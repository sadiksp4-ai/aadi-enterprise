import React from "react";
import "./Partners.css";

const partnerLogos = [
  "AltoShaam.png",
  "Ariane.png",
  "Art Evo.png",
  "Atlantis.png",
  "Cothas Coffee.png",
  "Elanpro .png",
  "Expobar.png",
  "Frontier.png",
  "IPC Tennant.png",
  "JVD.png",
  "Kaapi Solutions.png",
  "Karcher.png",
  "LSA Glassware.png",
  "Luigi Bormioli.png",
  "Nude.png",
  "Pasabasche.png",
  "Robot Coupe.png",
  "Roots.png",
  "Rubbermaid.png",
  "schott zwiesel.png",
  "Smokey Cocktail.png",
  "Steelite.png",
  "Trufrost & Butlers.png",
  "Trust.png",
  "Utopia.png",
  "Vikan.png",
  "Vitamix.png"
];

const Partners: React.FC = () => {
  return (
    <section className="partners-page-section">
      <div className="partners-header">
        <h2 className="section-title">Our Brand Partners</h2>
        <p className="section-subtitle">Collaborating with the world's finest brands to deliver excellence.</p>
        <div className="section-divider"></div>
      </div>
      
      <div className="partners-grid-container">
        {partnerLogos.map((logo, index) => {
           const name = logo.replace(/\.(png|jpg|jpeg)$/i, ""); 
           return (
            <div key={index} className="partner-card">
              <img 
                src={`/brand_partners/${logo}`} 
                alt={name} 
                className="partner-logo-img"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Partners;
