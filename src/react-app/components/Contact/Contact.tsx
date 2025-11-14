import React from "react";
import "./Contact.css";
import data from "../../../../aadi-info.json";

const Contact = React.forwardRef<HTMLElement>((_, ref) => {
  const { phone, email, closingMessage } = data.contactInfo;

  return (
    <section id="contact" className="contact" ref={ref}>
      <h2 className="section-title">Contact Us</h2>
      <p className="contact-text">{closingMessage}</p>
      <div className="contact-info">
        <p>
          Email: <a href={`mailto:${email}`}>{email}</a>
        </p>
        <p>
          Phone: <a href={`tel:${phone}`}>{phone}</a>
        </p>
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
});

export default Contact;
