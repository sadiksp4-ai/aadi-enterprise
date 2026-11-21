/**
 * Shared catalogue search.
 *
 * The haystack deliberately mirrors the original `/products` implementation
 * field-for-field and in the same order, so existing results are unchanged:
 *
 *   name, headline, description, brandLabel, cardDescription, subDescription,
 *   features, advantages, closing, idealFor, subItems(title, description,
 *   items), extraInfo(key + value(s))
 *
 * `highlights`, `badge` and `logo` were not searchable before and are still
 * not searchable, to preserve parity. New fields can be added later through an
 * explicit change with its own search-parity review.
 */

import { normalizeBrandKey } from "./slug";
import type {
  CatalogueSearchOptions,
  CatalogueSearchable,
} from "../data/catalogue.types";

/** Builds the lowercased text blob used for matching. */
export function catalogueSearchText(record: CatalogueSearchable): string {
  const parts: string[] = [record.name, record.headline ?? "", record.description ?? ""];

  if (record.brandLabel) parts.push(record.brandLabel);
  if (record.cardDescription) parts.push(record.cardDescription);
  if (record.subDescription) parts.push(record.subDescription);
  if (record.features) parts.push(record.features.join(" "));
  if (record.advantages) parts.push(record.advantages.join(" "));
  if (record.closing) parts.push(record.closing);
  if (record.idealFor) parts.push(record.idealFor.join(" "));

  if (record.subItems) {
    for (const sub of record.subItems) {
      parts.push(sub.title, sub.description ?? "", sub.items.join(" "));
    }
  }

  if (record.extraInfo) {
    for (const [key, value] of Object.entries(record.extraInfo)) {
      parts.push(key, typeof value === "string" ? value : value.join(" "));
    }
  }

  return parts.join(" ").toLowerCase();
}

/**
 * Case-insensitive substring match. Empty / whitespace-only queries always
 * match, exactly like the original component.
 */
export function matchesCatalogueQuery(
  record: CatalogueSearchable,
  query: string | null | undefined
): boolean {
  const needle = typeof query === "string" ? query.trim().toLowerCase() : "";
  if (!needle) return true;
  return catalogueSearchText(record).includes(needle);
}

/**
 * Filters records by query, group, source category and brand.
 * Returns a new array in the original order; the input is never mutated.
 */
export function filterCatalogueRecords<T extends CatalogueSearchable>(
  records: readonly T[],
  options: CatalogueSearchOptions = {}
): T[] {
  const activeGroup =
    options.groupId && options.groupId !== "all" ? options.groupId : undefined;
  const activeBrand =
    options.brand && options.brand !== "all" ? options.brand : undefined;
  const activeBrandKey = options.brandKey
    ? normalizeBrandKey(options.brandKey)
    : undefined;
  const activeCategory = options.categoryId || undefined;

  return records.filter((record) => {
    if (activeGroup && record.groupId !== activeGroup) return false;
    if (activeCategory && record.categoryId !== activeCategory) return false;
    if (activeBrand && record.name !== activeBrand) return false;
    if (activeBrandKey && normalizeBrandKey(record.name) !== activeBrandKey) {
      return false;
    }
    if (options.query && !matchesCatalogueQuery(record, options.query)) {
      return false;
    }
    return true;
  });
}
