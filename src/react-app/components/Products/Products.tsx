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
  onClick: () => void;
}

const BrandCard: React.FC<BrandCardProps> = ({ brand, onClick }) => {
  return (
    <div className="brand-card" onClick={onClick}>
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
    </div>
  );
};

interface ProductDetailsModalProps {
  product: ProductEntry | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ product, isOpen, onClose }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>×</button>

        <div className="modal-header">
           {product.logo && (
            <img src={product.logo} alt={product.name} className="modal-logo" />
           )}
           <div>
             <h2 className="modal-title">{product.name}</h2>
             {product.headline && <h4 className="modal-headline">{product.headline}</h4>}
           </div>
        </div>

        <div className="modal-body">
            <p className="brand-desc">{product.description}</p>

            {product.subDescription && (
              <p className="brand-desc">{product.subDescription}</p>
            )}

            {product.features && product.features.length > 0 && (
              <>
                <h5 className="ideal-for-label">Key Features</h5>
                <ul className="features-list">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </>
            )}

            {product.advantages && product.advantages.length > 0 && (
              <>
                <h5 className="ideal-for-label">Advantages</h5>
                <ul className="features-list">
                  {product.advantages.map((adv, idx) => (
                    <li key={idx}>{adv}</li>
                  ))}
                </ul>
              </>
            )}

            {product.subItems && (
              <div className="sub-items-container">
                {product.subItems.map((sub, idx) => (
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

            {product.extraInfo && (
              <div className="extra-info-container">
                {Object.entries(product.extraInfo).map(([key, value], idx) => (
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

            {product.idealFor && product.idealFor.length > 0 && (
              <div className="ideal-for-section">
                <span className="ideal-for-label">Ideal For</span>
                <div className="tags-container">
                  {product.idealFor.map((tag, idx) => (
                    <span key={idx} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.closing && (
                <p className="brand-desc" style={{ marginTop: '1rem', fontStyle: 'italic' }}>{product.closing}</p>
            )}
        </div>
      </div>
    </div>
  );
};

const Products: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    productCategories[0].id
  );
  const [selectedProduct, setSelectedProduct] = useState<ProductEntry | null>(null);

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
                <BrandCard
                  key={index}
                  brand={brand}
                  onClick={() => setSelectedProduct(brand)}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <ProductDetailsModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Products;
