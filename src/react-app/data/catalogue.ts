/**
 * Catalogue normalisation layer.
 *
 * Reads the existing `aadi-info.json` exactly once, validates its required
 * shape, and derives a stable, typed catalogue index. The JSON file is never
 * modified and no product facts are invented: optional fields stay absent
 * when the source omits them, and display names / asset paths are preserved
 * verbatim.
 *
 * The normaliser is a pure function (`createCatalogueIndex`) so future pages
 * and validation scripts can build an index from an in-memory source.
 */

import rawCatalogue from "../../../aadi-info.json";
import {
  CATALOGUE_GROUP_LABELS,
  CATALOGUE_GROUP_ORDER,
  resolveGroupId,
} from "./catalogue-groups";
import {
  normalizeBrandKey,
  SlugRegistry,
  slugify,
} from "../lib/slug";
import type {
  CatalogueBrand,
  CatalogueCategory,
  CatalogueDataIssue,
  CatalogueDataIssueCode,
  CatalogueExtraInfoValue,
  CatalogueGroup,
  CatalogueGroupId,
  CatalogueIndex,
  CatalogueRecord,
  CatalogueSource,
  CatalogueSourceCategory,
  CatalogueSourceRecord,
  CatalogueSubItem,
} from "./catalogue.types";

/* Stage 1 exported these from this module. They now live in
   `catalogue-groups.ts` so the Products component and the data layer share one
   mapping; the re-export keeps the Stage 1 public surface intact. */
export {
  CATALOGUE_GROUP_LABELS,
  CATALOGUE_GROUP_ORDER,
  resolveGroupId,
};

/* -------------------------------------------------------------------------
 * Source readers — defensive, but lossless for valid input
 * ---------------------------------------------------------------------- */

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function optionalStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.filter((entry): entry is string => typeof entry === "string");
}

function optionalExtraInfo(
  value: unknown
): Record<string, CatalogueExtraInfoValue> | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const result: Record<string, CatalogueExtraInfoValue> = {};
  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    if (typeof entry === "string") {
      result[key] = entry;
    } else if (Array.isArray(entry)) {
      result[key] = entry.filter(
        (item): item is string => typeof item === "string"
      );
    }
  }
  return result;
}

function optionalSubItems(value: unknown): CatalogueSubItem[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const result: CatalogueSubItem[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const candidate = entry as Record<string, unknown>;
    if (typeof candidate.title !== "string" || !Array.isArray(candidate.items)) {
      continue;
    }
    result.push({
      title: candidate.title,
      description:
        typeof candidate.description === "string"
          ? candidate.description
          : undefined,
      items: candidate.items.filter(
        (item): item is string => typeof item === "string"
      ),
    });
  }
  return result;
}

/* -------------------------------------------------------------------------
 * Normalisation
 * ---------------------------------------------------------------------- */

interface DraftRecord {
  readonly raw: CatalogueSourceRecord;
  readonly category: CatalogueSourceCategory;
  readonly categorySlug: string;
  readonly groupId: CatalogueGroupId;
  readonly sourceIndex: number;
  readonly baseSlug: string;
}

interface DraftBrand {
  readonly key: string;
  readonly name: string;
  readonly nameVariants: readonly string[];
  readonly logo?: string;
  readonly logoSources: readonly string[];
  readonly categoryIds: readonly string[];
  readonly groupIds: readonly CatalogueGroupId[];
  readonly slug: string;
}

function buildDraftBrands(
  drafts: readonly DraftRecord[],
  registry: SlugRegistry
): readonly DraftBrand[] {
  const groups = new Map<string, DraftRecord[]>();

  for (const draft of drafts) {
    const key = normalizeBrandKey(draft.raw.name);
    const existing = groups.get(key);
    if (existing) existing.push(draft);
    else groups.set(key, [draft]);
  }

  const brands: DraftBrand[] = [];

  for (const [key, records] of groups) {
    const nameVariants: string[] = [];
    const logoSources: string[] = [];
    const categoryIds: string[] = [];
    const groupIds: CatalogueGroupId[] = [];

    for (const { raw, category, groupId } of records) {
      if (!nameVariants.includes(raw.name)) nameVariants.push(raw.name);
      if (raw.logo && !logoSources.includes(raw.logo)) {
        logoSources.push(raw.logo);
      }
      if (!categoryIds.includes(category.id)) categoryIds.push(category.id);
      if (!groupIds.includes(groupId)) groupIds.push(groupId);
    }

    brands.push({
      key,
      name: records[0].raw.name,
      nameVariants,
      logo: logoSources[0],
      logoSources,
      categoryIds,
      groupIds,
      slug: registry.register(records[0].raw.name, `brand:${key}`),
    });
  }

  return brands;
}

export function createCatalogueIndex(
  source: CatalogueSource
): CatalogueIndex {
  if (!source || !Array.isArray(source.productCategories)) {
    throw new Error(
      "Invalid catalogue source: expected a `productCategories` array."
    );
  }

  const rawCategories = source.productCategories;
  const categoryRegistry = new SlugRegistry();
  const categorySlugById = new Map<string, string>();
  const seenCategoryIds = new Set<string>();

  for (const category of rawCategories) {
    if (typeof category?.id !== "string" || !category.id.trim()) {
      throw new Error("Invalid catalogue category: missing `id`.");
    }
    if (typeof category.title !== "string" || !category.title.trim()) {
      throw new Error(
        `Invalid catalogue category "${category.id}": missing \`title\`.`
      );
    }
    if (!Array.isArray(category.brands)) {
      throw new Error(
        `Invalid catalogue category "${category.id}": missing \`brands\` array.`
      );
    }
    if (seenCategoryIds.has(category.id)) {
      throw new Error(`Duplicate catalogue category id "${category.id}".`);
    }
    seenCategoryIds.add(category.id);
    categorySlugById.set(
      category.id,
      categoryRegistry.register(category.id, `category:${category.id}`)
    );
  }

  const drafts: DraftRecord[] = [];
  let sourceIndex = 0;

  for (const category of rawCategories) {
    const categorySlug = categorySlugById.get(category.id);
    if (!categorySlug) {
      throw new Error(`Category "${category.id}" was not registered.`);
    }

    for (const raw of category.brands) {
      if (typeof raw?.name !== "string" || !raw.name.trim()) {
        throw new Error(
          `Invalid catalogue record in "${category.id}": missing \`name\`.`
        );
      }

      drafts.push({
        raw,
        category,
        categorySlug,
        groupId: resolveGroupId(category.id, raw.name),
        sourceIndex,
        baseSlug: slugify(raw.name),
      });
      sourceIndex += 1;
    }
  }

  /* Brand grouping happens before record slugs so every record can carry its
     final `brandSlug`. */
  const brandRegistry = new SlugRegistry();
  const draftBrands = buildDraftBrands(drafts, brandRegistry);
  const brandByKey = new Map(draftBrands.map((brand) => [brand.key, brand]));

  /* A duplicated record name (e.g. the two Zafferano ranges) uses its
     headline to build a meaningful slug for every record sharing that name.
     If the headline is missing, the registry suffixes deterministically. */
  const baseSlugCounts = new Map<string, number>();
  for (const draft of drafts) {
    baseSlugCounts.set(
      draft.baseSlug,
      (baseSlugCounts.get(draft.baseSlug) ?? 0) + 1
    );
  }

  const recordRegistry = new SlugRegistry();
  const records: CatalogueRecord[] = [];

  for (const draft of drafts) {
    const { raw, category } = draft;
    const brandKey = normalizeBrandKey(raw.name);
    const brand = brandByKey.get(brandKey);
    if (!brand) {
      throw new Error(`Brand "${raw.name}" was not registered.`);
    }

    const duplicateBase = (baseSlugCounts.get(draft.baseSlug) ?? 0) > 1;
    const headlineSlug = slugify(raw.headline);
    const desiredSlug =
      duplicateBase && headlineSlug
        ? draft.baseSlug
          ? `${draft.baseSlug}-${headlineSlug}`
          : headlineSlug
        : draft.baseSlug;

    const recordSlug = recordRegistry.register(
      desiredSlug,
      `record:${draft.sourceIndex}`
    );

    records.push({
      id: `${category.id}:${recordSlug}`,
      slug: recordSlug,
      name: raw.name,
      normalizedName: brandKey,
      brandKey,
      brandSlug: brand.slug,

      categoryId: category.id,
      categoryTitle: category.title,
      categorySlug: draft.categorySlug,
      groupId: draft.groupId,
      groupLabel: CATALOGUE_GROUP_LABELS[draft.groupId],

      sourceIndex: draft.sourceIndex,

      logo: optionalString(raw.logo),
      brandLabel: optionalString(raw.brandLabel),
      badge: optionalString(raw.badge),
      headline: optionalString(raw.headline),
      description: optionalString(raw.description),
      cardDescription: optionalString(raw.cardDescription),
      subDescription: optionalString(raw.subDescription),
      features: optionalStringArray(raw.features),
      idealFor: optionalStringArray(raw.idealFor),
      closing: optionalString(raw.closing),
      extraInfo: optionalExtraInfo(raw.extraInfo),
      subItems: optionalSubItems(raw.subItems),
      advantages: optionalStringArray(raw.advantages),
      highlights: optionalStringArray(raw.highlights),
    });
  }

  /* Derived indexes ---------------------------------------------------- */

  const recordsByCategory = new Map<string, CatalogueRecord[]>();
  const recordsByGroup = new Map<CatalogueGroupId, CatalogueRecord[]>();
  const recordsByBrand = new Map<string, CatalogueRecord[]>();
  const recordBySlug = new Map<string, CatalogueRecord>();

  for (const groupId of CATALOGUE_GROUP_ORDER) {
    recordsByGroup.set(groupId, []);
  }
  for (const category of rawCategories) {
    recordsByCategory.set(category.id, []);
  }

  for (const record of records) {
    recordBySlug.set(record.slug, record);
    recordsByCategory.get(record.categoryId)?.push(record);
    recordsByGroup.get(record.groupId)?.push(record);

    const brandRecords = recordsByBrand.get(record.brandKey);
    if (brandRecords) brandRecords.push(record);
    else recordsByBrand.set(record.brandKey, [record]);
  }

  const categories: CatalogueCategory[] = rawCategories.map((category) => {
    const categoryRecords = recordsByCategory.get(category.id) ?? [];
    const groupIds: CatalogueGroupId[] = [];
    for (const record of categoryRecords) {
      if (!groupIds.includes(record.groupId)) groupIds.push(record.groupId);
    }
    return {
      id: category.id,
      slug: categorySlugById.get(category.id) ?? slugify(category.id),
      title: category.title,
      description: optionalString(category.description),
      recordCount: categoryRecords.length,
      groupIds,
    };
  });

  const brands: CatalogueBrand[] = draftBrands.map((brand) => {
    const brandRecords = recordsByBrand.get(brand.key) ?? [];
    return {
      key: brand.key,
      slug: brand.slug,
      name: brand.name,
      normalizedName: brand.key,
      nameVariants: brand.nameVariants,
      logo: brand.logo,
      logoSources: brand.logoSources,
      recordSlugs: brandRecords.map((record) => record.slug),
      categoryIds: brand.categoryIds,
      groupIds: brand.groupIds,
    };
  });

  const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));
  const categoryBySlug = new Map(
    categories.map((category) => [category.slug, category])
  );

  const groups: CatalogueGroup[] = CATALOGUE_GROUP_ORDER.map((groupId) => ({
    id: groupId,
    label: CATALOGUE_GROUP_LABELS[groupId],
    recordCount: recordsByGroup.get(groupId)?.length ?? 0,
  }));

  /* Integrity guard: never lose or duplicate a source record. */
  const expectedRecordCount = rawCategories.reduce(
    (total, category) => total + category.brands.length,
    0
  );
  if (records.length !== expectedRecordCount) {
    throw new Error(
      `Catalogue normalisation lost records: ${records.length} of ${expectedRecordCount}.`
    );
  }
  if (recordBySlug.size !== records.length) {
    throw new Error("Catalogue normalisation produced duplicate record slugs.");
  }

  const collisions = [
    ...categoryRegistry.getCollisions(),
    ...brandRegistry.getCollisions(),
    ...recordRegistry.getCollisions(),
  ];

  const issues = buildIssues(records, categories, brands, collisions);

  return {
    records,
    categories,
    brands,
    groups,
    recordsByCategory,
    recordsByGroup,
    recordsByBrand,
    recordBySlug,
    brandBySlug,
    categoryBySlug,
    collisions,
    issues,
  };
}

/* -------------------------------------------------------------------------
 * Data-quality reporting (informational; never mutates the source)
 * ---------------------------------------------------------------------- */

function buildIssues(
  records: readonly CatalogueRecord[],
  categories: readonly CatalogueCategory[],
  brands: readonly CatalogueBrand[],
  collisions: readonly CatalogueIndex["collisions"][number][]
): readonly CatalogueDataIssue[] {
  const issues: CatalogueDataIssue[] = [];
  const total = records.length;

  const addMissing = (
    code: CatalogueDataIssueCode,
    predicate: (record: CatalogueRecord) => boolean,
    label: string,
    severity: CatalogueDataIssue["severity"] = "info"
  ) => {
    const matches = records.filter(predicate);
    if (matches.length === 0) return;
    issues.push({
      code,
      severity,
      message: `${matches.length} of ${total} catalogue records have no ${label}.`,
      recordIds: matches.map((record) => record.id),
      recordSlugs: matches.map((record) => record.slug),
    });
  };

  addMissing("missing-description", (r) => !r.description, "description");
  addMissing("missing-headline", (r) => !r.headline, "headline");
  addMissing("missing-logo", (r) => !r.logo, "logo", "warning");
  addMissing(
    "missing-features",
    (r) => !r.features || r.features.length === 0,
    "features"
  );
  addMissing(
    "missing-ideal-for",
    (r) => !r.idealFor || r.idealFor.length === 0,
    "ideal-for list"
  );
  addMissing(
    "missing-extra-info",
    (r) => !r.extraInfo || Object.keys(r.extraInfo).length === 0,
    "extra information"
  );

  for (const brand of brands) {
    if (brand.recordSlugs.length > 1) {
      issues.push({
        code: "duplicate-brand-name",
        severity: "info",
        message: `Brand label "${brand.name}" covers ${brand.recordSlugs.length} records; kept as one brand with multiple ranges.`,
        recordSlugs: brand.recordSlugs,
        brandKeys: [brand.key],
      });
    }
    if (brand.nameVariants.length > 1) {
      issues.push({
        code: "brand-name-variant",
        severity: "info",
        message: `Brand "${brand.name}" is written ${brand.nameVariants.length} ways in the source (${brand.nameVariants.join(", ")}); grouped under one key.`,
        brandKeys: [brand.key],
      });
    }
  }

  const identityCounts = new Map<string, CatalogueRecord[]>();
  for (const record of records) {
    const identity = `${record.categoryId}|${record.name}|${record.headline ?? ""}`;
    const existing = identityCounts.get(identity);
    if (existing) existing.push(record);
    else identityCounts.set(identity, [record]);
  }
  for (const [, duplicates] of identityCounts) {
    if (duplicates.length < 2) continue;
    issues.push({
      code: "duplicate-record",
      severity: "warning",
      message: `Identical catalogue records found: "${duplicates[0].name}".`,
      recordIds: duplicates.map((record) => record.id),
      recordSlugs: duplicates.map((record) => record.slug),
    });
  }

  const brandsByLogo = new Map<string, Set<string>>();
  for (const brand of brands) {
    for (const logo of brand.logoSources) {
      const keys = brandsByLogo.get(logo);
      if (keys) keys.add(brand.key);
      else brandsByLogo.set(logo, new Set([brand.key]));
    }
  }
  for (const [logo, keys] of brandsByLogo) {
    if (keys.size < 2) continue;
    issues.push({
      code: "shared-logo",
      severity: "warning",
      message: `Logo "${logo}" is shared by ${keys.size} brand keys (${[...keys].join(", ")}).`,
      brandKeys: [...keys],
    });
  }

  for (const category of categories) {
    if (category.description === undefined) {
      issues.push({
        code: "missing-category-description",
        severity: "info",
        message: `Category "${category.title}" has no description.`,
        categoryIds: [category.id],
      });
    } else if (!category.description.trim()) {
      issues.push({
        code: "empty-category-description",
        severity: "info",
        message: `Category "${category.title}" has an empty description.`,
        categoryIds: [category.id],
      });
    }
  }

  for (const collision of collisions) {
    const code: CatalogueDataIssueCode =
      collision.reason === "reserved"
        ? "reserved-slug"
        : collision.reason === "empty"
          ? "empty-slug"
          : "slug-collision";
    issues.push({
      code,
      severity: "warning",
      message: `Slug "${collision.desired || "(empty)"}" for ${collision.sourceId} was assigned "${collision.assigned}" (${collision.reason}).`,
    });
  }

  return issues;
}

/**
 * The application-wide catalogue index.
 * Importing this module normalises the JSON once; consumers read the derived
 * maps instead of re-scanning the raw source.
 */
export const catalogueIndex: CatalogueIndex = createCatalogueIndex(
  rawCatalogue as unknown as CatalogueSource
);
