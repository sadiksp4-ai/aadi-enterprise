import React, { useState } from "react";
import "./Partners.css";
import { getAssetUrl } from "../../utils";

interface PartnerBrand {
  name: string;
  folder: string;
  file: string;
  descriptor: string;
}

interface PartnerCategory {
  id: string;
  title: string;
  filterLabel: string;
  brands: PartnerBrand[];
}

const partnerCategories: PartnerCategory[] = [
  {
    id: "kitchen",
    title: "Professional Kitchen & Culinary Equipment",
    filterLabel: "Kitchen",
    brands: [
      { name: "AltoShaam", folder: "brand_partners", file: "AltoShaam.png", descriptor: "Cooking Equipment" },
      { name: "Robot Coupe", folder: "brand_partners", file: "Robot Coupe.png", descriptor: "Food Preparation" },
      { name: "Vitamix", folder: "brand_partners", file: "Vitamix.png", descriptor: "Blending Equipment" },
      { name: "Santos", folder: "new/brand_partners", file: "santos.png", descriptor: "Juicing Equipment" },
      { name: "Frontier", folder: "brand_partners", file: "Frontier.png", descriptor: "Kitchen Solutions" },
    ],
  },
  {
    id: "coffee-bar",
    title: "Coffee, Beverage & Bar Solutions",
    filterLabel: "Coffee & Bar",
    brands: [
      { name: "Expobar", folder: "brand_partners", file: "Expobar.png", descriptor: "Coffee Machines" },
      { name: "Cothas Coffee", folder: "brand_partners", file: "Cothas Coffee.png", descriptor: "Filter Coffee" },
      { name: "Kaapi Machines", folder: "brand_partners", file: "KAAPI MACHINES.png", descriptor: "Coffee Equipment" },
      { name: "Smokey Cocktail", folder: "brand_partners", file: "Smokey Cocktail.png", descriptor: "Bar & Mixology" },
    ],
  },
  {
    id: "glassware",
    title: "Glassware, Barware & Tabletop",
    filterLabel: "Glassware",
    brands: [
      { name: "LSA", folder: "brand_partners", file: "LSA Glassware.png", descriptor: "Glassware • Tabletop" },
      { name: "Luigi Bormioli", folder: "brand_partners", file: "Luigi Bormioli.png", descriptor: "Glassware • Barware" },
      { name: "Nude", folder: "brand_partners", file: "Nude.png", descriptor: "Glassware • Barware" },
      { name: "Pasabahce", folder: "brand_partners", file: "Pasabasche.png", descriptor: "Glassware" },
      { name: "Schott Zwiesel", folder: "brand_partners", file: "schott zwiesel.png", descriptor: "Glassware • Barware" },
      { name: "Glass Studio", folder: "new/brand_partners", file: "glassstudio.png", descriptor: "Glassware" },
      { name: "Onis", folder: "new/brand_partners", file: "onis.png", descriptor: "Glassware • Tabletop" },
    ],
  },
  {
    id: "tableware",
    title: "Tableware, Porcelain & Buffet",
    filterLabel: "Tableware",
    brands: [
      { name: "Ariane", folder: "new/brand_partners", file: "ariane.png", descriptor: "Porcelain • Tableware" },
      { name: "Art Evo", folder: "brand_partners", file: "Art Evo.png", descriptor: "Designer Tableware" },
      { name: "Steelite", folder: "brand_partners", file: "Steelite.png", descriptor: "Tableware • Porcelain" },
      { name: "Utopia", folder: "brand_partners", file: "Utopia.png", descriptor: "Tableware" },
      { name: "APS", folder: "new/brand_partners", file: "aps.png", descriptor: "Buffet • Tableware" },
      { name: "Athena", folder: "new/brand_partners", file: "athena.png", descriptor: "Porcelain • Tableware" },
      { name: "Craster", folder: "new/brand_partners", file: "craster.png", descriptor: "Buffet • Tableware" },
      { name: "Cocoon", folder: "new/brand_partners", file: "cocoon.png", descriptor: "Tableware" },
      { name: "Gesign", folder: "new/brand_partners", file: "gesign.png", descriptor: "Facility Solutions" },
    ],
  },
  {
    id: "cutlery",
    title: "Cutlery, Utensils & Food Service",
    filterLabel: "Cutlery",
    brands: [
      { name: "Tramontina", folder: "brand_partners", file: "Tramontina.png", descriptor: "Cutlery • Kitchenware • Food Service" },
      { name: "Pujadas", folder: "new/brand_partners", file: "pujadas.png", descriptor: "Utensils • Food Service" },
      { name: "Japonois", folder: "new/brand_partners", file: "japonois.png", descriptor: "Cutlery • Utensils" },
      { name: "Shapes", folder: "", file: "shapes.png", descriptor: "Food Service" },
    ],
  },
  {
    id: "cleaning",
    title: "Cleaning, Hygiene & Facility Solutions",
    filterLabel: "Cleaning & Hygiene",
    brands: [
      { name: "Karcher", folder: "brand_partners", file: "Karcher.png", descriptor: "Cleaning Equipment" },
      { name: "IPC Tennant", folder: "brand_partners", file: "IPC Tennant.png", descriptor: "Cleaning Systems" },
      { name: "Vikan", folder: "brand_partners", file: "Vikan.png", descriptor: "Hygiene Tools" },
      { name: "Roots", folder: "brand_partners", file: "Roots.png", descriptor: "Cleaning Equipment" },
      { name: "Rubbermaid", folder: "brand_partners", file: "Rubbermaid.png", descriptor: "Facility Solutions" },
      { name: "Venta", folder: "new/brand_partners", file: "venta.png", descriptor: "Facility Solutions" },
      { name: "Washmax", folder: "new/brand_partners", file: "washmax.png", descriptor: "Cleaning & Hygiene" },
      { name: "Trust", folder: "brand_partners", file: "Trust.png", descriptor: "Hospitality Solutions" },
      { name: "Winterhalter", folder: "", file: "winterhalter.png", descriptor: "Commercial Dishwashers" },
    ],
  },
  {
    id: "coldchain",
    title: "Refrigeration & Ice Solutions",
    filterLabel: "Cold Chain",
    brands: [
      { name: "Elanpro", folder: "brand_partners", file: "Elanpro .png", descriptor: "Refrigeration" },
      { name: "Trufrost & Butlers", folder: "brand_partners", file: "Trufrost & Butlers.png", descriptor: "Refrigeration" },
      { name: "BlueStar", folder: "new/brand_partners", file: "bluestar.png", descriptor: "Refrigeration" },
      { name: "Cellfrost", folder: "new/brand_partners", file: "cellfrost.png", descriptor: "Refrigeration" },
      { name: "Icemake", folder: "new/brand_partners", file: "icemake.png", descriptor: "Ice Machines" },
      { name: "Marken", folder: "new/brand_partners", file: "marken.jpg", descriptor: "Refrigeration" },
    ],
  },
  {
    id: "inroom",
    title: "In-Room Amenities & Guest Experience",
    filterLabel: "In-Room & Guest",
    brands: [
      { name: "JVD", folder: "brand_partners", file: "JVD.png", descriptor: "In-Room Amenities" },
      { name: "Lush", folder: "new/brand_partners", file: "lush.png", descriptor: "In-Room Amenities" },
      { name: "Zafferano", folder: "brand_partners", file: "zafferano.png", descriptor: "Hospitality Table Lamps" },
      { name: "Dolphy", folder: "", file: "dolphy_logo.jpg", descriptor: "In-Room Amenities" },
      { name: "Euronics", folder: "", file: "euronics_logo.jpg", descriptor: "Washroom Automation" },
    ],
  },
];

const filters = [
  { id: "all", label: "All" },
  ...partnerCategories.map(({ id, filterLabel }) => ({ id, label: filterLabel })),
];

const Partners: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const visibleCategories =
    activeFilter === "all"
      ? partnerCategories
      : partnerCategories.filter((category) => category.id === activeFilter);

  return (
    <section className="partners-page-section">
      <div className="partners-header">
        <p className="partners-eyebrow">Partners</p>
        <h2 className="section-title">Our Brand Partners</h2>
        <p className="section-subtitle">Collaborating with the world's finest brands to deliver excellence.</p>
        <div className="section-divider"></div>
      </div>

      <div className="partners-filter-bar" role="group" aria-label="Filter brands by category">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`partners-filter-btn${activeFilter === filter.id ? " active" : ""}`}
            aria-pressed={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleCategories.map((category) => (
        <div key={category.id} className="partners-category">
          <h3 className="partners-category-title">{category.title}</h3>
          <div className="partners-grid-container">
            {category.brands.map((brand) => (
              <div key={brand.name} className="partner-card">
                <div className="partner-logo-area">
                  <img
                    src={getAssetUrl(`${brand.folder}/${brand.file}`)}
                    alt={`${brand.name} logo`}
                    className="partner-logo-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="partner-name">{brand.name}</p>
                <p className="partner-descriptor">{brand.descriptor}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Partners;
