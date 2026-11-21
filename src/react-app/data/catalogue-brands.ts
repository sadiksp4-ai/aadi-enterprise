/**
 * Brands that publish a featured product catalogue (Stage 3.1).
 *
 * This module is the single source of truth for every surface that promotes a
 * brand *because it has products*:
 *
 * - the "Brands with Product Catalogues" section on `/products/brands`;
 * - the catalogue shortcut at the top of each brand collection page.
 *
 * Counts are never written by hand. They are read from the approved records in
 * `featured-products.ts`, which is generated from
 * `product-extraction/approved-image-mapping.json` and validated on module load.
 * Brand names, logos and slugs come from `brand-directory.ts`, so no asset or
 * route is invented here.
 *
 * Adding a brand later is a two-step change and nothing else:
 *
 *   1. add its approved products to `featured-products.ts`;
 *   2. confirm the brand exists in `brand-directory.ts` (name, logo, slug).
 *
 * It then appears automatically in the directory section and, because it has a
 * collection page, on that page's catalogue shortcut. Brands without approved
 * products never appear, so the section can never drift into a list of all 34
 * partners.
 */

import { brandDirectory } from "./brand-directory";
import { FEATURED_CATALOGUE } from "./featured-products";
import type { CatalogueBrandProfile } from "./catalogue.types";

export interface CatalogueBrand {
  /** Stable brand id shared by `brand-directory` and `featured-products`. */
  readonly brandId: string;
  /** Existing public slug; the brand page route is built from it. */
  readonly slug: string;
  readonly displayName: string;
  /** Existing logo asset from the brand directory. Never generated. */
  readonly logo?: string;
  /** Approved, publication-ready products only. */
  readonly productCount: number;
  /** Existing brand collection route. */
  readonly route: string;
}

function resolveBrandProfile(
  brandId: string
): CatalogueBrandProfile | undefined {
  return (
    brandDirectory.brandById.get(brandId) ??
    brandDirectory.brandBySlug.get(brandId)
  );
}

/**
 * Published catalogue brands in curated order (the order of
 * `FEATURED_CATALOGUE`). Only brands with at least one approved product are
 * included.
 */
export const CATALOGUE_BRANDS: readonly CatalogueBrand[] =
  FEATURED_CATALOGUE.filter((entry) => entry.products.length > 0).flatMap(
    (entry) => {
      const profile = resolveBrandProfile(entry.brandId);
      if (!profile) {
        // A brand with published products but no directory entry cannot be
        // linked or given a logo, so it is skipped rather than half-rendered.
        if (import.meta.env.DEV) {
          console.error(
            `Catalogue brand "${entry.brandId}" has approved products but no brand-directory entry.`
          );
        }
        return [];
      }
      return [
        {
          brandId: profile.id,
          slug: profile.slug,
          displayName: profile.displayName,
          logo: profile.logo,
          productCount: entry.products.length,
          route: `/products/brand/${profile.slug}`,
        },
      ];
    }
  );

const CATALOGUE_BRANDS_BY_ID: ReadonlyMap<string, CatalogueBrand> = new Map(
  CATALOGUE_BRANDS.map((brand) => [brand.brandId, brand])
);

/** Number of brands currently publishing a catalogue. */
export const CATALOGUE_BRAND_COUNT = CATALOGUE_BRANDS.length;

/** Total approved products across every catalogue brand. */
export const CATALOGUE_PRODUCT_TOTAL = CATALOGUE_BRANDS.reduce(
  (sum, brand) => sum + brand.productCount,
  0
);

/**
 * Catalogue entry for a brand id (or slug), if that brand publishes one.
 * Returns `undefined` for the 31 partners without approved products, which is
 * what keeps the brand-page shortcut off those pages.
 */
export function getCatalogueBrand(
  brandId: string | undefined
): CatalogueBrand | undefined {
  if (!brandId) return undefined;
  return (
    CATALOGUE_BRANDS_BY_ID.get(brandId) ??
    CATALOGUE_BRANDS.find((brand) => brand.slug === brandId)
  );
}
