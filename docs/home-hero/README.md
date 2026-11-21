# Homepage hero — minimal cinematic refinement

Only the homepage hero was changed.

## Result

- One centred headline: **“Everything for exceptional hospitality.”**
- Supporting paragraph removed.
- Secondary “Request a Consultation” hero button removed; quotation access
  remains in the global navigation.
- One CTA: **Explore Solutions →**
- Existing full-width `hero-hospitality.mp4` retained.
- Subtle dark radial/vertical overlay keeps the ivory headline legible while
  leaving the footage dominant.
- Ivory Cormorant Garamond headline, centred horizontally and vertically.
- Headline is one line at 768 px and above; two balanced lines at 320/390 px.
- CTA is centred at every width and uses dark text on the Tiffany teal fill for
  readable contrast.
- Existing navigation and WhatsApp widget untouched.

## Animation

- Headline: 700 ms fade + 16 px upward reveal.
- CTA: 650 ms fade + rise, 180 ms after the headline.
- Reduced motion: both animations are disabled and content renders at full
  opacity immediately.
- Background video is paused when `prefers-reduced-motion: reduce` is active,
  leaving the existing `hero-fallback.jpg` poster. It resumes if the preference
  is turned off.

## Files changed

- `src/react-app/pages/HomePage.tsx`
- `src/react-app/pages/HomePage.css`
- `docs/home-hero/` — screenshots and this report

No other homepage sections, navigation, routes, SEO, video assets or enquiry
functionality were modified.

## Validation

Checked at **320, 390, 768, 1024, 1440 and 1920 px**:

| Width | Headline lines | CTA centred | Paragraphs | Hero CTAs | Overflow |
| --- | ---: | --- | ---: | ---: | --- |
| 320 | 2 | yes | 0 | 1 | none |
| 390 | 2 | yes | 0 | 1 | none |
| 768 | 1 | yes | 0 | 1 | none |
| 1024 | 1 | yes | 0 | 1 | none |
| 1440 | 1 | yes | 0 | 1 | none |
| 1920 | 1 | yes | 0 | 1 | none |

- Headline centre offset: **0 px** at every width.
- Headline vertical centre within hero: within **10 px**.
- Hero heights preserved: 736 / 776 / 792 / 810 / 810 / 896 px.
- Background video: playing, muted, looping, `playsInline`, no controls.
- Reduced motion: paused, poster retained, headline animation `none`, opacity 1.
- No console errors.
- CTA verified at 215 px wide, centred, dark-on-teal.

Build:

- `npx tsc -b` — pass
- `npm run lint` — 0 errors (3 pre-existing warnings)
- `npm run build` — pass
- Main CSS **161.43 kB** (gzip 27.18 kB)
- Main JS **706.89 kB** (gzip 217.23 kB)
- Existing Vite >500 kB warning remains

## Screenshots

- `docs/home-hero/hero-320.png`
- `docs/home-hero/hero-390.png`
- `docs/home-hero/hero-768.png`
- `docs/home-hero/hero-1024.png`
- `docs/home-hero/hero-1440.png`
- `docs/home-hero/hero-1920.png`
- `docs/home-hero/hero-reduced-1440.png`

## Outstanding

- The shared JS bundle remains above Vite’s 500 kB warning threshold.
- On phones the headline necessarily wraps to two lines; the type is balanced
  and not reduced below comfortable reading size.
- If a browser blocks background autoplay, the existing poster remains visible.

No commit, push or deployment was performed.
