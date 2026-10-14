import { useEffect, useState } from "react";
import { ArrowUpRight, Clapperboard, Instagram, Play } from "lucide-react";
import { getAssetUrl } from "../../utils";
import "./InstagramFeed.css";

const PROFILE_URL = "https://www.instagram.com/aadienterprises_/";
const HANDLE = "@aadienterprises_";
const POST_LIMIT = 6;

interface FeedPost {
  id: string;
  image: string;
  url: string;
  caption: string;
  mediaType: string;
  productType: string;
  publishedAt: string | null;
}

type Status = "loading" | "ready" | "empty" | "error";

function isReel(post: FeedPost): boolean {
  return post.productType === "REELS";
}

function isVideo(post: FeedPost): boolean {
  return post.mediaType === "VIDEO" && post.productType !== "REELS";
}

function altText(post: FeedPost, index: number): string {
  const caption = post.caption.trim().replace(/\s+/g, " ");
  if (caption) return `Instagram post ${index + 1} by ${HANDLE}: ${caption.slice(0, 100)}`;
  return `Instagram post ${index + 1} by ${HANDLE}`;
}

/**
 * Homepage Instagram section. Reads the build-time generated
 * `instagram/feed.json` (committed by the scheduled workflow) — no tokens,
 * no third-party scripts, no runtime calls to Meta.
 */
export default function InstagramFeed() {
  const [status, setStatus] = useState<Status>("loading");
  const [posts, setPosts] = useState<FeedPost[]>([]);
  // Thumbnails that failed to load are dropped from the grid so a broken
  // image never breaks the homepage layout.
  const [failed, setFailed] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(getAssetUrl("instagram/feed.json"), { cache: "no-store" });
        if (!res.ok) throw new Error(`feed.json ${res.status}`);
        const data = await res.json();
        const list: FeedPost[] = Array.isArray(data?.posts)
          ? data.posts.filter((p: FeedPost) => p?.image && p?.url).slice(0, POST_LIMIT)
          : [];
        if (cancelled) return;
        if (list.length === 0) {
          setStatus("empty");
        } else {
          setPosts(list);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = posts.filter((post) => !failed.has(post.id));
  const showGrid = status === "ready" && visible.length > 0;
  // Every thumbnail failed (or the fetch failed): fall back to the
  // follow note so the homepage never shows a broken grid.
  const showUnavailable =
    status === "error" || (status === "ready" && visible.length === 0);

  return (
    <section className="hx-instagram" aria-labelledby="hx-instagram-title">
      <div className="hx-section-inner">
        <div className="hx-section-head">
          <p className="hx-eyebrow">Instagram</p>
          <h2 id="hx-instagram-title" className="hx-section-title">
            Follow Our Journey
          </h2>
          <p className="hx-section-text">
            Recent work, products and moments from{" "}
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hx-instagram-handle"
            >
              {HANDLE}
            </a>
            .
          </p>
        </div>

        {status === "loading" && (
          <ul className="hx-instagram-grid" aria-label="Loading Instagram posts" aria-busy="true">
            {Array.from({ length: POST_LIMIT }).map((_, i) => (
              <li key={i} className="hx-instagram-skeleton" aria-hidden="true" />
            ))}
          </ul>
        )}

        {showGrid && (
          <ul className="hx-instagram-grid" aria-label={`Latest Instagram posts from ${HANDLE}`}>
            {visible.map((post, index) => (
              <li key={post.id}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hx-instagram-card"
                  aria-label={`Open Instagram post ${index + 1} in a new tab`}
                >
                  <img
                    src={getAssetUrl(post.image)}
                    alt={altText(post, index)}
                    loading="lazy"
                    decoding="async"
                    onError={() => {
                      setFailed((prev) => new Set(prev).add(post.id));
                    }}
                  />
                  <span className="hx-instagram-overlay" aria-hidden="true">
                    <Instagram size={22} />
                  </span>
                  {isReel(post) && (
                    <span className="hx-instagram-badge">
                      <Clapperboard size={13} aria-hidden="true" />
                      Reel
                    </span>
                  )}
                  {isVideo(post) && (
                    <span className="hx-instagram-badge">
                      <Play size={13} aria-hidden="true" />
                      Video
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}

        {status === "empty" && (
          <p className="hx-instagram-note" role="status">
            New posts are on the way — follow{" "}
            <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
              {HANDLE}
            </a>{" "}
            to see our latest work.
          </p>
        )}

        {showUnavailable && (
          <p className="hx-instagram-note" role="status">
            We couldn&apos;t load our latest posts right now. View{" "}
            <a href={PROFILE_URL} target="_blank" rel="noopener noreferrer">
              {HANDLE}
            </a>{" "}
            on Instagram to see more.
          </p>
        )}

        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hx-link"
          aria-label={`View ${HANDLE} on Instagram (opens in a new tab)`}
        >
          View Instagram
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
