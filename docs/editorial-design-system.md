# Products editorial design system

Stage 1 shared presentation foundation for `/products`, `/products/brands` and
`/products/brand/:slug`.

The system is CSS-first. It reuses the approved colour tokens and fonts from
`src/react-app/index.css`; it does not add a page-level component library.

## Files

| File | Purpose |
| --- | --- |
| `src/react-app/styles/editorial.css` | Tokens, layout, typography, buttons, media, breadcrumbs, focus, reduced motion and mobile composition. Imported once in `main.tsx`. |
| `src/react-app/lib/catalogue-motion.ts` | Single set of framer-motion variants and easing shared by the three pages. |
| `src/react-app/components/Products/Breadcrumbs.tsx` | The only new React primitive: one breadcrumb trail for the brand directory and collection pages. |

Page CSS files now contain composition only (`.px-*`, `.bd-*`, `.bc-*`, `.fp-*`
layout rules). Shared primitives no longer live inside `Products.css`.

## Typography

Fluid tokens keep one hierarchy across desktop and mobile.

| Token | Role |
| --- | --- |
| `--ed-text-display` | Page hero headline |
| `--ed-text-h2` | Section headline |
| `--ed-text-cta` | Enquiry headline |
| `--ed-text-h3` | Card / range headline |
| `--ed-text-lead` | Short supporting copy |
| `--ed-text-body` | Section and detail copy |
| `--ed-text-meta` / `--ed-text-eyebrow` | Labels and metadata |

Classes: `.px-display`, `.px-heading`, `.px-subheading`, `.px-lead`,
`.px-copy`, `.px-eyebrow`, `.px-kicker`, `.px-meta`, `.px-section-title`,
`.px-section-copy`, `.px-cta-title`, `.px-cta-text`.

Fonts remain `--font-primary` (Cormorant Garamond) and `--font-secondary`
(Inter).

## Spacing and widths

| Token | Value |
| --- | --- |
| `--ed-content` | `76rem` (`--content-max`) |
| `--ed-gutter` | `clamp(1.25rem, 4vw, 2.5rem)` |
| `--ed-section-space` | `clamp(3.25rem, 6.5vw, 5.5rem)` |
| `--ed-hero-top` | `clamp(8rem, 11vw, 10rem)` |
| `--ed-grid-gap` | `1.25rem` |

Classes: `.px-shell`, `.px-section`, `.px-section--flush`,
`.px-section--alt`, `.px-section--tall`, `.px-cta-section`,
`.px-cta-section--alt`.

## Images

| Token | Ratio | Use |
| --- | --- | --- |
| `--ed-ratio-hero` | 6 / 5 | Products hero |
| `--ed-ratio-cinema` | 16 / 6 | Brand collection hero |
| `--ed-ratio-wide` | 16 / 9 | Brand and catalogue cards |
| `--ed-ratio-editorial` | 4 / 3 | Index rows, category cards |
| `--ed-ratio-square` | 1 / 1 | Product cards |
| `--ed-ratio-portrait` | 3 / 4 | Mobile category carousel |
| `--ed-ratio-logo` | 16 / 10 | Brand plate |

Classes: `.px-media`, `.px-media--hero`, `.px-media--wide`,
`.px-media--cinema`, `.px-media--editorial`, `.px-media--square`,
`.px-media--portrait`, `.px-media--logo`, `.px-media--bare`, `.px-caption`.

Logos always sit on the existing warm `#f3efe5` plate and use
`object-fit: contain`. Photography uses `object-fit: cover` inside a bordered
frame. No glass, gradients or decorative overlays were added.

## Buttons and links

- `.px-btn .px-btn-primary` — teal fill, the single primary action.
- `.px-btn .px-btn-secondary` — bordered secondary action. `.px-btn-outline`
  remains as a compatibility alias.
- `.px-link` — inline text action with underline on hover. `.px-text-link`
  remains as a compatibility alias.

All buttons keep the existing 44px minimum target, uppercase micro-label and
2px radius.

## Motion and reduced motion

- `--ed-ease`, `--ed-duration-fast/base/slow/image` replace hard-coded image
  transitions.
- Reveal timing is centralised in `lib/catalogue-motion.ts`.
- Hover lift and image zoom are gated by
  `@media (hover: hover) and (prefers-reduced-motion: no-preference)`.
- `@media (prefers-reduced-motion: reduce)` collapses animation and transition
  durations, disables zoom, and forces reveal wrappers visible.

## Focus and accessibility

- One scoped baseline: `.px :focus-visible` uses the teal focus ring with a
  3px offset.
- Image cards may override the offset to `-2px` so the ring stays inside the
  frame.
- Breadcrumbs expose `aria-current="page"` on the final item.
- Filter and tab controls keep their existing `aria-pressed` / tab semantics.
- `MorphingDialog` continues to provide focus trapping, Escape handling and
  focus return.

## Deliberately not changed

Catalogue data, routes, SEO, product image mappings, enquiry logic, page
sections and page copy. The three pages keep their current composition; this
stage only replaces duplicated presentation code with the shared foundation.
