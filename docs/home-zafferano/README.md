# Zafferano homepage video

The static Zafferano feature image on the homepage is replaced with the supplied
video. No other homepage section was changed.

## Source video

- File: `public/Videos/1Zafferrano Website Video Home Page.mp4` (exact supplied
  name, including the double “r”; not renamed, moved or re-encoded)
- Format: MP4 / H.264
- Dimensions: 640 × 360
- Duration: 15.02 s
- Size: 1.39 MB
- `moov` atom precedes `mdat`, so it can begin playback progressively
- MIME served locally: `video/mp4`

## Implementation

- New `ZafferanoVideo` component inside the existing `.hx-feature-media` wrapper.
- Existing heading, description and “Explore Tabletop Lighting” CTA untouched.
- Media wrapper keeps the original **16:10** ratio, so the section dimensions and
  responsive grid do not change. The 16:9 video is centre-cropped with
  `object-fit: cover`.
- The existing Zafferano photograph is used as the poster/fallback and as the
  reduced-motion still.
- Native controls are not shown.

### Playback

- `autoPlay`, `muted`, `loop`, `playsInline`, no `controls`.
- `preload="none"` until the section is within 300 px of the viewport, then
  `preload="auto"` and muted autoplay begins.
- An `IntersectionObserver` prevents the video request while the section is far
  below the fold.
- A custom pause control is visible during playback (WCAG 2.2.2), and a “Play
  video” control appears when paused, when autoplay is blocked, or when reduced
  motion is requested.
- Playback errors hide the video, keep the poster and show “Video unavailable”.

### Reduced motion

When `prefers-reduced-motion: reduce` is active:

- The video does not autoplay and stays at `preload="none"`.
- The existing Zafferano photograph is shown with a visible “Play video” button.
- Playback only starts after the visitor activates that button.
- Map/media transitions are not forced; the video itself is never auto-started.

## Files changed

- `src/react-app/components/Home/ZafferanoVideo.tsx`
- `src/react-app/components/Home/ZafferanoVideo.css`
- `src/react-app/pages/HomePage.tsx`
- `src/react-app/pages/HomePage.css`
- `vite.config.ts` — ignore locked video files in the dev watcher (the supplied
  MP4 caused an `EBUSY` crash while open in another application)

Unrelated pages, navigation, SEO and other homepage sections were not modified.

## Validation

Tested at **1440, 390 and 320 px**:

- Autoplay starts without interaction in Chrome headless with no forced
  autoplay flag.
- `muted: true`, `loop: true`, `playsInline: true`, `controls: false`.
- Video continues playing and wraps correctly at the loop boundary
  (`currentTime` returned to 0.54 s after seeking to the end).
- Pause control pauses playback and swaps to the play control; play resumes.
- Reduced motion: paused, `preload="none"`, play control visible; clicking it
  starts the video.
- Poster image is the existing Zafferano photograph and remains available as
  the fallback.
- Media ratio measured **1.593–1.597** against the intended 16:10, with no
  layout shift when the video replaces the poster.
- Video crop/position checked in desktop and mobile screenshots.
- Playback error simulation showed “Video unavailable” and hid the video while
  retaining the poster layer.
- No console errors during the playback tests.

Performance:

- The Zafferano MP4 is not requested while the section is below the fold; the
  video element starts at `preload="none"` and `readyState: 0`.
- Video is 640 × 360, 15.02 s, 1.39 MB (≈740 kbps), muted and mobile-compatible.
- No new dependencies.

Build:

- `npx tsc -b` — pass
- `npm run lint` — 0 errors (3 pre-existing warnings)
- `npm run build` — pass
- Main `index.css`: 162.29 kB (gzip 27.31 kB)
- Main `index.js`: 707.24 kB (gzip 217.30 kB)
- Existing Vite >500 kB warning remains

## Screenshots

- `docs/home-zafferano/zafferano-1440.png` — desktop, video playing
- `docs/home-zafferano/zafferano-390.png` — mobile, video playing
- `docs/home-zafferano/zafferano-reduced-1440.png` — reduced-motion poster with
  the accessible play control

## Outstanding issues

- The supplied video is 640 × 360 while the desktop media area is approximately
  654 × 409, so it is slightly upscaled. It was not re-encoded because the brief
  explicitly forbids changing the original; a higher-resolution source would
  improve desktop sharpness.
- On browsers that block muted autoplay (for example, some low-power modes), the
  poster and play control remain and playback requires one tap.
- The shared JS chunk remains above Vite’s 500 kB warning threshold.

No commit, push or deployment was performed.
