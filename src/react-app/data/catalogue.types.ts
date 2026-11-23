/**
 * Catalogue data-layer types.
 *
 * Source of truth: `aadi-info.json` (`productCategories[].brands[]`).
 * The source does not separate brands from ranges or define SKUs, prices,
 * dimensions, stock or specifications, so none of those are modelled here.
 * Optional fields mirror fields that are actually absent on some records.
 */

import type { SlugCollision } from "../lib/slug";

/** Customer-facing groups used by the existing `/products` filter tabs. */
export type CatalogueGroupId =
  | "kitchen"
  | "fnb"
  | "hk"
  | "laundry"
  | "guest"
  | "cold";

export interface CatalogueGroup {
  readonly id: CatalogueGroupId;
  readonly label: string;
  readonly recordCount: number;
}

export interface CatalogueSubItem {
  readonly title: string;
  readonly description?: string;
  readonly items: readonly string[];
}

export type CatalogueExtraInfoValue = string | readonly string[];

/**
 * A single normalised catalogue record.
 *
 * `name` is the original display label from `aadi-info.json`; in the current
 * source it doubles as the brand/range label (the JSON has no separate brand
 * field). `brandKey` / `brandSlug` are derived index values only.
 */
export interface CatalogueRecord {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly normalizedName: string;
  readonly brandKey: string;
  readonly brandSlug: string;

  readonly categoryId: string;
  readonly categoryTitle: string;
  readonly categorySlug: string;
  readonly groupId: CatalogueGroupId;
  readonly groupLabel: string;

  /** Position in the original source array (traceability for audits). */
  readonly sourceIndex: number;

  readonly logo?: string;
  readonly brandLabel?: string;
  readonly badge?: string;
  readonly headline?: string;
  readonly description?: string;
  readonly cardDescription?: string;
  readonly subDescription?: string;
  readonly features?: readonly string[];
  readonly idealFor?: readonly string[];
  readonly closing?: string;
  readonly extraInfo?: Readonly<Record<string, CatalogueExtraInfoValue>>;
  readonly subItems?: readonly CatalogueSubItem[];
  readonly advantages?: readonly string[];
  readonly highlights?: readonly string[];
}

/** A source category (`commercial-kitchen`, `fnb-service`, …). */
export interface CatalogueCategory {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description?: string;
  readonly recordCount: number;
  /** Groups spanned by this category's records (one category may span two). */
  readonly groupIds: readonly CatalogueGroupId[];
}

/**
 * A brand grouping derived from record `name` values that fold to the same
 * key. Records are never merged across different keys, so genuinely distinct
 * brands stay separate.
 */
export interface CatalogueBrand {
  /** Normalised grouping key (case/diacritics/whitespace folded). */
  readonly key: string;
  readonly slug: string;
  /** Display name taken from the first source record (never slugified). */
  readonly name: string;
  readonly normalizedName: string;
  /** Distinct source spellings that folded into this key. */
  readonly nameVariants: readonly string[];
  readonly logo?: string;
  readonly logoSources: readonly string[];
  readonly recordSlugs: readonly string[];
  readonly categoryIds: readonly string[];
  readonly groupIds: readonly CatalogueGroupId[];
}

/* -------------------------------------------------------------------------
 * Curated brand / range layer (Stage 2A)
 * ---------------------------------------------------------------------- */

/**
 * Entity type recorded by the curated mapping.
 * `brand` confirms a named commercial brand but deliberately does not assert a
 * manufacturing relationship; `manufacturer` is only used where the source or
 * the partner directory states it explicitly.
 */
export type CatalogueBrandClassification =
  | "manufacturer"
  | "brand"
  | "product-collection"
  | "service"
  | "unverified";

export type CatalogueBrandStatus = "confirmed" | "pending-review";

/** A curated product range, always backed by exactly one source record. */
export interface CatalogueRange {
  /** Stable identity: `${brandId}:${localId}` (never derived from a headline). */
  readonly id: string;
  readonly localId: string;
  /** URL slug, unique within the parent brand. */
  readonly slug: string;
  readonly displayName: string;
  readonly brandId: string;
  readonly brandSlug: string;
  readonly record: CatalogueRecord;
  readonly recordSlug: string;
  readonly categoryId: string;
  readonly groupId: CatalogueGroupId;
  readonly notes?: string;
}

/** A confirmed brand and its ranges. */
export interface CatalogueBrandProfile {
  readonly id: string;
  readonly slug: string;
  readonly displayName: string;
  readonly status: CatalogueBrandStatus;
  readonly classification: CatalogueBrandClassification;
  /** Only set when verified copy exists; never generated. */
  readonly description?: string;
  readonly logo?: string;
  readonly rangeIds: readonly string[];
  readonly recordSlugs: readonly string[];
  readonly categoryIds: readonly string[];
  readonly groupIds: readonly CatalogueGroupId[];
  readonly notes?: string;
}

/**
 * A source record that could not be published as a confirmed brand/range.
 * The record itself stays fully accessible through `record`.
 */
export interface CataloguePendingRecord {
  readonly record: CatalogueRecord;
  readonly candidateName: string;
  readonly classification: CatalogueBrandClassification;
  readonly reason: string;
}

export type CatalogueBrandDirectoryIssueCode =
  | "brand-missing-logo"
  | "brand-missing-description"
  | "range-missing-description"
  | "range-missing-headline"
  | "range-missing-features"
  | "pending-record"
  | "brand-slug-adjusted"
  | "range-slug-adjusted";

export interface CatalogueBrandDirectoryIssue {
  readonly code: CatalogueBrandDirectoryIssueCode;
  readonly severity: "info" | "warning";
  readonly message: string;
  readonly brandIds?: readonly string[];
  readonly rangeIds?: readonly string[];
  readonly recordSlugs?: readonly string[];
}

/** Derived brand/range API consumed by future Brand Directory pages. */
export interface CatalogueBrandDirectory {
  readonly brands: readonly CatalogueBrandProfile[];
  readonly ranges: readonly CatalogueRange[];
  readonly pendingRecords: readonly CataloguePendingRecord[];
  /**
   * Source indexes withheld from the public products experience. They are
   * accounted for by the coverage check but never published.
   */
  readonly hiddenSourceIndexes: ReadonlySet<number>;
  readonly brandById: ReadonlyMap<string, CatalogueBrandProfile>;
  readonly brandBySlug: ReadonlyMap<string, CatalogueBrandProfile>;
  readonly rangeById: ReadonlyMap<string, CatalogueRange>;
  readonly rangesByBrand: ReadonlyMap<string, readonly CatalogueRange[]>;
  readonly rangesByCategory: ReadonlyMap<string, readonly CatalogueRange[]>;
  readonly collisions: readonly SlugCollision[];
  readonly issues: readonly CatalogueBrandDirectoryIssue[];
}

export type CatalogueDataIssueCode =
  | "missing-description"
  | "missing-headline"
  | "missing-logo"
  | "missing-features"
  | "missing-ideal-for"
  | "missing-extra-info"
  | "duplicate-brand-name"
  | "duplicate-record"
  | "brand-name-variant"
  | "shared-logo"
  | "empty-category-description"
  | "missing-category-description"
  | "slug-collision"
  | "reserved-slug"
  | "empty-slug";

export interface CatalogueDataIssue {
  readonly code: CatalogueDataIssueCode;
  readonly severity: "info" | "warning";
  readonly message: string;
  readonly recordIds?: readonly string[];
  readonly recordSlugs?: readonly string[];
  readonly categoryIds?: readonly string[];
  readonly brandKeys?: readonly string[];
}

/** All derived catalogue indexes, built once from the JSON source. */
export interface CatalogueIndex {
  readonly records: readonly CatalogueRecord[];
  readonly categories: readonly CatalogueCategory[];
  readonly brands: readonly CatalogueBrand[];
  readonly groups: readonly CatalogueGroup[];

  /** Records grouped by original source category id. */
  readonly recordsByCategory: ReadonlyMap<string, readonly CatalogueRecord[]>;
  /** Records grouped by the existing `/products?group=` ids. */
  readonly recordsByGroup: ReadonlyMap<CatalogueGroupId, readonly CatalogueRecord[]>;
  /** Records grouped by normalised brand key. */
  readonly recordsByBrand: ReadonlyMap<string, readonly CatalogueRecord[]>;

  readonly recordBySlug: ReadonlyMap<string, CatalogueRecord>;
  readonly brandBySlug: ReadonlyMap<string, CatalogueBrand>;
  readonly categoryBySlug: ReadonlyMap<string, CatalogueCategory>;

  /** Every slug that had to be adjusted for duplication/reservation. */
  readonly collisions: readonly SlugCollision[];
  /** Data-quality findings discovered while normalising. */
  readonly issues: readonly CatalogueDataIssue[];
}

/**
 * Minimal structural shape required by the shared search helpers.
 * The existing `CatalogProduct` (and any future page model) satisfies it.
 */
export interface CatalogueSearchable {
  readonly name: string;
  readonly groupId?: string;
  readonly categoryId?: string;
  readonly headline?: string;
  readonly description?: string;
  readonly brandLabel?: string;
  readonly cardDescription?: string;
  readonly subDescription?: string;
  readonly features?: readonly string[];
  readonly advantages?: readonly string[];
  readonly closing?: string;
  readonly idealFor?: readonly string[];
  readonly subItems?: readonly {
    readonly title: string;
    readonly description?: string;
    readonly items: readonly string[];
  }[];
  readonly extraInfo?: Readonly<Record<string, string | readonly string[]>>;
}

/**
 * Filter options for the shared catalogue search.
 * `brand` keeps the existing exact-display-name contract used by `/products`;
 * `brandKey` is available for future pages that want folded matching.
 */
export interface CatalogueSearchOptions {
  readonly query?: string;
  /** Existing UI group id (`kitchen`, `fnb`, …); `"all"` means no filter. */
  readonly groupId?: string;
  /** Original source category id (`commercial-kitchen`, …). */
  readonly categoryId?: string;
  /** Exact display name (current `/products` behaviour). `"all"` = no filter. */
  readonly brand?: string;
  /** Folded brand key from the catalogue index. */
  readonly brandKey?: string;
}

/* -------------------------------------------------------------------------
 * Raw JSON shapes (read-only; used by the normaliser and validation scripts)
 * ---------------------------------------------------------------------- */

export interface CatalogueSourceSubItem {
  title: string;
  description?: string;
  items: string[];
}

export interface CatalogueSourceRecord {
  name: string;
  logo?: string;
  headline?: string;
  description?: string;
  subDescription?: string;
  features?: string[];
  idealFor?: string[];
  closing?: string;
  extraInfo?: Record<string, string | string[]>;
  advantages?: string[];
  brandLabel?: string;
  cardDescription?: string;
  badge?: string;
  highlights?: string[];
  subItems?: CatalogueSourceSubItem[];
}

export interface CatalogueSourceCategory {
  id: string;
  title: string;
  description?: string;
  brands: CatalogueSourceRecord[];
}

export interface CatalogueSource {
  productCategories: CatalogueSourceCategory[];
}
