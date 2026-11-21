# Stage 3 — Brand directory page

Redesign of `/products/brands` using the approved Stage 1 editorial foundation.
Principle: **Show more. Say less.**

## Page hierarchy

1. **Hero** — breadcrumbs, one eyebrow, one headline, one support line. No
   statistics and no decorative imagery.
2. **Brands with product catalogues.** — exactly Kärcher, Tramontina and Dolphy,
   with the live product count (20 / 19 / 12) read from
   `getFeaturedCatalogue()`. Each tile links to its collection route.
3. **All brands.** — a compact toolbar (search, category filters, live count,
   inline reset) above 34 logo-led cards. A card shows the brand mark, brand
   name, source category and an arrow. No descriptions.
4. **Pending classification** — a single collapsed disclosure containing the
   nine records that are still unclassified. Closed by default.
5. **Enquiry** — one message and the existing `Request a Quote` plus WhatsApp
   actions.

## Data integrity

- 34 confirmed brands come from `brandDirectory.brands`; the nine pending
  records come from `brandDirectory.pendingRecords`. Nothing is hard-coded in
  the view.
- Category IDs remain the URL contract: `kitchen`, `fnb`, `hk`, `laundry`,
  `guest`, `cold`.
- `Kärcher` is a presentation-only spelling (`brand.id === "karcher"`); the data
  layer keeps `Karcher`.
- Search is diacritic-insensitive (`normalize("NFKD")`), so `karcher` matches
  `Kärcher`.

## Validation

- `npx tsc -b` — pass
- `npm run lint` — 0 errors (3 pre-existing warnings)
- `npm run build` — pass
- Live audit at 1440, 1024, 768, 390 and 320 px: 34 cards, 3 catalogue tiles,
  7 filters, 9 pending records, no document-level horizontal overflow.
- Search (`karcher` → 1 card), category filter (`Laundry` → 1 card), reset and
  the brand preview dialog verified in a live browser.
- All brand logo files decode; no missing `alt` text, duplicate IDs or console
  errors.

## Screenshots

- `brands-1440.png`, `brands-1024.png`, `brands-768.png`, `brands-390.png`,
  `brands-320.png` — full page at five widths.
- `brands-search-1440.png` — search for `karcher`.
- `brands-filter-1440.png` — `Laundry` filter applied.
- `brands-preview-1440.png` — brand preview dialog.

Full-page captures are stitched from viewport slices; the fixed navbar is
hidden after the first slice so it appears once.
