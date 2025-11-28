import React from "react";
import "./Contact.css";
import data from "../../../../aadi-info.json";

const Contact: React.FC = () => {
  const { email, linkedin, maps, closingMessage, offices } = data.contactInfo;

  return (
    <section id="contact" className="contact">
      <h2 className="section-title">Contact Us</h2>
      <p className="contact-text">{closingMessage}</p>
      <div className="contact-info">
        <p>
          Email: <a href={`mailto:${email}`}>{email}</a>
        </p>
        <p>
          LinkedIn:{" "}
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            Connect with us
          </a>
        </p>
        <p>
          Location:{" "}
          <a href={maps} target="_blank" rel="noopener noreferrer">
            View on Google Maps
          </a>
        </p>
        <div className="office-list">
          {offices.map((office, index) => (
            <div key={index} className="office-item">
              <strong>{office.label}</strong>
              <span>
                <a href={`tel:${office.phone}`}>{office.phone}</a>
              </span>
            </div>
          ))}
        </div>
      </div>
      <form className="contact-form">
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" rows={5} required></textarea>
        <button type="submit" className="submit-btn">
          Send Message
        </button>
      </form>
    </section>
  );
};

export default Contact;
