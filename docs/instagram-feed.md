# Instagram feed — refresh pipeline (Stage 1)

Free, automatically refreshing feed for `@aadienterprises_` (6 latest posts).
No scraping, no paid provider, no unofficial endpoints.

## How it works

1. Scheduled workflow `.github/workflows/instagram-feed.yml` runs every 6 hours
   (`23 */6 * * *` UTC) and on manual dispatch.
2. It runs `node scripts/fetch-instagram.mjs` with the repo secret
   `INSTAGRAM_ACCESS_TOKEN` as an environment variable (server-side only).
3. The script calls the official Instagram Login API:
   `GET https://graph.instagram.com/me/media` with fields
   `id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp`
   and `limit=12` (extra headroom so filtered items still leave 6).
   Required permission: `instagram_business_basic`.
4. Thumbnails are downloaded to `public/instagram/<media-id>.jpg` (Instagram CDN
   URLs expire, so we self-host). `public/instagram/feed.json` is written as:
   `{ "updatedAt": "<ISO>", "posts": [{ id, image, url, caption, mediaType, productType, publishedAt }] }`
   where `image` is relative (`instagram/<id>.jpg`) and resolved at runtime via
   `getAssetUrl()` so both custom-domain and project-page bases work.
5. The workflow commits `public/instagram/feed.json` + `*.jpg` to `main`.
   That push triggers the existing `Deploy to GitHub Pages` workflow.
   `deploy.yml` itself is unchanged.

## Token safety rules

- The token lives ONLY in the `INSTAGRAM_ACCESS_TOKEN` repo secret and the
  workflow `env:` block. It is never printed, logged, committed, written to
  `feed.json`, or imported by frontend code.
- Error diagnostics are redacted (`access_token=***`) and truncated; failures
  throw BEFORE any write, so the last valid `feed.json` cache is preserved and
  the workflow fails without committing.
- Empty-success safeguard: HTTP 200 with zero usable posts while the committed
  cache still holds posts exits `1` before pruning or writing, preserving both
  `feed.json` and its thumbnails. A genuinely empty account on the first run
  (empty cache) still writes an empty feed.
- Running the script without the env var exits `0` and leaves the cache
  untouched (safe local dry-run).

## Token expiry and renewal

- Dashboard tokens are **long-lived: 60 days** (`expires_in ≈ 5184000`).
  Short-lived tokens last 1 hour.
- Refresh is allowed only while the token is **≥24h old, unexpired**, with
  `instagram_business_basic` granted:
  `GET graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=...`
- `GITHUB_TOKEN` cannot update secrets, so renewal is manual: regenerate in
  the `Aadi feed` Meta App Dashboard → update the `INSTAGRAM_ACCESS_TOKEN`
  secret → re-run the workflow manually. Set a **calendar reminder at ~day 50**.
- An expired token surfaces as `Instagram API 400/401` in the workflow log
  with the hint `Renew INSTAGRAM_ACCESS_TOKEN …`. The homepage keeps showing
  the previous cache in the meantime.

## Manually run and validate

1. GitHub → repo `sadiksp4-ai/aadi-enterprise` → Actions →
   `Refresh Instagram feed` → `Run workflow` → `Run workflow`.
2. Watch the run log: it must show no token (only `access_token=***` if a URL
   is ever echoed) and either `Wrote N posts to public/instagram/feed.json`
   or a redacted API error with no commit.
3. On success, verify the auto-created commit touches ONLY
   `public/instagram/feed.json` + `public/instagram/*.jpg`, then confirm the
   `Deploy to GitHub Pages` run triggered by that push succeeds.
4. Verify the live site serves `/instagram/feed.json` with ≤6 posts, each with
   `image` + `url` (permalink), and images load.
5. Safe token sanity check (no exposure): the manual run itself IS the check.
   Never paste the token into a browser, chat, issue, or local `.env` file.
   Do not query `graph.instagram.com` from frontend code.

## Field caveats

- `media_url` is omitted for copyrighted-flagged video/Reels audio — such
  items are skipped so the grid still fills from the `limit=12` headroom.
- `thumbnail_url` exists only on `VIDEO` media; photos use `media_url`.
- `media_product_type` (`FEED`/`REELS`) is documented as Facebook-Login-only
  and may be absent on Instagram Login — consumers must default to `FEED` and
  fall back to a `VIDEO` badge via `media_type`.
