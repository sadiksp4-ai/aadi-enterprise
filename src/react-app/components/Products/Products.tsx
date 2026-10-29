import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, MessageCircle, Search, X } from "lucide-react";
import "./Products.css";
import data from "../../../../aadi-info.json";
import { getAssetUrl } from "../../utils";
import { getProductEnquiryMessage, getWhatsAppUrl } from "../../utils/whatsapp";

interface ProductEntry {
  name: string;
  logo?: string;
  brandLabel?: string;
  badge?: string;
  highlights?: string[];
  headline?: string;
  description: string;
  cardDescription?: string;
  subDescription?: string;
  features?: string[];
  idealFor?: string[];
  closing?: string;
  extraInfo?: Record<string, string | string[]>;
  subItems?: {
    title: string;
    description?: string;
    items: string[];
  }[];
  advantages?: string[];
}

interface RawCategory {
  id: string;
  title: string;
  description?: string;
  brands: ProductEntry[];
}

const rawCategories = (data as { productCategories: RawCategory[] }).productCategories;

interface CatalogProduct extends ProductEntry {
  /** Customer-facing group label (UI mapping only — raw records untouched). */
  groupId: string;
  groupLabel: string;
  sourceCategoryTitle: string;
}

const GROUPS: { id: string; label: string }[] = [
  { id: "all", label: "All" },
  { id: "kitchen", label: "Kitchen" },
  { id: "fnb", label: "Food & Beverage" },
  { id: "hk", label: "Housekeeping & Hygiene" },
  { id: "laundry", label: "Laundry" },
  { id: "guest", label: "Guest Experience" },
  { id: "cold", label: "Refrigeration & Cold Chain" },
];

const CATEGORY_IMAGES: Record<string, string> = {
  kitchen: getAssetUrl("commercial_kitchen.jpg"),
  fnb: getAssetUrl("f&b.jpg"),
  hk: getAssetUrl("housekeeping.jpg"),
  laundry: getAssetUrl("commercial_laundry.png"),
  guest: getAssetUrl("housekeeping/in-room-collection.jpg"),
  cold: getAssetUrl("elanpro.png"),
};

function groupFor(sourceId: string, name: string): { id: string; label: string } {
  if (sourceId === "commercial-kitchen") return { id: "kitchen", label: "Kitchen" };
  if (sourceId === "fnb-service") return { id: "fnb", label: "Food & Beverage" };
  if (sourceId === "housekeeping-solutions") return { id: "hk", label: "Housekeeping & Hygiene" };
  if (sourceId === "laundry-solutions") return { id: "laundry", label: "Laundry" };
  if (sourceId === "leather-products") return { id: "guest", label: "Guest Experience" };
  if (sourceId === "in-room-amenities") {
    if (name === "Elanpro" || name === "Ice Make") return { id: "cold", label: "Refrigeration & Cold Chain" };
    return { id: "guest", label: "Guest Experience" };
  }
  return { id: "guest", label: "Guest Experience" };
}

const ALL_PRODUCTS: CatalogProduct[] = rawCategories.flatMap((cat) =>
  cat.brands.map((brand) => {
    const group = groupFor(cat.id, brand.name);
    return {
      ...brand,
      groupId: group.id,
      groupLabel: group.label,
      sourceCategoryTitle: brand.name === "Ice Make" ? "Refrigeration & Cold Chain" : cat.title,
    };
  })
);

function haystack(product: CatalogProduct): string {
  const parts: string[] = [product.name, product.headline ?? "", product.description];
  if (product.brandLabel) parts.push(product.brandLabel);
  if (product.cardDescription) parts.push(product.cardDescription);
  if (product.subDescription) parts.push(product.subDescription);
  if (product.features) parts.push(product.features.join(" "));
  if (product.advantages) parts.push(product.advantages.join(" "));
  if (product.closing) parts.push(product.closing);
  if (product.idealFor) parts.push(product.idealFor.join(" "));
  if (product.subItems) {
    for (const sub of product.subItems) {
      parts.push(sub.title, sub.description ?? "", sub.items.join(" "));
    }
  }
  if (product.extraInfo) {
    for (const [key, value] of Object.entries(product.extraInfo)) {
      parts.push(key, Array.isArray(value) ? value.join(" ") : value);
    }
  }
  return parts.join(" ").toLowerCase();
}

const BRAND_OPTIONS: string[] = [...new Set(ALL_PRODUCTS.map((p) => p.name))].sort((a, b) =>
  a.localeCompare(b)
);

interface ProductCardProps {
  product: CatalogProduct;
  onSelect: () => void;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, index }) => {
  const cardBrand = product.brandLabel ?? (product.headline ? product.name : product.groupLabel);
  const cardDescription = product.cardDescription ?? product.description;

  return (
    <article className="px-card" style={{ animationDelay: `${Math.min(index, 12) * 0.04}s` }}>
      {product.logo && (
        <button
          type="button"
          className="px-card-media"
          onClick={onSelect}
          aria-label={`View details for ${product.headline ?? product.name}`}
          tabIndex={-1}
        >
          {product.badge && <span className="px-card-badge">{product.badge}</span>}
          <img
            src={getAssetUrl(product.logo)}
            alt={`${product.name} product image`}
            className="px-card-image"
            loading="lazy"
            decoding="async"
          />
        </button>
      )}
      <p className="px-card-brand">{cardBrand}</p>
      <h3 className="px-card-name">{product.headline ?? product.name}</h3>
      <p className="px-card-desc">{cardDescription}</p>
      <div className="px-card-actions">
        <button type="button" className="px-link" onClick={onSelect}>
          View Details
          <ArrowRight size={15} aria-hidden="true" />
        </button>
        <a
          href={getWhatsAppUrl(getProductEnquiryMessage(product.name, product.groupLabel))}
          target="_blank"
          rel="noopener noreferrer"
          className="px-wa-link"
          aria-label={`Enquire about ${product.name} on WhatsApp`}
        >
          <MessageCircle size={15} aria-hidden="true" />
          WhatsApp Enquiry
        </a>
      </div>
    </article>
  );
};

interface ProductSheetProps {
  product: CatalogProduct | null;
  onClose: () => void;
}

const ProductSheet: React.FC<ProductSheetProps> = ({ product, onClose }) => {
  const navigate = useNavigate();
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  const [featuresExpanded, setFeaturesExpanded] = useState(false);

  useEffect(() => {
    if (!product) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKey);
    };
  }, [product, onClose]);

  useEffect(() => {
    setOverviewExpanded(false);
    setFeaturesExpanded(false);
  }, [product?.name]);

  if (!product) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const visibleFeatures =
    product.features && product.features.length > 6 && !featuresExpanded
      ? product.features.slice(0, 6)
      : product.features;
  const showFeaturesToggle = product.features && product.features.length > 6;
  const showOverviewToggle = product.description.length > 220;

  return (
    <div
      className="px-overlay"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.name} details`}
    >
      <div className="px-sheet">
        <button type="button" className="px-sheet-close" onClick={onClose} aria-label="Close details">
          <X size={20} aria-hidden="true" />
        </button>

        <p className="px-eyebrow">{product.groupLabel}</p>
        <h2 className="px-sheet-title">{product.headline ?? product.name}</h2>
        {product.headline && <p className="px-sheet-headline">{product.name}</p>}
        {product.logo && (
          <img
            src={getAssetUrl(product.logo)}
            alt={`${product.name} product image`}
            className="px-sheet-image"
            loading="lazy"
            decoding="async"
          />
        )}

        <section className="px-spec px-spec-first" aria-label="Overview">
          <h3 className="px-spec-title">Overview</h3>
          <p className={`px-sheet-desc${!overviewExpanded ? " px-clamped" : ""}`}>
            {product.description}
          </p>
          {product.subDescription && (
            <p className="px-sheet-desc">{product.subDescription}</p>
          )}
          {showOverviewToggle && (
            <button
              type="button"
              className="px-text-toggle"
              onClick={() => setOverviewExpanded((v) => !v)}
              aria-expanded={overviewExpanded}
            >
              {overviewExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </section>

        {visibleFeatures && visibleFeatures.length > 0 && (
          <section className="px-spec" aria-label="Key features">
            <h3 className="px-spec-title">Key features</h3>
            <ul className="px-spec-list">
              {visibleFeatures.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
            {showFeaturesToggle && (
              <button
                type="button"
                className="px-text-toggle"
                onClick={() => setFeaturesExpanded((v) => !v)}
                aria-expanded={featuresExpanded}
              >
                {featuresExpanded
                  ? "Show fewer features"
                  : `Show all ${product.features!.length} features`}
              </button>
            )}
          </section>
        )}

        {product.highlights && product.highlights.length > 0 && (
          <section className="px-spec" aria-label="Key highlights">
            <h3 className="px-spec-title">Key highlights</h3>
            <ul className="px-spec-list">
              {product.highlights.map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </section>
        )}

        {product.advantages && product.advantages.length > 0 && (
          <section className="px-spec" aria-label="Advantages">
            <h3 className="px-spec-title">Advantages</h3>
            <ul className="px-spec-list">
              {product.advantages.map((advantage, idx) => (
                <li key={idx}>{advantage}</li>
              ))}
            </ul>
          </section>
        )}

        {product.subItems && product.subItems.length > 0 && (
          <section className="px-spec" aria-label="Product ranges">
            {product.subItems.map((sub, idx) => (
              <div key={idx} className="px-sub-block">
                <h3 className="px-spec-title">{sub.title}</h3>
                {sub.description && <p className="px-sheet-desc">{sub.description}</p>}
                <ul className="px-spec-list">
                  {sub.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {product.extraInfo && Object.keys(product.extraInfo).length > 0 && (
          <section className="px-spec" aria-label="Product information">
            <h3 className="px-spec-title">Product information</h3>
            <dl className="px-dl">
              <div className="px-dl-row">
                <dt>Category</dt>
                <dd>{product.sourceCategoryTitle}</dd>
              </div>
              {Object.entries(product.extraInfo).map(([key, value], idx) => (
                <div key={idx} className="px-dl-row">
                  <dt>{key}</dt>
                  <dd>{Array.isArray(value) ? value.join(", ") : value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {product.idealFor && product.idealFor.length > 0 && (
          <section className="px-spec" aria-label="Ideal for">
            <h3 className="px-spec-title">Ideal for</h3>
            <ul className="px-tag-list">
              {product.idealFor.map((tag, idx) => (
                <li key={idx} className="px-tag">
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="px-sheet-actions">
          <button
            type="button"
            className="px-btn px-btn-primary"
            onClick={() => navigate("/contact")}
          >
            Request a Quote
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <a
            href={getWhatsAppUrl(getProductEnquiryMessage(product.name, product.groupLabel))}
            target="_blank"
            rel="noopener noreferrer"
            className="px-btn px-btn-outline"
          >
            <MessageCircle size={16} aria-hidden="true" />
            WhatsApp Enquiry
          </a>
        </div>
      </div>
    </div>
  );
};

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGroupId = GROUPS.some((group) => group.id === searchParams.get("group"))
    ? (searchParams.get("group") as string)
    : "all";
  const [query, setQuery] = useState<string>("");
  const [activeBrand, setActiveBrand] = useState<string>("all");
  const [selected, setSelected] = useState<CatalogProduct | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_PRODUCTS.filter((product) => {
      if (activeGroupId !== "all" && product.groupId !== activeGroupId) return false;
      if (activeBrand !== "all" && product.name !== activeBrand) return false;
      if (q && !haystack(product).includes(q)) return false;
      return true;
    });
  }, [activeGroupId, activeBrand, query]);

  const filtersActive = activeGroupId !== "all" || activeBrand !== "all" || query.trim() !== "";

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("group");
    setSearchParams(next, { replace: true });
    setActiveBrand("all");
    setQuery("");
  };

  const setGroup = (groupId: string) => {
    const next = new URLSearchParams(searchParams);
    if (groupId === "all") next.delete("group");
    else next.set("group", groupId);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="px">
      <header className="px-hero">
        <div className="px-hero-inner">
          <p className="px-eyebrow">PRODUCTS & SOLUTIONS</p>
          <h1 className="px-title">
            Hospitality equipment, supplies and solutions for professional properties.
          </h1>
          <p className="px-subtitle">
            Explore professional equipment and carefully selected essentials for
            kitchens, food and beverage service, housekeeping, hygiene,
            refrigeration and guest experience.
          </p>
          <label className="px-search">
            <Search size={18} aria-hidden="true" className="px-search-icon" />
            <span className="px-visually-hidden">Search products, brands or product codes</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, brands or product codes"
              aria-label="Search products, brands or product codes"
            />
            {query && (
              <button
                type="button"
                className="px-search-clear"
                onClick={() => setQuery("")}
                aria-label="Clear search"
              >
                <X size={15} aria-hidden="true" />
              </button>
            )}
          </label>
        </div>
      </header>

      <section className="px-categories" aria-labelledby="px-categories-title">
        <div className="px-section-inner">
          <div className="px-categories-head">
            <h2 id="px-categories-title" className="px-categories-title">Browse by category</h2>
            <p className="px-categories-text">
              Select a category to filter the catalogue. Counts reflect the current product data.
            </p>
          </div>
          <div className="px-category-grid">
            {GROUPS.map((group) => {
              const count =
                group.id === "all"
                  ? ALL_PRODUCTS.length
                  : ALL_PRODUCTS.filter((p) => p.groupId === group.id).length;
              return (
                <button
                  key={group.id}
                  type="button"
                  className={`px-category-tile${activeGroupId === group.id ? " is-active" : ""}`}
                  aria-pressed={activeGroupId === group.id}
                  onClick={() => setGroup(group.id)}
                >
                  {group.id !== "all" && (
                    <img
                      src={CATEGORY_IMAGES[group.id]}
                      alt=""
                      aria-hidden="true"
                      className="px-category-image"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <span className="px-category-label">{group.label}</span>
                  <span className="px-category-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-toolbar-section" aria-labelledby="px-results-title">
        <div className="px-section-inner">
          <div className="px-toolbar">
            <label className="px-brand-filter">
              <span className="px-visually-hidden">Filter by brand</span>
              <select
                value={activeBrand}
                onChange={(event) => setActiveBrand(event.target.value)}
                aria-label="Filter by brand"
              >
                <option value="all">All brands</option>
                {BRAND_OPTIONS.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </label>

            {filtersActive && (
              <button type="button" className="px-link" onClick={clearFilters}>
                Clear filters
                <X size={14} aria-hidden="true" />
              </button>
            )}

            <p id="px-results-title" className="px-count" role="status" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
              {filtersActive && " found"}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="px-empty">
              <h2 className="px-empty-title">No products found</h2>
              <p className="px-empty-text">Try another product name, brand or category.</p>
              <button type="button" className="px-btn px-btn-outline" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="px-grid">
              {filtered.map((product, index) => (
                <ProductCard
                  key={`${product.groupId}-${product.name}-${product.headline ?? ""}`}
                  product={product}
                  index={index}
                  onSelect={() => setSelected(product)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <ProductSheet product={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default Products;
