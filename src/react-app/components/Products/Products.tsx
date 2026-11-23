import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Snowflake,
  X,
} from "lucide-react";
import "./Products.css";
import { getAssetUrl } from "../../utils";
import WhatsAppIcon from "../WhatsAppIcon";
import {
  getGeneralEnquiryMessage,
  getProductEnquiryMessage,
  getWhatsAppUrl,
} from "../../utils/whatsapp";
import { matchesCatalogueQuery } from "../../lib/catalogue-search";
import { usePrefersReducedMotion } from "../../lib/use-reduced-motion";
import {
  EASE_OUT,
  SECTION_VIEWPORT,
  heroReveal,
  revealItem,
  sectionHeadVariants,
  staggerParent,
} from "../../lib/catalogue-motion";
import { brandDirectory } from "../../data/brand-directory";
import { CATALOGUE_GROUPS } from "../../data/catalogue-groups";
import {
  buildRecordSections,
  selectRecordDescription,
} from "../../data/catalogue-display";
import { getFeaturedCatalogue } from "../../data/featured-products";
import type {
  CatalogueGroupId,
  CataloguePendingRecord,
  CatalogueRange,
  CatalogueRecord,
} from "../../data/catalogue.types";
import { AnimatedTabs, type TabItem } from "../ui/animated-tabs";
import { Combobox, type ComboboxOption } from "../ui/combobox";
import { ExpandableSearch } from "../ui/expandable-search";
import { MorphingDialog } from "../ui/morphing-dialog";

/* -------------------------------------------------------------------------
 * View model built from the validated data layer.
 *
 * Every confirmed range and every pending record is represented once, so the
 * compact full-catalogue disclosure can preserve the complete search surface
 * without repeating catalogue content on the discovery sections above it.
 * ---------------------------------------------------------------------- */

type EntryKind = "range" | "collection" | "service" | "unverified";

interface CatalogueEntry {
  readonly key: string;
  readonly kind: EntryKind;
  readonly record: CatalogueRecord;
  readonly range?: CatalogueRange;
  readonly brandName?: string;
  readonly brandSlug?: string;
  readonly title: string;
  readonly groupId: CatalogueGroupId;
  readonly groupLabel: string;
  readonly categoryTitle: string;
  readonly kindLabel: string;
  readonly description?: string;
}

const KIND_LABELS: Record<EntryKind, string> = {
  range: "Product range",
  collection: "Curated collection",
  service: "Aadi service",
  unverified: "Verification pending",
};

function pendingKind(
  classification: CataloguePendingRecord["classification"]
): EntryKind {
  if (classification === "service") return "service";
  if (classification === "unverified") return "unverified";
  return "collection";
}

const RANGE_ENTRIES: CatalogueEntry[] = brandDirectory.ranges.map((range) => {
  const brand = brandDirectory.brandById.get(range.brandId);
  return {
    key: `range:${range.id}`,
    kind: "range",
    record: range.record,
    range,
    brandName: brand?.displayName,
    brandSlug: range.brandSlug,
    title: range.displayName,
    groupId: range.record.groupId,
    groupLabel: range.record.groupLabel,
    categoryTitle: range.record.categoryTitle,
    kindLabel: KIND_LABELS.range,
    description: selectRecordDescription(range.record),
  };
});

const PENDING_ENTRIES: CatalogueEntry[] = brandDirectory.pendingRecords.map(
  (pending) => {
    const kind = pendingKind(pending.classification);
    return {
      key: `pending:${pending.record.slug}`,
      kind,
      record: pending.record,
      title: pending.record.name,
      groupId: pending.record.groupId,
      groupLabel: pending.record.groupLabel,
      categoryTitle: pending.record.categoryTitle,
      kindLabel: KIND_LABELS[kind],
      description: selectRecordDescription(pending.record),
    };
  }
);

/** Legacy order is preserved so search results feel identical to before. */
const ALL_ENTRIES: CatalogueEntry[] = [...RANGE_ENTRIES, ...PENDING_ENTRIES].sort(
  (a, b) => a.record.sourceIndex - b.record.sourceIndex
);

/* -------------------------------------------------------------------------
 * Discovery content
 * ---------------------------------------------------------------------- */

/**
 * The three brands with published product catalogues. Counts are read from the
 * approved featured catalogue at render time — never hard-coded — so the tiles
 * cannot drift from the collection pages.
 */
const FEATURED_COLLECTION_IDS = ["karcher", "tramontina", "dolphy"] as const;

/** Full-frame brand cover posters, one per featured collection. */
const FEATURED_COVERS: Record<
  (typeof FEATURED_COLLECTION_IDS)[number],
  { readonly image: string; readonly alt: string }
> = {
  karcher: {
    image: "/products/karcher/aadi-karcher-brand-cover.webp",
    alt: "Kärcher Professional Cleaning Solutions",
  },
  tramontina: {
    image: "/products/Tramontina/aadi-tramontina-brand-cover.webp",
    alt: "Tramontina Professional Cookware and Kitchenware",
  },
  dolphy: {
    image: "/products/Dolphy/aadi-dolphy-brand-cover.webp",
    alt: "Dolphy Professional Hygiene and Guest Amenities",
  },
};

const FEATURED_COLLECTIONS = FEATURED_COLLECTION_IDS.flatMap((brandId) => {
  const brand = brandDirectory.brandBySlug.get(brandId);
  const catalogue = getFeaturedCatalogue(brandId);
  const cover = FEATURED_COVERS[brandId];
  if (!brand || !catalogue || catalogue.products.length === 0) return [];

  return [
    {
      brandId,
      slug: brand.slug,
      // Presentation spelling for the official brand mark; data stays untouched.
      name: brandId === "karcher" ? "Kärcher" : brand.displayName,
      count: catalogue.products.length,
      image: cover.image,
      imageAlt: cover.alt,
    },
  ];
});

/** Twelve logo plates keep the partner section compact. */
const FEATURED_BRAND_SLUGS = [
  "rational",
  "winterhalter",
  "robot-coupe",
  "tramontina",
  "ariane",
  "schott-zwiesel",
  "steelite",
  "zafferano",
  "karcher",
  "electrolux-professional",
  "dolphy",
  "ice-make",
] as const;

const FEATURED_BRANDS = FEATURED_BRAND_SLUGS.flatMap((slug) => {
  const brand = brandDirectory.brandBySlug.get(slug);
  return brand ? [brand] : [];
});

const ALL_BRANDS = [...brandDirectory.brands].sort((a, b) =>
  a.displayName.localeCompare(b.displayName)
);

/**
 * Presentation labels for the six catalogue groups. The data layer keeps the
 * short labels used by the footer and URL contract; discovery sections read
 * better with the full commercial names.
 */
const CATEGORY_LABELS: Record<CatalogueGroupId, string> = {
  kitchen: "Professional Kitchen",
  fnb: "Food & Beverage",
  hk: "Housekeeping & Hygiene",
  laundry: "Commercial Laundry",
  guest: "Guest Experience",
  cold: "Refrigeration & Cold Chain",
};

const GROUP_STATS = CATALOGUE_GROUPS.map((group) => {
  const ranges = RANGE_ENTRIES.filter((entry) => entry.groupId === group.id).length;
  const solutions = PENDING_ENTRIES.filter(
    (entry) => entry.groupId === group.id
  ).length;
  return {
    ...group,
    displayLabel: CATEGORY_LABELS[group.id],
    records: ranges + solutions,
  };
});

/** Shorter tab labels keep the strip readable on tablet widths. */
const TAB_LABELS: Partial<Record<CatalogueGroupId, string>> = {
  hk: "Housekeeping",
  cold: "Cold Chain",
};

const CATEGORY_TABS: TabItem[] = [
  {
    id: "all",
    label: "All",
    badge: ALL_ENTRIES.length,
    ariaLabel: `All catalogue records (${ALL_ENTRIES.length})`,
  },
  ...GROUP_STATS.map((group) => ({
    id: group.id,
    label: TAB_LABELS[group.id] ?? group.label,
    badge: group.records,
    ariaLabel: `${group.displayLabel} (${group.records})`,
  })),
];

const BRAND_COMBO_OPTIONS: ComboboxOption[] = [
  { value: "all", label: "All brand partners" },
  ...ALL_BRANDS.map((brand) => ({
    value: brand.slug,
    label: brand.displayName,
    description: `${brand.rangeIds.length} ${
      brand.rangeIds.length === 1 ? "range" : "ranges"
    }`,
  })),
];

/** One verified photograph per category; cold chain has no approved image. */
const CATEGORY_MEDIA: Partial<
  Record<CatalogueGroupId, { image: string; alt: string }>
> = {
  kitchen: {
    image: "/images/solutions/commercial-kitchen.webp",
    alt: "Stainless-steel commercial kitchen with professional cooking equipment",
  },
  fnb: {
    image: "/images/installations/fine-dining-tabletop.webp",
    alt: "Fine-dining table setting with glassware and tableware",
  },
  hk: {
    image: "/images/solutions/housekeeping-scrubbers.webp",
    alt: "Fleet of professional floor-scrubbers and cleaning machines",
  },
  laundry: {
    image: "/images/solutions/commercial-laundry.webp",
    alt: "Commercial laundry with a row of industrial washer-extractors",
  },
  guest: {
    image: "/images/solutions/guestroom-amenities.webp",
    alt: "Housekeeping attendant preparing a guest bed",
  },
};

const INITIAL_VISIBLE_ENTRIES = 12;

function enquiryName(entry: CatalogueEntry): string {
  if (entry.brandName && entry.brandName !== entry.title) {
    return `${entry.brandName} ${entry.title}`;
  }
  return entry.record.name;
}

function whatsappHref(entry: CatalogueEntry): string {
  return getWhatsAppUrl(
    getProductEnquiryMessage(enquiryName(entry), entry.groupLabel)
  );
}

/* -------------------------------------------------------------------------
 * Motion
 *
 * Shared variants live in `lib/catalogue-motion.ts`. Only the hero line mask
 * is local, because it is the one composition unique to this page.
 * ---------------------------------------------------------------------- */

interface HeroLineProps {
  children: React.ReactNode;
  delay: number;
  reduced: boolean;
}

/** A single masked headline line that rises into place on load. */
const HeroLine: React.FC<HeroLineProps> = ({ children, delay, reduced }) => (
  <span className="px-hero-line">
    <motion.span
      initial={reduced ? { opacity: 0 } : { y: "112%" }}
      animate={reduced ? { opacity: 1 } : { y: "0%" }}
      transition={{
        duration: reduced ? 0.3 : 0.9,
        delay: reduced ? 0 : delay,
        ease: EASE_OUT,
      }}
    >
      {children}
    </motion.span>
  </span>
);

/* -------------------------------------------------------------------------
 * Page
 * ---------------------------------------------------------------------- */

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReducedMotion = usePrefersReducedMotion();

  const groupParam = searchParams.get("group");
  const activeGroupId: CatalogueGroupId | "all" = CATALOGUE_GROUPS.some(
    (group) => group.id === groupParam
  )
    ? (groupParam as CatalogueGroupId)
    : "all";

  const [query, setQuery] = useState("");
  const [activeBrand, setActiveBrand] = useState("all");
  const [showAllEntries, setShowAllEntries] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(
    () => activeGroupId !== "all"
  );
  const [selected, setSelected] = useState<CatalogueEntry | null>(null);
  const [selectedLayoutId, setSelectedLayoutId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => {
    return ALL_ENTRIES.filter((entry) => {
      if (activeGroupId !== "all" && entry.groupId !== activeGroupId) {
        return false;
      }
      if (activeBrand !== "all" && entry.brandSlug !== activeBrand) {
        return false;
      }
      if (query.trim() && !matchesCatalogueQuery(entry.record, query)) {
        return false;
      }
      return true;
    });
  }, [activeGroupId, activeBrand, query]);

  const filtersActive =
    activeGroupId !== "all" || activeBrand !== "all" || query.trim() !== "";

  const isFiltering = filtersActive;

  const visibleEntries = isFiltering
    ? filtered
    : filtered.slice(
        0,
        showAllEntries ? filtered.length : INITIAL_VISIBLE_ENTRIES
      );

  const activeGroupLabel =
    activeGroupId === "all" ? "" : CATEGORY_LABELS[activeGroupId];

  const activeBrandName =
    activeBrand === "all"
      ? ""
      : brandDirectory.brandBySlug.get(activeBrand)?.displayName ?? "";

  // Typing in the hero search reveals the catalogue it filters.
  useEffect(() => {
    if (query.trim()) setCatalogueOpen(true);
  }, [query]);

  // A `?group=` deep link (footer, category tile, shared URL) must never leave
  // the matching records hidden behind a collapsed disclosure.
  useEffect(() => {
    if (activeGroupId !== "all") setCatalogueOpen(true);
  }, [activeGroupId]);

  const scrollToId = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    const startY = window.scrollY;
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "instant" : "smooth",
      block: "start",
    });
    // Some embedded/headless browsers suppress smooth programmatic scrolling.
    // If nothing moved, jump to the same position instead of doing nothing.
    window.setTimeout(() => {
      if (Math.abs(window.scrollY - startY) < 2) {
        const top = target.getBoundingClientRect().top + window.scrollY - 104;
        window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
      }
    }, 280);
  };

  const setGroup = (groupId: string) => {
    const next = new URLSearchParams(searchParams);
    if (groupId === "all") next.delete("group");
    else next.set("group", groupId);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("group");
    setSearchParams(next, { replace: true });
    setActiveBrand("all");
    setQuery("");
    setShowAllEntries(false);
  };

  const selectCategory = (groupId: CatalogueGroupId) => {
    setGroup(activeGroupId === groupId ? "all" : groupId);
    setActiveBrand("all");
    setCatalogueOpen(true);
    scrollToId("catalogue");
  };

  const viewResults = () => {
    setCatalogueOpen(true);
    scrollToId("catalogue");
  };

  const openEntry = (entry: CatalogueEntry, layoutId?: string) => {
    setSelected(entry);
    setSelectedLayoutId(layoutId ?? null);
    setSheetOpen(true);
  };

  return (
    <div className="px">
      {/* 1 — Hero ------------------------------------------------------- */}
      <header className="px-hero">
        <div className="px-shell px-hero-grid">
          <div className="px-hero-copy">
            <motion.p
              className="px-eyebrow"
              {...heroReveal(0.05, prefersReducedMotion)}
            >
              Products &amp; Solutions
            </motion.p>

            <h1 className="px-hero-title">
              <HeroLine delay={0.12} reduced={prefersReducedMotion}>
                The essentials behind{" "}
              </HeroLine>
              <HeroLine delay={0.2} reduced={prefersReducedMotion}>
                <em>exceptional</em>{" "}
              </HeroLine>
              <HeroLine delay={0.28} reduced={prefersReducedMotion}>
                hospitality.
              </HeroLine>
            </h1>

            <motion.p
              className="px-hero-text"
              {...heroReveal(0.38, prefersReducedMotion)}
            >
              Verified products from the brands that equip hotels, restaurants
              and institutions.
            </motion.p>

            <motion.div
              className="px-hero-search"
              {...heroReveal(0.46, prefersReducedMotion)}
            >
              <ExpandableSearch
                value={query}
                onValueChange={setQuery}
                placeholder="Search products or brands"
                ariaLabel="Search products, brands or applications"
              />
            </motion.div>

            {query.trim() && (
              <motion.div
                className="px-hero-searchmeta"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
              >
                <span>
                  {filtered.length === 0
                    ? "No matching records."
                    : `${filtered.length} matching ${
                        filtered.length === 1 ? "record" : "records"
                      }`}
                </span>
                {filtered.length > 0 && (
                  <button
                    type="button"
                    className="px-link"
                    onClick={viewResults}
                  >
                    View results
                    <ArrowDown size={14} aria-hidden="true" />
                  </button>
                )}
              </motion.div>
            )}
          </div>

          <motion.figure
            className="px-hero-media"
            initial={{
              opacity: 0,
              scale: prefersReducedMotion ? 1 : 0.99,
            }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 1,
              delay: prefersReducedMotion ? 0 : 0.18,
              ease: EASE_OUT,
            }}
          >
            <div className="px-hero-frame px-media px-media--hero">
              <motion.img
                src={getAssetUrl(
                  "/images/installations/convention-centre-kitchen.webp"
                )}
                alt="Stainless-steel commercial kitchen equipped for a hospitality project"
                loading="eager"
                decoding="async"
                initial={{ scale: prefersReducedMotion ? 1 : 1.055 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: prefersReducedMotion ? 0.3 : 1.6,
                  delay: prefersReducedMotion ? 0 : 0.18,
                  ease: EASE_OUT,
                }}
              />
            </div>
          </motion.figure>
        </div>
      </header>

      {/* 2 — Featured product catalogues -------------------------------- */}
      <section
        className="px-section px-section--flush px-section--alt"
        aria-labelledby="px-collections-title"
      >
        <div className="px-shell">
          <motion.div
            className="px-block-head"
            variants={sectionHeadVariants}
            initial="hidden"
            whileInView="visible"
            viewport={SECTION_VIEWPORT}
          >
            <h2 id="px-collections-title" className="px-section-title">
              Collections.
            </h2>
          </motion.div>

          <motion.ul
            className="px-collection-grid"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {FEATURED_COLLECTIONS.map((collection) => (
              <motion.li key={collection.brandId} variants={revealItem}>
                <Link
                  to={`/products/brand/${collection.slug}`}
                  className="px-collection"
                  aria-label={`Explore the ${collection.name} catalogue, ${collection.count} products`}
                >
                  <span className="px-collection-media px-media px-media--portrait px-media--zoom">
                    <img
                      src={getAssetUrl(collection.image)}
                      alt={collection.imageAlt}
                      width={1200}
                      height={1600}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span className="px-collection-head">
                    <span className="px-collection-name">{collection.name}</span>
                    <span className="px-collection-meta">
                      <span className="px-collection-count">
                        {collection.count} products
                      </span>
                      <ArrowUpRight
                        size={15}
                        aria-hidden="true"
                        className="px-collection-arrow"
                      />
                    </span>
                  </span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* 3 — Category discovery ---------------------------------------- */}
      <section
        id="categories"
        className="px-section"
        aria-labelledby="px-categories-title"
      >
        <div className="px-shell">
          <motion.div
            className="px-block-head"
            variants={sectionHeadVariants}
            initial="hidden"
            whileInView="visible"
            viewport={SECTION_VIEWPORT}
          >
            <h2 id="px-categories-title" className="px-section-title">
              Categories.
            </h2>
          </motion.div>

          <motion.ul
            className="px-category-grid no-scrollbar"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {GROUP_STATS.map((group) => {
              const media = CATEGORY_MEDIA[group.id];
              const isActive = activeGroupId === group.id;
              return (
                <motion.li key={group.id} variants={revealItem}>
                  <button
                    type="button"
                    className={`px-category${
                      media ? "" : " px-category--type"
                    }${isActive ? " is-active" : ""}`}
                    onClick={() => selectCategory(group.id)}
                    aria-pressed={isActive}
                    aria-label={`${group.displayLabel}, ${group.records} records`}
                  >
                    {media ? (
                      <img
                        src={getAssetUrl(media.image)}
                        alt={media.alt}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <Snowflake
                        className="px-category-glyph"
                        size={150}
                        strokeWidth={0.6}
                        aria-hidden="true"
                      />
                    )}
                    <span className="px-category-shade" aria-hidden="true" />
                    <span className="px-category-top">
                      <span className="px-category-arrow" aria-hidden="true">
                        <ArrowUpRight size={16} />
                      </span>
                    </span>
                    <span className="px-category-title">
                      {group.displayLabel}
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>

          {/* Secondary discovery: the complete catalogue, collapsed by default. */}
          <div id="catalogue" className="px-catalogue">
            <div className="px-catalogue-head">
              <div>
                <h3 className="px-catalogue-title">Full catalogue</h3>
              </div>
              <button
                type="button"
                className="px-btn px-btn-secondary"
                onClick={() => setCatalogueOpen((value) => !value)}
                aria-expanded={catalogueOpen}
                aria-controls="px-catalogue-body"
              >
                {catalogueOpen
                  ? "Hide catalogue"
                  : `Browse all ${ALL_ENTRIES.length} records`}
                <ArrowDown
                  size={15}
                  aria-hidden="true"
                  className={catalogueOpen ? "px-flip" : undefined}
                />
              </button>
            </div>

            {catalogueOpen && (
              <div id="px-catalogue-body" className="px-catalogue-body">
                <div className="px-index-toolbar">
                  <div className="px-index-tabs-row">
                    <AnimatedTabs
                      tabs={CATEGORY_TABS}
                      activeTab={activeGroupId}
                      onChange={setGroup}
                      className="px-index-tabs"
                      renderContent={false}
                      layoutId="px-category-indicator"
                      tabsContainerClassName="px-tabs no-scrollbar"
                      tabClassName="px-tab"
                      activeTabClassName="is-active"
                      indicatorClassName="px-tab-bg"
                      badgeClassName="px-tab-badge"
                      tablistAria={{
                        label: "Filter the catalogue by category",
                        controls: "px-index-results",
                      }}
                    />
                    <p
                      className="px-index-count"
                      role="status"
                      aria-live="polite"
                    >
                      <motion.strong
                        key={filtered.length}
                        initial={{ opacity: 0.35 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.24, ease: EASE_OUT }}
                      >
                        {filtered.length}
                      </motion.strong>{" "}
                      of {ALL_ENTRIES.length}
                    </p>
                  </div>

                  <div className="px-index-filters">
                    <div className="px-brand-filter">
                      <Combobox
                        options={BRAND_COMBO_OPTIONS}
                        value={activeBrand}
                        onValueChange={(brand) => {
                          setActiveBrand(brand ?? "all");
                        }}
                        placeholder="All brand partners"
                        searchPlaceholder="Search brand partners…"
                        emptyText="No matching brands."
                        aria-label="Filter by brand partner"
                        className="w-full"
                      />
                    </div>

                    {filtersActive && (
                      <div className="px-active-filters">
                        {activeGroupId !== "all" && (
                          <span className="px-chip">
                            {activeGroupLabel}
                            <button
                              type="button"
                              onClick={() => setGroup("all")}
                              aria-label="Remove category filter"
                            >
                              <X size={12} aria-hidden="true" />
                            </button>
                          </span>
                        )}
                        {activeBrand !== "all" && (
                          <span className="px-chip">
                            {activeBrandName}
                            <button
                              type="button"
                              onClick={() => setActiveBrand("all")}
                              aria-label="Remove brand filter"
                            >
                              <X size={12} aria-hidden="true" />
                            </button>
                          </span>
                        )}
                        {query.trim() && (
                          <span className="px-chip">
                            “{query.trim()}”
                            <button
                              type="button"
                              onClick={() => setQuery("")}
                              aria-label="Remove search filter"
                            >
                              <X size={12} aria-hidden="true" />
                            </button>
                          </span>
                        )}
                        <button
                          type="button"
                          className="px-reset"
                          onClick={clearFilters}
                        >
                          Reset all
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <motion.div
                  id="px-index-results"
                  key={`${activeGroupId}:${activeBrand}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.15 : 0.28,
                    ease: EASE_OUT,
                  }}
                >
                  {filtered.length === 0 ? (
                    <div className="px-empty">
                      <h3 className="px-empty-title">No records found</h3>
                      <p className="px-empty-text">
                        Try another product name, brand or category.
                      </p>
                      <button
                        type="button"
                        className="px-btn px-btn-secondary"
                        onClick={clearFilters}
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    <>
                      <ul className="px-index-list">
                        {visibleEntries.map((entry) => {
                          const brandLabel =
                            entry.brandName && entry.brandName !== entry.title
                              ? entry.brandName
                              : entry.kindLabel;
                          return (
                            <li key={entry.key} className="px-index-item">
                              <div className="px-index-media px-media px-media--editorial">
                                {entry.record.logo && (
                                  <img
                                    src={getAssetUrl(entry.record.logo)}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                  />
                                )}
                              </div>

                              <div className="px-index-identity">
                                <span
                                  className={`px-index-brand px-index-brand--${entry.kind}`}
                                >
                                  {brandLabel}
                                </span>
                                <button
                                  type="button"
                                  className="px-index-title"
                                  onClick={() => openEntry(entry)}
                                >
                                  {entry.title}
                                </button>
                                <span className="px-index-meta">
                                  {entry.groupLabel}
                                  {entry.kind !== "range" && (
                                    <> · {entry.kindLabel}</>
                                  )}
                                </span>
                              </div>

                              <div className="px-index-actions">
                                <button
                                  type="button"
                                  className="px-index-action"
                                  onClick={() => openEntry(entry)}
                                  aria-label={`View details for ${entry.title}`}
                                >
                                  Details
                                  <ArrowUpRight size={14} aria-hidden="true" />
                                </button>
                                <a
                                  href={whatsappHref(entry)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-index-action px-index-action--wa"
                                  aria-label={`Enquire about ${enquiryName(
                                    entry
                                  )} on WhatsApp`}
                                >
                                  <WhatsAppIcon size={15} />
                                </a>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      {!isFiltering &&
                        !showAllEntries &&
                        filtered.length > INITIAL_VISIBLE_ENTRIES && (
                          <div className="px-index-more">
                            <button
                              type="button"
                              className="px-btn px-btn-secondary"
                              onClick={() => setShowAllEntries(true)}
                            >
                              Browse all {filtered.length} records
                              <ArrowDown size={15} aria-hidden="true" />
                            </button>
                          </div>
                        )}

                      {!isFiltering &&
                        showAllEntries &&
                        filtered.length > INITIAL_VISIBLE_ENTRIES && (
                          <div className="px-index-more">
                            <button
                              type="button"
                              className="px-link"
                              onClick={() => {
                                setShowAllEntries(false);
                                scrollToId("catalogue");
                              }}
                            >
                              Show fewer records
                            </button>
                          </div>
                        )}
                    </>
                  )}
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4 — Brand partners -------------------------------------------- */}
      <section
        className="px-section px-section--alt"
        aria-labelledby="px-brands-title"
      >
        <div className="px-shell">
          <motion.div
            className="px-block-head"
            variants={sectionHeadVariants}
            initial="hidden"
            whileInView="visible"
            viewport={SECTION_VIEWPORT}
          >
            <h2 id="px-brands-title" className="px-section-title">
              Trusted brands.
            </h2>
            <Link to="/products/brands" className="px-link">
              All {brandDirectory.brands.length} brands
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.ul
            className="px-brand-strip"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {FEATURED_BRANDS.map((brand) => (
              <motion.li key={brand.id} variants={revealItem}>
                <span className="px-brand-plate px-media">
                  {brand.logo && (
                    <img
                      src={getAssetUrl(brand.logo)}
                      alt={brand.displayName}
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* 5 — Enquiry ---------------------------------------------------- */}
      <section className="px-cta-section" aria-labelledby="px-cta-title">
        <div className="px-shell">
          <motion.div
            className="px-cta"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={revealItem}
          >
            <div className="px-cta-media px-media px-media--bare">
              <img
                src={getAssetUrl("/images/solutions/banquet-operations.webp")}
                alt="Banquet buffet display prepared for a hospitality event"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="px-cta-body">
              <h2 id="px-cta-title" className="px-cta-title">
                Sourcing for an opening or refurbishment?
              </h2>
              <p className="px-cta-text">
                Share your requirement and we will prepare a consolidated
                quotation.
              </p>
              <div className="px-cta-actions">
                <Link to="/contact" className="px-btn px-btn-primary">
                  Request a Quote
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <a
                  href={getWhatsAppUrl(getGeneralEnquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-btn px-btn-secondary"
                >
                  <WhatsAppIcon size={16} />
                  WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <EntryDialog
        entry={selected}
        layoutId={selectedLayoutId}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onExited={() => {
          setSelected(null);
          setSelectedLayoutId(null);
        }}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------
 * Details dialog
 * ---------------------------------------------------------------------- */

interface EntryDialogProps {
  entry: CatalogueEntry | null;
  layoutId: string | null;
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}

const EntryDialog: React.FC<EntryDialogProps> = ({
  entry,
  layoutId,
  open,
  onClose,
  onExited,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setExpanded({});
  }, [entry?.key]);

  if (!entry) return null;

  const sections = buildRecordSections(entry.record);
  const isRange = entry.kind === "range";

  return (
    <MorphingDialog
      id={layoutId ?? "px-entry-dialog"}
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      onExitComplete={onExited}
      title={`${entry.title} details`}
      showHeader={false}
      className="px-sheet px-sheet--motion"
      closeClassName="px-sheet-close"
    >
      <p className="px-eyebrow">{entry.groupLabel}</p>
      <h2 className="px-sheet-title">{entry.title}</h2>
      {entry.record.headline && (
        <p className="px-sheet-headline">{entry.record.headline}</p>
      )}

      <p className="px-sheet-meta">
        <span>
          {entry.brandName && entry.brandName !== entry.title
            ? entry.brandName
            : isRange
              ? "Confirmed brand range"
              : entry.kindLabel}
        </span>
        <span>{entry.categoryTitle}</span>
      </p>

      {entry.record.logo && (
        <img
          src={getAssetUrl(entry.record.logo)}
          alt={`${entry.title} logo`}
          className="px-sheet-image"
          loading="lazy"
          decoding="async"
        />
      )}

      {sections.map((section) => {
        const isExpanded = expanded[section.id] ?? false;
        const isOverview = section.id === "overview";
        const showBodyToggle =
          isOverview && !!section.body && section.body.length > 240;
        const showItemsToggle = !!section.items && section.items.length > 6;
        const visibleItems =
          section.items && showItemsToggle && !isExpanded
            ? section.items.slice(0, 6)
            : section.items;

        return (
          <section
            key={section.id}
            className="px-spec"
            aria-label={section.heading}
          >
            <h3 className="px-spec-title">{section.heading}</h3>

            {section.body && (
              <p
                className={`px-sheet-desc${
                  showBodyToggle && !isExpanded ? " px-clamped" : ""
                }`}
              >
                {section.body}
              </p>
            )}

            {visibleItems && visibleItems.length > 0 && (
              <ul className="px-spec-list">
                {visibleItems.map((item, index) => (
                  <li key={`${section.id}-${index}`}>{item}</li>
                ))}
              </ul>
            )}

            {section.subItems &&
              section.subItems.map((sub, index) => (
                <div key={`${section.id}-${index}`} className="px-sub-block">
                  <h4 className="px-spec-title">{sub.title}</h4>
                  {sub.description && (
                    <p className="px-sheet-desc">{sub.description}</p>
                  )}
                  <ul className="px-spec-list">
                    {sub.items.map((item, itemIndex) => (
                      <li key={`${section.id}-${index}-${itemIndex}`}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

            {section.entries && section.entries.length > 0 && (
              <dl className="px-dl">
                {section.entries.map((item) => (
                  <div key={item.label} className="px-dl-row">
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {showBodyToggle && (
              <button
                type="button"
                className="px-text-toggle"
                onClick={() =>
                  setExpanded((current) => ({
                    ...current,
                    [section.id]: !isExpanded,
                  }))
                }
                aria-expanded={isExpanded}
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}

            {showItemsToggle && (
              <button
                type="button"
                className="px-text-toggle"
                onClick={() =>
                  setExpanded((current) => ({
                    ...current,
                    [section.id]: !isExpanded,
                  }))
                }
                aria-expanded={isExpanded}
              >
                {isExpanded
                  ? "Show fewer"
                  : `Show all ${section.items?.length ?? 0}`}
              </button>
            )}
          </section>
        );
      })}

      <div className="px-sheet-actions">
        <Link
          to="/contact"
          className="px-btn px-btn-primary"
          onClick={onClose}
        >
          Request a Quote
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <a
          href={whatsappHref(entry)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-btn px-btn-secondary"
        >
          <WhatsAppIcon size={16} />
          WhatsApp Enquiry
        </a>
      </div>
    </MorphingDialog>
  );
};

export default Products;
