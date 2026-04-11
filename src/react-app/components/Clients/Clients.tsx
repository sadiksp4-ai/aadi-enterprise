import React from "react";
import "./Clients.css";
import { getAssetUrl } from "../../utils";

const clientLogos = [
  { folder: "clients", file: "Accor.png" },
  { folder: "clients", file: "Airbar Lounge.png" },
  { folder: "clients", file: "Amnora Mall.png" },
  { folder: "clients", file: "Apollo Hospitals.png" },
  { folder: "clients", file: "Arcatron Mobility.png" },
  { folder: "clients", file: "Atmantan Wellness resort .png" },
  { folder: "clients", file: "Bajaj Finserv.png" },
  { folder: "clients", file: "Centiro.png" },
  { folder: "clients", file: "Conrad Hotel.png" },
  { folder: "clients", file: "Country Delight.png" },
  { folder: "clients", file: "Dynamics Logistics.png" },
  { folder: "clients", file: "Endurance.png" },
  { folder: "clients", file: "Escalates.png" },
  { folder: "clients", file: "Fairfield by Marriott.png" },
  { folder: "clients", file: "Flash Industries.png" },
  { folder: "clients", file: "Fujitsu.png" },
  { folder: "clients", file: "Fulflex.png" },
  { folder: "clients", file: "Grand Hyatt.png" },
  { folder: "clients", file: "Hilton Hotel.png" },
  { folder: "clients", file: "Hyatt Residency.png" },
  { folder: "clients", file: "Hyatt.png" },
  { folder: "clients", file: "JW Marriott.png" },
  { folder: "clients", file: "Kalpataru.png" },
  { folder: "clients", file: "Kkanchan Veg.png" },
  { folder: "clients", file: "LeMeridien.png" },
  { folder: "clients", file: "Marriott.png" },
  { folder: "clients", file: "Nadbrahma Idli.png" },
  { folder: "clients", file: "Novotel Hotels.png" },
  { folder: "clients", file: "Nyati Foundation.png" },
  { folder: "clients", file: "Oakwood Premier.png" },
  { folder: "clients", file: "Park Ornate.png" },
  { folder: "clients", file: "Radisson Blu.png" },
  { folder: "clients", file: "Rhythm Hotels & Resort.png" },
  { folder: "clients", file: "Royal Western India Turf Club .png" },
  { folder: "clients", file: "Samarpan.png" },
  { folder: "clients", file: "Sheraton Hotels & Resort.png" },
  { folder: "clients", file: "Spree Hospitality.png" },
  { folder: "clients", file: "Suba groups of Hotel.png" },
  { folder: "clients", file: "Sujyoti.png" },
  { folder: "clients", file: "Surya.png" },
  { folder: "clients", file: "Swastik Wellness Resort.png" },
  { folder: "clients", file: "The Corinthians Club Resort.png" },
  { folder: "clients", file: "W Hotels.png" },
  { folder: "clients", file: "Wellington International College Pune.png" },
  { folder: "clients", file: "Westin Hotel.png" },
  { folder: "clients", file: "Xolopak.png" },
  { folder: "clients", file: "Yogh Hospitality.png" },
  { folder: "new/clients", file: "24s.png" },
  { folder: "new/clients", file: "accor.png" },
  { folder: "new/clients", file: "altruist.png" },
  { folder: "new/clients", file: "arcone.png" },
  { folder: "new/clients", file: "basil.png" },
  { folder: "new/clients", file: "cosme.png" },
  { folder: "new/clients", file: "courtyard.png" },
  { folder: "new/clients", file: "eagle.jpg" },
  { folder: "new/clients", file: "eks.png" },
  { folder: "new/clients", file: "empires.png" },
  { folder: "new/clients", file: "es.png" },
  { folder: "new/clients", file: "felicia.png" },
  { folder: "new/clients", file: "goosebumps.png" },
  { folder: "new/clients", file: "intercontentinal.png" },
  { folder: "new/clients", file: "marriotr.png" },
  { folder: "new/clients", file: "nehilent.png" },
  { folder: "new/clients", file: "nutra.jpg" },
  { folder: "new/clients", file: "oxford.png" },
  { folder: "new/clients", file: "poona.png" },
  { folder: "new/clients", file: "posco.png" },
  { folder: "new/clients", file: "radison.png" },
  { folder: "new/clients", file: "ria.png" },
  { folder: "new/clients", file: "ritz.png" },
  { folder: "new/clients", file: "sheraton.png" },
  { folder: "new/clients", file: "sujyoti.png" },
  { folder: "new/clients", file: "surya.jpg" },
  { folder: "new/clients", file: "tomatos.png" },
  { folder: "new/clients", file: "wang.png" }
];

const Clients: React.FC = () => {
  return (
    <section className="clients-page-section">
      <div className="clients-header">
        <h2 className="section-title">Our Valued Clients</h2>
        <p className="section-subtitle">Trusted by industry leaders in hospitality and beyond.</p>
        <div className="section-divider"></div>
      </div>
      
      <div className="clients-grid-container">
        {clientLogos.map(({ folder, file }, index) => {
           // Remove extension and use as alt text
           const name = file.replace(/\.(png|jpg|jpeg)$/i, ""); 
           return (
            <div key={index} className="client-card">
              <img 
                src={getAssetUrl(`${folder}/${file}`)} 
                alt={name} 
                className="client-logo-img"
                loading="lazy"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Clients;
