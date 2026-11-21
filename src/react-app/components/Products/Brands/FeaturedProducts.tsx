import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Search, X } from "lucide-react";
import "./FeaturedProducts.css";
import { getAssetUrl } from "../../../utils";
import {
  getProductEnquiryMessage,
  getWhatsAppUrl,
} from "../../../utils/whatsapp";
import { usePrefersReducedMotion } from "../../../lib/use-reduced-motion";
import {
  SECTION_VIEWPORT,
  resultFade,
  revealItem,
  sectionHeadVariants,
  staggerParent,
} from "../../../lib/catalogue-motion";
import { MorphingDialog } from "../../ui/morphing-dialog";
import {
  getFeaturedCatalogue,
  getFeaturedCategoryLabel,
  type FeaturedProduct,
} from "../../../data/featured-products";

/**
 * Product discovery for a brand collection page (Stage 4).
 *
 * Renders only the approved, publication-ready records held in
 * `data/featured-products.ts` — 51 products across three brands. Everything
 * shown is either catalogue metadata or a manifest image path; no description,
 * specification, price or availability claim is invented.
 */

/** Diacritic-insensitive, whitespace-collapsed search key. */
function searchKey(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

interface FeaturedProductsProps {
  /** Confirmed brand id from `brand-directory.ts`. */
  readonly brandId: string;
  /** Display name as published in the brand directory. */
  readonly brandName: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  brandId,
  brandName,
}) => {
  const catalogue = getFeaturedCatalogue(brandId);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState<FeaturedProduct | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const products = catalogue?.products ?? [];

  /** One haystack per product, built once per brand. */
  const indexed = useMemo(() => {
    if (!catalogue) return [];
    return catalogue.products.map((product) => ({
      product,
      categoryLabel: getFeaturedCategoryLabel(catalogue, product.categoryId),
      haystack: searchKey(
        [
          product.name,
          product.model,
          product.catalogueCategory ?? "",
          product.catalogueType ?? "",
          getFeaturedCategoryLabel(catalogue, product.categoryId),
        ].join(" ")
      ),
    }));
  }, [catalogue]);

  const visible = useMemo(() => {
    const tokens = searchKey(query).split(" ").filter(Boolean);
    return indexed.filter((entry) => {
      if (
        activeCategory !== "all" &&
        entry.product.categoryId !== activeCategory
      ) {
        return false;
      }
      return tokens.every((token) => entry.haystack.includes(token));
    });
  }, [indexed, query, activeCategory]);

  if (!catalogue) return null;

  const total = products.length;
  const filtered = query.trim().length > 0 || activeCategory !== "all";
  const searchId = `fp-search-${catalogue.brandId}`;
  const gridId = `fp-grid-${catalogue.brandId}`;

  const enquiryHref = (product: FeaturedProduct) =>
    getWhatsAppUrl(
      getProductEnquiryMessage(
        `${brandName} ${product.name} — ${product.model}`,
        getFeaturedCategoryLabel(catalogue, product.categoryId)
      )
    );

  const resetFilters = () => {
    setQuery("");
    setActiveCategory("all");
  };

  const openProduct = (product: FeaturedProduct) => {
    setSelected(product);
    setDialogOpen(true);
  };

  const selectedCategory = selected
    ? getFeaturedCategoryLabel(catalogue, selected.categoryId)
    : "";

  return (
    <section
      id="featured-products"
      className="px-section fp"
      aria-labelledby="fp-title"
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
            <h2 id="fp-title" className="px-section-title">
              The collection.
            </h2>
          </div>
        </motion.header>

        <div className="fp-controls">
          <div className="px-search fp-search">
            <label htmlFor={searchId} className="fp-sr">
              Search {brandName} products by name, model or SKU
            </label>
            <Search size={16} aria-hidden="true" className="px-search-icon" />
            <input
              id={searchId}
              type="search"
              value={query}
              placeholder="Search name or model / SKU"
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setQuery(event.target.value)}
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
            className="fp-filters"
            role="group"
            aria-label={`Filter ${brandName} products by category`}
          >
            <button
              type="button"
              className="fp-filter"
              aria-pressed={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
            >
              All
            </button>
            {catalogue.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="fp-filter"
                aria-pressed={activeCategory === category.id}
                onClick={() =>
                  setActiveCategory((current) =>
                    current === category.id ? "all" : category.id
                  )
                }
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="fp-status">
          <motion.p
            className="fp-count"
            role="status"
            aria-live="polite"
            {...resultFade(prefersReducedMotion, 0.2)}
          >
            {visible.length === 0
              ? "No products"
              : filtered
                ? `${visible.length} of ${total} products`
                : `${total} products`}
          </motion.p>
          {filtered && (
            <button type="button" className="px-reset" onClick={resetFilters}>
              Reset
            </button>
          )}
        </div>

        {visible.length === 0 ? (
          <div className="fp-empty">
            <h3 className="fp-empty-title">No products match.</h3>
            <button type="button" className="px-reset" onClick={resetFilters}>
              Reset filters
            </button>
          </div>
        ) : (
          <motion.ul
            id={gridId}
            className="fp-grid"
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
          >
            {visible.map(({ product }) => (
              <motion.li
                key={product.id}
                className="fp-item"
                variants={revealItem}
              >
                <article className="fp-card">
                  <div className="fp-card-media">
                    <img
                      src={getAssetUrl(product.imagePath)}
                      alt={`${brandName} ${product.name}, model ${product.model}`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="fp-card-body">
                    <h3 className="fp-card-name">{product.name}</h3>
                    <p className="fp-card-model">Model {product.model}</p>
                  </div>

                  <div className="fp-card-actions">
                    <button
                      type="button"
                      className="fp-card-action"
                      onClick={() => openProduct(product)}
                      aria-label={`View details for ${brandName} ${product.name}, model ${product.model}`}
                    >
                      View details
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                    <a
                      href={enquiryHref(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fp-card-action fp-card-action--wa"
                      aria-label={`Enquire about ${brandName} ${product.name}, model ${product.model}, on WhatsApp`}
                    >
                      <MessageCircle size={14} aria-hidden="true" />
                      Enquire
                    </a>
                  </div>
                </article>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      <ProductDialog
        brandName={brandName}
        categoryLabel={selectedCategory}
        product={selected}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onExited={() => setSelected(null)}
      />
    </section>
  );
};

/* -------------------------------------------------------------------------
 * Detail dialog — verified fields only, empty blocks omitted.
 * ---------------------------------------------------------------------- */

interface ProductDialogProps {
  brandName: string;
  categoryLabel: string;
  product: FeaturedProduct | null;
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  brandName,
  categoryLabel,
  product,
  open,
  onClose,
  onExited,
}) => {
  if (!product) return null;

  const facts: { label: string; value: string }[] = [
    { label: "Brand", value: brandName },
    { label: "Model / SKU", value: product.model },
    { label: "Category", value: categoryLabel },
  ];
  if (product.catalogueCategory) {
    facts.push({ label: "Catalogue category", value: product.catalogueCategory });
  }
  if (product.catalogueType) {
    facts.push({ label: "Type", value: product.catalogueType });
  }

  return (
    <MorphingDialog
      id="fp-product-dialog"
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
      onExitComplete={onExited}
      title={`${brandName} ${product.name} details`}
      showHeader={false}
      className="px-sheet fp-sheet"
      closeClassName="px-sheet-close"
    >
      <p className="px-eyebrow">{categoryLabel}</p>
      <h2 className="px-sheet-title">{product.name}</h2>
      <p className="px-sheet-meta">
        <span>{brandName}</span>
        <span>Model {product.model}</span>
      </p>

      <div className="fp-sheet-body">
        <div className="fp-sheet-media">
          <img
            src={getAssetUrl(product.imagePath)}
            alt={`${brandName} ${product.name}, model ${product.model}`}
            loading="lazy"
            decoding="async"
          />
        </div>

        <dl className="fp-sheet-facts">
          {facts.map((fact) => (
            <div className="fp-sheet-fact" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="px-sheet-actions">
        <Link to="/contact" className="px-btn px-btn-primary">
          Request a Quote
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <a
          href={getWhatsAppUrl(
            getProductEnquiryMessage(
              `${brandName} ${product.name} — ${product.model}`,
              categoryLabel
            )
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="px-btn px-btn-secondary"
        >
          <MessageCircle size={16} aria-hidden="true" />
          WhatsApp
        </a>
      </div>
    </MorphingDialog>
  );
};

export default FeaturedProducts;
