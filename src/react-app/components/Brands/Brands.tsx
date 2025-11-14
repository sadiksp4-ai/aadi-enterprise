import React from 'react';
import './Brands.css';
import brandsData from '../../../../aadi-info.json';

const logoMap: { [key: string]: string } = {
  "IPC (by Tennant Company)": "/ipcworldwide_logo.jpg",
  "Kärcher": "/kaercher_logo.png",
  "Trust": "/trust_logo.png",
  "Euronics": "/euronics_logo.jpg",
  "Dolphy": "/dolphy_logo.jpg",
  "Vileda": "/vileda_logo.jpg",
  "JVD": "/jvd_logo.jpg",
  "Origami": "/oragami_logo.jpg",
  "Saraya Mystair": "/saraya_logo.jpg",
};

const Brands = React.forwardRef<HTMLElement>((_, ref) => {
  const { title, subtitle, brands } = brandsData.trustedBrands;

  return (
    <section id="brands" className="brands" ref={ref}>
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle">{subtitle}</p>
      <div className="brands-grid">
        {brands.map((brand, index) => (
          <div key={index} className="brand-card">
            <div className="brand-logo-container">
              <img src={logoMap[brand.name]} alt={`${brand.name} logo`} className="brand-logo" />
            </div>
            <div className="brand-info">
              <p>{brand.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default Brands;
