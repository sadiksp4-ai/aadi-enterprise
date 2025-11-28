import React, { useState, useEffect } from "react";
import "./Products.css";
import data from "../../../../aadi-info.json";

interface ProductEntry {
  name: string;
  logo?: string;
  headline?: string;
  description: string;
  subDescription?: string;
  features?: string[];
  idealFor?: string[];
  closing?: string;
  extraInfo?: Record<string, any>;
  subItems?: {
    title: string;
    description?: string;
    items: string[];
  }[];
  advantages?: string[];
}

interface ProductCategory {
  id: string;
  title: string;
  description: string;
  brands: ProductEntry[];
}

// Helper type to match the JSON structure
const productCategories = data.productCategories as ProductCategory[];

interface BrandCardProps {
  brand: ProductEntry;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`brand-card ${isExpanded ? "expanded" : ""}`}>
      {brand.logo && (
        <div className="brand-logo-wrapper">
          <img
            src={brand.logo}
            alt={`${brand.name} logo`}
            className="brand-logo"
            loading="lazy"
          />
        </div>
      )}
      <h3 className="brand-name">{brand.name}</h3>
      {brand.headline && <h4 className="brand-headline">{brand.headline}</h4>}

      <p className="brand-desc">
        {brand.description}
      </p>

      {/* Always visible Ideal For tags (good for quick scanning) */}
      {brand.idealFor && brand.idealFor.length > 0 && (
        <div className="ideal-for-section-preview">
          <div className="tags-container">
            {brand.idealFor.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="tag">
                {tag}
              </span>
            ))}
            {brand.idealFor.length > 3 && (
               <span className="tag-more">+{brand.idealFor.length - 3}</span>
            )}
          </div>
        </div>
      )}

      {/* Expandable Content */}
      <div className={`brand-details ${isExpanded ? "open" : ""}`}>
        {brand.subDescription && (
          <p className="brand-desc">{brand.subDescription}</p>
        )}

        {brand.features && brand.features.length > 0 && (
          <>
            <h5 className="ideal-for-label">Key Features</h5>
            <ul className="features-list">
              {brand.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </>
        )}

        {brand.advantages && brand.advantages.length > 0 && (
          <>
            <h5 className="ideal-for-label">Advantages</h5>
            <ul className="features-list">
              {brand.advantages.map((adv, idx) => (
                <li key={idx}>{adv}</li>
              ))}
            </ul>
          </>
        )}

        {brand.subItems && (
          <div className="sub-items-container">
            {brand.subItems.map((sub, idx) => (
              <div key={idx} className="sub-item">
                <h5 className="sub-item-title">{sub.title}</h5>
                {sub.description && (
                  <p className="sub-item-desc">{sub.description}</p>
                )}
                <ul className="features-list">
                  {sub.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {brand.extraInfo && (
          <div className="extra-info-container">
             {Object.entries(brand.extraInfo).map(([key, value], idx) => (
               <div key={idx} className="extra-info-block">
                 <h5 className="ideal-for-label">{key}</h5>
                 {Array.isArray(value) ? (
                   <ul className="features-list">
                     {value.map((v, i) => <li key={i}>{v}</li>)}
                   </ul>
                 ) : (
                   <p className="brand-desc">{value}</p>
                 )}
               </div>
             ))}
          </div>
        )}

        {/* Full Ideal For list in expanded view if truncated in preview */}
        {brand.idealFor && brand.idealFor.length > 3 && (
             <div className="ideal-for-section">
                <span className="ideal-for-label">All Ideal For</span>
                <div className="tags-container">
                {brand.idealFor.map((tag, idx) => (
                    <span key={idx} className="tag">
                    {tag}
                    </span>
                ))}
                </div>
            </div>
        )}

        {brand.closing && (
            <p className="brand-desc" style={{ marginTop: '1rem', fontStyle: 'italic' }}>{brand.closing}</p>
        )}
      </div>

      <button
        className="view-details-btn"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        {isExpanded ? "Show Less" : "View Details"}
        <span className="btn-arrow">{isExpanded ? "▲" : "▼"}</span>
      </button>
    </div>
  );
};

const Products: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    productCategories[0].id
  );

  const activeCategory = productCategories.find(
    (cat) => cat.id === activeCategoryId
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategoryId]);

  return (
    <div className="products-page">
      <aside className="products-sidebar">
        <h2 className="sidebar-title">Categories</h2>
        <nav className="category-nav">
          {productCategories.map((cat) => (
            <button
              key={cat.id}
              className={`category-nav-btn ${
                activeCategoryId === cat.id ? "active" : ""
              }`}
              onClick={() => setActiveCategoryId(cat.id)}
            >
              {cat.title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="products-main">
        {activeCategory && (
          <div className="category-container">
            <header className="category-header">
              <h1 className="category-title">{activeCategory.title}</h1>
              <p className="category-desc">{activeCategory.description}</p>
            </header>

            <div className="brands-grid">
              {activeCategory.brands.map((brand, index) =>
                <BrandCard key={index} brand={brand} />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;
