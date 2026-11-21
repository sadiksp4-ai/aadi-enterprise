/**
 * Deterministic slug utilities for the catalogue data layer.
 *
 * These helpers are deliberately independent of React and of the router:
 * Stage 1 only reserves the URL vocabulary so future brand / category /
 * product routes can be generated without ambiguity. No routes are declared
 * here.
 *
 * Design rules
 * - Lowercase, ASCII, URL-safe output: `Kärcher` -> `karcher`.
 * - Display names are never derived from slugs (callers keep the raw name).
 * - Invalid / empty input returns an empty string rather than throwing; use
 *   `SlugRegistry` when a fallback is required.
 * - Collisions and reserved words are reported, never silently swallowed.
 */

/** Future route keywords that must never be used as an entity slug. */
export const RESERVED_CATALOGUE_SLUGS: readonly string[] = [
  "all",
  "about",
  "brand",
  "brands",
  "catalogue",
  "categories",
  "category",
  "clients",
  "contact",
  "partners",
  "product",
  "products",
  "quotation",
  "search",
];

const RESERVED_SLUG_SET: ReadonlySet<string> = new Set(RESERVED_CATALOGUE_SLUGS);

/**
 * Characters that NFKD does not decompose into ASCII letters. Keys are
 * lowercase because folding happens before this map is applied.
 */
const TRANSLITERATIONS: Readonly<Record<string, string>> = {
  ß: "ss",
  æ: "ae",
  œ: "oe",
  ø: "o",
  đ: "d",
  ł: "l",
  þ: "th",
  ð: "d",
};

const TRANSLITERATION_PATTERN = new RegExp(
  `[${Object.keys(TRANSLITERATIONS).join("")}]`,
  "g"
);

function foldToAscii(value: string): string {
  return value.normalize("NFKD").replace(/\p{M}+/gu, "");
}

/**
 * Converts arbitrary text into a lowercase, hyphen-separated, URL-safe slug.
 *
 * Examples:
 * - `"Kärcher"` -> `"karcher"`
 * - `"T&G"` -> `"t-and-g"`
 * - `"Saraya / Mystair"` -> `"saraya-mystair"`
 * - `""` / `"!!!"` -> `""`
 */
export function slugify(value: string | null | undefined): string {
  if (typeof value !== "string") return "";

  return foldToAscii(value)
    .toLowerCase()
    .replace(
      TRANSLITERATION_PATTERN,
      (character) => TRANSLITERATIONS[character] ?? character
    )
    .replace(/&/g, " and ")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Slugify with a guaranteed non-empty result. The fallback is itself
 * slugified and finally defaults to `"item"`.
 */
export function slugifyWithFallback(
  value: string | null | undefined,
  fallback = "item"
): string {
  return slugify(value) || slugify(fallback) || "item";
}

export function isReservedSlug(value: string | null | undefined): boolean {
  if (typeof value !== "string") return false;
  return RESERVED_SLUG_SET.has(value.trim().toLowerCase());
}

/**
 * Index key for brand grouping: case, diacritics and repeated whitespace are
 * folded, while punctuation is preserved so `"T&G"` and `"TG"` are never
 * merged. Display names remain untouched on the catalogue records.
 */
export function normalizeBrandKey(value: string | null | undefined): string {
  if (typeof value !== "string") return "";

  return foldToAscii(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export type SlugCollisionReason = "duplicate" | "reserved" | "empty";

export interface SlugCollision {
  /** Slug requested by the caller (already slugified). */
  readonly desired: string;
  /** Slug actually assigned. */
  readonly assigned: string;
  /** Stable identifier of the source entity (category id, record id, …). */
  readonly sourceId: string;
  readonly reason: SlugCollisionReason;
}

/**
 * Assigns unique slugs within one namespace.
 *
 * - A reserved word is suffixed (`brands` -> `brands-2`).
 * - A repeated slug is suffixed (`sony`, `sony-2`, …).
 * - An empty slug falls back to `untitled`.
 *
 * Every adjusted assignment is recorded so callers can surface a report
 * instead of shipping ambiguous routes.
 */
export class SlugRegistry {
  private readonly reserved: ReadonlySet<string>;
  private readonly taken = new Map<string, string>();
  private readonly detected: SlugCollision[] = [];

  constructor(reserved: readonly string[] = RESERVED_CATALOGUE_SLUGS) {
    this.reserved = new Set(reserved);
  }

  register(desired: string, sourceId: string): string {
    const base = slugify(desired);
    let candidate = base;
    let reason: SlugCollisionReason | null = null;

    if (!candidate) {
      candidate = "untitled";
      reason = "empty";
    }

    if (this.reserved.has(candidate)) {
      reason = "reserved";
    }

    let suffix = 1;
    while (this.taken.has(candidate) || this.reserved.has(candidate)) {
      suffix += 1;
      candidate = `${base || "untitled"}-${suffix}`;
      if (!reason) reason = "duplicate";
    }

    if (reason) {
      this.detected.push({
        desired: base,
        assigned: candidate,
        sourceId,
        reason,
      });
    }

    this.taken.set(candidate, sourceId);
    return candidate;
  }

  has(slug: string): boolean {
    return this.taken.has(slug);
  }

  get size(): number {
    return this.taken.size;
  }

  getCollisions(): readonly SlugCollision[] {
    return [...this.detected];
  }
}
