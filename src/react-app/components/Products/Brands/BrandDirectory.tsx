import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  MessageCircle,
  Search,
  X,
} from "lucide-react";
import "./BrandDirectory.css";
import Breadcrumbs from "../Breadcrumbs";
import { getAssetUrl } from "../../../utils";
import {
  getProductEnquiryMessage,
  getWhatsAppUrl,
} from "../../../utils/whatsapp";
import { usePrefersReducedMotion } from "../../../lib/use-reduced-motion";
import {
  SECTION_VIEWPORT,
  heroReveal,
  revealItem,
  revealItemDelayed,
  sectionHeadVariants,
  staggerParent,
} from "../../../lib/catalogue-motion";
import { brandDirectory } from "../../../data/brand-directory";
import { CATALOGUE_BRANDS } from "../../../data/catalogue-brands";
import { getBrandCollection } from "../../../data/brand-collections";
import {
  CATALOGUE_GROUPS,
  CATALOGUE_GROUP_LABELS,
} from "../../../data/catalogue-groups";
import type {
  CatalogueBrandProfile,
  CatalogueGroupId,
} from "../../../data/catalogue.types";
import { MorphingDialog } from "../../ui/morphing-dialog";

/* -------------------------------------------------------------------------
 * Page data — read from the confirmed directory only.
 * No brands, copy or category relationships are added here.
 * ---------------------------------------------------------------------- */

const ALL_BRANDS: readonly CatalogueBrandProfile[] = [
  ...brandDirectory.brands,
].sort((a, b) => a.displayName.localeCompare(b.displayName));

const BRAND_COUNT = ALL_BRANDS.length;

const CLASSIFICATION_LABEL: Record<
  CatalogueBrandProfile["classification"],
  string
> = {
  manufacturer: "Manufacturer",
  brand: "Brand partner",
  "product-collection": "Product collection",
  service: "Service provider",
  unverified: "Unverified",
};

/** Presentation spelling for the official brand mark; data stays untouched. */
function displayName(brand: CatalogueBrandProfile): string {
  return brand.id === "karcher" ? "Kärcher" : brand.displayName;
}

/** The brand's first confirmed category, kept to one short label. */
function primaryCategory(brand: CatalogueBrandProfile): string {
  const group = brand.groupIds[0];
  return group ? CATALOGUE_GROUP_LABELS[group] : "";
}

/** Diacritic-insensitive search key so "karcher" also finds "Kärcher". */
function searchKey(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/* -------------------------------------------------------------------------
 * Page
 * ---------------------------------------------------------------------- */

const BrandDirectory: React.FC = () => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<CatalogueGroupId | "all">(
    "all"
  );
  const [selected, setSelected] = useState<CatalogueBrandProfile | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const normalisedQuery = searchKey(query);

  const filtered = useMemo(
    () =>
      ALL_BRANDS.filter((brand) => {
        if (activeGroup !== "all" && !brand.groupIds.includes(activeGroup)) {
          return false;
        }
        if (
          normalisedQuery &&
          !searchKey(displayName(brand)).includes(normalisedQuery)
        ) {
          return false;
        }
        return true;
      }),
    [activeGroup, normalisedQuery]
  );

  const filtersActive = activeGroup !== "all" || normalisedQuery !== "";

  const resetFilters = () => {
    setQuery("");
    setActiveGroup("all");
  };

  const openBrand = (brand: CatalogueBrandProfile) => {
    setSelected(brand);
    setSheetOpen(true);
  };

  const enquiryHref = getWhatsAppUrl(
    getProductEnquiryMessage("hospitality brand selection", "Brand Directory")
  );

  return (
    <div className="px bd">
      {/* A — Editorial hero ------------------------------------------------ */}
      <header className="bd-hero">
        <div className="px-shell">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Products", to: "/products" },
              { label: "Brands" },
            ]}
          />

          <div className="bd-hero-inner">
            <motion.h1
              className="bd-hero-title"
              {...heroReveal(0.12, prefersReducedMotion)}
            >
              Brands behind better hospitality.
            </motion.h1>
          </div>
        </div>
      </header>

      {/* B — Brands with product catalogues ------------------------------- */}
      <section
        className="px-section px-section--alt bd-catalogue-section"
        aria-labelledby="bd-catalogue-title"
      >
        <div className="px-shell">
          <motion.header
            className="px-section-head"
            variants={sectionHeadVariants}
            initial="hidden"
            whileInView="visible"
            viewport={SECTION_VIEWPORT}
          >
            <div>
              <h2 id="bd-catalogue-title" className="px-section-title">
                Product catalogues.
              </h2>
            </div>
          </motion.header>

          <motion.ul
            className="bd-catalogue-grid"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {CATALOGUE_BRANDS.map((brand) => {
              const name =
                brand.brandId === "karcher" ? "Kärcher" : brand.displayName;

              return (
                <motion.li key={brand.brandId} variants={revealItem}>
                  <Link
                    to={brand.route}
                    className="bd-catalogue-card"
                    aria-label={`Explore the ${name} product catalogue, ${brand.productCount} products`}
                  >
                    <span className="bd-catalogue-media px-media px-media--logo">
                      {brand.logo && (
                        <img
                          src={getAssetUrl(brand.logo)}
                          alt={`${name} logo`}
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </span>
                    <span className="bd-catalogue-body">
                      <span className="bd-catalogue-name">{name}</span>
                      <span className="bd-catalogue-count">
                        {brand.productCount} products
                      </span>
                      <ArrowUpRight
                        size={16}
                        aria-hidden="true"
                        className="bd-catalogue-arrow"
                      />
                    </span>
                  </Link>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </section>

      {/* C — All confirmed brands ----------------------------------------- */}
      <section
        id="brand-directory"
        className="px-section bd-directory-section"
        aria-labelledby="bd-directory-title"
      >
        <div className="px-shell">
          <motion.header
            className="px-section-head"
            variants={sectionHeadVariants}
            initial="hidden"
            whileInView="visible"
            viewport={SECTION_VIEWPORT}
          >
            <div>
              <h2 id="bd-directory-title" className="px-section-title">
                All brands.
              </h2>
            </div>
          </motion.header>

          <div className="bd-toolbar">
            <div className="px-search bd-search">
              <Search
                size={16}
                aria-hidden="true"
                className="px-search-icon"
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search brands"
                aria-label="Search brands by name"
                autoComplete="off"
                spellCheck={false}
              />
              {query.length > 0 && (
                <button
                  type="button"
                  className="px-search-clear"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              )}
            </div>

            <div
              className="bd-filters"
              role="group"
              aria-label="Filter brands by category"
            >
              <button
                type="button"
                className="bd-filter"
                aria-pressed={activeGroup === "all"}
                onClick={() => setActiveGroup("all")}
              >
                All
              </button>
              {CATALOGUE_GROUPS.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className="bd-filter"
                  aria-pressed={activeGroup === group.id}
                  onClick={() =>
                    setActiveGroup((current) =>
                      current === group.id ? "all" : group.id
                    )
                  }
                >
                  {group.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bd-status">
            <p className="bd-result" role="status" aria-live="polite">
              {filtered.length === BRAND_COUNT
                ? `${BRAND_COUNT} brands`
                : `${filtered.length} of ${BRAND_COUNT} brands`}
            </p>
            {filtersActive && (
              <button
                type="button"
                className="px-reset"
                onClick={resetFilters}
              >
                Reset
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="px-empty">
              <h3 className="px-empty-title">No brands match.</h3>
              <button
                type="button"
                className="px-btn px-btn-secondary"
                onClick={resetFilters}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ul className="bd-grid">
              {filtered.map((brand, index) => {
                const name = displayName(brand);
                const category = primaryCategory(brand);

                return (
                  <motion.li
                    key={brand.id}
                    custom={index}
                    variants={revealItemDelayed}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    <button
                      type="button"
                      className="bd-card"
                      onClick={() => openBrand(brand)}
                      aria-label={`${name}${
                        category ? `, ${category}` : ""
                      }. Open preview.`}
                    >
                      <span className="bd-card-logo px-media px-media--logo">
                        {brand.logo && (
                          <img
                            src={getAssetUrl(brand.logo)}
                            alt={`${name} logo`}
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </span>
                      <span className="bd-card-body">
                        <span className="bd-card-text">
                          <span className="bd-card-name">{name}</span>
                          {category && (
                            <span className="bd-card-cat">{category}</span>
                          )}
                        </span>
                        <ArrowUpRight
                          size={15}
                          aria-hidden="true"
                          className="bd-card-arrow"
                        />
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          )}

          {brandDirectory.pendingRecords.length > 0 && (
            <details className="bd-pending">
              <summary>
                <span>Pending classification</span>
                <span className="bd-pending-count">
                  {brandDirectory.pendingRecords.length} records
                </span>
              </summary>
              <ul className="bd-pending-list">
                {brandDirectory.pendingRecords.map((pending) => (
                  <li key={pending.record.slug} className="bd-pending-item">
                    {pending.candidateName}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </section>

      {/* D — B2B enquiry --------------------------------------------------- */}
      <section
        className="px-cta-section px-cta-section--alt"
        aria-labelledby="bd-cta-title"
      >
        <div className="px-shell">
          <motion.div
            className="bd-cta"
            variants={revealItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 id="bd-cta-title" className="px-cta-title">
              Need help choosing?
            </h2>
            <div className="bd-cta-actions">
              <Link to="/contact" className="px-btn px-btn-primary">
                Request a Quote
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href={enquiryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-btn px-btn-secondary"
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <BrandPreview
        brand={selected}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onExited={() => setSelected(null)}
      />
    </div>
  );
};

/* -------------------------------------------------------------------------
 * Brand preview — verified range data only, no generated copy.
 * ---------------------------------------------------------------------- */

interface BrandPreviewProps {
  brand: CatalogueBrandProfile | null;
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}

const BrandPreview: React.FC<BrandPreviewProps> = ({
  brand,
  open,
  onClose,
  onExited,
}) => {
  if (!brand) return null;

  const name = displayName(brand);
  const ranges = brandDirectory.rangesByBrand.get(brand.id) ?? [];
  const categories = brand.groupIds.map(
    (id) => CATALOGUE_GROUP_LABELS[id]
  );
  const collection = getBrandCollection(brand.slug);

  return (
    <MorphingDialog
      id="bd-brand-preview"
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      onExitComplete={onExited}
      title={`${name} preview`}
      showHeader={false}
      className="px-sheet bd-sheet"
      closeClassName="px-sheet-close"
    >
      <p className="px-eyebrow">{CLASSIFICATION_LABEL[brand.classification]}</p>
      <h2 className="px-sheet-title">{name}</h2>
      <p className="px-sheet-meta">
        {categories.length > 0 && <span>{categories.join(" · ")}</span>}
        <span>
          {ranges.length} {ranges.length === 1 ? "range" : "ranges"}
        </span>
      </p>

      {brand.logo && (
        <div className="bd-sheet-logo px-media px-media--logo">
          <img
            src={getAssetUrl(brand.logo)}
            alt={`${name} logo`}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <section className="bd-sheet-ranges" aria-label="Confirmed product ranges">
        <h3 className="bd-sheet-subtitle">Ranges</h3>
        <ul>
          {ranges.map((range) => (
            <li key={range.id}>
              <Link
                to={`/products?group=${range.groupId}`}
                className="bd-sheet-range"
                aria-label={`View ${range.displayName} in the ${CATALOGUE_GROUP_LABELS[range.groupId]} catalogue`}
              >
                <span className="bd-sheet-range-text">
                  <span className="bd-sheet-range-name">
                    {range.displayName}
                  </span>
                  <span className="bd-sheet-range-group">
                    {CATALOGUE_GROUP_LABELS[range.groupId]}
                  </span>
                </span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="px-sheet-actions">
        {collection && (
          <Link
            to={`/products/brand/${brand.slug}`}
            className="px-btn px-btn-primary"
          >
            Explore the collection
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
        <Link
          to="/contact"
          className={`px-btn ${
            collection ? "px-btn-secondary" : "px-btn-primary"
          }`}
        >
          Request a Quote
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </MorphingDialog>
  );
};

export default BrandDirectory;
