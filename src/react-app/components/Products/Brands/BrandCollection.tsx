import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import WhatsAppIcon from "../../WhatsAppIcon";
import "./BrandCollection.css";
import Breadcrumbs from "../Breadcrumbs";
import FeaturedProducts from "./FeaturedProducts";
import { getAssetUrl } from "../../../utils";
import {
  getProductEnquiryMessage,
  getWhatsAppUrl,
} from "../../../utils/whatsapp";
import { usePrefersReducedMotion } from "../../../lib/use-reduced-motion";
import {
  EASE_OUT,
  SECTION_VIEWPORT,
  heroReveal,
  revealItem,
  sectionHeadVariants,
  staggerParent,
} from "../../../lib/catalogue-motion";
import {
  getBrandBySlug,
  getRangesForBrand,
} from "../../../data/brand-directory";
import { getCatalogueBrand } from "../../../data/catalogue-brands";
import { CATALOGUE_GROUP_LABELS } from "../../../data/catalogue-groups";
import { hasItems, hasText } from "../../../data/catalogue-display";
import { getBrandCollection } from "../../../data/brand-collections";
import type {
  CatalogueBrandProfile,
  CatalogueExtraInfoValue,
  CatalogueRange,
} from "../../../data/catalogue.types";
import { MorphingDialog } from "../../ui/morphing-dialog";

/* -------------------------------------------------------------------------
 * Presentation helpers — every string is derived from existing data.
 * ---------------------------------------------------------------------- */

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

/** Official brand mark spelling; the data layer keeps its own spelling. */
function displayName(brand: CatalogueBrandProfile): string {
  return brand.id === "karcher" ? "Kärcher" : brand.displayName;
}

function categoryLabels(brand: CatalogueBrandProfile): string[] {
  return brand.groupIds.map((id) => CATALOGUE_GROUP_LABELS[id]);
}

function rangeEnquiryName(
  brand: CatalogueBrandProfile,
  range: CatalogueRange
): string {
  const sameName =
    range.displayName.trim().toLowerCase() ===
    brand.displayName.trim().toLowerCase();
  return sameName
    ? brand.displayName
    : `${brand.displayName} ${range.displayName}`;
}

/** The source headline is only shown when it adds information. */
function rangeHeadline(range: CatalogueRange): string | undefined {
  const headline = range.record.headline;
  if (!hasText(headline)) return undefined;
  return headline.trim().toLowerCase() === range.displayName.trim().toLowerCase()
    ? undefined
    : headline;
}

interface ExtraEntry {
  readonly label: string;
  readonly kind: "list" | "text";
  readonly value: CatalogueExtraInfoValue;
}

function extraEntries(range: CatalogueRange): ExtraEntry[] {
  const extraInfo = range.record.extraInfo;
  if (!extraInfo) return [];
  return Object.entries(extraInfo).map(([label, value]) => ({
    label,
    kind: Array.isArray(value) ? "list" : "text",
    value,
  }));
}

function listEntries(range: CatalogueRange): ExtraEntry[] {
  return extraEntries(range).filter(
    (entry) => Array.isArray(entry.value) && entry.value.length > 0
  );
}

function textEntries(range: CatalogueRange): ExtraEntry[] {
  return extraEntries(range).filter(
    (entry) => typeof entry.value === "string" && entry.value.trim().length > 0
  );
}

/* -------------------------------------------------------------------------
 * Page
 * ---------------------------------------------------------------------- */

const BrandCollection: React.FC = () => {
  const { brandSlug } = useParams<{ brandSlug: string }>();
  const prefersReducedMotion = usePrefersReducedMotion();

  const brand = useMemo(
    () => (brandSlug ? getBrandBySlug(brandSlug) : undefined),
    [brandSlug]
  );
  const presentation = getBrandCollection(brandSlug);
  const ranges = useMemo(
    () => (brand ? getRangesForBrand(brand.id) : []),
    [brand]
  );
  // Only brands with approved featured products expose a product catalogue.
  const catalogue = brand ? getCatalogueBrand(brand.id) : undefined;

  const [selectedRange, setSelectedRange] = useState<CatalogueRange | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  // A new brand always starts at the top of its own page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setSelectedRange(null);
    setSheetOpen(false);
  }, [brand?.id]);

  /**
   * Deep links such as `/products/brand/karcher#featured-products` are opened
   * before the discovery section has mounted, so the browser cannot resolve
   * the anchor itself. Re-run the scroll once the page exists.
   */
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    const timer = window.setTimeout(() => {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "instant" : "smooth",
        block: "start",
      });
    }, 160);
    return () => window.clearTimeout(timer);
  }, [brand?.id, prefersReducedMotion]);

  if (!brand) {
    return <BrandCollectionUnavailable />;
  }

  if (!presentation) {
    return <BrandCollectionUnavailable brandName={brand.displayName} />;
  }

  const name = displayName(brand);
  const categories = categoryLabels(brand);
  const intro = catalogue
    ? `${catalogue.productCount} verified products.`
    : `${ranges.length} confirmed ${
        ranges.length === 1 ? "range" : "ranges"
      }.`;
  const rangeNames = ranges.map((range) => range.displayName).join(" · ");

  const brandWhatsApp = getWhatsAppUrl(
    getProductEnquiryMessage(brand.displayName, categories[0])
  );

  const openRange = (range: CatalogueRange) => {
    setSelectedRange(range);
    setSheetOpen(true);
  };

  return (
    <div className="px bc">
      {/* A — Brand hero ---------------------------------------------------- */}
      <header className="bc-hero">
        <div className="px-shell">
          <Breadcrumbs
            items={[
              { label: "Home", to: "/" },
              { label: "Products", to: "/products" },
              { label: "Brands", to: "/products/brands" },
              { label: name },
            ]}
          />

          <div className="bc-hero-grid">
            <div className="bc-hero-copy">
              <motion.p
                className="px-eyebrow"
                {...heroReveal(0.05, prefersReducedMotion)}
              >
                {categories.join(" · ")} ·{" "}
                {CLASSIFICATION_LABEL[brand.classification]}
              </motion.p>

              <motion.h1
                className="bc-hero-title"
                {...heroReveal(0.12, prefersReducedMotion)}
              >
                {name}
              </motion.h1>

              <motion.p
                className="bc-hero-intro"
                {...heroReveal(0.22, prefersReducedMotion)}
              >
                {intro}
              </motion.p>

              <motion.div
                className="px-hero-actions"
                {...heroReveal(0.32, prefersReducedMotion)}
              >
                {catalogue ? (
                  <a href="#featured-products" className="px-btn px-btn-primary">
                    Explore products
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                ) : (
                  <a href="#ranges" className="px-btn px-btn-primary">
                    View the ranges
                    <ArrowRight size={16} aria-hidden="true" />
                  </a>
                )}
              </motion.div>
            </div>

            <motion.div
              className="bc-hero-logo px-media px-media--logo"
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.65,
                delay: prefersReducedMotion ? 0 : 0.18,
                ease: EASE_OUT,
              }}
            >
              {brand.logo && (
                <img
                  src={getAssetUrl(brand.logo)}
                  alt={`${name} logo`}
                  decoding="async"
                />
              )}
            </motion.div>
          </div>

          {presentation.heroImage && (
            <motion.figure
              className="bc-hero-media px-media px-media--cinema"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0.2 : 0.8,
                delay: prefersReducedMotion ? 0 : 0.3,
                ease: EASE_OUT,
              }}
            >
              <img
                src={getAssetUrl(presentation.heroImage)}
                alt={presentation.heroImageAlt ?? ""}
                loading="eager"
                decoding="async"
              />
            </motion.figure>
          )}
        </div>
      </header>

      {/* B — Overview: confirmed fields only -------------------------------- */}
      <section
        className="px-section bc-overview"
        aria-labelledby="bc-overview-title"
      >
        <div className="px-shell">
          <motion.header
            className="bc-overview-head"
            variants={sectionHeadVariants}
            initial="hidden"
            whileInView="visible"
            viewport={SECTION_VIEWPORT}
          >
            <h2 id="bc-overview-title" className="px-section-title">
              Overview.
            </h2>
          </motion.header>

          <motion.dl
            className="bc-facts"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="bc-fact" variants={revealItem}>
              <dt>Categories</dt>
              <dd>{categories.join(" · ")}</dd>
            </motion.div>
            <motion.div className="bc-fact" variants={revealItem}>
              <dt>Classification</dt>
              <dd>{CLASSIFICATION_LABEL[brand.classification]}</dd>
            </motion.div>
            <motion.div className="bc-fact" variants={revealItem}>
              <dt>Ranges</dt>
              <dd>{rangeNames || "—"}</dd>
            </motion.div>
          </motion.dl>
        </div>
      </section>

      {/* C — Product discovery or confirmed ranges -------------------------- */}
      {catalogue ? (
        <FeaturedProducts
          key={brand.id}
          brandId={brand.id}
          brandName={name}
        />
      ) : (
        <section
          id="ranges"
          className="px-section px-section--alt bc-ranges"
          aria-labelledby="bc-ranges-title"
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
                <h2 id="bc-ranges-title" className="px-section-title">
                  The collection.
                </h2>
              </div>
            </motion.header>

            <motion.ul
              className="bc-range-list"
              variants={staggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              {ranges.map((range) => (
                <motion.li key={range.id} variants={revealItem}>
                  <div className="bc-range-row">
                    <div className="bc-range-text">
                      <h3 className="bc-range-name">{range.displayName}</h3>
                      <p className="bc-range-cat">
                        {CATALOGUE_GROUP_LABELS[range.groupId]}
                      </p>
                    </div>
                    <div className="bc-range-actions">
                      <button
                        type="button"
                        className="bc-range-view"
                        onClick={() => openRange(range)}
                        aria-label={`View details for ${rangeEnquiryName(
                          brand,
                          range
                        )}`}
                      >
                        View details
                        <ArrowRight size={14} aria-hidden="true" />
                      </button>
                      <a
                        href={getWhatsAppUrl(
                          getProductEnquiryMessage(
                            rangeEnquiryName(brand, range),
                            CATALOGUE_GROUP_LABELS[range.groupId]
                          )
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bc-range-wa"
                        aria-label={`Enquire about ${rangeEnquiryName(
                          brand,
                          range
                        )} on WhatsApp`}
                      >
                        <WhatsAppIcon size={15} />
                        Enquire
                      </a>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </section>
      )}

      {/* D — Enquiry -------------------------------------------------------- */}
      <section
        className="px-cta-section px-cta-section--alt"
        aria-labelledby="bc-cta-title"
      >
        <div className="px-shell">
          <motion.div
            className="bc-cta"
            variants={revealItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <h2 id="bc-cta-title" className="px-cta-title">
              Sourcing {name}?
            </h2>
            <div className="px-cta-actions">
              <Link to="/contact" className="px-btn px-btn-primary">
                Request a Quote
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href={brandWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="px-btn px-btn-secondary"
              >
                <WhatsAppIcon size={16} />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {!catalogue && (
        <RangeDialog
          brand={brand}
          range={selectedRange}
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onExited={() => setSelectedRange(null)}
        />
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------
 * Range dialog — full verified catalogue record, no added copy.
 * ---------------------------------------------------------------------- */

interface RangeDialogProps {
  brand: CatalogueBrandProfile;
  range: CatalogueRange | null;
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}

const RangeDialog: React.FC<RangeDialogProps> = ({
  brand,
  range,
  open,
  onClose,
  onExited,
}) => {
  if (!range) return null;

  const record = range.record;
  const enquiryName = rangeEnquiryName(brand, range);
  const headline = rangeHeadline(range);
  const lists = listEntries(range);
  const texts = textEntries(range);

  return (
    <MorphingDialog
      id="bc-range-dialog"
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      onExitComplete={onExited}
      title={`${enquiryName} details`}
      showHeader={false}
      className="px-sheet bc-sheet"
      closeClassName="px-sheet-close"
    >
      <p className="px-eyebrow">{CATALOGUE_GROUP_LABELS[range.groupId]}</p>
      <h2 className="px-sheet-title">{range.displayName}</h2>
      {headline && <p className="px-sheet-headline">{headline}</p>}
      <p className="px-sheet-meta">
        <span>{record.categoryTitle}</span>
      </p>

      {hasText(record.description) && (
        <p className="px-sheet-desc">{record.description}</p>
      )}

      {hasItems(record.features) && (
        <section className="bc-sheet-block" aria-label="Range features">
          <h3 className="bc-sheet-subtitle">Range features</h3>
          <ul className="bc-detail-list bc-detail-list--features">
            {record.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </section>
      )}

      {lists.map((entry) => (
        <section
          className="bc-sheet-block"
          key={entry.label}
          aria-label={entry.label}
        >
          <h3 className="bc-sheet-subtitle">{entry.label}</h3>
          <ul className="bc-detail-list bc-detail-list--chips">
            {(entry.value as readonly string[]).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      {texts.map((entry) => (
        <section
          className="bc-sheet-block"
          key={entry.label}
          aria-label={entry.label}
        >
          <h3 className="bc-sheet-subtitle">{entry.label}</h3>
          <p className="bc-sheet-text">{entry.value as string}</p>
        </section>
      ))}

      <div className="px-sheet-actions">
        <Link to="/contact" className="px-btn px-btn-primary">
          Request a Quote
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <a
          href={getWhatsAppUrl(
            getProductEnquiryMessage(
              enquiryName,
              CATALOGUE_GROUP_LABELS[range.groupId]
            )
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="px-btn px-btn-secondary"
        >
          <WhatsAppIcon size={16} />
          WhatsApp
        </a>
      </div>
    </MorphingDialog>
  );
};

/* -------------------------------------------------------------------------
 * Unpublished / unknown brand
 * ---------------------------------------------------------------------- */

interface UnavailableProps {
  brandName?: string;
}

const BrandCollectionUnavailable: React.FC<UnavailableProps> = ({
  brandName,
}) => (
  <div className="px bc bc-fallback">
    <section className="px-section bc-fallback-section">
      <div className="px-shell">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Products", to: "/products" },
            { label: "Brands", to: "/products/brands" },
          ]}
        />

        <p className="px-eyebrow">Brand collection</p>
        <h1 className="bc-hero-title bc-fallback-title">
          {brandName ? "Not published yet." : "Brand not found."}
        </h1>
        <p className="bc-hero-intro">
          {brandName
            ? `${brandName} is confirmed, but its collection is not part of the published launch.`
            : "No confirmed brand matches this address."}
        </p>
        <div className="px-hero-actions">
          <Link to="/products/brands" className="px-btn px-btn-primary">
            Open the brand directory
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link to="/products" className="px-btn px-btn-secondary">
            Products hub
            <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default BrandCollection;
