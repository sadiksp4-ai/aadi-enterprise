'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motionTransitions } from '../../lib/motion-tokens';

export interface MorphingDialogProps {
  /** Shared-layout id. The surface morphs from/to any element carrying the same layoutId. */
  id?: string;
  /** Controlled open state. Omit to drive the dialog through `trigger` (EasyUI mode). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Uncontrolled trigger render prop. */
  trigger?: (open: () => void) => React.ReactNode;
  /** Accessible name for the dialog surface. */
  title: string;
  subtitle?: string;
  /** Render the built-in header. Set false when the caller provides its own header. */
  showHeader?: boolean;
  children: React.ReactNode;
  className?: string;
  closeClassName?: string;
  /** Fires once the closing animation has finished — release content/sources here. */
  onExitComplete?: () => void;
}

/**
 * EasyUI morphing dialog, adapted to the site.
 *
 * Behaviour on top of the vendored component:
 * - controlled `open` / `onOpenChange` alongside the original trigger API;
 * - Escape to close and a document scroll lock that restores the previous
 *   overflow value instead of forcing `unset`;
 * - a focus trap while open and focus returned to the trigger on close;
 * - `role="dialog"` / `aria-modal` / `aria-label` on the surface.
 *
 * The surface carries `layoutId={id}`; render the opener (e.g. a card) as a
 * motion element with the same layoutId and the dialog will expand from it
 * and morph back on close. Layout animations are disabled automatically for
 * users who prefer reduced motion (MotionConfig `reducedMotion="user"`).
 */
export const MorphingDialog: React.FC<MorphingDialogProps> = ({
  id = 'morph-dialog',
  open,
  onOpenChange,
  trigger,
  title,
  subtitle,
  showHeader = true,
  children,
  className,
  closeClassName,
  onExitComplete,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? (open as boolean) : internalOpen;

  const surfaceRef = useRef<HTMLDivElement>(null);

  // Keep the change callback in a ref so the focus/scroll effect below only
  // re-runs when the open state actually flips.
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChangeRef.current?.(next);
    },
    [isControlled]
  );

  // Scroll lock, Escape, focus trap and focus return while the dialog is open.
  useEffect(() => {
    if (!isOpen) return;
    const surface = surfaceRef.current;
    if (!surface) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Move focus onto the surface so screen readers announce the dialog.
    surface.focus({ preventScroll: true });

    const focusableSelector =
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const focusables = () =>
      Array.from(surface.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => el.getClientRects().length > 0
      );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === surface)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || active === surface)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [isOpen, setOpen]);

  return (
    <>
      {trigger && <div className="inline-block">{trigger(() => setOpen(true))}</div>}

      <AnimatePresence onExitComplete={onExitComplete}>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={motionTransitions.easeSoft}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-[rgba(5,9,9,0.72)] backdrop-blur-md"
            />

            {/* Expanded Morphing Surface */}
            <motion.div
              layoutId={id}
              transition={motionTransitions.springMorph}
              ref={surfaceRef}
              role="dialog"
              aria-modal="true"
              aria-label={title}
              tabIndex={-1}
              className={cn(
                'relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-popover p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:p-8',
                className
              )}
            >
              {showHeader && (
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <motion.h3
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
                    >
                      {title}
                    </motion.h3>
                    {subtitle && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mt-1 text-xs text-muted-foreground sm:text-sm"
                      >
                        {subtitle}
                      </motion.p>
                    )}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cn(
                  'focus-ring absolute right-4 top-4 z-20 inline-flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground',
                  closeClassName
                )}
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Body — fades in after the surface has started its morph. */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ delay: 0.12, ...motionTransitions.easeSoft }}
                className={showHeader ? 'mt-4' : undefined}
              >
                {children}
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
