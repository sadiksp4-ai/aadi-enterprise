'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Command } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motionTransitions } from '../../lib/motion-tokens';
import { usePrefersReducedMotion } from '../../lib/use-reduced-motion';

export interface ExpandableSearchProps {
  placeholder?: string;
  /** Controlled query value. */
  value?: string;
  /** Initial value when uncontrolled. */
  defaultValue?: string;
  /** Fires on every keystroke and when the query is cleared. */
  onValueChange?: (query: string) => void;
  /** EasyUI alias for onValueChange. */
  onSearch?: (query: string) => void;
  /** Accessible name for the input. */
  ariaLabel?: string;
  className?: string;
}

/**
 * EasyUI expandable search, adapted to the approved products search bar.
 *
 * The shell reuses the site's `.px-search` treatment (background, border,
 * radius, focus ring via :focus-within) so the resting design is unchanged;
 * framer-motion animates only `maxWidth` — 36rem at rest growing to the
 * approved 40rem while typing — so it never fights the CSS border-color
 * transitions. On viewports narrower than the resting width the two states
 * clamp to the available width and nothing visually moves.
 *
 * ⌘K / Ctrl+K focuses the field from anywhere on the page.
 */
export const ExpandableSearch: React.FC<ExpandableSearchProps> = ({
  placeholder = 'Search…',
  value,
  defaultValue = '',
  onValueChange,
  onSearch,
  ariaLabel,
  className,
}) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
    onSearch?.(next);
  };

  const handleOpen = () => {
    setIsExpanded(true);
    inputRef.current?.focus();
  };

  const handleClose = () => {
    setIsExpanded(false);
    setValue('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // ⌘K / Ctrl+K focuses the search from anywhere on the page.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsExpanded(true);
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Width is the only animated property — border colour and the focus ring
  // stay on the site's CSS transitions. Under reduced motion the bar keeps
  // the approved full width in both states.
  const restingMaxWidth = 576; // 36rem
  const expandedMaxWidth = 640; // 40rem (approved .px-search width)

  return (
    <motion.div
      animate={{
        maxWidth: prefersReducedMotion || isExpanded ? expandedMaxWidth : restingMaxWidth,
      }}
      transition={motionTransitions.springMorph}
      className={cn('px-search cursor-text', className)}
      onClick={handleOpen}
    >
      <Search size={18} aria-hidden="true" className="px-search-icon" />
      <input
        ref={inputRef}
        type="search"
        value={currentValue}
        onChange={handleChange}
        onFocus={() => setIsExpanded(true)}
        onBlur={() => !currentValue && setIsExpanded(false)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
      />
      <AnimatePresence>
        {currentValue ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="px-search-clear"
            aria-label="Clear search"
          >
            <X size={15} aria-hidden="true" />
          </button>
        ) : (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
            className="hidden sm:inline-flex shrink-0 select-none items-center gap-1 rounded border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] text-text-muted"
          >
            <Command className="h-2.5 w-2.5" />
            <span>K</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
