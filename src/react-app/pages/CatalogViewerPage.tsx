import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent, PointerEvent } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { PageFlip } from "page-flip";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  LayoutGrid,
  Maximize,
  Minimize,
  Search,
  X,
} from "lucide-react";
import Seo from "../components/Seo/Seo";
import WhatsAppIcon from "../components/WhatsAppIcon";
import { getWhatsAppUrl } from "../utils/whatsapp";
import { useIsMobileViewport } from "../lib/use-media-query";
import {
  CATALOG_INDEX_URL,
  CATALOG_TITLE,
  catalogPagePath,
  catalogPageUrl,
  clampPage,
  searchCatalog,
  spreadLeftPage,
} from "../lib/tramontina-catalog";
import type { CatalogIndex } from "../lib/tramontina-catalog";
import "./CatalogViewerPage.css";

type ZoomLevel = 1 | 1.5 | 2;

const ZOOM_LEVELS: ZoomLevel[] = [1, 1.5, 2];
const DEFAULT_PAGE_RATIO = 1.414;
const FLIP_DURATION_MS = 700;

function parsePageParam(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default function CatalogViewerPage() {
  const { pageNumber } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isMobile = useIsMobileViewport();

  const requestedPage = parsePageParam(pageNumber ?? searchParams.get("page"));

  const [catalog, setCatalog] = useState<CatalogIndex | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [pageRatio, setPageRatio] = useState(DEFAULT_PAGE_RATIO);
  const [current, setCurrent] = useState(() => requestedPage ?? 1);
  const currentRef = useRef(current);
  const [zoom, setZoom] = useState<ZoomLevel>(1);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [thumbsOpen, setThumbsOpen] = useState(false);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [jumpValue, setJumpValue] = useState("");
  const [inquirySku, setInquirySku] = useState("");
  const [inquiryQty, setInquiryQty] = useState("1");
  const [inquiryNote, setInquiryNote] = useState("");

  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bookHostRef = useRef<HTMLDivElement>(null);
  const flipRef = useRef<PageFlip | null>(null);

  const pages = catalog?.pages;
  const total = catalog?.totalPages ?? 0;

  const commitPage = useCallback((page: number) => {
    currentRef.current = page;
    setCurrent(page);
  }, []);

  const pageFromIndex = useCallback(
    (index: number) => (isMobile ? index + 1 : spreadLeftPage(index)),
    [isMobile],
  );

  useEffect(() => {
    let cancelled = false;
    fetch(CATALOG_INDEX_URL)
      .then((response) => {
        if (!response.ok) throw new Error(`Catalogue index HTTP ${response.status}`);
        return response.json() as Promise<CatalogIndex>;
      })
      .then((data) => {
        if (!cancelled) setCatalog(data);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!pages?.length) return;
    const probe = new Image();
    probe.onload = () => {
      if (probe.naturalWidth > 0) setPageRatio(probe.naturalHeight / probe.naturalWidth);
    };
    probe.src = pages[0].image;
  }, [pages]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let timer: number | undefined;
    const measure = () => setStageSize({ width: el.clientWidth, height: el.clientHeight });
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(measure, 150);
    });
    observer.observe(el);
    measure();
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const layout = useMemo(() => {
    const availableWidth = Math.max(stageSize.width - 32, 0);
    const availableHeight = Math.max(stageSize.height - 24, 0);
    const basePageWidth = isMobile
      ? Math.min(availableWidth, availableHeight / pageRatio)
      : Math.min(availableWidth / 2, availableHeight / pageRatio);
    const pageWidth = Math.floor(basePageWidth * zoom);
    const pageHeight = Math.floor(pageWidth * pageRatio);
    return {
      pageWidth,
      pageHeight,
      bookWidth: isMobile ? pageWidth : pageWidth * 2,
    };
  }, [stageSize, isMobile, pageRatio, zoom]);

  const ready =
    !!pages?.length && stageSize.width > 0 && stageSize.height > 0 && layout.pageWidth > 0;

  useEffect(() => {
    const host = bookHostRef.current;
    if (!ready || !host || !pages) return;

    const book = document.createElement("div");
    book.className = "cv-book";
    book.style.width = `${layout.bookWidth}px`;
    book.style.height = `${layout.pageHeight}px`;
    host.appendChild(book);

    const pageNodes = pages.map((entry) => {
      const node = document.createElement("div");
      node.className = "cv-page";
      const img = document.createElement("img");
      img.src = entry.image;
      img.alt = `${CATALOG_TITLE}, page ${entry.page}`;
      img.loading = "lazy";
      img.decoding = "async";
      img.draggable = false;
      node.appendChild(img);
      return node;
    });

    const flip = new PageFlip(book, {
      width: layout.pageWidth,
      height: layout.pageHeight,
      size: "fixed",
      showCover: true,
      usePortrait: true,
      autoSize: false,
      startPage: Math.max(0, currentRef.current - 1),
      flippingTime: FLIP_DURATION_MS,
      drawShadow: true,
      maxShadowOpacity: 0.35,
      mobileScrollSupport: true,
      useMouseEvents: true,
      swipeDistance: 30,
      showPageCorners: true,
    });

    let active = true;
    flip.loadFromHTML(pageNodes);
    flip.on("flip", () => {
      if (!active) return;
      commitPage(pageFromIndex(flip.getCurrentPageIndex()));
    });
    flipRef.current = flip;
    commitPage(pageFromIndex(Math.max(0, currentRef.current - 1)));

    return () => {
      active = false;
      flip.destroy();
      flipRef.current = null;
      book.remove();
    };
  }, [ready, pages, layout, pageFromIndex, commitPage]);

  const goToPage = useCallback(
    (requested: number) => {
      if (!total) return;
      const page = clampPage(requested, total);
      flipRef.current?.turnToPage(page - 1);
      commitPage(isMobile ? page : spreadLeftPage(page - 1));
    },
    [total, isMobile, commitPage],
  );

  useEffect(() => {
    if (!total) return;
    const target = clampPage(requestedPage ?? 1, total);
    if (target !== currentRef.current) goToPage(target);
    // Runs only when the URL page changes; flips write the URL below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedPage, total]);

  useEffect(() => {
    if (!total) return;
    const expected = requestedPage ?? 1;
    if (current !== expected) {
      navigate(catalogPagePath(current), { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, total]);

  useEffect(() => {
    if (!current) return;
    const warm = [current, current + 1, current + 2, current + 3];
    warm.forEach((page) => {
      const entry = pages?.[page - 1];
      if (entry) new Image().src = entry.image;
    });
  }, [current, pages]);

  const rightPage = !isMobile && current > 1 && current + 1 <= total ? current + 1 : null;
  const spreadPages = rightPage ? [current, rightPage] : [current];
  const spreadSkus = useMemo(() => {
    if (!pages) return [];
    const set = new Set<string>();
    spreadPages.forEach((page) => pages[page - 1]?.skus.forEach((sku) => set.add(sku)));
    return Array.from(set);
    // spreadPages is derived from current/rightPage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, current, rightPage]);

  const pageUrl = catalogPageUrl(current);
  const indicator = rightPage ? `${current}–${rightPage}` : `${current}`;
  const seoTitle = `${CATALOG_TITLE} – Page ${indicator} | Aadi Enterprises`;
  const seoDescription = [
    `Browse page ${indicator} of the ${CATALOG_TITLE} for professional cookware, knives and kitchen utensils.`,
    spreadSkus.length ? `Product codes: ${spreadSkus.slice(0, 6).join(", ")}.` : null,
    "Search by SKU and enquire on WhatsApp.",
  ]
    .filter(Boolean)
    .join(" ");

  const flipNext = useCallback(() => {
    if (flipRef.current) {
      flipRef.current.flipNext("top");
    } else {
      goToPage(isMobile ? current + 1 : current === 1 ? 2 : current + 2);
    }
  }, [current, goToPage, isMobile]);

  const flipPrev = useCallback(() => {
    if (flipRef.current) {
      flipRef.current.flipPrev("top");
    } else {
      goToPage(isMobile ? current - 1 : current <= 2 ? 1 : current - 2);
    }
  }, [current, goToPage, isMobile]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
        return;
      }
      if (event.key === "ArrowRight") flipNext();
      if (event.key === "ArrowLeft") flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipNext, flipPrev]);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen().catch(() => undefined);
      return;
    }
    void rootRef.current?.requestFullscreen().catch(() => undefined);
  };

  const searchState = useMemo(() => {
    if (!catalog) return { results: [], total: 0 };
    return searchCatalog(catalog, query);
  }, [catalog, query]);

  const onSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    const first = searchState.results[0];
    if (first) selectSearchResult(first.page);
  };

  const selectSearchResult = (page: number) => {
    goToPage(page);
    setSearchOpen(false);
  };

  const onJumpSubmit = (event: FormEvent) => {
    event.preventDefault();
    const parsed = parsePageParam(jumpValue);
    if (parsed) goToPage(parsed);
    setJumpValue("");
  };

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const shareWhatsAppUrl = getWhatsAppUrl(
    `Tramontina Hospitality Catalogue, page ${indicator}: ${pageUrl}`,
  );

  const enquiryMessage = [
    `Hello Aadi Enterprises! I'm looking at the ${CATALOG_TITLE}, page ${indicator}.`,
    `Link: ${pageUrl}`,
    inquirySku === "other"
      ? "SKU: not listed on this page (see note)"
      : inquirySku
        ? `SKU: ${inquirySku}`
        : null,
    `Quantity: ${inquiryQty || "1"}`,
    inquiryNote.trim() ? `Note: ${inquiryNote.trim()}` : null,
    "Please share pricing and availability.",
  ]
    .filter(Boolean)
    .join("\n");

  const enquiryWhatsAppUrl = getWhatsAppUrl(enquiryMessage);

  const panRef = useRef<{ id: number; x: number; y: number; left: number; top: number } | null>(null);

  const onPanStart = (event: PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1 || event.pointerType !== "mouse" || event.button !== 0) return;
    const el = event.currentTarget;
    panRef.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: el.scrollLeft,
      top: el.scrollTop,
    };
    el.setPointerCapture(event.pointerId);
    el.dataset.panning = "true";
  };

  const onPanMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = panRef.current;
    if (!start || start.id !== event.pointerId) return;
    const el = event.currentTarget;
    el.scrollLeft = start.left - (event.clientX - start.x);
    el.scrollTop = start.top - (event.clientY - start.y);
  };

  const onPanEnd = (event: PointerEvent<HTMLDivElement>) => {
    const start = panRef.current;
    if (!start || start.id !== event.pointerId) return;
    panRef.current = null;
    const el = event.currentTarget;
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    delete el.dataset.panning;
  };

  const canPrev = current > 1;
  const canNext = current < total;

  const bookWrapWidth = Math.max(stageSize.width, layout.bookWidth);
  const bookWrapHeight = Math.max(stageSize.height, layout.pageHeight);

  return (
    <section
      ref={rootRef}
      className={`cv-root${isFullscreen ? " is-fullscreen" : ""}${zoom > 1 ? " is-zoomed" : ""}`}
      aria-label={CATALOG_TITLE}
    >
      <Seo title={seoTitle} description={seoDescription} canonicalPath={catalogPagePath(current)} />
      <header className="cv-bar">
        <div className="cv-bar-group cv-bar-brand">
          <Link to="/" className="cv-back">
            <ChevronLeft size={16} aria-hidden="true" />
            Back to website
          </Link>
          <nav className="cv-crumbs" aria-label="Breadcrumb">
            <Link to="/products">Catalogs</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Tramontina</span>
          </nav>
          <h1 className="cv-title">{CATALOG_TITLE}</h1>
        </div>

        <div className="cv-bar-group cv-bar-search">
          <form className="cv-search" role="search" onSubmit={onSearchSubmit}>
            <Search size={16} aria-hidden="true" className="cv-search-icon" />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => window.setTimeout(() => setSearchOpen(false), 150)}
              placeholder="Search keyword or SKU…"
              aria-label="Search catalogue by keyword or SKU"
              aria-controls="cv-search-results"
              aria-expanded={searchOpen && query.trim().length > 0}
              className="cv-search-input"
              disabled={!catalog}
            />
            {query && (
              <button
                type="button"
                className="cv-icon-btn cv-search-clear"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </form>
          {searchOpen && query.trim() && (
            <div id="cv-search-results" className="cv-search-results" role="listbox">
              {searchState.results.length === 0 && <p className="cv-muted">No matches found.</p>}
              {searchState.results.length > 0 && (
                <p className="cv-muted cv-results-count">
                  {searchState.total} page{searchState.total === 1 ? "" : "s"} found
                </p>
              )}
              {searchState.results.map((result) => (
                <button
                  key={result.page}
                  type="button"
                  className="cv-result"
                  role="option"
                  aria-selected={false}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSearchResult(result.page)}
                >
                  <span className="cv-result-page">Page {result.page}</span>
                  {result.matchedSkus.length > 0 && (
                    <span className="cv-result-skus">{result.matchedSkus.join(", ")}</span>
                  )}
                  <span className="cv-result-snippet">{result.snippet}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="cv-bar-group cv-bar-controls">
          <p className="cv-indicator" aria-live="polite">
            Page <strong>{indicator}</strong> of {total || "—"}
          </p>
          <form className="cv-jump" onSubmit={onJumpSubmit}>
            <label htmlFor="cv-jump-input" className="cv-sr-only">
              Jump to page
            </label>
            <input
              id="cv-jump-input"
              type="number"
              inputMode="numeric"
              min={1}
              max={total || undefined}
              value={jumpValue}
              onChange={(event) => setJumpValue(event.target.value)}
              placeholder="Go to"
              className="cv-jump-input"
              disabled={!total}
            />
          </form>
          <div className="cv-zoom" role="group" aria-label="Zoom">
            {ZOOM_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                className={`cv-zoom-btn${zoom === level ? " is-active" : ""}`}
                aria-pressed={zoom === level}
                onClick={() => setZoom(level)}
              >
                {level}x
              </button>
            ))}
          </div>
          <button
            type="button"
            className={`cv-icon-btn${thumbsOpen ? " is-active" : ""}`}
            aria-label={thumbsOpen ? "Hide thumbnails" : "Show thumbnails"}
            aria-pressed={thumbsOpen}
            onClick={() => setThumbsOpen((open) => !open)}
          >
            <LayoutGrid size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="cv-icon-btn"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize size={18} aria-hidden="true" /> : <Maximize size={18} aria-hidden="true" />}
          </button>
          <button
            type="button"
            className={`cv-enquire${inquiryOpen ? " is-active" : ""}`}
            aria-expanded={inquiryOpen}
            onClick={() => setInquiryOpen((open) => !open)}
          >
            <WhatsAppIcon size={16} />
            Enquire
          </button>
        </div>
      </header>

      <div className="cv-stage" ref={stageRef}>
        {!catalog && !loadFailed && <p className="cv-status">Loading catalogue…</p>}
        {loadFailed && (
          <p className="cv-status">
            The catalogue could not be loaded. Please{" "}
            <a href={getWhatsAppUrl("Hello Aadi Enterprises! I need the Tramontina catalogue.")} target="_blank" rel="noopener noreferrer">
              message us on WhatsApp
            </a>{" "}
            for a copy.
          </p>
        )}

        {catalog && (
          <div
            className="cv-scroll"
            onPointerDown={onPanStart}
            onPointerMove={onPanMove}
            onPointerUp={onPanEnd}
            onPointerCancel={onPanEnd}
          >
            <div
              className="cv-book-wrap"
              style={{ width: bookWrapWidth, height: bookWrapHeight }}
            >
              <div ref={bookHostRef} className="cv-book-host" />
            </div>
          </div>
        )}

        {catalog && (
          <>
            <button
              type="button"
              className="cv-nav cv-nav-prev"
              aria-label="Previous page"
              onClick={flipPrev}
              disabled={!canPrev}
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="cv-nav cv-nav-next"
              aria-label="Next page"
              onClick={flipNext}
              disabled={!canNext}
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        )}

        {thumbsOpen && pages && (
          <aside className="cv-thumbs" aria-label="Page thumbnails">
            <div className="cv-thumbs-head">
              <span>All pages</span>
              <button
                type="button"
                className="cv-icon-btn"
                aria-label="Close thumbnails"
                onClick={() => setThumbsOpen(false)}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <div className="cv-thumbs-grid">
              {pages.map((entry) => {
                const active = spreadPages.includes(entry.page);
                return (
                  <button
                    key={entry.page}
                    type="button"
                    className={`cv-thumb${active ? " is-active" : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={() => goToPage(entry.page)}
                  >
                    <img src={entry.image} alt="" loading="lazy" decoding="async" draggable={false} />
                    <span>{entry.page}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {inquiryOpen && catalog && (
          <div className="cv-inquiry" role="dialog" aria-label="Enquire about this page">
            <div className="cv-inquiry-head">
              <h2>Enquire about page {indicator}</h2>
              <button
                type="button"
                className="cv-icon-btn"
                aria-label="Close enquiry"
                onClick={() => setInquiryOpen(false)}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <label className="cv-field">
              <span>Product SKU</span>
              <select value={inquirySku} onChange={(event) => setInquirySku(event.target.value)}>
                <option value="">
                  {spreadSkus.length ? "Select a SKU on this page" : "No product codes on this page"}
                </option>
                {spreadSkus.map((sku) => (
                  <option key={sku} value={sku}>
                    {sku}
                  </option>
                ))}
                <option value="other">Not listed / other</option>
              </select>
            </label>

            <label className="cv-field">
              <span>Quantity</span>
              <input
                type="number"
                min={1}
                value={inquiryQty}
                onChange={(event) => setInquiryQty(event.target.value)}
              />
            </label>

            <label className="cv-field">
              <span>Note (optional)</span>
              <textarea
                rows={3}
                value={inquiryNote}
                onChange={(event) => setInquiryNote(event.target.value)}
                placeholder="Product name, size, or any other detail"
              />
            </label>

            <a
              className="cv-wa-primary"
              href={enquiryWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon size={16} />
              Send enquiry on WhatsApp
            </a>

            <div className="cv-inquiry-actions">
              <a className="cv-wa-secondary" href={shareWhatsAppUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={14} />
                Share page
              </a>
              <button type="button" className="cv-wa-secondary" onClick={copyPageLink}>
                {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                {copied ? "Link copied" : "Copy page link"}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
