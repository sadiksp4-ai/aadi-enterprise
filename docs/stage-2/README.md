# Stage 2 — Products discovery page

Redesign of `/products` using the approved Stage 1 editorial foundation.
Principle: **Show more. Say less.**

## Page hierarchy

1. **Hero** — one headline, one support line, one existing project image, and a
   secondary search field. No statistics.
2. **Explore our collections.** — exactly Kärcher, Tramontina and Dolphy.
   Product image, brand name, live product count (20 / 19 / 12) and an
   `Explore catalogue` action. The whole tile is a link to
   `/products/brand/{karcher|tramontina|dolphy}`.
3. **Explore by category.** — the six existing categories as large image-led
   tiles with short labels and counts. Selecting a tile applies `?group=` and
   reveals the matching catalogue records. Cold chain uses a typographic
   snowflake tile because no approved photograph exists.
4. **Full catalogue** — a compact disclosure below the categories. It contains
   the complete 44-record catalogue, category tabs, brand combobox, search
   chips, reset controls and the existing detail dialog. It opens automatically
   for a `?group=` deep link, a hero search or a category tile.
5. **Trusted brands. Thoughtfully sourced.** — twelve logo plates and one link
   to `/products/brands`. No repeated brand descriptions.
6. **Enquiry** — one message and a primary `Request a Quote` action, with the
   existing WhatsApp enquiry as the secondary action.

## Data integrity

- All 44 records (`brandDirectory.ranges` + `pendingRecords`) remain searchable
  and filterable through the disclosure.
- Collection counts are read from `getFeaturedCatalogue()`; they are not
  hard-coded.
- Category IDs remain the URL contract: `kitchen`, `fnb`, `hk`, `laundry`,
  `guest`, `cold`.
- Presentation labels use the full commercial names while the data layer keeps
  its short labels.
- Brand directory and brand collection pages were not modified.

## Validation

- `npx tsc -b` — pass
- `npm run lint` — 0 errors (3 pre-existing warnings)
- `npm run build` — pass
- Search, brand filter, category filter, reset, show-more, detail dialog,
  enquiry links and all routes verified in a live browser.
- No document-level horizontal overflow at 1440, 1024, 768, 390 or 320 px.
- No duplicate IDs, unnamed controls, missing image alts or console errors.

## Screenshots

- `products-1440.png`, `products-1024.png`, `products-768.png`,
  `products-390.png`, `products-320.png` — collapsed discovery page.
- `products-catalogue-1440.png`, `products-catalogue-1024.png`,
  `products-catalogue-768.png`, `products-catalogue-390.png` — catalogue open
  with the `Professional Kitchen` filter.
- `products-search-1440.png` — hero search filtering the catalogue.
