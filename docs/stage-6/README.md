# Stage 6 — Products redesign QA and acceptance

Full regression audit of the redesigned Products experience. No design changes
were made during the audit except one accessibility defect fix (below).

## Defect found and fixed

The filled teal CTAs used light text:

- `.px-btn-primary` — `#F3EFE5` on `#0C9990` = **3.06:1**
- Navbar “Request a Quote” — `#F3EFE5` on `#087F78` = **4.24:1**
- Enquiry drawer “Send Enquiry” — `#F3EFE5` on `#087F78` = **4.24:1**
- Active catalogue tab and count used the same light-on-teal pairing

Both fail WCAG AA for normal-size text. Fixed by switching filled-control text
to the near-black background token and matching the navbar CTA surface to the
editorial teal:

- `.px-btn-primary` text: `var(--background)` → **5.70:1**
- Navbar CTA: `var(--accent)` with `var(--background)` text, hover `#0B8F87`
  → **5.05:1**
- Enquiry drawer submit: primary token darkened to `#07706A`, light text
  → **5.17:1**
- Active catalogue tab and badge text: `var(--background)` → **5.70:1**

No other visual or behavioural changes were made.

## Files changed

- `src/react-app/styles/editorial.css` — filled CTA text contrast
- `src/react-app/components/Products/Products.css` — active tab and badge contrast
- `src/react-app/components/Navbar/Navbar.css` — navbar CTA contrast
- `src/react-app/index.css` — primary button token contrast
- `docs/stage-6/` — screenshots and this report
- `docs/stage-5/README.md` — contrast note aligned with the Stage 6 audit

No data, route, component-structure, dependency or content changes.

## Final page hierarchy

### `/products`

1. Hero — eyebrow, headline, one support line, search, project image.
2. Collections — Kärcher, Tramontina, Dolphy tiles with live product counts.
3. Categories — six image-led category tiles.
4. Full catalogue — 44-record disclosure with search, brand combobox, group
   tabs, reset and detail dialog.
5. Trusted brands — twelve logo plates and a link to the directory.
6. Enquiry — one question, `Request a Quote`, WhatsApp.

### `/products/brands`

1. Hero — breadcrumb and headline.
2. Product catalogues — three catalogue tiles.
3. All brands — search, seven filters, 34 confirmed cards, nine pending records
   in a separate disclosure.
4. Enquiry — one question, `Request a Quote`, WhatsApp.

### `/products/brand/:slug` — catalogue brands

1. Hero — breadcrumb, category/classification eyebrow, brand name, verified
   product count, one action, brand mark and collection photograph.
2. Overview — categories, classification, ranges.
3. The collection — search, category filters, live count, reset, image-first
   product cards.
4. Enquiry — brand-specific question, `Request a Quote`, WhatsApp.

### `/products/brand/:slug` — range brands

Same hero and overview, followed by confirmed range rows with `View details`
and `Enquire`, then the enquiry block. Published range routes: `winterhalter`,
`zafferano`, `electrolux-professional`.

The 28 confirmed brands without a published collection show a clear
“Not published yet.” page rather than a broken or empty collection.

## Functionality preserved

- All three collection tiles navigate to the correct brand routes.
- All six category tiles filter to the correct `?group=` values and counts:
  Kitchen 5, F&B 20, Housekeeping 9, Laundry 4, Guest 4, Cold 2. Toggling the
  active tile resets to 44.
- Search returns the expected matches; `karcher` matches the Kärcher record
  and the pending housekeeping record that references it.
- Brand combobox lists 34 partner options + All; Rational → 1 record.
- Catalogue “Browse all 44 records” opens the complete list; active filters
  show a reset chip.
- Empty states appear and reset on both `/products` and the brand directory.
- Entry, brand-preview, product and range dialogs open, lock body scroll, keep
  focus inside, close on Escape and return focus to the trigger.
- `Request a Quote` always points to `/contact`.
- WhatsApp links preserve the approved messages for Rational, Kärcher,
  Tramontina, Dolphy and Winterhalter.
- Breadcrumbs navigate back to `/products` and `/products/brands`.
- Directed `#featured-products` shortcut scrolls the Kärcher collection into
  view.
- Direct loads and refreshes work for all eight audited routes.

## Data integrity

- Source catalogue records: **44**; app catalogue records: **44**; no missing
  or extra names. Two source records are both named “Zafferano” and remain
  distinct by record slug.
- Confirmed brands: **34**; ranges: **35**; pending records: **9**.
- Pending records remain separated and classified; none appears among the 34
  confirmed brand cards.
- Approved featured products: **51** exact matches against
  `product-extraction/approved-image-mapping.json`, including name, model,
  image path, catalogue category and subcategory.
  - Kärcher **20**
  - Tramontina **19**
  - Dolphy **12**
- No excluded or pending-owner-confirmation product appears in the app.
- No pricing, cost, GST, stock or availability fields exist in the featured
  data or rendered pages.
- All 51 product images, 34 brand marks, category images, hero images and
  gallery assets resolve; zero broken images across every audited route and
  width.

## Responsive validation

Every route was checked at **320, 390, 768, 1024, 1440 and 1920 px**:
8 routes × 6 widths = **48 checks**.

- No horizontal overflow at any width.
- No broken images, missing alt text, duplicate IDs or console errors.
- Mobile navigation opens full-width at 320 and 390 with 59 px links.
- Product grids: 2 columns at 320, 3 at 768, 4 from 1024.
- Brand directory: 2 columns from 390, 4 from 1200; a single legible column at
  320 to avoid mid-word category breaks.
- Category and filter rails scroll horizontally on phones.
- Dialogs fit and scroll at 320 with actions visible.

## Accessibility

- 22 keyboard stops tested on `/products`, `/products/brands` and
  `/products/brand/karcher`; every stop had a visible focus ring.
- Contrast after the fix: minimum **5.3:1**, zero failures (24–26 sampled text
  styles per page). The global enquiry drawer submit is **5.17:1**.
- Heading order is h1 → h2 → h3 on every route.
- Zero images without `alt`; decorative arrows are `aria-hidden`.
- Reduced motion: no content remains transparent or translated on the three
  tested surfaces.
- Dialog focus trap, Escape, scroll lock and focus return verified.

## Build and bundle

- `npx tsc -b` — pass
- `npm run lint` — **0 errors**, 3 pre-existing warnings
- `npm run build` — pass, Vite 6.3.6, 2,200 modules

| Asset | Size | Gzip |
| --- | ---: | ---: |
| `index.css` | 155.47 kB | 26.04 kB |
| `index.js` | 694.57 kB | 213.83 kB |
| `index.html` | 3.80 kB | 1.18 kB |

The existing Vite warning for the >500 kB JS chunk remains. No dependencies were
added.

## Outstanding issues

- The shared JS bundle still exceeds Vite’s 500 kB warning threshold.
- 28 confirmed brands intentionally have no published collection and show the
  unavailable page until a collection is configured.
- At 320 px the brand directory is a single column, which makes the page long
  but keeps brand names and categories readable.

No functional or data defects remain.

## Screenshots

See `docs/stage-6/`:

- `products-1440.png`, `products-390.png`
- `products-catalogue-1440.png`
- `brands-1440.png`, `brands-390.png`
- `karcher-1440.png`, `karcher-390.png`
- `tramontina-1440.png`
- `dolphy-1440.png`
- `winterhalter-1440.png` — range-only collection

No commit, push or deploy was performed.
