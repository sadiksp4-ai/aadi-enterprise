import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { brandDirectory } from "../../data/brand-directory";
import { getBrandCollection } from "../../data/brand-collections";
import { CATALOGUE_GROUP_LABELS } from "../../data/catalogue-groups";
import type { CatalogueBrandProfile } from "../../data/catalogue.types";

interface PageMeta {
  title: string;
  description: string;
}

/**
 * Production origin for canonical URLs. Source: README.md live-site entry
 * (https://www.aadienterprisespune.com), consistent with the contact email
 * domain and the custom-domain `base: "/"` in vite.config.ts.
 */
export const SITE_URL = "https://www.aadienterprisespune.com";

/** Absolute URL of the social-sharing image: branded Aadi Enterprises hotel
 *  lobby (1709x920 ≈ 1.86:1, 221 KB), the closest existing asset to the
 *  recommended 1200x630 social aspect ratio. Served from the site root. */
const OG_IMAGE_URL = `${SITE_URL}/about-hero.jpg`;

const HOME_META: PageMeta = {
  title: "Aadi Enterprises | Hospitality & Hotel Solutions in India",
  description:
    "Aadi Enterprises provides professional hospitality solutions including kitchen equipment, F&B supplies, housekeeping, laundry, cold chain and guest amenities for hotels, restaurants and institutions across India.",
};

const PRODUCTS_META: PageMeta = {
  title: "Hospitality Products & Equipment | Aadi Enterprises",
  description:
    "Explore Aadi Enterprises' range of professional hospitality products including kitchen equipment, F&B supplies, housekeeping, laundry, cold chain and guest amenities.",
};

const ROUTE_META: Record<string, PageMeta> = {
  "/": HOME_META,
  "/about": {
    title: "About Aadi Enterprises | Hospitality Solutions Partner",
    description:
      "Learn about Aadi Enterprises, a hospitality solutions company providing professional kitchen, F&B, housekeeping, laundry, cold chain and guest experience solutions across India.",
  },
  "/products": PRODUCTS_META,
  "/products/brands": {
    title: "Brand Directory | Hospitality Equipment Brands | Aadi Enterprises",
    description:
      "Browse Aadi Enterprises' confirmed hospitality brand partners across professional kitchens, food and beverage, housekeeping, laundry, guest amenities and commercial refrigeration.",
  },
  "/clients": {
    title: "Our Clients | Hotels, Restaurants & Institutions | Aadi Enterprises",
    description:
      "Discover the hotels, restaurants, healthcare, corporate and institutional organizations served by Aadi Enterprises across India.",
  },
  "/partners": {
    title: "Our Partners | Hospitality Equipment Brands | Aadi Enterprises",
    description:
      "Explore Aadi Enterprises' network of professional hospitality equipment and solution partners across kitchen, F&B, housekeeping, hygiene and guest experience categories.",
  },
  "/contact": {
    title: "Contact Aadi Enterprises | Hospitality Solutions India",
    description:
      "Contact Aadi Enterprises for hospitality equipment, housekeeping, hygiene, F&B and in-room amenity solutions for your property.",
  },
  // Legacy alias redirects to /products; keep its metadata in sync.
  "/brands": PRODUCTS_META,
};

/** Brand collection pages that are not published (or unknown slugs). */
const BRAND_COLLECTION_UNAVAILABLE_META: PageMeta = {
  title: "Brand Collection | Aadi Enterprises",
  description:
    "This brand collection is not published yet. Browse the Aadi Enterprises brand directory to explore confirmed brands and the ranges recorded in the catalogue.",
};

const BRAND_COLLECTION_PATH = /^\/products\/brand\/([^/]+)$/;

/**
 * Metadata for a published brand collection. Titles and descriptions only
 * restate verified catalogue facts: brand name, category and range count.
 */
function brandCollectionMeta(brand: CatalogueBrandProfile): PageMeta {
  const categories = brand.groupIds
    .map((id) => CATALOGUE_GROUP_LABELS[id])
    .join(" and ");
  const rangeCount = brand.rangeIds.length;
  return {
    title: `${brand.displayName} Collection | ${categories} | Aadi Enterprises`,
    description: `${brand.displayName} in the Aadi Enterprises catalogue: ${rangeCount} confirmed ${
      rangeCount === 1 ? "range" : "ranges"
    } in ${categories}. View range details, request a quote or enquire on WhatsApp.`,
  };
}

function upsertDescription(content: string): void {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", "description");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

/**
 * Exactly one canonical tag per route. Creates it if absent and removes any
 * extras so crawlers never see duplicates. Paths are clean (no query strings,
 * hashes, or trailing slashes except the root "/").
 */
function upsertCanonical(path: string): void {
  const canonicalPath = path === "/" ? "/" : path;
  const tags = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]')
  );
  const tag = tags[0] ?? document.createElement("link");
  if (!tag.parentNode) {
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", `${SITE_URL}${canonicalPath}`);
  for (const extra of tags.slice(1)) {
    extra.remove();
  }
}

/**
 * Generic upsert for named head tags (property="og:*" or name="twitter:*").
 * Creates the tag if absent and removes extras so each key exists exactly
 * once, then sets its content. Old values are updated, never duplicated.
 */
function upsertHeadTag(attr: "property" | "name", key: string, content: string): void {
  const selector = `meta[${attr}="${key}"]`;
  const tags = Array.from(document.querySelectorAll<HTMLMetaElement>(selector));
  const tag = tags[0] ?? document.createElement("meta");
  if (!tag.parentNode) {
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
  for (const extra of tags.slice(1)) {
    extra.remove();
  }
}

function applyHead(meta: PageMeta, canonicalPath: string): void {
  const canonicalUrl = `${SITE_URL}${canonicalPath === "/" ? "/" : canonicalPath}`;
  document.title = meta.title;
  upsertDescription(meta.description);
  upsertCanonical(canonicalPath);
  upsertHeadTag("property", "og:title", meta.title);
  upsertHeadTag("property", "og:description", meta.description);
  upsertHeadTag("property", "og:url", canonicalUrl);
  upsertHeadTag("property", "og:type", "website");
  upsertHeadTag("property", "og:site_name", "Aadi Enterprises");
  upsertHeadTag("property", "og:image", OG_IMAGE_URL);
  upsertHeadTag("name", "twitter:card", "summary_large_image");
  upsertHeadTag("name", "twitter:title", meta.title);
  upsertHeadTag("name", "twitter:description", meta.description);
  upsertHeadTag("name", "twitter:image", OG_IMAGE_URL);
}

/**
 * Route-driven document head manager (Step 1: title + meta description;
 * Step 2: canonical URL; Step 3: Open Graph + Twitter sharing metadata).
 * Rendered once inside the Router in App.tsx; updates on every navigation.
 * No SEO library introduced — uses the platform document API directly.
 * NOTE: no twitter:site/creator tags — no official X handle is confirmed
 * in the repository, and handles must not be invented.
 */
export interface SeoProps {
  /** Page-specific title and description. When set, overrides the route table. */
  title?: string;
  description?: string;
  /** Path used for the canonical tag and og:url, e.g. "/catalog/tramontina/page/12". */
  canonicalPath?: string;
}

/**
 * Routes whose metadata is owned by a page-level <Seo {...props} /> instance
 * (dynamic content such as the catalogue viewer). The global instance skips
 * them so the two never race for document.title.
 */
const PAGE_OWNED_PREFIXES = ["/catalog/"];

const Seo: React.FC<SeoProps> = ({ title, description, canonicalPath: canonicalOverride }) => {
  const { pathname } = useLocation();
  const hasOverride = Boolean(title || description || canonicalOverride);

  useEffect(() => {
    const key =
      pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

    if (hasOverride) {
      const overrideMeta: PageMeta = {
        title: title ?? HOME_META.title,
        description: description ?? HOME_META.description,
      };
      applyHead(overrideMeta, canonicalOverride ?? key);
      return;
    }

    if (PAGE_OWNED_PREFIXES.some((prefix) => key.startsWith(prefix))) return;

    const brandMatch = key.match(BRAND_COLLECTION_PATH);
    let meta: PageMeta;
    let canonicalPath: string;

    if (brandMatch) {
      // Dynamic brand collection route: resolve the slug against the curated
      // directory and the published launch list.
      const slug = decodeURIComponent(brandMatch[1]).toLowerCase();
      const brand = brandDirectory.brandBySlug.get(slug);
      const published = getBrandCollection(slug);

      if (brand && published) {
        meta = brandCollectionMeta(brand);
        canonicalPath = `/products/brand/${brand.slug}`;
      } else {
        // Unknown or unlaunched brands are not indexable content; point
        // search engines at the directory that owns those entries.
        meta = BRAND_COLLECTION_UNAVAILABLE_META;
        canonicalPath = "/products/brands";
      }
    } else {
      meta = ROUTE_META[key] ?? HOME_META;
      // The legacy /brands alias redirects to /products — canonicalize it
      // to the products URL so both never compete in the index.
      canonicalPath =
        key === "/brands" ? "/products" : ROUTE_META[key] ? key : "/";
    }

    applyHead(meta, canonicalPath);
  }, [pathname, hasOverride, title, description, canonicalOverride]);

  return null;
};

export default Seo;
