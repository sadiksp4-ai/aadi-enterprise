/**
 * Published brand collection pages (Stage 2C.2).
 *
 * This module is *presentation configuration only*. It records which confirmed
 * brand slugs have a published collection page and which existing Aadi
 * Enterprises photograph introduces each one. It deliberately stores no brand
 * names, descriptions, category relationships or ranges — everything a page
 * displays is read from `brand-directory.ts` at render time, so the two can
 * never drift apart.
 *
 * Every image below is an existing site asset:
 * - `karcher` uses the mall cleaning-fleet installation (Kärcher ride-on
 *   scrubbers and wet/dry vacuums deployed by Aadi Enterprises).
 * - `tramontina` / `winterhalter` use existing commercial-kitchen imagery.
 * - `zafferano` uses the existing Zafferano cordless-lamp photograph.
 * - `dolphy` uses the existing guestroom-amenities photograph.
 * - `electrolux-professional` uses the existing commercial-laundry photograph.
 *
 * Adding a brand here is the only step required to publish its collection
 * page, provided the brand already exists in the curated directory.
 */

export interface BrandCollectionPresentation {
  /** Curated brand slug from `brand-directory.ts`. */
  readonly slug: string;
  /** Existing site photograph used as category context in the hero. */
  readonly heroImage?: string;
  readonly heroImageAlt?: string;
  /** Short, factual caption shown beneath the hero photograph. */
  readonly heroCaption?: string;
}

const BRAND_COLLECTIONS: readonly BrandCollectionPresentation[] = [
  {
    slug: "karcher",
    heroImage: "/images/installations/mall-cleaning-fleet.webp",
    heroImageAlt:
      "Fleet of ride-on scrubbers and wet/dry vacuums deployed in a shopping mall",
    heroCaption:
      "Mechanised housekeeping fleet · Aadi Enterprises installation",
  },
  {
    slug: "tramontina",
    heroImage: "/images/solutions/commercial-kitchen.webp",
    heroImageAlt:
      "Stainless-steel commercial kitchen with professional cooking equipment",
    heroCaption: "Commercial kitchen · Aadi Enterprises",
  },
  {
    slug: "winterhalter",
    heroImage: "/images/installations/convention-centre-kitchen.webp",
    heroImageAlt:
      "Stainless steel commercial kitchen with cooking ranges, ovens and prep stations",
    heroCaption:
      "Convention-centre kitchen · Aadi Enterprises installation",
  },
  {
    slug: "zafferano",
    heroImage: "/images/spotlight/zafferano-poldina-pro.webp",
    heroImageAlt:
      "Cordless rechargeable table lamps arranged on a fine-dining table",
    heroCaption: "Cordless table lighting · Zafferano range imagery",
  },
  {
    slug: "dolphy",
    heroImage: "/images/solutions/guestroom-amenities.webp",
    heroImageAlt: "Housekeeping attendant preparing a guest bed",
    heroCaption: "Guestroom amenities · Aadi Enterprises",
  },
  {
    slug: "electrolux-professional",
    heroImage: "/images/solutions/commercial-laundry.webp",
    heroImageAlt:
      "Commercial laundry with a row of industrial washer-extractors",
    heroCaption: "Commercial laundry · Aadi Enterprises",
  },
];

/** Slugs with a published collection page, in launch order. */
export const BRAND_COLLECTION_SLUGS: readonly string[] = BRAND_COLLECTIONS.map(
  (collection) => collection.slug
);

const COLLECTION_BY_SLUG = new Map(
  BRAND_COLLECTIONS.map((collection) => [collection.slug, collection])
);

/** Presentation config for a published slug; `undefined` when not published. */
export function getBrandCollection(
  slug: string | undefined
): BrandCollectionPresentation | undefined {
  if (!slug) return undefined;
  return COLLECTION_BY_SLUG.get(slug.toLowerCase());
}
