/**
 * Website-wide search index.
 *
 * Every entry is derived from the existing catalogue data at module load:
 * 40 published catalogue records, 51 featured products, 31 confirmed brands,
 * the six product groups and the public pages. Nothing is duplicated or
 * hand-curated apart from the page route list.
 */

import { brandDirectory } from "../data/brand-directory";
import { getBrandCollection } from "../data/brand-collections";
import { catalogueIndex } from "../data/catalogue";
import { CATALOGUE_GROUPS } from "../data/catalogue-groups";
import { FEATURED_CATALOGUE } from "../data/featured-products";
import { catalogueSearchText } from "./catalogue-search";

export type GlobalSearchGroup = "products" | "brands" | "categories" | "pages";

export interface GlobalSearchEntry {
  readonly id: string;
  readonly group: GlobalSearchGroup;
  readonly title: string;
  readonly context: string;
  readonly route: string;
  readonly haystack: string;
}

export const GLOBAL_SEARCH_GROUP_LABELS: Readonly<
  Record<GlobalSearchGroup, string>
> = {
  products: "Products",
  brands: "Brands",
  categories: "Categories",
  pages: "Pages",
};

export const GLOBAL_SEARCH_GROUP_ORDER: readonly GlobalSearchGroup[] = [
  "products",
  "brands",
  "categories",
  "pages",
];

const PAGE_ENTRIES: ReadonlyArray<{
  readonly title: string;
  readonly route: string;
  readonly keywords: string;
}> = [
  { title: "Home", route: "/", keywords: "homepage aadi enterprises" },
  { title: "About", route: "/about", keywords: "company story philosophy" },
  { title: "Products", route: "/products", keywords: "catalogue collections categories" },
  { title: "Brands", route: "/products/brands", keywords: "brand directory partners" },
  { title: "Clients", route: "/clients", keywords: "client portfolio references" },
  { title: "Partners", route: "/partners", keywords: "brand partners" },
  { title: "Contact", route: "/contact", keywords: "contact enquiry office phone email whatsapp" },
];

/** Case/diacritic-insensitive normalisation used by the search index. */
export function normalizeSearch(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function brandName(id: string): string {
  if (id === "karcher") return "Kärcher";
  return (
    brandDirectory.brands.find((brand) => brand.id === id)?.displayName ?? id
  );
}

function brandGroupLabels(brandId: string): string[] {
  const brand = brandDirectory.brands.find((entry) => entry.id === brandId);
  if (!brand) return [];
  return brand.groupIds
    .map((id) => CATALOGUE_GROUPS.find((group) => group.id === id)?.label)
    .filter((label): label is string => Boolean(label));
}

function featuredCategoryLabel(brandId: string, categoryId: string): string {
  const catalogue = FEATURED_CATALOGUE.find(
    (entry) => entry.brandId === brandId
  );
  return (
    catalogue?.categories.find((category) => category.id === categoryId)
      ?.label ?? "Product"
  );
}

const featuredEntries: GlobalSearchEntry[] = FEATURED_CATALOGUE.flatMap(
  (brand) =>
    brand.products.map((product) => {
      const name = brandName(brand.brandId);
      const category = featuredCategoryLabel(brand.brandId, product.categoryId);
      return {
        id: `product:${brand.brandId}:${product.id}`,
        group: "products" as const,
        title: product.name,
        context: `${name} · ${category}`,
        route: `/products/brand/${brand.brandId}#featured-products`,
        haystack: normalizeSearch(
          [
            product.name,
            product.model,
            name,
            category,
            product.catalogueCategory,
            product.catalogueType,
          ]
            .filter(Boolean)
            .join(" ")
        ),
      };
    })
);

/**
 * Source records published on the public products experience. Withheld records
 * stay in `aadi-info.json` but must never appear in search results.
 */
const publishedCatalogueRecords = catalogueIndex.records.filter(
  (record) => !brandDirectory.hiddenSourceIndexes.has(record.sourceIndex)
);

const catalogueEntries: GlobalSearchEntry[] = publishedCatalogueRecords.map(
  (record) => ({
    id: `catalogue:${record.slug}`,
    group: "products" as const,
    title: record.name,
    context: `${record.groupLabel} · Catalogue`,
    route: `/products?group=${record.groupId}`,
    haystack: normalizeSearch(
      `${catalogueSearchText(record)} ${record.groupLabel} ${record.categoryTitle}`
    ),
  })
);

const brandEntries: GlobalSearchEntry[] = brandDirectory.brands.map((brand) => {
  const name = brand.id === "karcher" ? "Kärcher" : brand.displayName;
  const collection = getBrandCollection(brand.slug);
  const groups = brandGroupLabels(brand.id);
  const classification =
    brand.classification === "manufacturer" ? "Manufacturer" : "Brand";
  return {
    id: `brand:${brand.id}`,
    group: "brands" as const,
    title: name,
    context: `${groups.slice(0, 2).join(" · ")} · ${classification}`,
    route: collection
      ? `/products/brand/${brand.slug}`
      : "/products/brands",
    haystack: normalizeSearch(
      [name, brand.displayName, groups.join(" "), classification].join(" ")
    ),
  };
});

const categoryEntries: GlobalSearchEntry[] = CATALOGUE_GROUPS.map((group) => {
  const count = publishedCatalogueRecords.filter(
    (record) => record.groupId === group.id
  ).length;
  return {
    id: `category:${group.id}`,
    group: "categories" as const,
    title: group.label,
    context: `${count} ${count === 1 ? "record" : "records"}`,
    route: `/products?group=${group.id}`,
    haystack: normalizeSearch(`${group.label} ${group.id} category`),
  };
});

const pageEntries: GlobalSearchEntry[] = PAGE_ENTRIES.map((page) => ({
  id: `page:${page.route}`,
  group: "pages" as const,
  title: page.title,
  context: "Page",
  route: page.route,
  haystack: normalizeSearch(`${page.title} ${page.keywords} page`),
}));

export const GLOBAL_SEARCH_ENTRIES: readonly GlobalSearchEntry[] = [
  ...featuredEntries,
  ...catalogueEntries,
  ...brandEntries,
  ...categoryEntries,
  ...pageEntries,
];

export interface GlobalSearchGroupResult {
  readonly group: GlobalSearchGroup;
  readonly label: string;
  readonly items: readonly GlobalSearchEntry[];
}

/**
 * Returns grouped, relevance-sorted results for a query.
 * Matching is instant and token-based; every query token must appear.
 */
export function runGlobalSearch(rawQuery: string): GlobalSearchGroupResult[] {
  const query = normalizeSearch(rawQuery);
  if (!query) return [];

  const tokens = query.split(" ").filter(Boolean);
  const matches = GLOBAL_SEARCH_ENTRIES.map((entry, order) => {
    if (!tokens.every((token) => entry.haystack.includes(token))) return null;

    const title = normalizeSearch(entry.title);
    const context = normalizeSearch(entry.context);
    let score = 3;
    if (title.startsWith(query)) score = 0;
    else if (tokens.every((token) => title.includes(token))) score = 1;
    else if (tokens.every((token) => context.includes(token))) score = 2;

    return { entry, score, order };
  })
    .filter((match): match is NonNullable<typeof match> => match !== null)
    .sort((a, b) => a.score - b.score || a.order - b.order);

  return GLOBAL_SEARCH_GROUP_ORDER.map((group) => ({
    group,
    label: GLOBAL_SEARCH_GROUP_LABELS[group],
    items: matches
      .filter((match) => match.entry.group === group)
      .map((match) => match.entry),
  })).filter((group) => group.items.length > 0);
}
