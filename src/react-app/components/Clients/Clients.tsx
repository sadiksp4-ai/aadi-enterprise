import React from "react";
import "./Clients.css";

const clients = [
  "Grand Hyatt",
  "The Ritz-Carlton",
  "JW Marriott",
  "Hilton Hotels",
  "The Oberoi Group",
  "Taj Hotels",
  "Leela Palaces",
  "Accor Hotels",
];

const Clients = React.forwardRef<HTMLElement>((_, ref) => {
  return (
    <section id="clients" className="clients" ref={ref}>
      <h2 className="section-title">Our Valued Clients</h2>
      <div className="clients-marquee">
        <div className="clients-slide">
          {clients.map((client, index) => (
            <div key={index} className="client-logo">
              {client}
            </div>
          ))}
          {clients.map((client, index) => (
            <div key={index + clients.length} className="client-logo">
              {client}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default Clients;
