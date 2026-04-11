import React from "react";
import "./Partners.css";
import { getAssetUrl } from "../../utils";

const partnerLogos = [
  { folder: "brand_partners", file: "AltoShaam.png" },
  { folder: "brand_partners", file: "Ariane.png" },
  { folder: "brand_partners", file: "Art Evo.png" },
  { folder: "brand_partners", file: "Atlantis.png" },
  { folder: "brand_partners", file: "Cothas Coffee.png" },
  { folder: "brand_partners", file: "Elanpro .png" },
  { folder: "brand_partners", file: "Expobar.png" },
  { folder: "brand_partners", file: "Frontier.png" },
  { folder: "brand_partners", file: "IPC Tennant.png" },
  { folder: "brand_partners", file: "JVD.png" },
  { folder: "brand_partners", file: "Kaapi Solutions.png" },
  { folder: "brand_partners", file: "Karcher.png" },
  { folder: "brand_partners", file: "LSA Glassware.png" },
  { folder: "brand_partners", file: "Luigi Bormioli.png" },
  { folder: "brand_partners", file: "Nude.png" },
  { folder: "brand_partners", file: "Pasabasche.png" },
  { folder: "brand_partners", file: "Robot Coupe.png" },
  { folder: "brand_partners", file: "Roots.png" },
  { folder: "brand_partners", file: "Rubbermaid.png" },
  { folder: "brand_partners", file: "schott zwiesel.png" },
  { folder: "brand_partners", file: "Smokey Cocktail.png" },
  { folder: "brand_partners", file: "Steelite.png" },
  { folder: "brand_partners", file: "Trufrost & Butlers.png" },
  { folder: "brand_partners", file: "Trust.png" },
  { folder: "brand_partners", file: "Utopia.png" },
  { folder: "brand_partners", file: "Vikan.png" },
  { folder: "brand_partners", file: "Vitamix.png" },
  { folder: "new/brand_partners", file: "aps.png" },
  { folder: "new/brand_partners", file: "ariane.png" },
  { folder: "new/brand_partners", file: "athena.png" },
  { folder: "new/brand_partners", file: "bluestar.png" },
  { folder: "new/brand_partners", file: "cellfrost.png" },
  { folder: "new/brand_partners", file: "cocoon.png" },
  { folder: "new/brand_partners", file: "craster.png" },
  { folder: "new/brand_partners", file: "gesign.png" },
  { folder: "new/brand_partners", file: "glassstudio.png" },
  { folder: "new/brand_partners", file: "icemake.png" },
  { folder: "new/brand_partners", file: "ipc.jpg" },
  { folder: "new/brand_partners", file: "japonois.png" },
  { folder: "new/brand_partners", file: "kaapi.jpg" },
  { folder: "new/brand_partners", file: "lush.png" },
  { folder: "new/brand_partners", file: "marken.jpg" },
  { folder: "new/brand_partners", file: "onis.png" },
  { folder: "new/brand_partners", file: "pujadas.png" },
  { folder: "new/brand_partners", file: "santos.png" },
  { folder: "new/brand_partners", file: "trufrost.jpg" },
  { folder: "new/brand_partners", file: "venta.png" },
  { folder: "new/brand_partners", file: "washmax.png" }
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
        {partnerLogos.map(({ folder, file }, index) => {
           const name = file.replace(/\.(png|jpg|jpeg)$/i, ""); 
           return (
            <div key={index} className="partner-card">
              <img 
                src={getAssetUrl(`${folder}/${file}`)} 
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
