import React from "react";
import "./Products.css";

const products = [
  {
    name: "Luxury Amenity Set",
    description: "Imported collection for a premium experience.",
  },
  {
    name: "Eco-Friendly Toiletries",
    description: "Sustainable and gentle on the environment.",
  },
  {
    name: "Durable Housekeeping Trolleys",
    description: "Designed for efficiency and longevity.",
  },
  {
    name: "Elegant In-Room Bins",
    description: "A touch of class for every room.",
  },
  {
    name: "Custom Logo Doormats",
    description: "Personalized welcome for your guests.",
  },
  {
    name: "High-Quality Linen",
    description: "Comfort and durability combined.",
  },
];

const Products = React.forwardRef<HTMLElement>((_, ref) => {
  return (
    <section id="products" className="products" ref={ref}>
      <h2 className="section-title">Our Products</h2>
      <div className="products-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <div className="product-card-content">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default Products;
