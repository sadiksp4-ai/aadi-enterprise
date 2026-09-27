import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PageMeta {
  title: string;
  description: string;
}

/**
 * Production origin for canonical URLs. Source: README.md live-site entry
 * (https://www.aadienterprisespune.com), consistent with the contact email
 * domain and the custom-domain `base: "/"` in vite.config.ts.
 */
const SITE_URL = "https://www.aadienterprisespune.com";

/** Absolute URL of the social-sharing image: branded Aadi Enterprises hotel
 *  lobby (1709x920 ≈ 1.86:1, 221 KB), the closest existing asset to the
 *  recommended 1200x630 social aspect ratio. Served from the site root. */
const OG_IMAGE_URL = `${SITE_URL}/about-hero.jpg`;

const HOME_META: PageMeta = {
  title: "Aadi Enterprises | Hospitality & Hotel Solutions in India",
  description:
    "Aadi Enterprises provides professional hospitality solutions, housekeeping equipment, F&B supplies, hygiene systems and in-room amenities for hotels, restaurants and institutions across India.",
};

const PRODUCTS_META: PageMeta = {
  title: "Hospitality Products & Equipment | Aadi Enterprises",
  description:
    "Explore Aadi Enterprises' range of professional hospitality products including kitchen equipment, housekeeping solutions, hygiene systems, F&B supplies and guest amenities.",
};

const ROUTE_META: Record<string, PageMeta> = {
  "/": HOME_META,
  "/about": {
    title: "About Aadi Enterprises | Hospitality Solutions Partner",
    description:
      "Learn about Aadi Enterprises, a hospitality solutions company providing professional equipment, housekeeping, hygiene and in-room solutions for businesses across India.",
  },
  "/products": PRODUCTS_META,
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

/**
 * Route-driven document head manager (Step 1: title + meta description;
 * Step 2: canonical URL; Step 3: Open Graph + Twitter sharing metadata).
 * Rendered once inside the Router in App.tsx; updates on every navigation.
 * No SEO library introduced — uses the platform document API directly.
 * NOTE: no twitter:site/creator tags — no official X handle is confirmed
 * in the repository, and handles must not be invented.
 */
const Seo: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const key =
      pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const meta = ROUTE_META[key] ?? HOME_META;
    // The legacy /brands alias redirects to /products — canonicalize it
    // to the products URL so both never compete in the index.
    const canonicalPath = key === "/brands" ? "/products" : ROUTE_META[key] ? key : "/";
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
  }, [pathname]);

  return null;
};

export default Seo;
