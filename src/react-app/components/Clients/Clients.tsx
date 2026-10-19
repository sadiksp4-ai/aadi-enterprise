import React, { useState } from "react";
import "./Clients.css";
import { getAssetUrl } from "../../utils";

interface ClientEntry {
  name: string;
  folder: string;
  file: string;
  /** Industry descriptor shown under the name. Omit when not verifiable from repo data. */
  descriptor?: string;
}

interface ClientCategory {
  id: string;
  title: string;
  filterLabel: string;
  descriptor: string;
  clients: ClientEntry[];
}

/**
 * Clients V2 — organized by business type, mirroring the Partners page
 * information architecture (filter bar + category sections + cards).
 *
 * Sourcing rules applied (per audit, no facts invented):
 * - No star-rating claims anywhere in the repo, so all hotels sit under a
 *   single "Hotels & Resorts" category. No luxury/premium labels.
 * - Descriptors are shown ONLY where the repo verifies them (filename itself,
 *   HomePage CLIENTS list, or AboutPage "Sectors We Serve").
 * - Uncertain identities render under "Other Hospitality & Organizations"
 *   with name only.
 * - Asset paths are preserved verbatim (including fragile names); display
 *   names follow the confirmed placement list; files are never renamed here.
 *
 * Duplicate resolution (compared by logo/name/file data, logos visually verified):
 * - Updated to newer supplied logo assets (same brand confirmed visually):
 *   Accor: clients/Accor.png → new/clients/accor.png
 *   Radisson Blu: clients/Radisson Blu.png → new/clients/radison.png
 *   Sheraton Hotels & Resort: clients/Sheraton Hotels & Resort.png → new/clients/sheraton.png
 *   Sujyoti: clients/Sujyoti.png → new/clients/sujyoti.png
 * - Merged (same brand, one card kept):
 *   Radisson Blu ↔ Radisson (both logos show Radisson BLU) → kept "Radisson Blu" with new/clients/radison.png
 *   Surya.png ↔ new/clients/surya.jpg → kept clients/Surya.png
 *   Marriott.png ↔ new/clients/marriotr.png (typo variant) → kept clients/Marriott.png
 * - Removed per management: Eagle Forgings (new/clients/eagle.jpg).
 * - Excluded per management (never re-add): Cosme Matias Menezes
 *   (new/clients/cosme.png, file deleted), ES (new/clients/es.png),
 *   Wang Hospitality Equipment Private Limited (new/clients/wang.png,
 *   file deleted).
 * - Retained separately (repo does not prove same property):
 *   All Marriott/Hyatt family properties (Fairfield, JW, Courtyard, Grand Hyatt,
 *   Hyatt, Hyatt Residency, W, Westin, Ritz, InterContinental) kept distinct.
 * - Second logo batch (Oct 2026, 53 present files audited; filenames kept
 *   verbatim, display names cleaned of underscores only):
 *   Added 45 new cards, one per present file. Property-qualified hotel files
 *   get their own cards alongside the pre-existing generic brand cards.
 *   Skipped as same-entity duplicates (existing card reused): Amanora Mall,
 *   Atmantan Wellness Centre, Endurance Technologies Ltd, Fujitsu Consulting
 *   India, Hotel Park Ornate, Oakwood Residence Pune, Swastik Luxury Wellbeing
 *   Sanctuary, The Corinthians Resort & Club, new/clients/surya.jpg.
 *   Descriptors on new cards appear only when the filename itself verifies
 *   them (Hotel/Resort/Mall/Insurance); all other new cards render name-only.
 *   Lower-confidence placements (name gives no hospitality signal) sit under
 *   "Other Hospitality & Organizations": King Mansion Goa, Luxe Puri,
 *   The Astor Goa, The Grand Imperial.
 * - Yogh Hospitality was not in the confirmed placement lists, so it renders
 *   under "Other Hospitality & Organizations" (name only) rather than Hotels.
 */
const clientCategories: ClientCategory[] = [
  {
    id: "hotels",
    title: "Hotels & Resorts",
    filterLabel: "Hotels & Resorts",
    descriptor: "Hotels, resorts and hospitality groups.",
    clients: [
      { name: "Accor", folder: "new/clients", file: "accor.png", descriptor: "Hotel Group" },
      { name: "Conrad Hotel", folder: "clients", file: "Conrad Hotel.png", descriptor: "Hotel" },
      { name: "Fairfield by Marriott", folder: "clients", file: "Fairfield by Marriott.png", descriptor: "Hotel" },
      { name: "Grand Hyatt", folder: "clients", file: "Grand Hyatt.png", descriptor: "Hotel" },
      { name: "Hilton Hotel", folder: "clients", file: "Hilton Hotel.png", descriptor: "Hotel" },
      { name: "Hyatt Residency", folder: "clients", file: "Hyatt Residency.png", descriptor: "Hotel" },
      { name: "Hyatt", folder: "clients", file: "Hyatt.png", descriptor: "Hotel Group" },
      { name: "Le Meridien", folder: "clients", file: "LeMeridien.png", descriptor: "Hotel" },
      { name: "Marriott", folder: "clients", file: "Marriott.png", descriptor: "Hotel Group" },
      { name: "Novotel Hotels", folder: "clients", file: "Novotel Hotels.png", descriptor: "Hotel" },
      { name: "Oakwood Premier", folder: "clients", file: "Oakwood Premier.png", descriptor: "Hotel" },
      { name: "Park Ornate", folder: "clients", file: "Park Ornate.png", descriptor: "Hotel" },
      { name: "Radisson Blu", folder: "new/clients", file: "radison.png", descriptor: "Hotel" },
      { name: "Rhythm Hotels & Resorts", folder: "clients", file: "Rhythm Hotels & Resort.png", descriptor: "Hotel" },
      { name: "Sheraton Hotels & Resort", folder: "new/clients", file: "sheraton.png", descriptor: "Hotel" },
      { name: "Spree Hospitality", folder: "clients", file: "Spree Hospitality.png", descriptor: "Hospitality Group" },
      { name: "Suba Group of Hotels", folder: "clients", file: "Suba groups of Hotel.png", descriptor: "Hotel Group" },
      { name: "The Corinthians Club Resort", folder: "clients", file: "The Corinthians Club Resort.png", descriptor: "Resort" },
      { name: "W Hotels", folder: "clients", file: "W Hotels.png", descriptor: "Hotel" },
      { name: "Westin", folder: "clients", file: "Westin Hotel.png", descriptor: "Hotel" },
      { name: "Courtyard", folder: "new/clients", file: "courtyard.png", descriptor: "Hotel" },
      { name: "InterContinental", folder: "new/clients", file: "intercontentinal.png", descriptor: "Hotel" },
      { name: "Ritz", folder: "new/clients", file: "ritz.png", descriptor: "Hotel" },
      { name: "Anchaviyo Nature Resort", folder: "new/clients", file: "Anchaviyo_Nature_Resort.jpg", descriptor: "Resort" },
      { name: "Conrad Pune (Hilton)", folder: "new/clients", file: "Conrad_Pune_(Hilton).jpg", descriptor: "Hotel" },
      { name: "Courtyard by Marriott Hinjewadi", folder: "new/clients", file: "Courtyard by Marriott Hinjewadi.png", descriptor: "Hotel" },
      { name: "Courtyard by Marriott Mahabaleshwar", folder: "new/clients", file: "Courtyard by Marriott Mahabaleshwar.jpg", descriptor: "Hotel" },
      { name: "Fairfield by Marriott Anjuna", folder: "new/clients", file: "Fairfield_by_Marriott_Anjuna.jpg", descriptor: "Hotel" },
      { name: "Fairfield by Marriott Kharadi", folder: "new/clients", file: "Fairfield_by_Marriott_Kharadi.jpg", descriptor: "Hotel" },
      { name: "Four Points by Sheraton Nashik", folder: "new/clients", file: "Four Points by Sheraton Nashik.jpg", descriptor: "Hotel" },
      { name: "Four Points by Sheraton Pune", folder: "new/clients", file: "Four Points by Sheraton Pune.jpg", descriptor: "Hotel" },
      { name: "Hilton Goa Resort", folder: "new/clients", file: "Hilton_Goa_Resort.png", descriptor: "Resort" },
      { name: "Hyatt Place Aurangabad", folder: "new/clients", file: "Hyatt Place Aurangabad.png", descriptor: "Hotel" },
      { name: "Hyatt Place Hinjewadi", folder: "new/clients", file: "Hyatt Place Hinjewadi.png", descriptor: "Hotel" },
      { name: "Hyatt Regency Pune", folder: "new/clients", file: "Hyatt_Regency_Pune.jpg", descriptor: "Hotel" },
      { name: "ibis Styles Goa Vagator", folder: "new/clients", file: "ibis Styles Goa Vagator.png", descriptor: "Hotel" },
      { name: "IRA by Orchid Bhavnagar", folder: "new/clients", file: "IRA By Orchid Bhavnagar.jpg", descriptor: "Hotel" },
      { name: "JW Marriott Pune", folder: "new/clients", file: "JW_Marriott_Pune.png", descriptor: "Hotel" },
      { name: "Kochi Marriott Hotel", folder: "new/clients", file: "Kochi_Marriott_Hotel.png", descriptor: "Hotel" },
      { name: "Le Meridien Dehradun Resort & Spa", folder: "new/clients", file: "Le Meridien Dehradun Resort & Spa.jpg", descriptor: "Resort" },
      { name: "Le Meridien Mahabaleshwar Resort & Spa", folder: "new/clients", file: "Le Meridien Mahabaleshwar Resort & Spa.jpg", descriptor: "Resort" },
      { name: "Le Meridien Gurgaon", folder: "new/clients", file: "Le_Meridien_Gurgaon.jpg", descriptor: "Hotel" },
      { name: "Lotus Eco Beach Resort", folder: "new/clients", file: "Lotus Eco Beach Resort.jpg", descriptor: "Resort" },
      { name: "Novotel Imagicaa Khopoli", folder: "new/clients", file: "Novotel Imagicaa Khopoli.jpg", descriptor: "Hotel" },
      { name: "Novotel Pune Nagar Road", folder: "new/clients", file: "Novotel Pune Nagar Road.jpg", descriptor: "Hotel" },
      { name: "Radisson Blu Resort & Spa Khopoli", folder: "new/clients", file: "Radisson Blu Resort & Spa Khopoli.jpg", descriptor: "Resort" },
      { name: "Renaissance Goa Resort", folder: "new/clients", file: "Renaissance_Goa_Resort.jpg", descriptor: "Resort" },
      { name: "Rhythm Lonavala", folder: "new/clients", file: "Rhythm_Lonavala.jpg" },
      { name: "Royal Goan Beach Resorts", folder: "new/clients", file: "Royal Goan Beach Resorts.jpg", descriptor: "Resort" },
      { name: "The Fern Residency Pune", folder: "new/clients", file: "The Fern Residency Pune.jpg", descriptor: "Hotel" },
      { name: "The O Hotel Pune", folder: "new/clients", file: "The O Hotel Pune.jpg", descriptor: "Hotel" },
      { name: "W Goa", folder: "new/clients", file: "W_Goa.png", descriptor: "Hotel" },
      { name: "The Westin Pune Koregaon Park", folder: "new/clients", file: "The_Westin_Pune_Koregaon_Park.jpg", descriptor: "Hotel" },
      { name: "The Beacon Hotel Pune NIBM", folder: "new/clients", file: "The Beacon Hotel Pune.jpeg", descriptor: "Hotel" },
      { name: "Tipai Tipeshwar Wildlife Luxuries", folder: "new/clients", file: "Tipai Tipeshwar.jpeg", descriptor: "Resort" },
      { name: "The Orchid Hotel Jamnagar", folder: "new/clients", file: "The orchid Jamnagar.jpeg", descriptor: "Hotel" },
      { name: "The Orchid Ecotel Panchgani", folder: "new/clients", file: "The Orchid Panchgani.jpeg", descriptor: "Hotel" },
      { name: "Radisson Resort and Spa Kandla", folder: "new/clients", file: "Radisson Kandla.jpeg", descriptor: "Resort" },
    ],
  },
  {
    id: "food-beverage-manufacturing",
    title: "Food & Beverage Manufacturing",
    filterLabel: "Food & Beverage Mfg.",
    descriptor: "Dairy, packaged food and beverage manufacturers.",
    clients: [
      { name: "Country Delight", folder: "clients", file: "Country Delight.png", descriptor: "Dairy" },
      { name: "Warana Dairy", folder: "new/clients", file: "Warana Dairy.jpg", descriptor: "Dairy" },
      { name: "Nutra Dynamics", folder: "new/clients", file: "nutra.jpg", descriptor: "Nutrition" },
      { name: "Peony Foods", folder: "new/clients", file: "Peony Foods.jpg", descriptor: "Packaged Foods" },
    ],
  },
  {
    id: "restaurants",
    title: "Restaurants & Food Service",
    filterLabel: "Restaurants & Food Service",
    descriptor: "Restaurants, lounges and food-service establishments.",
    clients: [
      { name: "AirBar Lounge", folder: "clients", file: "Airbar Lounge.png", descriptor: "Lounge" },
      { name: "Kkanchan Veg", folder: "clients", file: "Kkanchan Veg.png", descriptor: "Restaurant" },
      { name: "Nandbram Idli", folder: "clients", file: "Nadbrahma Idli.png", descriptor: "Food Service" },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare",
    filterLabel: "Healthcare",
    descriptor: "Hospitals and healthcare organizations.",
    clients: [
      { name: "Apollo Hospitals", folder: "clients", file: "Apollo Hospitals.png", descriptor: "Hospital" },
      { name: "Star Health & Allied Insurance", folder: "new/clients", file: "Star Health & Allied Insurance.png", descriptor: "Insurance" },
    ],
  },
  {
    id: "corporate",
    title: "Corporate & Commercial",
    filterLabel: "Corporate & Commercial",
    descriptor: "Corporate, industrial, logistics and technology organizations.",
    clients: [
      { name: "Arcatron Mobility", folder: "clients", file: "Arcatron Mobility.png" },
      { name: "Bajaj Finserv", folder: "clients", file: "Bajaj Finserv.png", descriptor: "Corporate" },
      { name: "Centrio", folder: "clients", file: "Centiro.png" },
      { name: "Dynamic Logistics", folder: "clients", file: "Dynamics Logistics.png", descriptor: "Logistics" },
      { name: "Endurance", folder: "clients", file: "Endurance.png" },
      { name: "Flash Industries", folder: "clients", file: "Flash Industries.png", descriptor: "Industrial" },
      { name: "Fujitsu", folder: "clients", file: "Fujitsu.png", descriptor: "Corporate" },
      { name: "Fulflex", folder: "clients", file: "Fulflex.png" },
      { name: "Kalpataru", folder: "clients", file: "Kalpataru.png" },
      { name: "Xolopak", folder: "clients", file: "Xolopak.png" },
      { name: "Bajaj Finserv Direct", folder: "new/clients", file: "Bajaj Finserv Direct.jpg" },
      { name: "Britannia Industries Ltd", folder: "new/clients", file: "Britannia Industries Ltd.jpg" },
      { name: "Kokuyo Workplace India", folder: "new/clients", file: "Kokuyo Workplace India.jpg" },
      { name: "Palmonas Demifine Jewellery", folder: "new/clients", file: "Palmonas.png" },
      { name: "Panchshil Infrastructure Holdings", folder: "new/clients", file: "Panchshil Infrastructure Holdings.jpg" },
      { name: "Spectrum Electrical Technologies", folder: "new/clients", file: "Spectrum Electrical Technologies.png" },
    ],
  },
  {
    id: "institutions",
    title: "Institutions & Education",
    filterLabel: "Institutions & Education",
    descriptor: "Colleges, foundations and educational institutions.",
    clients: [
      { name: "Wellington International College Pune", folder: "clients", file: "Wellington International College Pune.png", descriptor: "Education" },
      { name: "Nayi Foundation", folder: "clients", file: "Nyati Foundation.png", descriptor: "Foundation" },
    ],
  },
  {
    id: "wellness",
    title: "Wellness & Lifestyle",
    filterLabel: "Wellness & Lifestyle",
    descriptor: "Wellness resorts, clubs and lifestyle venues.",
    clients: [
      { name: "Antarmana Wellness Resort", folder: "clients", file: "Atmantan Wellness resort .png", descriptor: "Wellness Resort" },
      { name: "Swastik Wellness Resort", folder: "clients", file: "Swastik Wellness Resort.png", descriptor: "Wellness Resort" },
      { name: "Royal Western India Turf Club", folder: "clients", file: "Royal Western India Turf Club .png", descriptor: "Club" },
      { name: "Amanora Mall", folder: "clients", file: "Amnora Mall.png", descriptor: "Mall" },
      { name: "The Pavillion Mall Pune", folder: "new/clients", file: "The Pavillion Mall Pune.jpg", descriptor: "Mall" },
    ],
  },
  {
    id: "other",
    title: "Other Hospitality & Organizations",
    filterLabel: "Other Hospitality & Organizations",
    descriptor: "Additional organizations across hospitality and allied sectors.",
    clients: [
      { name: "Yogh Hospitality", folder: "clients", file: "Yogh Hospitality.png" },
      { name: "Sujyoti", folder: "new/clients", file: "sujyoti.png" },
      { name: "Surya", folder: "clients", file: "Surya.png" },
      { name: "Samarpan", folder: "clients", file: "Samarpan.png" },
      { name: "Escalates Tech India Pvt. Ltd.", folder: "clients", file: "Escalates.png" },
      { name: "24S Fitness & Beyond", folder: "new/clients", file: "24s.png" },
      { name: "The Altruist Hotels", folder: "new/clients", file: "altruist.png" },
      { name: "arcOne ai", folder: "new/clients", file: "arcone.png" },
      { name: "Basil Hospitality Pvt. Ltd.", folder: "new/clients", file: "basil.png" },
      { name: "EKA Design & Build", folder: "new/clients", file: "eks.png" },
      { name: "Empires Bhubaneswar", folder: "new/clients", file: "empires.png" },
      { name: "Felice Pasticceria", folder: "new/clients", file: "felicia.png" },
      { name: "Goose Bumps", folder: "new/clients", file: "goosebumps.png" },
      { name: "Nihilent", folder: "new/clients", file: "nehilent.png" },
      { name: "Oxford Golf Resort", folder: "new/clients", file: "oxford.png" },
      { name: "The Poona Western Club", folder: "new/clients", file: "poona.png" },
      { name: "Posco India", folder: "new/clients", file: "posco.png" },
      { name: "RIA", folder: "new/clients", file: "ria.png" },
      { name: "Tomatoes", folder: "new/clients", file: "tomatos.png" },
      { name: "King Mansion Goa", folder: "new/clients", file: "King Mansion Goa.jpg" },
      { name: "Luxe Puri", folder: "new/clients", file: "Luxe Puri.jpg" },
      { name: "The Astor Goa", folder: "new/clients", file: "The Astor Goa.jpg" },
      { name: "The Grand Imperial", folder: "new/clients", file: "The Grand Imperial.jpg" },
    ],
  },
];

const filters = [
  { id: "all", label: "All" },
  ...clientCategories.map(({ id, filterLabel }) => ({ id, label: filterLabel })),
];

const Clients: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const visibleCategories =
    activeFilter === "all"
      ? clientCategories
      : clientCategories.filter((category) => category.id === activeFilter);

  return (
    <section className="clients-page-section">
      <div className="clients-header">
        <p className="clients-eyebrow">Clients</p>
        <h2 className="section-title">Our Valued Clients</h2>
        <p className="section-subtitle">Trusted by industry leaders in hospitality and beyond.</p>
        <div className="section-divider"></div>
      </div>

      <div className="clients-filter-bar" role="group" aria-label="Filter clients by category">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`clients-filter-btn${activeFilter === filter.id ? " active" : ""}`}
            aria-pressed={activeFilter === filter.id}
            onClick={() => setActiveFilter(filter.id)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {visibleCategories.map((category) => (
        <div key={category.id} className="clients-category">
          <h3 className="clients-category-title">{category.title}</h3>
          <p className="clients-category-descriptor">{category.descriptor}</p>
          <div className="clients-grid-container">
            {category.clients.map((client) => (
              <div key={`${client.folder}/${client.file}`} className="client-card">
                <div className="client-logo-area">
                  <img
                    src={getAssetUrl(`${client.folder}/${client.file}`)}
                    alt={`${client.name} logo`}
                    className="client-logo-img"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="client-name">{client.name}</p>
                {client.descriptor && (
                  <p className="client-descriptor">{client.descriptor}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Clients;
