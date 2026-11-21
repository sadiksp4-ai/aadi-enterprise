/**
 * Featured product catalogue (Stage 3).
 *
 * Source of truth: `product-extraction/approved-image-mapping.json`.
 * Only records carrying `status: "approved"` and `publicationReady: true` are
 * reproduced here — 51 in total (Karcher 20, Tramontina 19, Dolphy 12).
 *
 * Deliberately absent:
 * - pricing, margin, GST, stock or availability data of any kind;
 * - descriptions and technical specifications, because none are verified in the
 *   source. Nothing is inferred, so the detail view omits those blocks.
 *
 * `catalogueCategory` / `catalogueType` are the workbook's own classification
 * strings, copied unchanged for the Kärcher (class) and Dolphy (type) records.
 *
 * `imagePath` is the exact, case-sensitive public URL recorded in the manifest.
 * Folders are `public/products/karcher`, `.../Tramontina` and `.../Dolphy`;
 * the casing is intentional and must not be normalised.
 */

export type FeaturedBrandId = "karcher" | "tramontina" | "dolphy";

/** A single publication-ready product. No commercial fields by design. */
export interface FeaturedProduct {
  /** Stable key: `${brandId}:${model}`. */
  readonly id: string;
  readonly brandId: FeaturedBrandId;
  readonly name: string;
  readonly model: string;
  /** Stable category key, resolved against the brand's category list. */
  readonly categoryId: string;
  /** Exact public image URL from the approved manifest. */
  readonly imagePath: string;
  /** Unique within the brand; reserved for future detail routes. */
  readonly slug: string;
  /** Workbook classification, when the source records one. */
  readonly catalogueCategory?: string;
  /** Workbook type/sub-category, when the source records one. */
  readonly catalogueType?: string;
}

export interface FeaturedCategory {
  readonly id: string;
  readonly label: string;
}

export interface FeaturedBrandCatalogue {
  readonly brandId: FeaturedBrandId;
  readonly categories: readonly FeaturedCategory[];
  readonly products: readonly FeaturedProduct[];
}

/** Only brands with verified, publication-ready products appear here. */
export const FEATURED_CATALOGUE: readonly FeaturedBrandCatalogue[] = [
  {
    brandId: "karcher",
    categories: [
      { id: "pressure-washers", label: "Pressure washers" },
      { id: "vacuum-cleaners", label: "Vacuum cleaners" },
      { id: "carpet-extractors", label: "Carpet extractors" },
      { id: "steam-cleaners", label: "Steam cleaners" },
      { id: "floor-scrubbers", label: "Floor scrubbers" },
      { id: "sweepers", label: "Sweepers" },
      { id: "cleaning-robots", label: "Cleaning robots" },
    ],
    products: [
      {
        id: "karcher:1.520-900.0",
        brandId: "karcher",
        name: "HD 5/12 C",
        model: "1.520-900.0",
        categoryId: "pressure-washers",
        imagePath: "/products/karcher/karcher-1-520-900-0-hd-5-12-c.jpg",
        slug: "hd-5-12-c-1-520-900-0",
        catalogueCategory: "HD - Compact Class",
        catalogueType: "High Pressure Cleaners",
      },
      {
        id: "karcher:1.524-970.0",
        brandId: "karcher",
        name: "HD 8/18-4M",
        model: "1.524-970.0",
        categoryId: "pressure-washers",
        imagePath: "/products/karcher/karcher-1-524-970-0-hd-8-18-4m.jpg",
        slug: "hd-8-18-4m-1-524-970-0",
        catalogueCategory: "HD - Middle Class",
        catalogueType: "High Pressure Cleaners",
      },
      {
        id: "karcher:1.286-954.0",
        brandId: "karcher",
        name: "HD 10/25-4 S",
        model: "1.286-954.0",
        categoryId: "pressure-washers",
        imagePath: "/products/karcher/karcher-1-286-954-0-hd-10-25-4-s-i.jpg",
        slug: "hd-10-25-4-s-1-286-954-0",
        catalogueCategory: "HD - Super Class",
        catalogueType: "High Pressure Cleaners",
      },
      {
        id: "karcher:1.520-204.0",
        brandId: "karcher",
        name: "HD 5/11 Cage",
        model: "1.520-204.0",
        categoryId: "pressure-washers",
        imagePath: "/products/karcher/karcher-1-520-204-0-hd-5-11-cage.jpg",
        slug: "hd-5-11-cage-1-520-204-0",
        catalogueCategory: "HD - Special Class",
        catalogueType: "High Pressure Cleaners",
      },
      {
        id: "karcher:1.071-939.0",
        brandId: "karcher",
        name: "HDS 10/21-4 M",
        model: "1.071-939.0",
        categoryId: "pressure-washers",
        imagePath: "/products/karcher/karcher-1-071-939-0-hds-10-21-4-m-i.jpg",
        slug: "hds-10-21-4-m-1-071-939-0",
        catalogueCategory: "HDS - Middle Class",
        catalogueType: "Hot Water High Pressure Cleaners",
      },
      {
        id: "karcher:1.033-336.0",
        brandId: "karcher",
        name: "CV 38/2 Adv",
        model: "1.033-336.0",
        categoryId: "vacuum-cleaners",
        imagePath: "/products/karcher/karcher-1-033-336-0-cv-38-2-adv.jpg",
        slug: "cv-38-2-adv-1-033-336-0",
        catalogueCategory: "Upright brush-type vacuum cleaners",
        catalogueType: "Dry Vacuum Cleaners",
      },
      {
        id: "karcher:1.394-274.0",
        brandId: "karcher",
        name: "BVL 5/1 Bp",
        model: "1.394-274.0",
        categoryId: "vacuum-cleaners",
        imagePath: "/products/karcher/karcher-1-394-274-0-bvl-5-1-bp.jpg",
        slug: "bvl-5-1-bp-1-394-274-0",
        catalogueCategory: "Battery powered dry vacuum cleaner",
        catalogueType: "Battery Vacuum Cleaners",
      },
      {
        id: "karcher:1.527-205.0",
        brandId: "karcher",
        name: "T 11/1 Classic HEPA Re!Plast",
        model: "1.527-205.0",
        categoryId: "vacuum-cleaners",
        imagePath: "/products/karcher/karcher-1-527-205-0-t-11-1-classic-hepa-re-plast.jpg",
        slug: "t-11-1-classic-hepa-re-plast-1-527-205-0",
        catalogueCategory: "Dry Vacuum Cleaner",
        catalogueType: "Dry Vacuum Cleaners",
      },
      {
        id: "karcher:1.378-600.0",
        brandId: "karcher",
        name: "NT 22/1 Ap L",
        model: "1.378-600.0",
        categoryId: "vacuum-cleaners",
        imagePath: "/products/karcher/karcher-1-378-600-0-nt-22-1-ap-l.jpg",
        slug: "nt-22-1-ap-l-1-378-600-0",
        catalogueCategory: "Wet and Dry Vacuum Cleaner",
        catalogueType: "Wet & Dry Vacuum Cleaners",
      },
      {
        id: "karcher:1.148-321.0",
        brandId: "karcher",
        name: "NT 40/1 Ap L",
        model: "1.148-321.0",
        categoryId: "vacuum-cleaners",
        imagePath: "/products/karcher/karcher-1-148-321-0-nt-40-1-ap-l.jpg",
        slug: "nt-40-1-ap-l-1-148-321-0",
        catalogueCategory: "Wet and Dry Vacuum Cleaner",
        catalogueType: "Wet & Dry Vacuum Cleaners",
      },
      {
        id: "karcher:1.667-288.0",
        brandId: "karcher",
        name: "NT 75/2 Tact² Me",
        model: "1.667-288.0",
        categoryId: "vacuum-cleaners",
        imagePath: "/products/karcher/karcher-1-667-288-0-nt-75-2-tact-me.jpg",
        slug: "nt-75-2-tact2-me-1-667-288-0",
        catalogueCategory: "Wet and Dry Vacuum Cleaner",
        catalogueType: "Wet & Dry Vacuum Cleaners",
      },
      {
        id: "karcher:1.100-240.0",
        brandId: "karcher",
        name: "Puzzi 8/1",
        model: "1.100-240.0",
        categoryId: "carpet-extractors",
        imagePath: "/products/karcher/karcher-1-100-240-0-puzzi-8-1.jpg",
        slug: "puzzi-8-1-1-100-240-0",
        catalogueCategory: "Spray Extraction",
        catalogueType: "Spray Extraction Cleaners",
      },
      {
        id: "karcher:1.100-130.0",
        brandId: "karcher",
        name: "Puzzi 10/1",
        model: "1.100-130.0",
        categoryId: "carpet-extractors",
        imagePath: "/products/karcher/karcher-1-100-130-0-puzzi-10-1.jpg",
        slug: "puzzi-10-1-1-100-130-0",
        catalogueCategory: "Spray Extraction",
        catalogueType: "Spray Extraction Cleaners",
      },
      {
        id: "karcher:1.092-104.0",
        brandId: "karcher",
        name: "SG 4/4",
        model: "1.092-104.0",
        categoryId: "steam-cleaners",
        imagePath: "/products/karcher/karcher-1-092-104-0-sg-4-4.jpg",
        slug: "sg-4-4-1-092-104-0",
        catalogueCategory: "Steam cleaners",
        catalogueType: "Steam Cleaners",
      },
      {
        id: "karcher:1.291-261.0",
        brandId: "karcher",
        name: "BDS 43/165 C Classic",
        model: "1.291-261.0",
        categoryId: "floor-scrubbers",
        imagePath: "/products/karcher/karcher-1-291-261-0-bds-43-165-c-classic.jpg",
        slug: "bds-43-165-c-classic-1-291-261-0",
        catalogueCategory: "FC - Single-disc machines",
        catalogueType: "Single Disc Machines",
      },
      {
        id: "karcher:1.783-220.0",
        brandId: "karcher",
        name: "BR 30/4",
        model: "1.783-220.0",
        categoryId: "floor-scrubbers",
        imagePath: "/products/karcher/karcher-1-783-220-0-br-30-4.jpg",
        slug: "br-30-4-1-783-220-0",
        catalogueCategory: "FC - Walk-behind scrubber drier",
        catalogueType: "Walk-behind Scrubber Driers",
      },
      {
        id: "karcher:1.127-025.0",
        brandId: "karcher",
        name: "BD 50/50 C Bp Classic",
        model: "1.127-025.0",
        categoryId: "floor-scrubbers",
        imagePath: "/products/karcher/karcher-1-127-025-0-bd-50-50-c-bp-classi.jpg",
        slug: "bd-50-50-c-bp-classic-1-127-025-0",
        catalogueCategory: "FC - Walk-behind scrubber drier",
        catalogueType: "Walk-behind Scrubber Driers",
      },
      {
        id: "karcher:1.246-041.0",
        brandId: "karcher",
        name: "BD 90/160 R",
        model: "1.246-041.0",
        categoryId: "floor-scrubbers",
        imagePath: "/products/karcher/karcher-1-246-041-0-bd-90-160-r.jpg",
        slug: "bd-90-160-r-1-246-041-0",
        catalogueCategory: "FC - Ride-on scrubber driers",
        catalogueType: "Ride-on Scrubber Driers",
      },
      {
        id: "karcher:1.517-130.0",
        brandId: "karcher",
        name: "KM 70/20 C",
        model: "1.517-130.0",
        categoryId: "sweepers",
        imagePath: "/products/karcher/karcher-1-517-130-0-km-70-20-c.jpg",
        slug: "km-70-20-c-1-517-130-0",
        catalogueCategory: "KM - Walk-behind sweepers",
        catalogueType: "Walk-behind Sweepers",
      },
      {
        id: "karcher:1.533-002.0",
        brandId: "karcher",
        name: "KIRA B 50",
        model: "1.533-002.0",
        categoryId: "cleaning-robots",
        imagePath: "/products/karcher/karcher-1-533-002-0-kira-b-50.jpg",
        slug: "kira-b-50-1-533-002-0",
        catalogueCategory: "Cleaning Robots",
        catalogueType: "Cleaning Robots",
      },
    ],
  },
  {
    brandId: "tramontina",
    categories: [
      { id: "titanex", label: "Titanex cast iron" },
      { id: "heritage", label: "Heritage iron cookware" },
      { id: "aeion", label: "Aeion cookware" },
      { id: "fusao", label: "Fusao cookware" },
      { id: "century", label: "Century professional knives" },
    ],
    products: [
      {
        id: "tramontina:98052000",
        brandId: "tramontina",
        name: "Titanex Cast Iron Frypan 20 cm",
        model: "98052000",
        categoryId: "titanex",
        imagePath: "/products/Tramontina/tramontina-98052000-titanex-cast-iron-frypan-20-cm.webp",
        slug: "titanex-cast-iron-frypan-20-cm-98052000",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98052004",
        brandId: "tramontina",
        name: "Titanex Cast Iron Deep Kadai 24 cm",
        model: "98052004",
        categoryId: "titanex",
        imagePath: "/products/Tramontina/tramontina-98052004-titanex-cast-iron-deep-kadai-24-cm.webp",
        slug: "titanex-cast-iron-deep-kadai-24-cm-98052004",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98052012",
        brandId: "tramontina",
        name: "Titanex Cast Iron Casserole 24 cm",
        model: "98052012",
        categoryId: "titanex",
        imagePath: "/products/Tramontina/tramontina-98052012-titanex-cast-iron-casserole-24-cm.webp",
        slug: "titanex-cast-iron-casserole-24-cm-98052012",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98052014",
        brandId: "tramontina",
        name: "Titanex Cast Iron Grill Pan 27 cm",
        model: "98052014",
        categoryId: "titanex",
        imagePath: "/products/Tramontina/tramontina-98052014-titanex-cast-iron-grill-pan-27-cm.webp",
        slug: "titanex-cast-iron-grill-pan-27-cm-98052014",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98052007",
        brandId: "tramontina",
        name: "Titanex Cast Iron Dosa Tawa 24 cm",
        model: "98052007",
        categoryId: "titanex",
        imagePath: "/products/Tramontina/tramontina-98052007-titanex-cast-iron-dosa-tawa-24-cm.webp",
        slug: "titanex-cast-iron-dosa-tawa-24-cm-98052007",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98052013",
        brandId: "tramontina",
        name: "Titanex Cast Iron Paniyarakkal 26 cm",
        model: "98052013",
        categoryId: "titanex",
        imagePath: "/products/Tramontina/tramontina-98052013-titanex-cast-iron-paniyarakkal-26-cm.webp",
        slug: "titanex-cast-iron-paniyarakkal-26-cm-98052013",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98052050",
        brandId: "tramontina",
        name: "Heritage Iron Fry Pan 26 cm",
        model: "98052050",
        categoryId: "heritage",
        imagePath: "/products/Tramontina/tramontina-98052050-heritage-iron-fry-pan-26-cm.webp",
        slug: "heritage-iron-fry-pan-26-cm-98052050",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98052051",
        brandId: "tramontina",
        name: "Heritage Iron Roti Tawa 24 cm",
        model: "98052051",
        categoryId: "heritage",
        imagePath: "/products/Tramontina/tramontina-98052051-heritage-iron-roti-tawa-24-cm.webp",
        slug: "heritage-iron-roti-tawa-24-cm-98052051",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98052054",
        brandId: "tramontina",
        name: "Heritage Iron Dosa Tawa 28 cm",
        model: "98052054",
        categoryId: "heritage",
        imagePath: "/products/Tramontina/tramontina-98052054-heritage-iron-dosa-tawa-28-cm.webp",
        slug: "heritage-iron-dosa-tawa-28-cm-98052054",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98052058",
        brandId: "tramontina",
        name: "Heritage Iron Kadai with Lid 24 cm",
        model: "98052058",
        categoryId: "heritage",
        imagePath: "/products/Tramontina/tramontina-98052058-heritage-iron-kadai-with-lid-24-cm.jpg",
        slug: "heritage-iron-kadai-with-lid-24-cm-98052058",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98052060",
        brandId: "tramontina",
        name: "Heritage Iron Wok 30 cm",
        model: "98052060",
        categoryId: "heritage",
        imagePath: "/products/Tramontina/tramontina-98052060-heritage-iron-wok-30-cm.webp",
        slug: "heritage-iron-wok-30-cm-98052060",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98050000",
        brandId: "tramontina",
        name: "Aeion Triply Clad 20 cm Fry Pan with SS Lid",
        model: "98050000",
        categoryId: "aeion",
        imagePath: "/products/Tramontina/tramontina-98050000-aeion-triply-clad-20cm-fry-pan-with-ss-lid.webp",
        slug: "aeion-triply-clad-20-cm-fry-pan-with-ss-lid-98050000",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98050008",
        brandId: "tramontina",
        name: "Aeion Triply Clad 24 cm Casserole with SS Lid",
        model: "98050008",
        categoryId: "aeion",
        imagePath: "/products/Tramontina/tramontina-98050008-aeion-triply-clad-24cm-casserole-with-ss-lid.jpg",
        slug: "aeion-triply-clad-24-cm-casserole-with-ss-lid-98050008",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98050013",
        brandId: "tramontina",
        name: "Aeion Triply Clad 30 cm Kadai with SS Lid",
        model: "98050013",
        categoryId: "aeion",
        imagePath: "/products/Tramontina/tramontina-98050013-aeion-triply-clad-30cm-kadai-with-ss-lid.webp",
        slug: "aeion-triply-clad-30-cm-kadai-with-ss-lid-98050013",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98051029",
        brandId: "tramontina",
        name: "Fusao EX+ Triply Ceramic 20 cm Fry Pan with SS Lid",
        model: "98051029",
        categoryId: "fusao",
        imagePath: "/products/Tramontina/tramontina-98051029-fusao-ex-triply-ceramic-20cm-fry-pan-with-ss-lid.webp",
        slug: "fusao-ex-triply-ceramic-20-cm-fry-pan-with-ss-lid-98051029",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98051042",
        brandId: "tramontina",
        name: "Fusao EX+ Triply Ceramic 20 cm Deep Kadai with SS Lid",
        model: "98051042",
        categoryId: "fusao",
        imagePath: "/products/Tramontina/tramontina-98051042-fusao-ex-triply-ceramic-20cm-deep-kadai-with-ss-.webp",
        slug: "fusao-ex-triply-ceramic-20-cm-deep-kadai-with-ss-lid-98051042",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:98051027",
        brandId: "tramontina",
        name: "Fusao EX+ Triply Ceramic 30 cm Dosa Tawa",
        model: "98051027",
        categoryId: "fusao",
        imagePath: "/products/Tramontina/tramontina-98051027-fusao-ex-triply-ceramic-30-cm-dosa-tawa-4-0mm-th.jpg",
        slug: "fusao-ex-triply-ceramic-30-cm-dosa-tawa-98051027",
        catalogueCategory: "Cookware",
      },
      {
        id: "tramontina:24011106",
        brandId: "tramontina",
        name: "Century Chefs Knife 15 cm",
        model: "24011106",
        categoryId: "century",
        imagePath: "/products/Tramontina/tramontina-24011106-century-chefs-knife-15-cm-6in-black.jpg",
        slug: "century-chefs-knife-15-cm-24011106",
        catalogueCategory: "Commercial & Horeca",
      },
      {
        id: "tramontina:24020107",
        brandId: "tramontina",
        name: "Century Santoku Knife 17 cm",
        model: "24020107",
        categoryId: "century",
        imagePath: "/products/Tramontina/tramontina-24020107-century-santoku-knife-17-cm-7in-black.webp",
        slug: "century-santoku-knife-17-cm-24020107",
        catalogueCategory: "Commercial & Horeca",
      },
    ],
  },
  {
    brandId: "dolphy",
    categories: [
      { id: "hotel-locks", label: "Hotel locks & security" },
      { id: "hair-dryers", label: "Hair dryers" },
      { id: "soap-dispensers", label: "Soap dispensers & hygiene" },
      { id: "clocks-docking", label: "Table clocks & docking" },
      { id: "tissue-dispensers", label: "Tissue dispensers" },
    ],
    products: [
      {
        id: "dolphy:DHDL0001-S",
        brandId: "dolphy",
        name: "Matt Finish Silver Hotel RFID Door Lock",
        model: "DHDL0001-S",
        categoryId: "hotel-locks",
        imagePath: "/products/Dolphy/dolphy-dhdl0001-s-matt-finish-silver-hotel-rfid-door-lock.jpg",
        slug: "matt-finish-silver-hotel-rfid-door-lock-dhdl0001-s",
        catalogueCategory: "Hotel Locks & Security",
        catalogueType: "RFID Door Locks",
      },
      {
        id: "dolphy:DHDL0006",
        brandId: "dolphy",
        name: "Handset Wireless Portable Programmer",
        model: "DHDL0006",
        categoryId: "hotel-locks",
        imagePath: "/products/Dolphy/dolphy-dhdl0006-handset-wireless-portable-programmer.jpg",
        slug: "handset-wireless-portable-programmer-dhdl0006",
        catalogueCategory: "Hotel Locks & Security",
        catalogueType: "Encoders & Programmers",
      },
      {
        id: "dolphy:DHDL0008",
        brandId: "dolphy",
        name: "Lift Reader",
        model: "DHDL0008",
        categoryId: "hotel-locks",
        imagePath: "/products/Dolphy/dolphy-dhdl0008-lift-reader.jpg",
        slug: "lift-reader-dhdl0008",
        catalogueCategory: "Hotel Locks & Security",
        catalogueType: "Access Control",
      },
      {
        id: "dolphy:DHDL0012",
        brandId: "dolphy",
        name: "USB Room Card Encoder Compact",
        model: "DHDL0012",
        categoryId: "hotel-locks",
        imagePath: "/products/Dolphy/dolphy-dhdl0012-usb-room-card-encoder-compact.jpg",
        slug: "usb-room-card-encoder-compact-dhdl0012",
        catalogueCategory: "Hotel Locks & Security",
        catalogueType: "Encoders & Programmers",
      },
      {
        id: "dolphy:DPHD0022",
        brandId: "dolphy",
        name: "1600W Unique Box Design Hair Dryer Ivory",
        model: "DPHD0022",
        categoryId: "hair-dryers",
        imagePath: "/products/Dolphy/dolphy-dphd0022-1600w-unique-box-design-hair-dryer-ivory.png",
        slug: "1600w-unique-box-design-hair-dryer-ivory-dphd0022",
        catalogueCategory: "Bathroom & Personal Care",
        catalogueType: "Hair Dryers",
      },
      {
        id: "dolphy:DPHD0025",
        brandId: "dolphy",
        name: "1800W High Power Professional Hair Dryer",
        model: "DPHD0025",
        categoryId: "hair-dryers",
        imagePath: "/products/Dolphy/dolphy-dphd0025-1800-w-high-power-professional-hair-dryer.jpg",
        slug: "1800w-high-power-professional-hair-dryer-dphd0025",
        catalogueCategory: "Bathroom & Personal Care",
        catalogueType: "Hair Dryers",
      },
      {
        id: "dolphy:DSDR0083",
        brandId: "dolphy",
        name: "PC Premium Soap Dispenser 200ML Grey",
        model: "DSDR0083",
        categoryId: "soap-dispensers",
        imagePath: "/products/Dolphy/dolphy-dsdr0083-pc-premium-soap-dispenser-200ml-grey.jpg",
        slug: "pc-premium-soap-dispenser-200ml-grey-dsdr0083",
        catalogueCategory: "Bathroom & Personal Care",
        catalogueType: "Soap Dispensers",
      },
      {
        id: "dolphy:DSDR0159",
        brandId: "dolphy",
        name: "Hotel Wall Mount Soap Dispenser 360ML White",
        model: "DSDR0159",
        categoryId: "soap-dispensers",
        imagePath: "/products/Dolphy/dolphy-dsdr0159-hotel-wall-mount-soap-dispenser-360ml-white.jpg",
        slug: "hotel-wall-mount-soap-dispenser-360ml-white-dsdr0159",
        catalogueCategory: "Bathroom & Personal Care",
        catalogueType: "Soap Dispensers",
      },
      {
        id: "dolphy:DSDR0149",
        brandId: "dolphy",
        name: "Wall Mounted Top Push Double Soap Dispenser",
        model: "DSDR0149",
        categoryId: "soap-dispensers",
        imagePath: "/products/Dolphy/dolphy-dsdr0149-wall-mounted-top-push-double-soap-dispenser.jpg",
        slug: "wall-mounted-top-push-double-soap-dispenser-dsdr0149",
        catalogueCategory: "Bathroom & Personal Care",
        catalogueType: "Soap Dispensers",
      },
      {
        id: "dolphy:DDSN0008",
        brandId: "dolphy",
        name: "Dock Station Alarm Clock FM Radio Type C USB Wireless",
        model: "DDSN0008",
        categoryId: "clocks-docking",
        imagePath: "/products/Dolphy/dolphy-ddsn0008-dock-station-alarm-clock-fm-radio-type-c-usb-wir.jpg",
        slug: "dock-station-alarm-clock-fm-radio-type-c-usb-wireless-ddsn0008",
        catalogueCategory: "Communication & Electronics",
        catalogueType: "Clock Radios & Docks",
      },
      {
        id: "dolphy:DDSN0001",
        brandId: "dolphy",
        name: "Dock Station With 5.5 Inch LED Display Black",
        model: "DDSN0001",
        categoryId: "clocks-docking",
        imagePath: "/products/Dolphy/dolphy-ddsn0001-dolphy-dock-station-with-5-5-inch-led-display-bl.jpg",
        slug: "dock-station-with-5-5-inch-led-display-black-ddsn0001",
        catalogueCategory: "Communication & Electronics",
        catalogueType: "Clock Radios & Docks",
      },
      {
        id: "dolphy:DPDR0023",
        brandId: "dolphy",
        name: "Black Table Top Paper Dispenser",
        model: "DPDR0023",
        categoryId: "tissue-dispensers",
        imagePath: "/products/Dolphy/dolphy-dpdr0023-black-table-top-paper-dispenser-255x130x66mm.jpg",
        slug: "black-table-top-paper-dispenser-dpdr0023",
        catalogueCategory: "Guestroom Amenities",
        catalogueType: "Tissue & Paper Dispensers",
      },
    ],
  },
];

/** Publication gate: the approved manifest must never silently change size. */
export const FEATURED_EXPECTED_COUNTS: Readonly<Record<FeaturedBrandId, number>> = {
  karcher: 20,
  tramontina: 19,
  dolphy: 12,
};

export const FEATURED_TOTAL = 51;

export function getFeaturedCatalogue(
  brandId: string | undefined
): FeaturedBrandCatalogue | undefined {
  if (!brandId) return undefined;
  return FEATURED_CATALOGUE.find((entry) => entry.brandId === brandId);
}

export function getFeaturedCategoryLabel(
  catalogue: FeaturedBrandCatalogue,
  categoryId: string
): string {
  return (
    catalogue.categories.find((category) => category.id === categoryId)?.label ??
    categoryId
  );
}

/* -------------------------------------------------------------------------
 * Structural validation — runs once at module load.
 *
 * A failure means the curated data and the manifest have drifted, which must
 * never ship quietly: it throws in development and reports loudly in
 * production builds instead of rendering a half-broken section.
 * ---------------------------------------------------------------------- */

function validateFeaturedCatalogue(): string[] {
  const issues: string[] = [];
  const brandIds = new Set<string>();
  const productIds = new Set<string>();

  for (const entry of FEATURED_CATALOGUE) {
    if (brandIds.has(entry.brandId)) {
      issues.push(`duplicate brand entry: ${entry.brandId}`);
    }
    brandIds.add(entry.brandId);

    const categoryIds = new Set<string>();
    for (const category of entry.categories) {
      if (categoryIds.has(category.id)) {
        issues.push(`duplicate category ${entry.brandId}/${category.id}`);
      }
      categoryIds.add(category.id);
      if (!category.label.trim()) {
        issues.push(`empty category label ${entry.brandId}/${category.id}`);
      }
    }

    const slugs = new Set<string>();
    const usedCategories = new Set<string>();

    for (const product of entry.products) {
      if (productIds.has(product.id)) {
        issues.push(`duplicate product id: ${product.id}`);
      }
      productIds.add(product.id);

      if (product.brandId !== entry.brandId) {
        issues.push(`brand mismatch: ${product.id} is listed under ${entry.brandId}`);
      }
      if (!product.name.trim()) issues.push(`empty name: ${product.id}`);
      if (!product.model.trim()) issues.push(`empty model: ${product.id}`);
      if (!slugPattern.test(product.slug)) {
        issues.push(`invalid slug: ${product.id} -> ${product.slug}`);
      }
      if (slugs.has(product.slug)) {
        issues.push(`duplicate slug in ${entry.brandId}: ${product.slug}`);
      }
      slugs.add(product.slug);

      if (!categoryIds.has(product.categoryId)) {
        issues.push(`unknown category ${product.categoryId} on ${product.id}`);
      }
      usedCategories.add(product.categoryId);

      if (!product.imagePath.startsWith(`/products/${IMAGE_FOLDER[entry.brandId]}/`)) {
        issues.push(`image outside brand folder: ${product.id} -> ${product.imagePath}`);
      }
      if (!/\.(jpg|jpeg|png|webp)$/i.test(product.imagePath)) {
        issues.push(`unexpected image extension: ${product.id}`);
      }
    }

    for (const categoryId of categoryIds) {
      if (!usedCategories.has(categoryId)) {
        issues.push(`category without products: ${entry.brandId}/${categoryId}`);
      }
    }

    const expected = FEATURED_EXPECTED_COUNTS[entry.brandId];
    if (entry.products.length !== expected) {
      issues.push(
        `${entry.brandId} count ${entry.products.length} does not match ${expected}`
      );
    }
  }

  for (const brandId of Object.keys(FEATURED_EXPECTED_COUNTS)) {
    if (!brandIds.has(brandId)) issues.push(`missing brand entry: ${brandId}`);
  }

  const actualTotal = FEATURED_CATALOGUE.reduce(
    (sum, entry) => sum + entry.products.length,
    0
  );
  if (actualTotal !== FEATURED_TOTAL) {
    issues.push(`total ${actualTotal} does not match ${FEATURED_TOTAL}`);
  }

  return issues;
}

/** Exact on-disk folder casing per brand — never normalised. */
const IMAGE_FOLDER: Readonly<Record<FeaturedBrandId, string>> = {
  karcher: "karcher",
  tramontina: "Tramontina",
  dolphy: "Dolphy",
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const FEATURED_CATALOGUE_ISSUES = validateFeaturedCatalogue();

if (FEATURED_CATALOGUE_ISSUES.length > 0) {
  const report = `Featured product catalogue is invalid:\n${FEATURED_CATALOGUE_ISSUES.join("\n")}`;
  if (import.meta.env.DEV) {
    throw new Error(report);
  }
  console.error(report);
}
