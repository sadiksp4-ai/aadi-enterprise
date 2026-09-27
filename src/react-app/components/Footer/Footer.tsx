import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import './Footer.css';
import { getAssetUrl } from '../../utils';
import { WHATSAPP_DISPLAY_NUMBER, getGeneralEnquiryMessage, getWhatsAppUrl } from '../../utils/whatsapp';
import data from '../../../../aadi-info.json';

const SOLUTION_LINKS = [
  'Professional Kitchen',
  'Food & Beverage',
  'Housekeeping & Hygiene',
  'Guest Experience',
];

const COMPANY_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/clients', label: 'Clients' },
  { to: '/partners', label: 'Partners' },
  { to: '/contact', label: 'Contact' },
];

const Footer: React.FC = () => {
  const { email, offices } = data.contactInfo;

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <p className="footer-brand">Aadi Enterprises</p>
            <p className="footer-text">
              Hospitality solutions partner for professional kitchen, food &amp; beverage,
              housekeeping, hygiene and guest experience requirements.
            </p>
          </div>

          <nav className="footer-col" aria-label="Solutions">
            <p className="footer-heading">Solutions</p>
            <ul className="footer-list">
              {SOLUTION_LINKS.map((solution) => (
                <li key={solution}>
                  <Link to="/products">{solution}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Company">
            <p className="footer-heading">Company</p>
            <ul className="footer-list">
              {COMPANY_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <p className="footer-heading">Contact</p>
            <ul className="footer-list footer-contact-list">
              {offices.map((office) => (
                <li key={office.label}>
                  <span className="footer-contact-label">{office.label.replace(' Office', '')}</span>{' '}
                  <a href={`tel:${office.phone}`}>{office.phone}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
              <li>
                <a
                  href={getWhatsAppUrl(getGeneralEnquiryMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-whatsapp-link"
                >
                  <MessageCircle size={15} aria-hidden="true" />
                  WhatsApp Enquiry ({WHATSAPP_DISPLAY_NUMBER})
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <img
            src={getAssetUrl('logo.png')}
            alt="Aadi Enterprises logo"
            className="footer-bottom-logo"
            loading="lazy"
          />
          <p>&copy; {new Date().getFullYear()} AADI ENTERPRISES. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
