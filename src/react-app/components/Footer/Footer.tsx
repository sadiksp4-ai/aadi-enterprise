import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, MessageCircle } from 'lucide-react';
import './Footer.css';
import { getAssetUrl } from '../../utils';
import { WHATSAPP_DISPLAY_NUMBER, getGeneralEnquiryMessage, getWhatsAppUrl } from '../../utils/whatsapp';
import data from '../../../../aadi-info.json';

const SOCIAL_LINKS = [
  {
    label: 'Aadi Enterprises on Facebook',
    href: 'https://www.facebook.com/share/1JfupXt4k4/',
    Icon: Facebook,
  },
  {
    label: 'Aadi Enterprises on Instagram',
    href: 'https://www.instagram.com/aadienterprises_/',
    Icon: Instagram,
  },
  {
    label: 'Aadi Enterprises on LinkedIn',
    href: 'https://www.linkedin.com/in/aadi-enterprises-pune-300127391',
    Icon: Linkedin,
  },
];

const SOLUTION_LINKS = [
  { label: 'Professional Kitchen', group: 'kitchen' },
  { label: 'Food & Beverage', group: 'fnb' },
  { label: 'Housekeeping & Hygiene', group: 'hk' },
  { label: 'Laundry', group: 'laundry' },
  { label: 'Guest Experience', group: 'guest' },
  { label: 'Refrigeration & Cold Chain', group: 'cold' },
];

const COMPANY_LINKS = [
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/clients', label: 'Clients' },
  { to: '/partners', label: 'Partners' },
  { to: '/contact', label: 'Contact' },
];

const OFFICE_CONTACTS = [
  { label: 'Pune (HQ)', phone: '+91-9076304428' },
  { label: 'Mumbai', phone: '+91-9076304428' },
  { label: 'Bengaluru', phone: '+91-9270075682' },
  { label: 'Delhi NCR', phone: '+91-9834921872' },
];

const Footer: React.FC = () => {
  const { email } = data.contactInfo;

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <p className="footer-brand">Aadi Enterprises</p>
            <p className="footer-text">
              Hospitality solutions partner for professional kitchen, food &amp; beverage,
              housekeeping, laundry, cold chain and guest experience requirements.
            </p>
            <ul className="footer-social-list" aria-label="Aadi Enterprises on social media">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="footer-social-link"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer-col" aria-label="Solutions">
            <p className="footer-heading">Solutions</p>
            <ul className="footer-list">
              {SOLUTION_LINKS.map((solution) => (
                <li key={solution.group}>
                  <Link to={`/products?group=${solution.group}`}>{solution.label}</Link>
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
              {OFFICE_CONTACTS.map((office) => (
                <li key={office.label}>
                  <strong className="footer-contact-label">{office.label}:</strong>{' '}
                  <a href={`tel:${office.phone.replace(/[^+\d]/g, '')}`}>{office.phone}</a>
                </li>
              ))}
              <li className="footer-contact-email">
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
            decoding="async"
          />
          <p>&copy; {new Date().getFullYear()} AADI ENTERPRISES. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
