import React, { useState } from "react";
import "./Products.css";
import data from "../../../../aadi-info.json";

interface ProductsProps {
  onOpenModal: () => void;
}

const Products = React.forwardRef<HTMLElement, ProductsProps>(
  ({ onOpenModal }, ref) => {
    const { productSections } = data;
    const [activeSection, setActiveSection] = useState<
      "housekeeping" | "foodAndBeverage"
    >("housekeeping");
    const [activeTab, setActiveTab] = useState(0);
    const [activeRange, setActiveRange] = useState<"premium" | "essential">(
      "premium",
    );
    const [expandedSubcategories, setExpandedSubcategories] = useState<
      Set<number>
    >(new Set());

    const currentCategories =
      productSections[activeSection as keyof typeof productSections].categories;
    const currentCategory = currentCategories[activeTab];

    const toggleSubcategory = (index: number) => {
      const newExpanded = new Set(expandedSubcategories);
      if (newExpanded.has(index)) {
        newExpanded.delete(index);
      } else {
        newExpanded.add(index);
      }
      setExpandedSubcategories(newExpanded);
    };

    const handleSectionChange = (
      section: "housekeeping" | "foodAndBeverage",
    ) => {
      setActiveSection(section);
      setActiveTab(0);
      setExpandedSubcategories(new Set());
    };

    const renderProductList = (items: string[]) => (
      <ul className="product-list">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );

    const getCategoryImage = () => {
      const folderName = activeSection === "housekeeping" ? "housekeeping" : "F&B";
      const imageName = currentCategory.category
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\s+/g, "-")
        .replace(/[()]/g, "");
      return `/${folderName}/${imageName}.jpg`;
    };

    const renderStandardCategory = () => {
      if (!("premiumRange" in currentCategory)) return null;

      const range =
        activeRange === "premium"
          ? currentCategory.premiumRange
          : currentCategory.essentialRange;

      if (!range) return null;

      return (
        <div className="category-content">
          <div className="category-image-wrapper">
            <img
              src={getCategoryImage()}
              alt={currentCategory.category}
              className="category-image"
              loading="lazy"
            />
          </div>
          {currentCategory.headline && (
            <h3 className="category-headline">{currentCategory.headline}</h3>
          )}
          {currentCategory.description && (
            <p className="category-description">
              {currentCategory.description}
            </p>
          )}
          <div className="range-content">
            <h4 className="range-title">{range.title}</h4>
            {renderProductList(range.items)}
          </div>
        </div>
      );
    };

    const renderComplexCategory = () => {
      if (!("subCategories" in currentCategory)) return null;

      return (
        <div className="category-content">
          <div className="category-image-wrapper">
            <img
              src={getCategoryImage()}
              alt={currentCategory.category}
              className="category-image"
              loading="lazy"
            />
          </div>
          {currentCategory.headline && (
            <h3 className="category-headline">{currentCategory.headline}</h3>
          )}
          {currentCategory.description && (
            <p className="category-description">
              {currentCategory.description}
            </p>
          )}

          <div className="subcategories">
            {currentCategory.subCategories?.map((subcat, index) => {
              const isExpanded = expandedSubcategories.has(index);
              return (
                <div key={index} className="subcategory">
                  <button
                    className="subcategory-header"
                    onClick={() => toggleSubcategory(index)}
                  >
                    <span className="subcategory-title">
                      {subcat.subCategory}
                    </span>
                    <span
                      className={`subcategory-icon ${isExpanded ? "expanded" : ""}`}
                    >
                      ▼
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="subcategory-content">
                      {"description" in subcat && subcat.description && (
                        <p className="subcategory-description">
                          {subcat.description}
                        </p>
                      )}
                      <div className="subcategory-ranges">
                        <div className="subcat-range premium">
                          <h5 className="subcat-range-title">
                            {subcat.premiumRange.title}
                          </h5>
                          {renderProductList(subcat.premiumRange.items)}
                        </div>
                        <div className="subcat-range essential">
                          <h5 className="subcat-range-title">
                            {("classicRange" in subcat
                              ? subcat.classicRange
                              : subcat.essentialRange
                            ).title}
                          </h5>
                          {renderProductList(
                            ("classicRange" in subcat
                              ? subcat.classicRange
                              : subcat.essentialRange
                            ).items,
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    const hasSubcategories = "subCategories" in currentCategory;

    return (
      <section id="products" className="products" ref={ref}>
        <div className="products-header">
          <h2 className="section-title">Our Products</h2>
          <button className="comparison-btn" onClick={onOpenModal}>
            View Comparison Guide
          </button>
        </div>

        <div className="section-switcher">
          <button
            className={`section-btn ${activeSection === "housekeeping" ? "active" : ""}`}
            onClick={() => handleSectionChange("housekeeping")}
          >
            {productSections.housekeeping.title}
          </button>
          <button
            className={`section-btn ${activeSection === "foodAndBeverage" ? "active" : ""}`}
            onClick={() => handleSectionChange("foodAndBeverage")}
          >
            {productSections.foodAndBeverage.title}
          </button>
        </div>

        <div className="products-tabs">
          {currentCategories.map((category, index) => (
            <button
              key={index}
              className={`tab-button ${activeTab === index ? "active" : ""}`}
              onClick={() => {
                setActiveTab(index);
                setExpandedSubcategories(new Set());
              }}
            >
              {category.category}
            </button>
          ))}
        </div>

        {!hasSubcategories && (
          <div className="range-toggle">
            <button
              className={`range-btn ${activeRange === "premium" ? "active" : ""}`}
              onClick={() => setActiveRange("premium")}
            >
              Premium Range
            </button>
            <button
              className={`range-btn ${activeRange === "essential" ? "active" : ""}`}
              onClick={() => setActiveRange("essential")}
            >
              Essential Range
            </button>
          </div>
        )}

        <div className="products-content">
          {hasSubcategories
            ? renderComplexCategory()
            : renderStandardCategory()}
        </div>
      </section>
    );
  },
);

export default Products;
