/**
 * Curated brand -> range mapping (Stage 2A).
 *
 * `aadi-info.json` is the factual source of truth and is never rewritten.
 * This file adds only *classification*: which source record belongs to which
 * brand, and which records cannot yet be published as a brand/range.
 *
 * Evidence used for this curation
 * - The record copy in `aadi-info.json` (descriptions name the brand or state
 *   that the entry is a generic collection/service).
 * - The existing partner directory in `components/Partners/Partners.tsx`,
 *   which independently confirms named brand partners (Ariane, Utopia, NUDE,
 *   Shapes, T&G, M.Style, IPC, Icemake, Zafferano, …).
 *
 * Rules
 * - A manufacturer relationship is only asserted for `manufacturer` where the
 *   source/partner evidence states it; every other named partner stays a
 *   `brand` (identity confirmed, manufacturing not claimed).
 * - Generic product collections and services are NOT brands: they are listed
 *   under `CURATED_PENDING_RECORDS` and remain fully accessible through their
 *   catalogue record.
 * - `sourceIndex` is the record's position in `aadi-info.json`; every entry
 *   also carries `expectedSourceName` so a reordered/edited source fails
 *   loudly instead of silently mis-classifying a record.
 * - No product facts, descriptions, specifications or brand copy are invented
 *   here. Brand descriptions stay absent until verified text exists.
 */

import type { CatalogueBrandClassification } from "./catalogue.types";

export interface CuratedBrandDefinition {
  /** Stable internal identity. Never derived from a marketing headline. */
  readonly id: string;
  /** Explicit URL slug; display names may change without breaking links. */
  readonly slug: string;
  readonly displayName: string;
  readonly classification: CatalogueBrandClassification;
  readonly logo?: string;
  /** Only set when verified brand-level copy exists. */
  readonly description?: string;
  readonly notes?: string;
}

export interface CuratedRangeDefinition {
  readonly sourceIndex: number;
  readonly expectedSourceName: string;
  readonly brandId: string;
  /** Stable local identity, scoped by the parent brand. */
  readonly rangeId: string;
  readonly rangeName: string;
  readonly notes?: string;
}

export interface CuratedPendingRecordDefinition {
  readonly sourceIndex: number;
  readonly expectedSourceName: string;
  readonly candidateName: string;
  readonly classification: CatalogueBrandClassification;
  readonly reason: string;
}

/** Confirmed brand identities (34). */
export const CURATED_BRANDS: readonly CuratedBrandDefinition[] = [
  {
    id: "rational",
    slug: "rational",
    displayName: "Rational",
    classification: "brand",
    logo: "/brand-logos/rational.webp",
    notes:
      "Record copy describes the Rational Combi Oven; manufacturer status is not asserted here.",
  },
  {
    id: "winterhalter",
    slug: "winterhalter",
    displayName: "Winterhalter",
    classification: "manufacturer",
    logo: "/brand-logos/winterhalter.webp",
    notes:
      "Manufacturer brand per the approved classification guidance; partner directory confirms it.",
  },
  {
    id: "robot-coupe",
    slug: "robot-coupe",
    displayName: "Robot Coupe",
    classification: "brand",
    logo: "/brand-logos/robot-coupe.webp",
    notes: "Confirmed by the partner directory.",
  },
  {
    id: "tramontina",
    slug: "tramontina",
    displayName: "Tramontina",
    classification: "manufacturer",
    logo: "/brand-logos/tramontina.webp",
    notes: "Manufacturer brand per the approved classification guidance.",
  },
  {
    id: "atlantic-chef",
    slug: "atlantic-chef",
    displayName: "Atlantic Chef",
    classification: "brand",
    logo: "/brand-logos/atlantic-chef.webp",
    notes: "Record copy names Atlantic Chef as the knife brand.",
  },
  {
    id: "ariane",
    slug: "ariane",
    displayName: "Ariane",
    classification: "brand",
    logo: "/brand-logos/ariane.webp",
    notes:
      "Partner directory lists the brand as Ariane; the source record adds the Porcelain descriptor.",
  },
  {
    id: "schott-zwiesel",
    slug: "schott-zwiesel",
    displayName: "Schott Zwiesel",
    classification: "brand",
    logo: "/brand-logos/schott-zwiesel.webp",
    notes: "Confirmed by the partner directory.",
  },
  {
    id: "studio-william",
    slug: "studio-william",
    displayName: "Studio William",
    classification: "brand",
    logo: "/brand-logos/studio-william.webp",
    notes: "Confirmed by the partner directory.",
  },
  {
    id: "utopia",
    slug: "utopia",
    displayName: "Utopia",
    classification: "brand",
    logo: "/brand-logos/utopia.webp",
    notes:
      "Partner directory lists the brand as Utopia; the source record adds the Tableware descriptor.",
  },
  {
    id: "steelite",
    slug: "steelite",
    displayName: "Steelite",
    classification: "brand",
    logo: "/brand-logos/steelite.webp",
    notes: "Confirmed by the partner directory.",
  },
  {
    id: "serax",
    slug: "serax",
    displayName: "Serax",
    classification: "brand",
    logo: "/brand-logos/serax.webp",
    notes: "Confirmed by the partner directory.",
  },
  {
    id: "lsa-international",
    slug: "lsa-international",
    displayName: "LSA International",
    classification: "brand",
    logo: "/brand-logos/lsa-international.webp",
    notes: "Partner directory confirms LSA.",
  },
  {
    id: "pasabahce",
    slug: "pasabahce",
    displayName: "Pasabahce",
    classification: "brand",
    logo: "/brand-logos/pasabahce.webp",
    notes: "Confirmed by the partner directory.",
  },
  {
    id: "nude",
    slug: "nude",
    displayName: "NUDE",
    classification: "brand",
    logo: "/brand-logos/nude.webp",
    notes:
      "Partner directory lists Nude; the source record adds the Glassware descriptor.",
  },
  {
    id: "m-style",
    slug: "m-style",
    displayName: "M.Style",
    classification: "brand",
    logo: "/brand-logos/m-style.webp",
    notes: "Partner directory lists M.Style Japonais.",
  },
  {
    id: "figgjo",
    slug: "figgjo",
    displayName: "Figgjo",
    classification: "brand",
    logo: "/brand-logos/figgjo.webp",
  },
  {
    id: "artevo",
    slug: "artevo",
    displayName: "ArtEvo",
    classification: "brand",
    logo: "/brand-logos/artevo.webp",
    notes: "Partner directory lists Art Evo.",
  },
  {
    id: "luigi-bormioli",
    slug: "luigi-bormioli",
    displayName: "Luigi Bormioli",
    classification: "brand",
    logo: "/brand-logos/luigi-bormioli.webp",
  },
  {
    id: "t-and-g",
    slug: "t-and-g",
    displayName: "T&G",
    classification: "brand",
    logo: "/brand-logos/t-and-g.webp",
    notes: "Partner directory lists T&G (Bristol).",
  },
  {
    id: "shapes",
    slug: "shapes",
    displayName: "Shapes",
    classification: "brand",
    logo: "/brand-logos/shapes.webp",
    notes: "Confirmed by the partner directory as a food-service brand.",
  },
  {
    id: "bar-kraft",
    slug: "bar-kraft",
    displayName: "Bar Kraft",
    classification: "brand",
    logo: "/brand-logos/bar-kraft.webp",
    notes: "Record copy names Bar Kraft as the barware brand.",
  },
  {
    id: "kaapi-solutions",
    slug: "kaapi-solutions",
    displayName: "Kaapi Solutions",
    classification: "brand",
    logo: "/brand-logos/kaapi-solutions.webp",
    notes:
      "Record copy describes a coffee-equipment provider; the brand identity is confirmed, manufacturing is not asserted.",
  },
  {
    id: "cothas-coffee",
    slug: "cothas-coffee",
    displayName: "Cothas Coffee",
    classification: "brand",
    logo: "/brand-logos/cothas-coffee.webp",
    notes: "Confirmed by the partner directory.",
  },
  {
    id: "karcher",
    slug: "karcher",
    displayName: "Karcher",
    classification: "manufacturer",
    logo: "/brand-logos/karcher.webp",
    notes:
      "Manufacturer brand per the approved classification guidance; source spells it Karcher.",
  },
  {
    id: "ipc",
    slug: "ipc",
    displayName: "IPC",
    classification: "brand",
    logo: "/brand-logos/ipc.webp",
    notes: "Partner directory lists IPC Tennant.",
  },
  {
    id: "dolphy",
    slug: "dolphy",
    displayName: "Dolphy",
    classification: "brand",
    logo: "/brand-logos/dolphy.webp",
    notes: "Brand per the approved classification guidance.",
  },
  {
    id: "euronics",
    slug: "euronics",
    displayName: "Euronics",
    classification: "brand",
    logo: "/brand-logos/euronics.webp",
    notes:
      "Record copy describes Euronics as a washroom-automation brand; manufacturing is not asserted.",
  },
  {
    id: "vikan",
    slug: "vikan",
    displayName: "Vikan",
    classification: "brand",
    logo: "/brand-logos/vikan.webp",
    notes: "Confirmed by the partner directory.",
  },
  {
    id: "vileda-professional",
    slug: "vileda-professional",
    displayName: "Vileda Professional",
    classification: "brand",
    logo: "/brand-logos/vileda-professional.webp",
  },
  {
    id: "electrolux-professional",
    slug: "electrolux-professional",
    displayName: "Electrolux Professional",
    classification: "manufacturer",
    logo: "/brand-logos/electrolux-professional.webp",
    notes: "Source copy explicitly calls Electrolux a laundry equipment manufacturer.",
  },
  {
    id: "elanpro",
    slug: "elanpro",
    displayName: "Elanpro",
    classification: "brand",
    logo: "/brand-logos/elanpro.webp",
    notes: "Record copy names Elanpro as a hotel-refrigeration brand.",
  },
  {
    id: "jvd",
    slug: "jvd",
    displayName: "JVD",
    classification: "brand",
    logo: "/brand-logos/jvd.webp",
    notes: "Confirmed by the partner directory.",
  },
  {
    id: "zafferano",
    slug: "zafferano",
    displayName: "Zafferano",
    classification: "brand",
    logo: "/brand-logos/zafferano.webp",
    notes:
      "One brand with two verified ranges (Pina Pro, Poldina Pro). The brand-level logo comes from the existing partner assets; the two source records carry range imagery.",
  },
  {
    id: "ice-make",
    slug: "ice-make",
    displayName: "Ice Make",
    classification: "brand",
    logo: "/brand-logos/ice-make.webp",
    notes:
      "Refrigeration brand per the approved classification guidance; the partner directory lists it as Icemake.",
  },
];

/** Confirmed ranges (35), each backed by exactly one source record. */
export const CURATED_RANGES: readonly CuratedRangeDefinition[] = [
  {
    sourceIndex: 0,
    expectedSourceName: "Rational Combi Oven",
    brandId: "rational",
    rangeId: "combi-oven",
    rangeName: "Combi Oven",
    notes: "Descriptor taken from the source record name.",
  },
  {
    sourceIndex: 1,
    expectedSourceName: "Winterhalter Commercial Dishwashers",
    brandId: "winterhalter",
    rangeId: "commercial-dishwashers",
    rangeName: "Commercial Dishwashers",
  },
  {
    sourceIndex: 2,
    expectedSourceName: "Robot Coupe Food Preparation Equipment",
    brandId: "robot-coupe",
    rangeId: "food-preparation-equipment",
    rangeName: "Food Preparation Equipment",
  },
  {
    sourceIndex: 3,
    expectedSourceName: "Tramontina",
    brandId: "tramontina",
    rangeId: "tramontina",
    rangeName: "Tramontina",
  },
  {
    sourceIndex: 4,
    expectedSourceName: "Atlantic Chef - Professional Chef Knives",
    brandId: "atlantic-chef",
    rangeId: "professional-chef-knives",
    rangeName: "Professional Chef Knives",
  },
  {
    sourceIndex: 5,
    expectedSourceName: "Ariane Porcelain",
    brandId: "ariane",
    rangeId: "porcelain",
    rangeName: "Porcelain",
  },
  {
    sourceIndex: 6,
    expectedSourceName: "Schott Zwiesel",
    brandId: "schott-zwiesel",
    rangeId: "schott-zwiesel",
    rangeName: "Schott Zwiesel",
  },
  {
    sourceIndex: 7,
    expectedSourceName: "Studio William",
    brandId: "studio-william",
    rangeId: "studio-william",
    rangeName: "Studio William",
  },
  {
    sourceIndex: 8,
    expectedSourceName: "Utopia Tableware",
    brandId: "utopia",
    rangeId: "tableware",
    rangeName: "Tableware",
  },
  {
    sourceIndex: 9,
    expectedSourceName: "Steelite",
    brandId: "steelite",
    rangeId: "steelite",
    rangeName: "Steelite",
  },
  {
    sourceIndex: 10,
    expectedSourceName: "Serax",
    brandId: "serax",
    rangeId: "serax",
    rangeName: "Serax",
  },
  {
    sourceIndex: 11,
    expectedSourceName: "LSA International",
    brandId: "lsa-international",
    rangeId: "lsa-international",
    rangeName: "LSA International",
  },
  {
    sourceIndex: 12,
    expectedSourceName: "Pasabahce",
    brandId: "pasabahce",
    rangeId: "pasabahce",
    rangeName: "Pasabahce",
  },
  {
    sourceIndex: 13,
    expectedSourceName: "NUDE Glassware",
    brandId: "nude",
    rangeId: "glassware",
    rangeName: "Glassware",
  },
  {
    sourceIndex: 14,
    expectedSourceName: "M.Style",
    brandId: "m-style",
    rangeId: "m-style",
    rangeName: "M.Style",
  },
  {
    sourceIndex: 15,
    expectedSourceName: "Figgjo",
    brandId: "figgjo",
    rangeId: "figgjo",
    rangeName: "Figgjo",
  },
  {
    sourceIndex: 16,
    expectedSourceName: "ArtEvo",
    brandId: "artevo",
    rangeId: "artevo",
    rangeName: "ArtEvo",
  },
  {
    sourceIndex: 17,
    expectedSourceName: "Luigi Bormioli",
    brandId: "luigi-bormioli",
    rangeId: "luigi-bormioli",
    rangeName: "Luigi Bormioli",
  },
  {
    sourceIndex: 18,
    expectedSourceName: "T&G",
    brandId: "t-and-g",
    rangeId: "t-and-g",
    rangeName: "T&G",
  },
  {
    sourceIndex: 19,
    expectedSourceName: "Shapes",
    brandId: "shapes",
    rangeId: "shapes",
    rangeName: "Shapes",
  },
  {
    sourceIndex: 20,
    expectedSourceName: "Bar Kraft",
    brandId: "bar-kraft",
    rangeId: "bar-kraft",
    rangeName: "Bar Kraft",
  },
  {
    sourceIndex: 21,
    expectedSourceName: "Kaapi Solutions",
    brandId: "kaapi-solutions",
    rangeId: "kaapi-solutions",
    rangeName: "Kaapi Solutions",
  },
  {
    sourceIndex: 22,
    expectedSourceName: "Cothas Coffee",
    brandId: "cothas-coffee",
    rangeId: "cothas-coffee",
    rangeName: "Cothas Coffee",
  },
  {
    sourceIndex: 25,
    expectedSourceName: "Karcher",
    brandId: "karcher",
    rangeId: "karcher",
    rangeName: "Karcher",
  },
  {
    sourceIndex: 26,
    expectedSourceName: "IPC",
    brandId: "ipc",
    rangeId: "ipc",
    rangeName: "IPC",
  },
  {
    sourceIndex: 29,
    expectedSourceName: "Dolphy",
    brandId: "dolphy",
    rangeId: "dolphy",
    rangeName: "Dolphy",
  },
  {
    sourceIndex: 30,
    expectedSourceName: "Euronics",
    brandId: "euronics",
    rangeId: "euronics",
    rangeName: "Euronics",
  },
  {
    sourceIndex: 31,
    expectedSourceName: "Vikan",
    brandId: "vikan",
    rangeId: "vikan",
    rangeName: "Vikan",
  },
  {
    sourceIndex: 32,
    expectedSourceName: "Vileda Professional",
    brandId: "vileda-professional",
    rangeId: "vileda-professional",
    rangeName: "Vileda Professional",
  },
  {
    sourceIndex: 37,
    expectedSourceName: "Electrolux Professional",
    brandId: "electrolux-professional",
    rangeId: "electrolux-professional",
    rangeName: "Electrolux Professional",
  },
  {
    sourceIndex: 38,
    expectedSourceName: "Elanpro",
    brandId: "elanpro",
    rangeId: "elanpro",
    rangeName: "Elanpro",
  },
  {
    sourceIndex: 39,
    expectedSourceName: "JVD",
    brandId: "jvd",
    rangeId: "jvd",
    rangeName: "JVD",
  },
  {
    sourceIndex: 40,
    expectedSourceName: "Zafferano",
    brandId: "zafferano",
    rangeId: "pina-pro",
    rangeName: "Pina Pro",
    notes: "Range identity comes from the curated mapping, not the marketing headline.",
  },
  {
    sourceIndex: 41,
    expectedSourceName: "Zafferano",
    brandId: "zafferano",
    rangeId: "poldina-pro",
    rangeName: "Poldina Pro",
    notes: "Range identity comes from the curated mapping, not the marketing headline.",
  },
  {
    sourceIndex: 42,
    expectedSourceName: "Ice Make",
    brandId: "ice-make",
    rangeId: "ice-make",
    rangeName: "Ice Make",
  },
];

/**
 * Records that are not published as brands yet (9).
 * The catalogue record remains fully accessible; only classification is
 * withheld pending verification or content authoring.
 */
export const CURATED_PENDING_RECORDS: readonly CuratedPendingRecordDefinition[] =
  [
    {
      sourceIndex: 23,
      expectedSourceName: "Wooden Salad Bowls, Plates & Buffet Display",
      candidateName: "Wooden Salad Bowls, Plates & Buffet Display",
      classification: "product-collection",
      reason:
        "Descriptive product collection with no manufacturer or brand name in the source; cannot be published as a brand.",
    },
    {
      sourceIndex: 24,
      expectedSourceName: "Acrylic Serving & Buffet Display Systems",
      candidateName: "Acrylic Serving & Buffet Display Systems",
      classification: "product-collection",
      reason:
        "Descriptive product collection with no manufacturer or brand name in the source; cannot be published as a brand.",
    },
    {
      sourceIndex: 27,
      expectedSourceName: "Housekeeping & Utility Trolleys",
      candidateName: "Housekeeping & Utility Trolleys",
      classification: "product-collection",
      reason:
        "Generic equipment category (the copy references compatible vendors rather than a brand).",
    },
    {
      sourceIndex: 28,
      expectedSourceName: "Waste Management Solutions",
      candidateName: "Waste Management Solutions",
      classification: "service",
      reason:
        "Service/system offering described in Aadi's own voice; no brand or manufacturer is identified.",
    },
    {
      sourceIndex: 33,
      expectedSourceName: "Saraya / Mystair",
      candidateName: "Saraya / Mystair",
      classification: "unverified",
      reason:
        "One record names two hygiene brands (Saraya and Mystair); the brand/range split needs verification before either is published as a confirmed brand.",
    },
    {
      sourceIndex: 34,
      expectedSourceName: "Commercial Laundry Machines",
      candidateName: "Commercial Laundry Machines",
      classification: "product-collection",
      reason:
        "Generic equipment category supplied from multiple OEMs; no single brand is identified.",
    },
    {
      sourceIndex: 35,
      expectedSourceName: "Laundry Layout Planning & Execution",
      candidateName: "Laundry Layout Planning & Execution",
      classification: "service",
      reason:
        "Aadi service offering (planning, installation, AMC), not a brand or product range.",
    },
    {
      sourceIndex: 36,
      expectedSourceName: "Laundry Accessories",
      candidateName: "Laundry Accessories",
      classification: "product-collection",
      reason:
        "Generic accessory category compatible with multiple machine brands; no brand is identified.",
    },
    {
      sourceIndex: 43,
      expectedSourceName: "Luxury Leather Collection",
      candidateName: "Luxury Leather Collection",
      classification: "product-collection",
      reason:
        "Aadi's own curated leather collection with no manufacturer or brand name in the source.",
    },
  ];
