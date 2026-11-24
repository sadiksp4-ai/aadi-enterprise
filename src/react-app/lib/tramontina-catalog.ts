export type CatalogPage = {
  page: number;
  image: string;
  skus: string[];
  text: string;
};

export type CatalogIndex = {
  totalPages: number;
  pages: CatalogPage[];
};

export type CatalogSearchResult = {
  page: number;
  matchedSkus: string[];
  snippet: string;
};

import { SITE_URL } from "../components/Seo/Seo";

export const CATALOG_INDEX_URL = "/catalogs/tramontina/index.json";
export const CATALOG_BASE_PATH = "/catalog/tramontina";
export const CATALOG_TITLE = "Tramontina Hospitality Catalogue";

export function catalogPagePath(page: number): string {
  return `${CATALOG_BASE_PATH}/page/${page}`;
}

export function catalogPageUrl(page: number): string {
  return `${SITE_URL}${catalogPagePath(page)}`;
}

export function clampPage(page: number, total: number): number {
  if (!Number.isFinite(page)) return 1;
  return Math.min(Math.max(Math.trunc(page), 1), Math.max(total, 1));
}

/**
 * Left page (1-based) of the two-page spread that contains a 0-based flipbook index.
 * The front cover (index 0) sits alone; after it spreads are [1,2], [3,4], ...
 * so every spread starts on an even page number.
 */
export function spreadLeftPage(index: number): number {
  if (index <= 0) return 1;
  const leftIndex = index % 2 === 1 ? index : index - 1;
  return leftIndex + 1;
}

export function searchCatalog(
  index: CatalogIndex,
  query: string,
  limit = 30,
): { results: CatalogSearchResult[]; total: number } {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return { results: [], total: 0 };

  const tokens = normalized.split(/\s+/).filter(Boolean);
  const skuMatches: CatalogSearchResult[] = [];
  const textMatches: CatalogSearchResult[] = [];

  for (const entry of index.pages) {
    const haystack = entry.text.toLowerCase();
    const matchedSkus = entry.skus.filter((sku) => sku.toLowerCase().includes(normalized));
    const textHit = tokens.every((token) => haystack.includes(token));

    if (!matchedSkus.length && !textHit) continue;

    const result: CatalogSearchResult = {
      page: entry.page,
      matchedSkus,
      snippet: buildSnippet(entry.text, haystack.indexOf(tokens[0])),
    };

    if (matchedSkus.length) skuMatches.push(result);
    else textMatches.push(result);
  }

  const all = [...skuMatches, ...textMatches];
  return { results: all.slice(0, limit), total: all.length };
}

function buildSnippet(text: string, position: number): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!flat) return "";
  if (position < 0) return flat.slice(0, 120);
  const start = Math.max(0, position - 50);
  const end = Math.min(flat.length, position + 90);
  return `${start > 0 ? "…" : ""}${flat.slice(start, end).trim()}${end < flat.length ? "…" : ""}`;
}
