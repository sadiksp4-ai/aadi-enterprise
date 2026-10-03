import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  ClipboardList,
  Package,
  Wrench,
  HeartHandshake,
  MessageCircle,
} from 'lucide-react';
import './HomePage.css';
import { getAssetUrl } from '../utils';
import {
  WHATSAPP_DISPLAY_NUMBER,
  getGeneralEnquiryMessage,
  getWhatsAppUrl,
} from '../utils/whatsapp';

const SOLUTIONS = [
  {
    title: 'Professional Kitchen',
    description:
      'Cooking, refrigeration, warewashing and food-preparation equipment for demanding commercial kitchens.',
    image: getAssetUrl('commercial_kitchen.jpg'),
    alt: 'Commercial kitchen equipped for professional hospitality operations',
  },
  {
    title: 'Food & Beverage',
    description:
      'Tableware, glassware, barware and service essentials that shape the dining experience.',
    image: getAssetUrl('f&b.jpg'),
    alt: 'Food and beverage service setup for hospitality dining',
  },
  {
    title: 'Housekeeping & Hygiene',
    description:
      'Professional cleaning systems, laundry solutions and hygiene essentials for spotless properties.',
    image: getAssetUrl('housekeeping.jpg'),
    alt: 'Housekeeping team preparing a hotel room',
  },
  {
    title: 'Guest Experience',
    description:
      'In-room amenities and thoughtful details that guests remember long after checkout.',
    image: getAssetUrl('housekeeping/guest-comfort-essentials.jpg'),
    alt: 'In-room guest amenities and comfort essentials',
  },
];

const CAPABILITIES = [
  {
    icon: ClipboardList,
    title: 'Kitchen & Project Planning',
    description: 'Layout planning and equipment sizing for new and existing properties.',
  },
  {
    icon: Package,
    title: 'Product Sourcing',
    description: 'Equipment and tableware sourced from global hospitality brands.',
  },
  {
    icon: Wrench,
    title: 'Installation & Commissioning',
    description: 'Professional installation and commissioning support on site.',
  },
  {
    icon: HeartHandshake,
    title: 'After-Sales Support',
    description: 'Reliable after-sales service to keep operations running.',
  },
];

const BRANDS = [
  { name: 'Tramontina', file: 'brand_partners/Tramontina.png' },
  { name: 'Karcher', file: 'brand_partners/Karcher.png' },
  { name: 'Schott Zwiesel', file: 'brand_partners/schott zwiesel.png' },
  { name: 'LSA', file: 'brand_partners/LSA Glassware.png' },
  { name: 'Steelite', file: 'brand_partners/Steelite.png' },
  { name: 'JVD', file: 'brand_partners/JVD.png' },
  { name: 'Elanpro', file: 'brand_partners/Elanpro .png' },
  { name: 'Utopia', file: 'brand_partners/Utopia.png' },
];

const CLIENTS = [
  { name: 'Marriott', file: 'clients/Marriott.png' },
  { name: 'Hyatt', file: 'clients/Hyatt.png' },
  { name: 'Apollo Hospitals', file: 'clients/Apollo Hospitals.png' },
  { name: 'Bajaj Finserv', file: 'clients/Bajaj Finserv.png' },
  { name: 'Conrad Hotel', file: 'clients/Conrad Hotel.png' },
  { name: 'Novotel Hotels', file: 'clients/Novotel Hotels.png' },
];

/* Featured-brand hero slideshow (5s fade loop). Images are supplied
   full-composition banners, so no text is overlaid on top of them. */
const HERO_SLIDES = [
  {
    file: 'new/home-hero/01-zafferano-lamp.png',
    alt: 'Zafferano hospitality table lamps lighting a restaurant table — Lighting for Hospitality',
  },
  {
    file: 'new/home-hero/02-tramontina-cookware.png',
    alt: 'Tramontina professional cookware range — Professional Kitchen Solutions',
  },
  {
    file: 'new/home-hero/03-zafferano-hospitality-lighting.png',
    alt: 'Zafferano Poldina Pro Series colourful portable lamps — Portable Lighting for Modern Hospitality',
  },
  {
    file: 'new/home-hero/04-tramontina-knives.png',
    alt: 'Tramontina professional kitchen knives — Precision Tools for Professional Kitchens',
  },
  {
    file: 'new/home-hero/05-tramontina-utensils.png',
    alt: 'Tramontina premium stainless steel kitchen utensils — Reliability for Every Kitchen',
  },
];

const HERO_SLIDE_INTERVAL_MS = 5000;

function HomePage() {
  const navigate = useNavigate();
  const whatsappUrl = getWhatsAppUrl(getGeneralEnquiryMessage());
  const [heroSlide, setHeroSlide] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const timer = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, HERO_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hx">
      {/* Hero */}
      <section className="hx-hero">
        <div className="hx-hero-inner">
          <div className="hx-hero-copy">
            <p className="hx-eyebrow">Aadi Enterprises</p>
            <h1 className="hx-hero-title">
              Hospitality Solutions, Curated for Better Experiences.
            </h1>
            <p className="hx-hero-text">
              Aadi Enterprises partners with hotels, restaurants and institutions on
              professional kitchen, food &amp; beverage, housekeeping, hygiene and guest
              experience requirements — from planning and sourcing to installation and
              after-sales support.
            </p>
            <div className="hx-hero-actions">
              <button type="button" className="hx-btn hx-btn-primary" onClick={() => navigate('/products')}>
                Explore Solutions
                <ArrowRight size={17} aria-hidden="true" />
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hx-btn hx-btn-outline"
              >
                <MessageCircle size={17} aria-hidden="true" />
                WhatsApp Enquiry
              </a>
            </div>
          </div>
          <div className="hx-hero-media">
            <img
              src={getAssetUrl('housekeeping/entrance-solutions.jpg')}
              alt="Premium hotel lobby with marble reception desk, luggage carts and lounge seating"
              className="hx-hero-image"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
        <div
          className="hx-hero-slideshow"
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured brand highlights"
        >
          {HERO_SLIDES.map((slide, index) => (
            <img
              key={slide.file}
              src={getAssetUrl(slide.file)}
              alt={slide.alt}
              className={`hx-hero-slide${index === heroSlide ? ' is-active' : ''}`}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              decoding="async"
              aria-hidden={index === heroSlide ? undefined : true}
            />
          ))}
          <div className="hx-hero-dots" role="group" aria-label="Choose slide">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.file}
                type="button"
                className={`hx-hero-dot${index === heroSlide ? ' is-active' : ''}`}
                aria-label={`Show slide ${index + 1} of ${HERO_SLIDES.length}`}
                aria-current={index === heroSlide ? true : undefined}
                onClick={() => setHeroSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="hx-intro">
        <div className="hx-intro-inner">
          <h2 className="hx-intro-title">
            One Partner.
            <br />
            Multiple Hospitality
            <br />
            Solutions.
          </h2>
          <div className="hx-intro-copy">
            <p>
              Aadi Enterprises provides hospitality-focused products, equipment and
              solutions across kitchen, food &amp; beverage, housekeeping, hygiene and
              guest experience requirements.
            </p>
            <button
              type="button"
              className="hx-link"
              onClick={() => navigate('/about')}
            >
              Learn more about us
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section className="hx-solutions" aria-labelledby="hx-solutions-title">
        <div className="hx-section-inner">
          <div className="hx-section-head">
            <p className="hx-eyebrow">What we do</p>
            <h2 id="hx-solutions-title" className="hx-section-title">
              Solutions for every corner of your property
            </h2>
          </div>
          <div className="hx-solutions-grid">
            {SOLUTIONS.map((solution) => (
              <article key={solution.title} className="hx-solution-card">
                <button
                  type="button"
                  className="hx-solution-media"
                  onClick={() => navigate('/products')}
                  aria-label={`Explore ${solution.title} solutions`}
                  tabIndex={-1}
                >
                  <img
                    src={solution.image}
                    alt={solution.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
                <h3 className="hx-solution-title">{solution.title}</h3>
                <p className="hx-solution-text">{solution.description}</p>
                <button
                  type="button"
                  className="hx-link"
                  onClick={() => navigate('/products')}
                >
                  Explore
                  <ArrowUpRight size={16} aria-hidden="true" />
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="hx-capabilities" aria-labelledby="hx-capabilities-title">
        <div className="hx-section-inner">
          <div className="hx-section-head">
            <p className="hx-eyebrow">How we help</p>
            <h2 id="hx-capabilities-title" className="hx-section-title">
              More Than Products
            </h2>
            <p className="hx-section-text">
              Support across every stage of your property lifecycle.
            </p>
          </div>
          <ul className="hx-capabilities-list">
            {CAPABILITIES.map(({ icon: Icon, title, description }) => (
              <li key={title} className="hx-capability">
                <span className="hx-capability-icon" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.5} />
                </span>
                <div>
                  <h3 className="hx-capability-title">{title}</h3>
                  <p className="hx-capability-text">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Brands */}
      <section className="hx-brands" aria-labelledby="hx-brands-title">
        <div className="hx-section-inner">
          <div className="hx-section-head">
            <p className="hx-eyebrow">Partnerships</p>
            <h2 id="hx-brands-title" className="hx-section-title">
              Brands We Work With
            </h2>
            <p className="hx-section-text">
              A selection of the global manufacturers and hospitality brands we source from.
            </p>
          </div>
          <ul className="hx-brand-list" aria-label="Selected partner brands">
            {BRANDS.map((brand) => (
              <li key={brand.name} className="hx-brand-item">
                <img
                  src={getAssetUrl(brand.file)}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                  decoding="async"
                />
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="hx-link"
            onClick={() => navigate('/partners')}
          >
            View All Brands
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Clients */}
      <section className="hx-clients" aria-labelledby="hx-clients-title">
        <div className="hx-section-inner">
          <div className="hx-section-head">
            <p className="hx-eyebrow">Relationships</p>
            <h2 id="hx-clients-title" className="hx-section-title">
              Trusted Across Hospitality &amp; Industry
            </h2>
            <p className="hx-section-text">
              A selection of the hotels, restaurants, healthcare providers, corporates
              and institutions we work with.
            </p>
          </div>
          <ul className="hx-client-list" aria-label="Selected clients">
            {CLIENTS.map((client) => (
              <li key={client.name} className="hx-client-item">
                <img
                  src={getAssetUrl(client.file)}
                  alt={`${client.name} logo`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="hx-client-name">{client.name}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="hx-link"
            onClick={() => navigate('/clients')}
          >
            View Our Clients
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="hx-cta" aria-labelledby="hx-cta-title">
        <div className="hx-cta-inner">
          <h2 id="hx-cta-title" className="hx-cta-title">
            Planning a New Property or Upgrading an Existing One?
          </h2>
          <p className="hx-cta-text">
            Tell us about your requirement — our team will help you plan, source and
            set up the right solution for your property.
          </p>
          <div className="hx-cta-actions">
            <button
              type="button"
              className="hx-btn hx-btn-light"
              onClick={() => navigate('/contact')}
            >
              Talk to Aadi Enterprises
              <ArrowRight size={17} aria-hidden="true" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hx-btn hx-btn-ghost-light"
            >
              <MessageCircle size={17} aria-hidden="true" />
              WhatsApp Enquiry ({WHATSAPP_DISPLAY_NUMBER})
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
