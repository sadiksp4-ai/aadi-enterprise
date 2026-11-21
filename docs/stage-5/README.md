# Stage 5 — Responsive, interaction, accessibility, motion and performance

Final polish pass across the three Products surfaces:

- `/products`
- `/products/brands`
- `/products/brand/:slug` (catalogue brands and range-only brands)

Principle: **Show more. Say less.**

## What changed

### Typography and spacing

- Raised the smallest labels from 9.3–10.6 px to ≥11.2 px across the catalogue,
  brand directory and brand collections.
- Breadcrumbs, text links and product-card actions now meet a 44 px tap target;
  footer link rows are at least 24 px high.
- Desktop section padding reduced from 88 px to 72 px top and bottom
  (`--ed-section-space`); tablet spacing scales down with it.
- Kept one type hierarchy and one focus ring from the Stage 1 foundation.

### Minimalism

Removed repetitive or non-essential visible text:

- `/products`: hero image caption, per-category record badges, swipe hint,
  catalogue count meta, collection “Explore catalogue” labels and the second
  sentence in the brand heading. Section headings shortened to
  `Collections.`, `Categories.` and `Trusted brands.`
- `/products/brands`: hero eyebrow and support line, catalogue-section support
  line, directory support line, and the long catalogue heading (now
  `Product catalogues.`).
- Brand collections: removed the `Products` / `Ranges` kickers and the repeated
  range-count line; hero count reduced to one factual line.
- Text on `/products` fell from 788 to 565 characters. Most of what remains is
  product names, models and brand names rather than prose.

### Images and assets

- Converted all 34 brand marks to WebP at a 720 px maximum: served brand-logo
  total is now **1,022 kB**. Example: Vileda 1,816 kB → 9 kB, M-Style 843 kB →
  41 kB, Robot Coupe 784 kB → 66 kB.
- Replaced the 149 kB PNG site logo in the navbar and footer with an 11 kB WebP
  (320 px wide, enough for a 39–44 px render).
- Added a 1 kB favicon so the 149 kB brand PNG is no longer fetched on every
  page.
- Collection tiles keep the same portrait image ratio at every width; the
  redundant action label was replaced by an arrow aligned with the product
  count.

## Responsive results

Checked at 320, 390, 768, 1024, 1440 and 1920 px.

- No document-level horizontal overflow on any route at any width.
- `/products`: collections are 280 px single-column at 320, 350 px at 390,
  three columns from 1024; categories use a snap rail on phones and a 2/3-column
  grid above; brand strip is 2 columns at 320 and 6 on desktop.
- `/products/brands`: catalogue cards stack horizontally below 900 px; directory
  cards are 2 columns from 390 and 4 on desktop, with a legible single column at
  320. Filters stay in a horizontal rail on phones.
- Brand collections: product cards are 2 columns at 320 (135 px), 3 at 768 and
  4 from 1024; both dialogs fit and scroll at 320.
- Mobile navigation opens full-width at 320 and 390 with 59 px links and no
  overflow.

## Interaction results

Verified on the built page and via scripted browser checks:

- Whole collection tiles navigate to the correct brand collection.
- Category tiles update `?group=`, open the catalogue, scroll to it and show the
  correct active state.
- Search and filter combinations work on both `/products` and catalogue brands;
  reset restores all 44 records / all products.
- Empty states appear and reset cleanly.
- Entry and product dialogs keep focus inside, lock body scroll, return focus to
  the trigger and close on Escape.
- WhatsApp links keep the approved messages; `Request a Quote` points to
  `/contact`.

## Accessibility

- Every interactive element has a visible 2 px focus ring.
- Headings follow h1 → h2 → h3 on all three surfaces.
- All images keep their existing alt text; decorative arrows are hidden.
- Contrast measured on these pages is 5.3:1 or better; body and meta copy range
  from 7.4:1 to 17:1. Filled CTA contrast was corrected in the Stage 6 QA pass.
- `prefers-reduced-motion: reduce` disables reveal and hover motion. A scripted
  check at 1440 px confirmed no content remains transparent or translated on
  `/products`, `/products/brands` or `/products/brand/karcher`.

## Motion

Entrance reveals, image zooms and the shared morphing dialog only. No parallax,
autoplay loops, cursor effects or continuous animation. Reduced motion removes
the transforms and transitions.

## Performance

Production build (`npm run build`, Vite 6.3.6):

| Asset | Size | Gzip |
| --- | ---: | ---: |
| `index.css` | 155.32 kB | 26.02 kB |
| `index.js` | 694.57 kB | 213.83 kB |
| `index.html` | 3.80 kB | 1.18 kB |

- 2,200 modules transformed. The existing Vite warning for the >500 kB JS chunk
  remains; the chunk is dominated by the shared app and Framer Motion, and this
  pass added no dependencies.
- Image payload per page (browser resource timings, unique images):
  - `/products`: 3,151 kB → **1,101 kB** (−65%)
  - `/products/brands`: 7,844 kB → **702 kB** (−91%)
  - `/products/brand/karcher`: 2,796 kB (product photography, unchanged)
- No duplicate asset requests: the navbar and footer now share one cached logo;
  `logo.png` is only used by the 64 px favicon source.
- Product images are still JPG/WebP at their existing resolution; no quality was
  reduced to hit a size target.

## Validation

- `npx tsc -b` — pass
- `npm run lint` — 0 errors (3 pre-existing warnings)
- `npm run build` — pass
- Automated audit across 3 pages × 6 widths: no overflow, no duplicate IDs, no
  missing alt text, no console errors.

## Screenshots

Full-page captures in this folder:

- `products-320.png`, `products-390.png`, `products-768.png`,
  `products-1024.png`, `products-1440.png`, `products-1920.png`
- `products-catalogue-1440.png` — full catalogue expanded
- `brands-320.png`, `brands-390.png`, `brands-768.png`, `brands-1024.png`,
  `brands-1440.png`, `brands-1920.png`
- `karcher-320.png`, `karcher-390.png`, `karcher-768.png`,
  `karcher-1024.png`, `karcher-1440.png`, `karcher-1920.png`
- `winterhalter-1440.png` — range-only brand layout
