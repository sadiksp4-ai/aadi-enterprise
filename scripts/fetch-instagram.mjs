/**
 * Build-time Instagram feed fetcher — runs ONLY in GitHub Actions.
 *
 * Reads a Meta long-lived Instagram User access token from the
 * `INSTAGRAM_ACCESS_TOKEN` environment variable (GitHub Actions secret),
 * fetches the latest media for the connected Business/Creator account via
 * the official Instagram Login API (`instagram_business_basic` permission),
 * downloads thumbnails to `public/instagram/` (Instagram CDN URLs expire,
 * so we self-host), and writes `public/instagram/feed.json` consumed by the
 * homepage feed component.
 *
 * The token NEVER appears in the repository, build output, browser bundle,
 * or logs. Do not import this file from frontend code.
 *
 * Required setup (one time):
 *  1. Convert @aadienterprises_ to a Business or Creator account (free).
 *  2. Create a Meta App ("Aadi feed") with the Instagram product +
 *     Business Login, generate a long-lived token (valid 60 days).
 *  3. Save it as the repo secret `INSTAGRAM_ACCESS_TOKEN`.
 *  4. Renew the secret every ~50 days (calendar reminder). Refreshing is a
 *     manual step because GITHUB_TOKEN cannot update secrets.
 *
 * Usage (CI):  INSTAGRAM_ACCESS_TOKEN=... node scripts/fetch-instagram.mjs
 * Local dry-run without a token: node scripts/fetch-instagram.mjs
 *   (keeps the existing committed feed.json untouched).
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "instagram");
const FEED_JSON = path.join(OUT_DIR, "feed.json");
const POST_LIMIT = 6;
const FETCH_LIMIT = 12; // fetch extra so filtered-out items still leave 6
const FIELDS =
  "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp";

const token = process.env.INSTAGRAM_ACCESS_TOKEN ?? "";

if (!token) {
  console.log(
    "[instagram] INSTAGRAM_ACCESS_TOKEN not set — leaving committed public/instagram/feed.json untouched."
  );
  process.exit(0);
}

function redact(value) {
  return String(value).replace(/access_token=[^&\s]*/gi, "access_token=***");
}

// Meta error bodies never contain our token, but sanitize defensively so a
// redacted diagnostic can never leak credential-adjacent material and stays
// short in Actions logs.
function sanitizeBody(text) {
  return redact(String(text)).slice(0, 300);
}

const api = new URL("https://graph.instagram.com/me/media");
api.searchParams.set("fields", FIELDS);
api.searchParams.set("limit", String(FETCH_LIMIT));
api.searchParams.set("access_token", token);

let listing;
try {
  const res = await fetch(api);
  if (!res.ok) {
    // feed.json is written only after a successful fetch, so throwing here
    // preserves the last valid cache. The message carries status + a
    // sanitized body only — never the request URL or token.
    throw new Error(`Instagram API ${res.status}: ${sanitizeBody(await res.text())}`);
  }
  listing = await res.json();
} catch (error) {
  console.error("[instagram] Failed to fetch media listing. Token may be expired.");
  console.error("[instagram] Renew INSTAGRAM_ACCESS_TOKEN (Meta App → long-lived token, 60-day validity).");
  throw error;
}

const items = Array.isArray(listing?.data) ? listing.data : [];
await mkdir(OUT_DIR, { recursive: true });

const posts = [];
const keptFiles = new Set();

for (const item of items) {
  if (posts.length >= POST_LIMIT) break;
  if (!item?.id || !item?.permalink) continue;
  // VIDEO / REELS expose a stable poster via thumbnail_url; photos via media_url.
  const src = item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url || item.thumbnail_url;
  if (!src) continue;

  const fileName = `${item.id}.jpg`;
  const filePath = path.join(OUT_DIR, fileName);
  keptFiles.add(fileName);

  if (!existsSync(filePath)) {
    const imgRes = await fetch(src);
    if (!imgRes.ok) {
      console.warn(`[instagram] Skipping ${item.id}: image download ${imgRes.status}`);
      continue;
    }
    const contentType = imgRes.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      console.warn(`[instagram] Skipping ${item.id}: unexpected content-type ${contentType}`);
      continue;
    }
    await writeFile(filePath, Buffer.from(await imgRes.arrayBuffer()));
    console.log(`[instagram] Downloaded ${fileName}`);
  }

  posts.push({
    id: item.id,
    // Relative to the site root; resolved at runtime via getAssetUrl()/BASE_URL
    // so custom-domain ("/") and project-page bases both work.
    image: `instagram/${fileName}`,
    url: item.permalink,
    caption: typeof item.caption === "string" ? item.caption.slice(0, 220) : "",
    mediaType: item.media_type ?? "IMAGE",
    productType: item.media_product_type ?? "FEED",
    publishedAt: item.timestamp ?? null,
  });
}

// Empty-success safeguard (runs BEFORE pruning): HTTP 200 with zero usable
// posts while the committed cache still holds posts almost certainly means a
// scope, permission, or filtering regression — not a genuinely emptied
// account. Preserve the last valid cache AND its thumbnails by exiting before
// any prune or write, and fail loudly (no commit happens). A genuinely empty
// account on the first run (no cached posts) still produces an empty feed.
if (posts.length === 0) {
  let cachedPosts = 0;
  try {
    const cached = JSON.parse(await readFile(FEED_JSON, "utf8"));
    if (Array.isArray(cached?.posts)) cachedPosts = cached.posts.length;
  } catch {
    // Missing or malformed cache: treat as first run, fall through.
  }
  if (cachedPosts > 0) {
    console.error(
      `[instagram] API returned 0 usable posts but cache holds ${cachedPosts} — preserving existing feed.json. Check token scope (instagram_business_basic) and media availability.`
    );
    process.exit(1);
  }
}

// Prune thumbnails for posts that dropped out of the latest 6 (keeps repo lean).
try {
  const onDisk = await readdir(OUT_DIR);
  for (const file of onDisk) {
    if (file === "feed.json" || file === ".gitkeep") continue;
    if (!keptFiles.has(file) && file.endsWith(".jpg")) {
      await rm(path.join(OUT_DIR, file));
      console.log(`[instagram] Pruned stale ${file}`);
    }
  }
} catch {
  // Non-fatal: a missing directory just means the first run.
}

await writeFile(
  FEED_JSON,
  JSON.stringify({ updatedAt: new Date().toISOString(), posts }, null, 2) + "\n"
);
console.log(redact(`[instagram] Wrote ${posts.length} posts to public/instagram/feed.json`));
