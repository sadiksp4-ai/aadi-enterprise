import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import './AboutPage.css';
import { getAssetUrl } from '../utils';
import {
  WHATSAPP_DISPLAY_NUMBER,
  getGeneralEnquiryMessage,
  getWhatsAppUrl,
} from '../utils/whatsapp';
import { AnimatedNumber } from '../components/ui/animated-number';
import { motionTransitions } from '../lib/motion-tokens';

const SOLUTIONS = [
  {
    label: '01 — Kitchen',
    title: 'Professional Kitchen',
    description:
      'Cooking, refrigeration, warewashing and food-preparation equipment for demanding commercial kitchens.',
  },
  {
    label: '02 — Dining',
    title: 'Food & Beverage',
    description:
      'Tableware, glassware, barware and service essentials that shape the dining experience.',
  },
  {
    label: '03 — Care',
    title: 'Housekeeping & Hygiene',
    description:
      'Professional cleaning systems and hygiene essentials for spotless properties.',
  },
  {
    label: '04 — Linen',
    title: 'Laundry',
    description:
      'Laundry planning, accessories and finishing solutions for hospitality linen workflows.',
  },
  {
    label: '05 — Stay',
    title: 'Guest Experience',
    description:
      'In-room amenities and thoughtful details that guests remember long after checkout.',
  },
  {
    label: '06 — Cold',
    title: 'Refrigeration & Cold Chain',
    description:
      'Refrigeration, ice machines and cold-storage solutions for reliable food safety.',
  },
];

const STEPS = [
  {
    index: '01',
    title: 'Kitchen & Project Planning',
    description: 'Layout planning and equipment sizing for new and existing properties.',
  },
  {
    index: '02',
    title: 'Product Sourcing',
    description: 'Equipment and tableware sourced from global hospitality brands.',
  },
  {
    index: '03',
    title: 'Installation & Commissioning',
    description: 'Professional installation and commissioning support on site.',
  },
  {
    index: '04',
    title: 'After-Sales Support',
    description: 'Reliable after-sales service to keep operations running.',
  },
];

const PRINCIPLES = [
  {
    title: 'One partner, many categories',
    description:
      'A single supplier across kitchen, food & beverage, housekeeping, hygiene and guest experience requirements.',
  },
  {
    title: 'Ranges for every property tier',
    description:
      'Tailored collections that suit properties from budget stays to luxury flagships.',
  },
  {
    title: 'Imported and Indian-made collections',
    description:
      'Global brands combined with dependable Indian-made essentials for practical budgets.',
  },
  {
    title: 'Built for durability, hygiene and design',
    description:
      'Products selected for long service life, hygienic operation and presentation quality.',
  },
  {
    title: 'Consultation and post-sales support',
    description:
      'Expert guidance before purchase and dependable support after installation.',
  },
  {
    title: 'Global sourcing, Indian logistics',
    description:
      'International procurement handled end to end, delivered through local teams.',
  },
];

const INDUSTRIES = [
  'Hotels & Resorts',
  'Restaurants & Food Service',
  'Healthcare',
  'Corporate & Commercial',
  'Institutions & Education',
  'Wellness & Lifestyle',
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: motionTransitions.springSmooth,
} as const;

function AboutPage() {
  const navigate = useNavigate();
  const whatsappUrl = getWhatsAppUrl(getGeneralEnquiryMessage());

  return (
    <div className="ax">
      {/* Hero */}
      <motion.section className="ax-hero" {...reveal}>
        <div className="ax-hero-inner">
          <div className="ax-hero-copy">
            <p className="ax-eyebrow">About Aadi Enterprises</p>
            <h1 className="ax-hero-title">
              Hospitality Solutions, Built Around Your Property.
            </h1>
            <p className="ax-hero-text">
              Aadi Enterprises provides hospitality-focused products, equipment and
              solutions across professional kitchen, food &amp; beverage, housekeeping,
              laundry, refrigeration and guest experience requirements.
            </p>
          </div>
          <div className="ax-hero-media">
            <img
              src={getAssetUrl('about-hero.jpg')}
              alt="Sunlit luxury hotel lobby with marble reception desk, lounge seating and luggage cart"
              className="ax-hero-image"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </motion.section>

      {/* Who we are */}
      <motion.section className="ax-who" aria-labelledby="ax-who-title" {...reveal}>
        <div className="ax-inner">
          <div className="ax-two-col">
            <h2 id="ax-who-title" className="ax-h2">
              One Partner. Multiple Hospitality Solutions.
            </h2>
            <div className="ax-col-copy">
              <p>
                Aadi Enterprises works with hotels, restaurants, healthcare providers,
                corporates and institutions on new property setups and upgrades of
                existing operations — helping each property plan, source and set up
                the right equipment across six solution categories.
              </p>
              <p className="ax-muted">
                Headquartered in Pune, with teams in Mumbai, Bengaluru and Delhi.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Mission & Vision — official company wording, reproduced verbatim.
          Presented as accessible HTML text (searchable, responsive) rather
          than depending solely on artwork. */}
      <motion.section className="ax-mission" aria-labelledby="ax-mission-title" {...reveal}>
        <div className="ax-inner">
          <p className="ax-eyebrow">Mission &amp; Vision</p>
          <h2 id="ax-mission-title" className="ax-h2 ax-head-space">
            Where We&rsquo;re Going. What We Stand For.
          </h2>
          <div className="ax-mv-grid">
            <div className="ax-mv-block">
              <h3 className="ax-mv-label">Mission</h3>
              <p className="ax-mv-text">
                To empower the food and beverage industry by providing premium,
                innovative, and stylish equipment solutions that enhance efficiency,
                aesthetics, and customer experiences.
              </p>
              <p className="ax-mv-text">
                We are committed to delivering high-quality products, exceptional service,
                and tailored solutions that help businesses in a competitive market.
              </p>
            </div>
            <div className="ax-mv-block">
              <h3 className="ax-mv-label">Vision</h3>
              <p className="ax-mv-text">
                To be the most trusted and preferred partner for food and beverage
                equipment solutions across India, setting new benchmarks in quality,
                innovation, and customer satisfaction.
              </p>
              <p className="ax-mv-text">
                We envision a future where every hospitality business can access
                world-class equipment that elevates their culinary excellence and
                brand identity.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* What we do */}
      <motion.section className="ax-do" aria-labelledby="ax-do-title" {...reveal}>
        <div className="ax-inner">
          <p className="ax-eyebrow">What we do</p>
          <h2 id="ax-do-title" className="ax-h2 ax-head-space">
            Solution areas
          </h2>
          <ul className="ax-solutions">
            {SOLUTIONS.map((solution) => (
              <li key={solution.title} className="ax-solution">
                <p className="ax-solution-label">
                  <AnimatedNumber
                    value={parseInt(solution.label.slice(0, 2), 10)}
                    prefix="0"
                    className="font-sans"
                  />
                  {' — '}{solution.title}
                </p>
                <h3 className="ax-solution-title">{solution.title}</h3>
                <p className="ax-solution-text">{solution.description}</p>
                <button
                  type="button"
                  className="ax-link"
                  onClick={() => navigate('/products')}
                >
                  Browse {solution.title}
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* How we help */}
      <motion.section className="ax-steps" aria-labelledby="ax-steps-title" {...reveal}>
        <div className="ax-inner">
          <p className="ax-eyebrow">How we help</p>
          <h2 id="ax-steps-title" className="ax-h2 ax-head-space">
            From planning to post-sales support
          </h2>
          <ol className="ax-steps-list">
            {STEPS.map((step) => (
              <li key={step.index} className="ax-step">
                <span className="ax-step-index" aria-hidden="true">
                  <AnimatedNumber
                    value={parseInt(step.index, 10)}
                    prefix="0"
                    className="font-sans"
                  />
                </span>
                <h3 className="ax-step-title">{step.title}</h3>
                <p className="ax-step-text">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </motion.section>

      {/* Why Aadi */}
      <motion.section className="ax-why" aria-labelledby="ax-why-title" {...reveal}>
        <div className="ax-inner">
          <p className="ax-eyebrow">Why Aadi Enterprises</p>
          <h2 id="ax-why-title" className="ax-h2 ax-head-space">
            A practical way to equip hospitality properties
          </h2>
          <dl className="ax-principles">
            {PRINCIPLES.map((principle) => (
              <div key={principle.title} className="ax-principle">
                <dt>{principle.title}</dt>
                <dd>{principle.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.section>

      {/* Industries */}
      <motion.section className="ax-industries" aria-labelledby="ax-industries-title" {...reveal}>
        <div className="ax-inner">
          <p className="ax-eyebrow">Who we serve</p>
          <h2 id="ax-industries-title" className="ax-h2 ax-head-space">
            Industries we serve
          </h2>
          <ul className="ax-industry-list">
            {INDUSTRIES.map((industry) => (
              <li key={industry}>
                <button
                  type="button"
                  className="ax-industry-link"
                  onClick={() => navigate('/clients')}
                >
                  {industry}
                  <ArrowRight size={15} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Brands + clients */}
      <motion.section className="ax-proof" aria-labelledby="ax-proof-title" {...reveal}>
        <div className="ax-inner">
          <h2 id="ax-proof-title" className="ax-h2">
            Established brands. Organisations across hospitality and industry.
          </h2>
          <p className="ax-proof-text">
            Aadi works with established hospitality and product brands, and serves
            organisations across hospitality and related sectors.
          </p>
          <div className="ax-proof-links">
            <button type="button" className="ax-link" onClick={() => navigate('/partners')}>
              View Our Brands
              <ArrowRight size={16} aria-hidden="true" />
            </button>
            <button type="button" className="ax-link" onClick={() => navigate('/clients')}>
              View Our Clients
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section className="ax-cta" aria-labelledby="ax-cta-title" {...reveal}>
        <div className="ax-cta-inner">
          <h2 id="ax-cta-title" className="ax-cta-title">
            Planning a New Property or Upgrading an Existing One?
          </h2>
          <p className="ax-cta-text">
            Tell us about your requirement — our team can help you plan, source and
            set up the right solution for your property.
          </p>
          <div className="ax-cta-actions">
            <button
              type="button"
              className="ax-btn ax-btn-light"
              onClick={() => navigate('/contact')}
            >
              Talk to Aadi Enterprises
              <ArrowRight size={17} aria-hidden="true" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ax-btn ax-btn-ghost-light"
            >
              <MessageCircle size={17} aria-hidden="true" />
              WhatsApp Enquiry ({WHATSAPP_DISPLAY_NUMBER})
            </a>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

export default AboutPage;
