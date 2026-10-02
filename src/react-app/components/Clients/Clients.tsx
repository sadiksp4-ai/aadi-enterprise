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
 * - Retained separately (repo does not prove same property):
 *   All Marriott/Hyatt family properties (Fairfield, JW, Courtyard, Grand Hyatt,
 *   Hyatt, Hyatt Residency, W, Westin, Ritz, InterContinental) kept distinct.
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
      { name: "JW Marriott", folder: "clients", file: "JW Marriott.png", descriptor: "Hotel" },
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
      { name: "Escalates", folder: "clients", file: "Escalates.png" },
      { name: "Country Delight", folder: "clients", file: "Country Delight.png" },
      { name: "24s", folder: "new/clients", file: "24s.png" },
      { name: "altruist", folder: "new/clients", file: "altruist.png" },
      { name: "arcone", folder: "new/clients", file: "arcone.png" },
      { name: "basil", folder: "new/clients", file: "basil.png" },
      { name: "cosme", folder: "new/clients", file: "cosme.png" },
      { name: "eks", folder: "new/clients", file: "eks.png" },
      { name: "empires", folder: "new/clients", file: "empires.png" },
      { name: "es", folder: "new/clients", file: "es.png" },
      { name: "felicia", folder: "new/clients", file: "felicia.png" },
      { name: "goosebumps", folder: "new/clients", file: "goosebumps.png" },
      { name: "nehilent", folder: "new/clients", file: "nehilent.png" },
      { name: "nutra", folder: "new/clients", file: "nutra.jpg" },
      { name: "oxford", folder: "new/clients", file: "oxford.png" },
      { name: "poona", folder: "new/clients", file: "poona.png" },
      { name: "posco", folder: "new/clients", file: "posco.png" },
      { name: "ria", folder: "new/clients", file: "ria.png" },
      { name: "tomatos", folder: "new/clients", file: "tomatos.png" },
      { name: "wang", folder: "new/clients", file: "wang.png" },
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
          <div
            className={`clients-grid-container${
              category.clients.length <= 3 ? ` compact-${category.clients.length}` : ""
            }`}
          >
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
