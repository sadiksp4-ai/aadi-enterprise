/**
 * Brand / range directory API (Stage 2A).
 *
 * Builds the curated hierarchy from `brand-mapping.ts` and joins every range to
 * its existing catalogue record. This module is read-only: it never mutates the
 * source data and never invents brand copy.
 *
 * Future Brand Directory and Brand Collection pages can retrieve:
 * - all confirmed brands,
 * - a brand by stable slug,
 * - the ranges belonging to a brand,
 * - ranges grouped by source category,
 * - the records behind a brand,
 * - records that are still pending classification.
 */

import { catalogueIndex } from "./catalogue";
import {
  CURATED_BRANDS,
  CURATED_HIDDEN_RECORDS,
  CURATED_PENDING_RECORDS,
  CURATED_RANGES,
} from "./brand-mapping";
import { SlugRegistry, slugify, type SlugCollision } from "../lib/slug";
import type {
  CatalogueBrandDirectory,
  CatalogueBrandDirectoryIssue,
  CatalogueBrandProfile,
  CatalogueGroupId,
  CatalogueIndex,
  CataloguePendingRecord,
  CatalogueRange,
  CatalogueRecord,
} from "./catalogue.types";

function lacksText(value: string | undefined): boolean {
  return !value || !value.trim();
}

export function createBrandDirectory(
  index: CatalogueIndex = catalogueIndex
): CatalogueBrandDirectory {
  const recordsBySourceIndex = new Map<number, CatalogueRecord>(
    index.records.map((record) => [record.sourceIndex, record])
  );

  const issues: CatalogueBrandDirectoryIssue[] = [];
  const usedSourceIndexes = new Set<number>();

  /* Brand identities ---------------------------------------------------- */

  const brandDefinitions = new Map<
    string,
    (typeof CURATED_BRANDS)[number]
  >();
  const brandSlugById = new Map<string, string>();
  const brandSlugRegistry = new SlugRegistry();

  for (const definition of CURATED_BRANDS) {
    if (brandDefinitions.has(definition.id)) {
      throw new Error(`Duplicate curated brand id "${definition.id}".`);
    }

    if (definition.slug !== slugify(definition.displayName)) {
      issues.push({
        code: "brand-slug-adjusted",
        severity: "warning",
        message: `Brand "${definition.displayName}" uses curated slug "${definition.slug}" instead of "${slugify(definition.displayName)}".`,
        brandIds: [definition.id],
      });
    }

    const assignedSlug = brandSlugRegistry.register(
      definition.slug,
      `brand:${definition.id}`
    );
    if (assignedSlug !== definition.slug) {
      issues.push({
        code: "brand-slug-adjusted",
        severity: "warning",
        message: `Brand "${definition.displayName}" requested slug "${definition.slug}" but was assigned "${assignedSlug}".`,
        brandIds: [definition.id],
      });
    }

    brandDefinitions.set(definition.id, definition);
    brandSlugById.set(definition.id, assignedSlug);
  }

  /* Range identities ---------------------------------------------------- */

  const rangeRegistries = new Map<string, SlugRegistry>();
  for (const definition of CURATED_BRANDS) {
    rangeRegistries.set(definition.id, new SlugRegistry());
  }

  const rangesByBrand = new Map<string, CatalogueRange[]>();
  for (const definition of CURATED_BRANDS) {
    rangesByBrand.set(definition.id, []);
  }

  const rangeById = new Map<string, CatalogueRange>();
  const ranges: CatalogueRange[] = [];

  for (const assignment of CURATED_RANGES) {
    if (usedSourceIndexes.has(assignment.sourceIndex)) {
      throw new Error(
        `Source record ${assignment.sourceIndex} is mapped more than once.`
      );
    }

    const record = recordsBySourceIndex.get(assignment.sourceIndex);
    if (!record) {
      throw new Error(
        `Source record ${assignment.sourceIndex} was not found in the catalogue.`
      );
    }
    if (record.name !== assignment.expectedSourceName) {
      throw new Error(
        `Source record ${assignment.sourceIndex} is "${record.name}" but the curated mapping expects "${assignment.expectedSourceName}".`
      );
    }

    const brand = brandDefinitions.get(assignment.brandId);
    if (!brand) {
      throw new Error(
        `Range ${assignment.rangeId} references unknown brand "${assignment.brandId}".`
      );
    }

    const brandSlug = brandSlugById.get(brand.id);
    const registry = rangeRegistries.get(brand.id);
    if (!brandSlug || !registry) {
      throw new Error(`Brand "${brand.id}" was not fully registered.`);
    }

    const desiredSlug = slugify(assignment.rangeName);
    const rangeSlug = registry.register(
      desiredSlug,
      `range:${brand.id}:${assignment.rangeId}`
    );
    if (rangeSlug !== desiredSlug) {
      issues.push({
        code: "range-slug-adjusted",
        severity: "warning",
        message: `Range "${assignment.rangeName}" under "${brand.displayName}" requested slug "${desiredSlug}" but was assigned "${rangeSlug}".`,
        brandIds: [brand.id],
        rangeIds: [`${brand.id}:${assignment.rangeId}`],
      });
    }

    const range: CatalogueRange = {
      id: `${brand.id}:${assignment.rangeId}`,
      localId: assignment.rangeId,
      slug: rangeSlug,
      displayName: assignment.rangeName,
      brandId: brand.id,
      brandSlug,
      record,
      recordSlug: record.slug,
      categoryId: record.categoryId,
      groupId: record.groupId,
      notes: assignment.notes,
    };

    if (rangeById.has(range.id)) {
      throw new Error(`Duplicate curated range identity "${range.id}".`);
    }
    rangeById.set(range.id, range);
    ranges.push(range);
    rangesByBrand.get(brand.id)?.push(range);
    usedSourceIndexes.add(assignment.sourceIndex);
  }

  /* Pending records ----------------------------------------------------- */

  const pendingRecords: CataloguePendingRecord[] = [];

  for (const pending of CURATED_PENDING_RECORDS) {
    if (usedSourceIndexes.has(pending.sourceIndex)) {
      throw new Error(
        `Source record ${pending.sourceIndex} is both confirmed and pending.`
      );
    }

    const record = recordsBySourceIndex.get(pending.sourceIndex);
    if (!record) {
      throw new Error(
        `Pending source record ${pending.sourceIndex} was not found in the catalogue.`
      );
    }
    if (record.name !== pending.expectedSourceName) {
      throw new Error(
        `Pending source record ${pending.sourceIndex} is "${record.name}" but the curated mapping expects "${pending.expectedSourceName}".`
      );
    }

    pendingRecords.push({
      record,
      candidateName: pending.candidateName,
      classification: pending.classification,
      reason: pending.reason,
    });
    usedSourceIndexes.add(pending.sourceIndex);
  }

  /* Withheld records ---------------------------------------------------- */

  /* Hiding a record is a publication decision. The record still counts as
     covered so the integrity check below keeps guarding against genuinely
     unmapped source data. */
  const hiddenSourceIndexes = new Set<number>();

  for (const hidden of CURATED_HIDDEN_RECORDS) {
    if (usedSourceIndexes.has(hidden.sourceIndex)) {
      throw new Error(
        `Source record ${hidden.sourceIndex} is both published and withheld.`
      );
    }

    const record = recordsBySourceIndex.get(hidden.sourceIndex);
    if (!record) {
      throw new Error(
        `Withheld source record ${hidden.sourceIndex} was not found in the catalogue.`
      );
    }
    if (record.name !== hidden.expectedSourceName) {
      throw new Error(
        `Withheld source record ${hidden.sourceIndex} is "${record.name}" but the curated mapping expects "${hidden.expectedSourceName}".`
      );
    }

    hiddenSourceIndexes.add(hidden.sourceIndex);
    usedSourceIndexes.add(hidden.sourceIndex);
  }

  if (usedSourceIndexes.size !== index.records.length) {
    throw new Error(
      `Brand directory covers ${usedSourceIndexes.size} of ${index.records.length} source records.`
    );
  }

  /* Brand profiles ------------------------------------------------------ */

  const brands: CatalogueBrandProfile[] = CURATED_BRANDS.map((definition) => {
    const brandRanges = rangesByBrand.get(definition.id) ?? [];
    if (brandRanges.length === 0) {
      throw new Error(
        `Confirmed brand "${definition.displayName}" has no curated ranges.`
      );
    }

    const categoryIds: string[] = [];
    const groupIds: CatalogueGroupId[] = [];
    for (const range of brandRanges) {
      if (!categoryIds.includes(range.categoryId)) {
        categoryIds.push(range.categoryId);
      }
      if (!groupIds.includes(range.groupId)) groupIds.push(range.groupId);
    }

    return {
      id: definition.id,
      slug: brandSlugById.get(definition.id) ?? definition.slug,
      displayName: definition.displayName,
      status: "confirmed",
      classification: definition.classification,
      description: definition.description,
      logo: definition.logo,
      rangeIds: brandRanges.map((range) => range.id),
      recordSlugs: brandRanges.map((range) => range.recordSlug),
      categoryIds,
      groupIds,
      notes: definition.notes,
    };
  });

  /* Derived indexes ----------------------------------------------------- */

  const brandById = new Map(brands.map((brand) => [brand.id, brand]));
  const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));

  const rangesByCategory = new Map<string, CatalogueRange[]>();
  for (const category of index.categories) {
    rangesByCategory.set(category.id, []);
  }
  for (const range of ranges) {
    const categoryRanges = rangesByCategory.get(range.categoryId);
    if (categoryRanges) categoryRanges.push(range);
    else rangesByCategory.set(range.categoryId, [range]);
  }

  const rangeCollisions = [...rangeRegistries.values()].flatMap((registry) =>
    registry.getCollisions()
  );
  const collisions: SlugCollision[] = [
    ...brandSlugRegistry.getCollisions(),
    ...rangeCollisions,
  ];

  /* Data-quality reporting --------------------------------------------- */

  const brandsMissingLogo = brands.filter((brand) => lacksText(brand.logo));
  if (brandsMissingLogo.length > 0) {
    issues.push({
      code: "brand-missing-logo",
      severity: "warning",
      message: `${brandsMissingLogo.length} confirmed brands have no verified logo asset.`,
      brandIds: brandsMissingLogo.map((brand) => brand.id),
    });
  }

  const brandsMissingDescription = brands.filter((brand) =>
    lacksText(brand.description)
  );
  if (brandsMissingDescription.length > 0) {
    issues.push({
      code: "brand-missing-description",
      severity: "info",
      message: `${brandsMissingDescription.length} confirmed brands have no verified brand-level description; pages must omit the section.`,
      brandIds: brandsMissingDescription.map((brand) => brand.id),
    });
  }

  const rangesMissingDescription = ranges.filter((range) =>
    lacksText(range.record.description)
  );
  if (rangesMissingDescription.length > 0) {
    issues.push({
      code: "range-missing-description",
      severity: "info",
      message: `${rangesMissingDescription.length} confirmed ranges have no verified description.`,
      rangeIds: rangesMissingDescription.map((range) => range.id),
      recordSlugs: rangesMissingDescription.map((range) => range.recordSlug),
    });
  }

  const rangesMissingHeadline = ranges.filter((range) =>
    lacksText(range.record.headline)
  );
  if (rangesMissingHeadline.length > 0) {
    issues.push({
      code: "range-missing-headline",
      severity: "info",
      message: `${rangesMissingHeadline.length} confirmed ranges have no headline.`,
      rangeIds: rangesMissingHeadline.map((range) => range.id),
      recordSlugs: rangesMissingHeadline.map((range) => range.recordSlug),
    });
  }

  const rangesMissingFeatures = ranges.filter(
    (range) => !range.record.features || range.record.features.length === 0
  );
  if (rangesMissingFeatures.length > 0) {
    issues.push({
      code: "range-missing-features",
      severity: "info",
      message: `${rangesMissingFeatures.length} confirmed ranges have no feature list.`,
      rangeIds: rangesMissingFeatures.map((range) => range.id),
      recordSlugs: rangesMissingFeatures.map((range) => range.recordSlug),
    });
  }

  for (const pending of pendingRecords) {
    issues.push({
      code: "pending-record",
      severity: "info",
      message: `Record "${pending.record.name}" is pending review (${pending.classification}): ${pending.reason}`,
      recordSlugs: [pending.record.slug],
    });
  }

  return {
    brands,
    ranges,
    pendingRecords,
    hiddenSourceIndexes,
    brandById,
    brandBySlug,
    rangeById,
    rangesByBrand,
    rangesByCategory,
    collisions,
    issues,
  };
}

/** Application-wide brand directory, derived once from the catalogue index. */
export const brandDirectory: CatalogueBrandDirectory = createBrandDirectory();

/* -------------------------------------------------------------------------
 * Read helpers for future pages
 * ---------------------------------------------------------------------- */

function resolveBrand(
  directory: CatalogueBrandDirectory,
  identifier: string
): CatalogueBrandProfile | undefined {
  return directory.brandById.get(identifier) ?? directory.brandBySlug.get(identifier);
}

export function getBrandBySlug(
  slug: string,
  directory: CatalogueBrandDirectory = brandDirectory
): CatalogueBrandProfile | undefined {
  return directory.brandBySlug.get(slug);
}

export function getConfirmedBrands(
  directory: CatalogueBrandDirectory = brandDirectory
): readonly CatalogueBrandProfile[] {
  return directory.brands;
}

export function getRangesForBrand(
  brand: string,
  directory: CatalogueBrandDirectory = brandDirectory
): readonly CatalogueRange[] {
  const profile = resolveBrand(directory, brand);
  if (!profile) return [];
  return directory.rangesByBrand.get(profile.id) ?? [];
}

export function getRecordsForBrand(
  brand: string,
  directory: CatalogueBrandDirectory = brandDirectory
): readonly CatalogueRecord[] {
  return getRangesForBrand(brand, directory).map((range) => range.record);
}

export function getRangesByCategory(
  categoryId: string,
  directory: CatalogueBrandDirectory = brandDirectory
): readonly CatalogueRange[] {
  return directory.rangesByCategory.get(categoryId) ?? [];
}

export function getPendingRecords(
  directory: CatalogueBrandDirectory = brandDirectory
): readonly CataloguePendingRecord[] {
  return directory.pendingRecords;
}

/** Nested route helper for the future `/brands/:brand/:range` pages. */
export function getRange(
  brandSlug: string,
  rangeSlug: string,
  directory: CatalogueBrandDirectory = brandDirectory
): CatalogueRange | undefined {
  return getRangesForBrand(brandSlug, directory).find(
    (range) => range.slug === rangeSlug
  );
}

export interface CatalogueRangeCategoryGroup {
  readonly categoryId: string;
  readonly categoryTitle: string;
  readonly ranges: readonly CatalogueRange[];
}

/** Categories that contain at least one confirmed range. */
export function getRangeGroupsByCategory(
  directory: CatalogueBrandDirectory = brandDirectory
): readonly CatalogueRangeCategoryGroup[] {
  return [...directory.rangesByCategory.entries()]
    .filter(([, ranges]) => ranges.length > 0)
    .map(([categoryId, ranges]) => ({
      categoryId,
      categoryTitle: ranges[0].record.categoryTitle,
      ranges,
    }));
}
