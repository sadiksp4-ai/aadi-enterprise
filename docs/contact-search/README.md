# Contact experience + global search

Focused stage covering `/contact` and a website-wide search overlay. No changes
were made to the homepage, Products pages, Brand Directory, brand collections,
Footer, SEO metadata or navigation routes.

## Contact page

### Hierarchy

1. **Hero** — centred “Contact Aadi Enterprises” and one support line.
2. **Quick contact** — WhatsApp Enquiry and Project Enquiry.
3. **Project enquiry** — the existing seven-field Web3Forms form in one dark
   editorial card, with the existing validation, success and error states.
4. **Pune head office** — keyless OpenStreetMap map, Maharashtra highlighted,
   Pune pin, marker popup, verified address and Google Maps directions.
5. **Other offices** — Mumbai, Bengaluru and Delhi NCR, plus email, WhatsApp and
   business hours.
6. **Closing** — one heading with WhatsApp and “Send an enquiry” actions.

The previous “Why work with us”, coverage block and repeated closing paragraph
were removed.

### Map

- Leaflet loaded lazily only on `/contact` (`ContactMap` chunk).
- OpenStreetMap standard tiles, tone-mapped to the dark palette in CSS.
- India state boundaries from the MIT-licensed
  `AbhinavSwami28/india-official-geojson` dataset, stored at
  `public/data/india-states.geojson`. Maharashtra is highlighted in teal.
- Pune marker at **18.5238332, 73.8643409**, matching the existing Google Maps
  listing for Aadi Enterprises–Hospitality Solutions, Parage Chowk.
- Marker click opens a dark popup with the existing Pune address and directions
  link. The directions link also sits beside the map.
- Responsive map height, popup capped to the viewport at 320 px, reduced-motion
  map animation disabled when requested.

### Preserved

- Web3Forms access key, form name, subject, submission handling and field set.
- Name, Company / Organisation, Phone, Email, Property / Project Type,
  Requirement and Message.
- Existing required-field, email-pattern and honeypot behaviour.
- Verified email, office phones, WhatsApp number, business hours and address.
- Existing `getContactPageEnquiryMessage()` WhatsApp copy.

## Global search

### Architecture

A single `GlobalSearch` component is mounted in the shared header. The index is
derived at module load from existing data — no second catalogue:

- 44 catalogue records (`catalogueIndex.records`)
- 51 approved featured products (`FEATURED_CATALOGUE`)
- 34 confirmed brands (`brandDirectory.brands`)
- six product groups (`CATALOGUE_GROUPS`)
- seven public pages

Results are grouped into **Products**, **Brands**, **Categories** and **Pages**,
with a title and short context label. Catalogue text reuses
`catalogueSearchText()`; normalisation is diacritic-insensitive.

### Routes

- Featured product → `/products/brand/{brand}#featured-products`
- Catalogue record / category → `/products?group={id}`
- Published brand → `/products/brand/{slug}`
- Unpublished confirmed brand → `/products/brands`
- Page → the existing public route

### Interaction

- Desktop magnifier in the header; mobile “Search” row in the mobile menu.
- Ctrl+K / Cmd+K opens; Escape closes.
- Arrow Up/Down moves the active result, Enter opens it.
- Empty state with suggestions, no-results state, clear action, live count.
- Background scroll locked while open; focus returns to the opener (or the
  mobile menu button when search was opened from the mobile menu).
- Overlay is portalled to the body so the fixed header cannot clip it.
- Reduced motion keeps the overlay and results visible without transforms.

## Files changed

- `src/react-app/pages/ContactPage.tsx`, `ContactPage.css`
- `src/react-app/components/Contact/ContactMap.tsx`, `ContactMap.css`
- `src/react-app/components/Search/GlobalSearch.tsx`, `GlobalSearch.css`
- `src/react-app/lib/global-search.ts`
- `src/react-app/data/contact.ts`
- `src/react-app/components/Navbar/Navbar.tsx`, `Navbar.css`
- `package.json`, `package-lock.json` — Leaflet + Leaflet types
- `public/data/india-states.geojson`
- `docs/contact-search/` — screenshots and this report

## Validation

### Contact

- Layout checked at 320, 390, 768, 1024, 1440 and 1920 px: no horizontal
  overflow, no broken images, no duplicate IDs.
- Seven form fields present in the required order.
- Empty submit produces Name, Phone and Message errors with no network request.
- Successful submit (Web3Forms intercepted in-browser) shows the success state
  and resets the form. The captured request contained the existing access key,
  form name, subject and all entered fields.
- Failed submit (mocked failure response) shows the error state.
- WhatsApp, email and `tel:` links resolve correctly; WhatsApp keeps the
  Contact-page message.
- Map: 6–12 tiles loaded per width, marker present, GeoJSON canvas rendered,
  marker popup opens with the Pune address and directions link.
- 320 px popup measured inside the map (left 20 px, right 205 px).
- Reduced motion: no contact reveal content left hidden; map inertia and zoom
  animation disabled.

### Search

- Tested from `/`, `/products` and `/contact` using Ctrl+K.
- Queries verified: `oven` (Products), `kitchen` (Products/Brands/Categories),
  `karcher` (Products/Brands), `vileda` (Products/Brands), `contact` (Pages),
  `1.520` (Products), `zzzz` (no results).
- Arrow keys move the active option; Enter opens it.
- Navigated to `/clients` (page), `/products/brands` (brand), 
  `/products?group=kitchen` (category), and
  `/products/brand/karcher#featured-products` (product).
- Escape closes and restores scroll.
- Mobile menu search row opens the overlay, closes the menu, locks background
  scroll, and fits within 320/390 px.
- Search overlay uses a body portal, so it covers the full viewport.

### Accessibility

- 24 keyboard stops on `/contact`; every stop had a visible focus ring.
- Search focus trap keeps Tab inside the overlay.
- Contrast: minimum **5.3:1**, zero failures on the Contact page and search
  overlay (24–26 sampled text styles).
- Reduced motion confirmed for both page and search overlay.
- Map container has a descriptive region label; marker has an accessible title.

### Build

- `npx tsc -b` — pass
- `npm run lint` — 0 errors (3 pre-existing warnings)
- `npm run build` — pass

| Asset | Size | Gzip |
| --- | ---: | ---: |
| `index.css` | 160.45 kB | 27.03 kB |
| `index.js` | 705.33 kB | 216.64 kB |
| `ContactMap.css` (lazy) | 17.85 kB | 7.07 kB |
| `ContactMap.js` (lazy) | 152.24 kB | 44.55 kB |
| `index.html` | 3.80 kB | 1.18 kB |

The existing >500 kB main-chunk warning remains. Leaflet is isolated in the
lazy ContactMap chunk and only downloaded on `/contact`.

## Outstanding issues

- The shared main JS chunk remains above Vite’s 500 kB warning threshold.
- OpenStreetMap’s tile usage policy and attribution apply; no API key is used.
- Catalogue search results land on `/products` with the matching group filter
  open, but do not auto-scroll to the catalogue because Products pages were
  intentionally left untouched.
- A pre-existing React hydration warning on `/about` appears when navigating
  there; it is unrelated to this stage and was not modified.

## Screenshots

In `docs/contact-search/`:

- `contact-1440.png` — full desktop page
- `contact-390.png` — full mobile page
- `contact-map-popup-1440.png` — marker popup and directions
- `search-1440.png` — desktop search results
- `search-390.png` — mobile search results

No commit, push or deployment was performed.
