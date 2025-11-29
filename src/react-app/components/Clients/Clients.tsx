import React from "react";
import "./Clients.css";

const clientLogos = [
  "Accor.png",
  "Airbar Lounge.png",
  "Amnora Mall.png",
  "Apollo Hospitals.png",
  "Arcatron Mobility.png",
  "Atmantan Wellness resort .png",
  "Bajaj Finserv.png",
  "Centiro.png",
  "Conrad Hotel.png",
  "Country Delight.png",
  "Dynamics Logistics.png",
  "Endurance.png",
  "Escalates.png",
  "Fairfield by Marriott.png",
  "Flash Industries.png",
  "Fujitsu.png",
  "Fulflex.png",
  "Grand Hyatt.png",
  "Hilton Hotel.png",
  "Hyatt Residency.png",
  "Hyatt.png",
  "JW Marriott.png",
  "Kalpataru.png",
  "Kkanchan Veg.png",
  "LeMeridien.png",
  "Marriott.png",
  "Nadbrahma Idli.png",
  "Novotel Hotels.png",
  "Nyati Foundation.png",
  "Oakwood Premier.png",
  "Park Ornate.png",
  "Radisson Blu.png",
  "Rhythm Hotels & Resort.png",
  "Royal Western India Turf Club .png",
  "Samarpan.png",
  "Sheraton Hotels & Resort.png",
  "Spree Hospitality.png",
  "Suba groups of Hotel.png",
  "Sujyoti.png",
  "Surya.png",
  "Swastik Wellness Resort.png",
  "The Corinthians Club Resort.png",
  "W Hotels.png",
  "Wellington International College Pune.png",
  "Westin Hotel.png",
  "Xolopak.png",
  "Yogh Hospitality.png"
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
        {clientLogos.map((logo, index) => {
           // Remove extension and use as alt text
           const name = logo.replace(/\.(png|jpg|jpeg)$/i, ""); 
           return (
            <div key={index} className="client-card">
              <img 
                src={`/clients/${logo}`} 
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