/**
 * Safe display helpers for incomplete catalogue data.
 *
 * Future brand/range pages must be able to render with missing optional
 * fields without generating filler copy. These helpers only return values that
 * actually exist in the source; anything absent is reported through the
 * completeness helpers for internal validation or used to omit a section.
 */

import type {
  CatalogueBrandProfile,
  CatalogueRange,
  CatalogueRecord,
  CatalogueSubItem,
} from "./catalogue.types";

export function hasText(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function hasItems<T>(
  values: readonly T[] | null | undefined
): values is readonly T[] {
  return Array.isArray(values) && values.length > 0;
}

/**
 * Returns the first verified description in page-copy precedence.
 * Never concatenates or rewrites fields.
 */
export function selectRecordDescription(
  record: CatalogueRecord
): string | undefined {
  return [record.description, record.cardDescription, record.subDescription].find(
    hasText
  );
}

export interface CatalogueContentEntry {
  readonly label: string;
  readonly value: string;
}

export interface CatalogueContentSection {
  /** Stable section key for React lists and anchor links. */
  readonly id: string;
  readonly heading: string;
  readonly body?: string;
  readonly items?: readonly string[];
  readonly entries?: readonly CatalogueContentEntry[];
  readonly subItems?: readonly CatalogueSubItem[];
}

/**
 * Builds only the sections the record can actually support, in a stable order.
 * A section is omitted when its underlying field is missing or empty.
 */
export function buildRecordSections(
  record: CatalogueRecord
): readonly CatalogueContentSection[] {
  const sections: CatalogueContentSection[] = [];

  if (hasText(record.description)) {
    sections.push({
      id: "overview",
      heading: "Overview",
      body: record.description,
    });
  }

  if (hasText(record.subDescription)) {
    sections.push({
      id: "details",
      heading: "Details",
      body: record.subDescription,
    });
  }

  if (hasItems(record.features)) {
    sections.push({
      id: "features",
      heading: "Features",
      items: record.features,
    });
  }

  if (hasItems(record.highlights)) {
    sections.push({
      id: "highlights",
      heading: "Highlights",
      items: record.highlights,
    });
  }

  if (hasItems(record.idealFor)) {
    sections.push({
      id: "ideal-for",
      heading: "Ideal For",
      items: record.idealFor,
    });
  }

  if (hasItems(record.advantages)) {
    sections.push({
      id: "advantages",
      heading: "Advantages",
      items: record.advantages,
    });
  }

  if (hasItems(record.subItems)) {
    sections.push({
      id: "collections",
      heading: "Collections",
      subItems: record.subItems,
    });
  }

  if (record.extraInfo) {
    const entries: CatalogueContentEntry[] = [];
    for (const [label, value] of Object.entries(record.extraInfo)) {
      const text = typeof value === "string"
        ? value
        : value.filter(hasText).join(" ");
      if (hasText(text)) entries.push({ label, value: text });
    }
    if (entries.length > 0) {
      sections.push({
        id: "additional-information",
        heading: "Additional Information",
        entries,
      });
    }
  }

  if (hasText(record.closing)) {
    sections.push({
      id: "summary",
      heading: "Summary",
      body: record.closing,
    });
  }

  return sections;
}

/** Field names that are absent from a record, for internal validation only. */
export function listMissingRecordFields(
  record: CatalogueRecord
): readonly string[] {
  const missing: string[] = [];
  if (!hasText(record.description)) missing.push("description");
  if (!hasText(record.headline)) missing.push("headline");
  if (!hasText(record.logo)) missing.push("logo");
  if (!hasItems(record.features)) missing.push("features");
  if (!hasItems(record.idealFor)) missing.push("ideal-for");
  if (!record.extraInfo || Object.keys(record.extraInfo).length === 0) {
    missing.push("extra-info");
  }
  return missing;
}

/** Brand-level gaps; ranges are assessed through their record. */
export function listMissingBrandFields(
  brand: CatalogueBrandProfile,
  ranges: readonly CatalogueRange[]
): readonly string[] {
  const missing: string[] = [];
  if (!hasText(brand.logo)) missing.push("logo");
  if (!hasText(brand.description)) missing.push("description");
  if (ranges.length === 0) missing.push("ranges");
  return missing;
}

export interface CatalogueCompleteness {
  readonly missing: readonly string[];
  readonly isComplete: boolean;
}

export function describeRecordCompleteness(
  record: CatalogueRecord
): CatalogueCompleteness {
  const missing = listMissingRecordFields(record);
  return { missing, isComplete: missing.length === 0 };
}

export function describeBrandCompleteness(
  brand: CatalogueBrandProfile,
  ranges: readonly CatalogueRange[]
): CatalogueCompleteness {
  const missing = listMissingBrandFields(brand, ranges);
  return { missing, isComplete: missing.length === 0 };
}
