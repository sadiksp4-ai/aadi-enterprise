import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ClipboardList,
  Package,
  Wrench,
  HeartHandshake,
  MessageCircle,
} from 'lucide-react';
import './HomePage.css';
import InstagramFeed from '../components/InstagramFeed/InstagramFeed';
import { getAssetUrl } from '../utils';
import {
  WHATSAPP_DISPLAY_NUMBER,
  getGeneralEnquiryMessage,
  getWhatsAppUrl,
} from '../utils/whatsapp';

const solutionsData = [
  {
    id: '01',
    tag: 'CULINARY',
    title: 'Commercial Kitchen Solutions',
    desc: 'High-performance cooking ranges, refrigeration, combi ovens, and custom stainless prep stations.',
    href: '/products?group=kitchen',
    image: getAssetUrl('images/solutions/commercial-kitchen.webp'),
    alt: 'Professional commercial kitchen with stainless steel equipment',
  },
  {
    id: '02',
    tag: 'DINING',
    title: 'Food & Beverage Service',
    desc: 'Porcelain tableware, premium glassware, cutlery, and modular buffet presentation systems.',
    href: '/products?group=fnb',
    image: getAssetUrl('images/solutions/food-beverage.webp'),
    alt: 'Premium tabletop and buffet presentation setup',
  },
  {
    id: '03',
    tag: 'HOUSEKEEPING',
    title: 'Housekeeping & Floor Care',
    desc: 'Commercial ride-on and walk-behind scrubbers, high-pressure washers, wet/dry vacuums, and janitorial carts.',
    href: '/products?group=hk',
    image: getAssetUrl('images/solutions/housekeeping-scrubbers.webp'),
    alt: 'Commercial floor scrubbers and cleaning machines in a shopping mall',
  },
  {
    id: '04',
    tag: 'GUEST ROOMS',
    title: 'Guest Room & In-Room Amenities',
    desc: 'Designer hospitality lighting, in-room safes, kettles, minibar units, and premium guest accessories.',
    href: '/products?group=guest',
    image: getAssetUrl('images/solutions/guestroom-amenities.webp'),
    alt: 'Housekeeper preparing a premium hotel guest room',
  },
  {
    id: '05',
    tag: 'LAUNDRY',
    title: 'Commercial Laundry Solutions',
    desc: 'Industrial washers, dryers, ironers, and complete linen care systems for high-throughput operations.',
    href: '/products?group=laundry',
    image: getAssetUrl('images/solutions/commercial-laundry.webp'),
    alt: 'Commercial laundry solutions for hospitality linen operations',
  },
  {
    id: '06',
    tag: 'BANQUET',
    title: 'Banquet Operations',
    desc: 'Mobile buffet stations, display risers, chafing dishes, and event service equipment for seamless delivery.',
    href: '/products?group=fnb',
    image: getAssetUrl('images/solutions/banquet-operations.webp'),
    alt: 'Banquet display risers and food presentation equipment',
  },
];

const CAPABILITIES = [
  {
    icon: ClipboardList,
    title: 'Consulting & Planning',
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
    description: 'Professional on-site installation and commissioning support.',
  },
  {
    icon: HeartHandshake,
    title: 'After-Sales Support',
    description: 'Reliable service to keep operations running smoothly.',
  },
];

const caseStudies = [
  {
    id: 'cs-01',
    client: '5-Star Business Hotel & Convention Centre',
    location: 'Pune, Maharashtra',
    category: 'Turnkey Kitchen & Cold Storage',
    title: 'High-Volume Main Kitchen & Cold Room Execution',
    description:
      'End-to-end AutoCAD workflow design, stainless steel custom cooking ranges, combi steamers, and modular cold room integration for a 600-cover simultaneous banquet facility.',
    specs: [
      'Custom 304 SS Worktables & Hoods',
      'Modular Walk-In Cold Room',
      'Combi Ovens & Fryer Batteries',
    ],
    image: getAssetUrl('images/installations/convention-centre-kitchen.webp'),
    alt: 'Stainless steel commercial kitchen with cooking ranges, ovens and prep stations',
  },
  {
    id: 'cs-02',
    client: 'Luxury Shopping & Entertainment Mall',
    location: 'Pune MIDC / Wakad',
    category: 'Mechanized Housekeeping Fleet',
    title: 'Automated Facility Cleaning Fleet Deployment',
    description:
      'Supply and AMC commissioning of Kärcher ride-on scrubber-driers and industrial wet/dry vacuum fleets covering 1.2M sq. ft. of commercial floor space.',
    specs: [
      'Ride-on Floor Scrubbers',
      'Walk-Behind Scrubbers',
      'Preventive Maintenance SLA',
    ],
    image: getAssetUrl('images/installations/mall-cleaning-fleet.webp'),
    alt: 'Fleet of ride-on scrubbers and wet/dry vacuums deployed in a shopping mall',
  },
  {
    id: 'cs-03',
    client: 'Premium Fine-Dining & Rooftop Lounge',
    location: 'Koregaon Park, Pune',
    category: 'Tableware & Banquet Fit-Out',
    title: 'Artisanal Porcelain & Barware Curation',
    description:
      'Complete dining room tabletop package featuring Turkish fine porcelain, crystal lead-free glassware, and cordless architectural table lighting.',
    specs: [
      'Kütahya Porcelain Lines',
      'Curated Lead-Free Glassware',
      'Rechargeable Table Lamps',
    ],
    image: getAssetUrl('images/installations/fine-dining-tabletop.webp'),
    alt: 'Fine dining table setting with porcelain, glassware and silver cutlery',
  },
];

const partnerBrands = [
  {
    name: 'Kärcher',
    category: 'Industrial Cleaning & Scrubbers',
    logo: 'assets/brands/karcher.png',
  },
  {
    name: 'Kütahya Porselen',
    category: 'Fine Porcelain Tableware',
    logo: 'assets/brands/kutahya.png',
  },
  {
    name: 'Tramontina',
    category: 'Commercial Cookware & Cutlery',
    logo: 'assets/brands/tramontina.png',
  },
  {
    name: 'Steelite',
    category: 'Buffet & Tabletop Systems',
    logo: 'assets/brands/steelite.png',
  },
  {
    name: 'Paşabahçe',
    category: 'Commercial Glassware',
    logo: 'assets/brands/pasabahce.png',
  },
  {
    name: 'Dolphy',
    category: 'Washroom & Hygiene Automation',
    logo: 'assets/brands/dolphy.png',
  },
  {
    name: 'Winterhalter',
    category: 'Commercial Warewashing',
    logo: 'assets/brands/winterhalter.png',
  },
  {
    name: 'Ice Make',
    category: 'Commercial Refrigeration & Cold Rooms',
    logo: 'assets/brands/icemake.png',
  },
];

const ICON_PROPS = { size: 24, strokeWidth: 1.5 } as const;

function HomePage() {
  const navigate = useNavigate();
  const whatsappUrl = getWhatsAppUrl(getGeneralEnquiryMessage());

  return (
    <div
      className="hx bg-[#080808] text-white"
      style={{ backgroundColor: '#080808', color: '#ffffff' }}
    >
      {/* Cinematic hero */}
      <section
        className="hx-hero bg-[#080808] text-white"
        style={{ backgroundColor: '#080808', color: '#ffffff' }}
        aria-label="Aadi Enterprises hospitality solutions"
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            poster="/images/hero-fallback.jpg"
            aria-hidden="true"
          >
            <source src="/Videos/hero-hospitality.mp4" type="video/mp4" />
            {/* Fallback if folder was renamed to lowercase */}
            <source src="/videos/hero-hospitality.mp4" type="video/mp4" />
          </video>
          {/* Dark cinematic vignette overlay so white headline text remains legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/80 via-[#080808]/60 to-[#080808]" />
        </div>
        <div className="hx-hero-inner">
          <div className="hx-hero-copy">
            <h1 className="hx-hero-title">
              <span className="hx-hero-title-line">Complete</span>{' '}
              <span className="hx-hero-title-line">Hospitality.</span>{' '}
              <span className="hx-hero-title-line">Perfectly</span>{' '}
              <span className="hx-hero-title-line">Equipped.</span>
            </h1>
            <p className="hx-hero-lead">
              From professional kitchens to exceptional guest experiences.
            </p>
            <div className="hx-hero-actions">
              <button
                type="button"
                className="hx-btn hx-btn-primary"
                onClick={() => navigate('/products')}
              >
                Explore Solutions
                <ArrowRight size={20} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="hx-btn hx-btn-outline"
                onClick={() => navigate('/contact')}
              >
                Request a Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Solution areas */}
      <section
        className="hx-solutions bg-[#080808] text-white"
        style={{ backgroundColor: '#080808', color: '#ffffff' }}
        aria-labelledby="hx-solutions-title"
      >
        <div className="hx-solutions-inner">
          <header className="hx-solutions-head">
            <p className="hx-solutions-eyebrow">SOLUTIONS</p>
            <h2 id="hx-solutions-title" className="hx-solutions-title">
              Complete Solutions to Equip Your Hospitality Property
            </h2>
            <p className="hx-solutions-subtitle">
              From high-volume commercial kitchens to guest room comfort, explore our
              end-to-end equipment, tableware, and facility care lines.
            </p>
          </header>
          <ul className="hx-solutions-grid">
            {solutionsData.map((solution) => (
              <li
                key={solution.id}
                className="hx-solution-card bg-[#121214] text-white border border-white/10"
                style={{ backgroundColor: '#121214', color: '#ffffff' }}
              >
                <Link
                  to={solution.href}
                  className="hx-solution-link"
                  aria-label={`Explore ${solution.title}`}
                >
                  <div className="hx-solution-media">
                    <img
                      src={solution.image}
                      alt={solution.alt}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="hx-solution-meta" aria-hidden="true">
                      <span className="hx-solution-id">{solution.id}</span>
                      <span className="hx-solution-tag">{solution.tag}</span>
                    </div>
                  </div>
                  <div className="hx-solution-body">
                    <h3 className="hx-solution-title">{solution.title}</h3>
                    <p className="hx-solution-text">{solution.desc}</p>
                    <span className="hx-solution-cta" aria-hidden="true">
                      Explore Solutions
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured Zafferano — large image-led split layout */}
      <section
        className="hx-feature bg-[#080808] text-white"
        style={{ backgroundColor: '#080808', color: '#ffffff' }}
        aria-labelledby="hx-feature-title"
      >
        <div className="hx-feature-inner">
          <div className="hx-feature-media">
            <img
              src={getAssetUrl('images/spotlight/zafferano-poldina-pro.webp')}
              alt="Zafferano Poldina Pro cordless table lamps in red, purple and orange on a restaurant table"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="hx-feature-copy">
            <p className="hx-eyebrow">Featured</p>
            <h2 id="hx-feature-title" className="hx-feature-title">
              Zafferano — Designed for Hospitality
            </h2>
            <p className="hx-feature-text">
              Cordless, rechargeable and made to move. Zafferano portable lamps bring
              adaptable colour and warmth to restaurant tables, hotel rooms and lounges.
            </p>
            <button
              type="button"
              className="hx-btn hx-btn-primary"
              onClick={() => navigate('/products?group=guest')}
            >
              Explore Tabletop Lighting
              <ArrowRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* Capabilities — editorial layout */}
      <section
        className="hx-capabilities bg-[#080808] text-white"
        style={{ backgroundColor: '#080808', color: '#ffffff' }}
        aria-labelledby="hx-capabilities-title"
      >
        <div className="hx-section-inner">
          <div className="hx-capabilities-intro">
            <p className="hx-eyebrow">How we work</p>
            <h2 id="hx-capabilities-title" className="hx-section-title">
              One partner. Multiple hospitality solutions.
            </h2>
            <p className="hx-section-text">
              From planning to post-sales support, we help properties source, install and
              maintain the right equipment across every operational area.
            </p>
          </div>
          <ul className="hx-capabilities-list">
            {CAPABILITIES.map(({ icon: Icon, title, description }) => (
              <li
                key={title}
                className="hx-capability group flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-[#121214] transition-all duration-300 hover:border-teal-500/30 hover:bg-[#1a1a1e]"
                style={{ backgroundColor: '#121214', color: '#ffffff' }}
              >
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-teal-500/20 bg-teal-500/10 text-teal-400"
                  aria-hidden="true"
                >
                  <Icon {...ICON_PROPS} />
                </span>
                <div>
                  <h3 className="text-base font-medium text-white">{title}</h3>
                  <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Case studies — balanced B2B installation grid */}
      <section
        className="hx-cases bg-[#080808] text-white"
        style={{ backgroundColor: '#080808', color: '#ffffff' }}
        aria-labelledby="hx-cases-title"
      >
        <div className="hx-cases-inner">
          <header className="hx-cases-head">
            <p className="hx-cases-eyebrow">PROVEN FIT-OUTS</p>
            <h2 id="hx-cases-title" className="hx-cases-title">
              Recent Hospitality &amp; Commercial Installations
            </h2>
            <p className="hx-cases-subtitle">
              Explore real turnkey commercial kitchen deployments, automated housekeeping
              fleets, and banquet fit-outs delivered across leading hospitality properties.
            </p>
          </header>

          <div className="hx-cases-grid">
            {caseStudies.map((project) => (
              <article
                key={project.id}
                className="hx-case-card bg-[#121214] text-white border border-white/10"
                style={{ backgroundColor: '#121214', color: '#ffffff' }}
              >
                <div className="hx-case-media">
                  <img
                    src={project.image}
                    alt={project.alt}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="hx-case-badge">{project.category}</span>
                </div>
                <p className="hx-case-meta">
                  <span className="hx-case-client">{project.client}</span>
                  {' · '}
                  <span className="hx-case-location">{project.location}</span>
                </p>
                <h3 className="hx-case-title">{project.title}</h3>
                <p className="hx-case-text">{project.description}</p>
                <ul className="hx-case-specs">
                  {project.specs.map((spec) => (
                    <li key={spec}>{spec}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Brand partners — unified monochrome tile grid */}
      <section
        className="hx-brands bg-[#080808] text-white"
        style={{ backgroundColor: '#080808', color: '#ffffff' }}
        aria-labelledby="hx-brands-title"
      >
        <div className="hx-brands-inner">
          <header className="hx-brands-head text-center">
            <span className="font-mono text-xs uppercase tracking-wider text-teal-400">
              CURATED BRAND ECOSYSTEM
            </span>
            <h3
              id="hx-brands-title"
              className="text-3xl md:text-4xl font-light text-white tracking-tight mt-1"
            >
              Premium Brands We Supply &amp; Support
            </h3>
            <p className="text-zinc-400 text-sm max-w-2xl mx-auto text-center mt-2 mb-10">
              Supplying industry-benchmark culinary equipment, fine porcelain, glassware,
              and commercial machinery from leading global manufacturers.
            </p>
          </header>
          <ul className="hx-brand-list" aria-label="Selected partner brands">
            {partnerBrands.map((brand) => (
              <li key={brand.name}>
                <div className="group flex items-center justify-center p-4 rounded-xl bg-white shadow-sm border border-white/10 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-black/60 h-20 sm:h-24">
                  <img
                    src={getAssetUrl(brand.logo)}
                    alt={`${brand.name} logo`}
                    className="max-h-10 sm:max-h-12 w-auto max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Instagram */}
      <InstagramFeed />

      {/* Contact CTA — deep petrol */}
      <section
        className="hx-cta bg-[#121214] text-white"
        style={{ backgroundColor: '#121214', color: '#ffffff' }}
        aria-labelledby="hx-cta-title"
      >
        <div className="hx-cta-inner">
          <h2 id="hx-cta-title" className="hx-cta-title">
            Ready to equip your property?
          </h2>
          <p className="hx-cta-text">
            Talk to our team about planning, sourcing and installing the right
            hospitality solutions.
          </p>
          <div className="hx-cta-actions">
            <button
              type="button"
              className="hx-btn hx-btn-primary"
              onClick={() => navigate('/contact')}
            >
              Request a Consultation
              <ArrowRight size={20} aria-hidden="true" />
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hx-btn hx-btn-outline"
            >
              <MessageCircle size={20} aria-hidden="true" />
              WhatsApp ({WHATSAPP_DISPLAY_NUMBER})
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
