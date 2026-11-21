import React, {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { CornerDownLeft, Search, X } from "lucide-react";
import { MorphingDialog } from "../ui/morphing-dialog";
import {
  runGlobalSearch,
  type GlobalSearchEntry,
} from "../../lib/global-search";
import "./GlobalSearch.css";

interface GlobalSearchProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

const SUGGESTIONS = ["Kärcher", "Kitchen", "Contact"] as const;
const SHORTCUT_LABEL =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
    ? "⌘ K"
    : "Ctrl K";

const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => runGlobalSearch(deferredQuery), [deferredQuery]);
  const flatResults = useMemo(
    () => results.flatMap((group) => group.items),
    [results]
  );
  const indexById = useMemo(
    () => new Map(flatResults.map((entry, index) => [entry.id, index])),
    [flatResults]
  );

  // Global shortcut: Ctrl+K on Windows/Linux, Cmd+K on macOS.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        !event.altKey &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  // Reset and focus whenever the palette opens.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const timer = window.setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Close when a result navigates the app.
  useEffect(() => {
    if (open) onOpenChange(false);
    // Only react to an actual path change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  useEffect(() => {
    setActiveIndex(0);
  }, [deferredQuery]);

  useEffect(() => {
    if (activeIndex >= flatResults.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, flatResults.length]);

  useEffect(() => {
    const item = document.getElementById(`gs-option-${activeIndex}`);
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const choose = (entry: GlobalSearchEntry) => {
    onOpenChange(false);
    navigate(entry.route);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (flatResults.length) {
        setActiveIndex((index) => (index + 1) % flatResults.length);
      }
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (flatResults.length) {
        setActiveIndex(
          (index) => (index - 1 + flatResults.length) % flatResults.length
        );
      }
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const entry = flatResults[activeIndex];
      if (entry) choose(entry);
    }
  };

  const clear = () => {
    setQuery("");
    setActiveIndex(0);
    inputRef.current?.focus({ preventScroll: true });
  };

  const activeId =
    flatResults.length && activeIndex < flatResults.length
      ? `gs-option-${activeIndex}`
      : undefined;

  return createPortal(
    <MorphingDialog
      id="global-search"
      open={open}
      onOpenChange={onOpenChange}
      title="Search Aadi Enterprises"
      showHeader={false}
      className="gs-dialog max-w-3xl p-0"
      closeClassName="gs-dialog-close"
    >
      <div className="gs">
        <div className="gs-input-row">
          <Search size={20} aria-hidden="true" className="gs-input-icon" />
          <input
            ref={inputRef}
            type="text"
            className="gs-input"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search products, brands, categories, pages…"
            aria-label="Search products, brands, categories and pages"
            aria-autocomplete="list"
            aria-controls="gs-results"
            aria-activedescendant={activeId}
            role="combobox"
            aria-expanded={open}
            autoComplete="off"
            spellCheck={false}
          />
          {query ? (
            <button
              type="button"
              className="gs-clear"
              onClick={clear}
              aria-label="Clear search"
            >
              <X size={16} aria-hidden="true" />
            </button>
          ) : (
            <kbd className="gs-shortcut" aria-hidden="true">
              {SHORTCUT_LABEL}
            </kbd>
          )}
        </div>

        <div className="gs-body">
          {!deferredQuery.trim() ? (
            <div className="gs-empty">
              <p className="gs-empty-title">Search the Aadi catalogue.</p>
              <p className="gs-empty-text">
                Products, brands, categories and pages.
              </p>
              <div className="gs-suggestions">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="gs-suggestion"
                    onClick={() => {
                      setQuery(suggestion);
                      inputRef.current?.focus({ preventScroll: true });
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="gs-empty">
              <p className="gs-empty-title">No results for “{query.trim()}”.</p>
              <button type="button" className="gs-suggestion" onClick={clear}>
                Clear search
              </button>
            </div>
          ) : (
            <div
              className="gs-results"
              id="gs-results"
              role="listbox"
              aria-label="Search results"
            >
              {results.map((group) => (
                <section
                  key={group.group}
                  className="gs-group"
                  aria-labelledby={`gs-group-${group.group}`}
                >
                  <h3
                    id={`gs-group-${group.group}`}
                    className="gs-group-label"
                  >
                    {group.label}
                  </h3>
                  <div role="group" aria-labelledby={`gs-group-${group.group}`}>
                    {group.items.map((entry) => {
                      const index = indexById.get(entry.id) ?? 0;
                      const isActive = index === activeIndex;
                      return (
                        <button
                          key={entry.id}
                          id={`gs-option-${index}`}
                          type="button"
                          role="option"
                          aria-selected={isActive}
                          className={`gs-item${isActive ? " is-active" : ""}`}
                          onMouseEnter={() => setActiveIndex(index)}
                          onClick={() => choose(entry)}
                        >
                          <span className="gs-item-title">{entry.title}</span>
                          <span className="gs-item-context">
                            {entry.context}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <footer className="gs-footer">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> Navigate
          </span>
          <span>
            <CornerDownLeft size={12} aria-hidden="true" /> Open
          </span>
          <button
            type="button"
            className="gs-footer-close"
            onClick={() => onOpenChange(false)}
          >
            <X size={12} aria-hidden="true" /> Close
          </button>
          <span className="gs-live" role="status" aria-live="polite">
            {deferredQuery.trim()
              ? `${flatResults.length} ${
                  flatResults.length === 1 ? "result" : "results"
                }`
              : ""}
          </span>
        </footer>
      </div>
    </MorphingDialog>,
    document.body
  );
};

export default GlobalSearch;
