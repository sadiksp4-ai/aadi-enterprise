# Stage 4 — Brand collection pages

Redesign of every published brand collection route, `/products/brand/:slug`,
on the approved Stage 1 editorial foundation.
Principle: **Show more. Say less.**

Routes covered: `karcher`, `tramontina`, `dolphy`, `winterhalter`,
`zafferano`, `electrolux-professional`.

## Page hierarchy

1. **Brand hero** — breadcrumbs, one eyebrow (categories · classification),
   brand name, one factual line (verified product or range count), one primary
   action, the existing brand mark and the existing collection photograph.
   The long intro copy and image captions are gone.
2. **Overview.** — a slim three-column meta row: categories, classification and
   the confirmed range names. No cards, notes or explanatory paragraphs.
3. **Discovery** — a single section that replaces the old ranges block,
   featured-product block and related-discovery block.
   - Product brands (`karcher`, `tramontina`, `dolphy`): name/model/SKU search,
     minimal category filters, live count, inline reset and image-first cards.
     Every approved product is shown; there is no page-size cap or "show all".
   - Range brands (`winterhalter`, `zafferano`, `electrolux-professional`):
     compact confirmed-range rows with `View details` and `Enquire`.
4. **Enquiry** — one question and the existing `Request a Quote` plus WhatsApp
   actions. This is the only page-level enquiry block.

## Product cards

Image, product name, model/SKU, `View details`, `Enquire`. Nothing else.
Specifications, catalogue category and type live inside the detail dialog,
which keeps its original morphing behaviour: keyboard access, Escape, focus
trap, scroll lock and focus return to the triggering card.

## Removed

- Related-discovery section and its brand tiles.
- Long generated intro paragraphs, overview note and range descriptions.
- Filter chip counts and category labels on cards.
- Range features/description blocks from the discovery surface.
- Detail-dialog note paragraph.
- `PAGE_SIZE = 8` / `Show all` pagination.

## Data integrity

- Counts are read from `getFeaturedCatalogue()`: Kärcher 20, Tramontina 19,
  Dolphy 12. Nothing is hard-coded in the view.
- Product names, models, categories and image paths are unchanged from
  `data/featured-products.ts`; range names come from `brand-directory.ts`.
- No excluded or pending record is reintroduced. Pending minibar records and
  records without approved imagery remain outside these pages.
- Brand collection copy is derived from confirmed metadata only; no pricing,
  availability or specification claim is invented.
- `Kärcher` is a presentation-only spelling (`brand.id === "karcher"`); the data
  layer keeps `Karcher`.

## Validation

- `npx tsc -b` — pass
- `npm run lint` — 0 errors (3 pre-existing warnings)
- `npm run build` — pass
- Live checks on all six routes: correct H1, intro, overview facts, product or
  range counts, no broken hero logo/hero image/product image, no document-level
  horizontal overflow.
- Search: model (`1.520` → 2 products), name (`puzzi` → 2 products), clear,
  diacritic-insensitive match on `karcher`.
- Filters: `Vacuum cleaners` → 6 products, toggle back to `All` → 20, inline
  `Reset` appears only while a filter is active, empty state resets cleanly.
- Detail dialog: label, five verified facts, `Request a Quote` → `/contact`,
  WhatsApp URL preserved, body scroll locked, Escape closes, focus returns to
  the `View details` button.
- No overflow at 1440, 1024, 768, 390 or 320 px; the dialog fits the viewport at
  390 and 320 px.
- No console errors or uncaught exceptions during the pass.

## Screenshots

- `karcher-1440.png`, `karcher-1024.png`, `karcher-768.png`, `karcher-390.png`,
  `karcher-320.png` — full page at five widths.
- `tramontina-1440.png`, `tramontina-390.png` — full page.
- `dolphy-1440.png`, `dolphy-390.png` — full page.
- `winterhalter-1440.png` — range-brand layout.
- `karcher-dialog-1440.png`, `karcher-dialog-390.png` — product detail dialog.
