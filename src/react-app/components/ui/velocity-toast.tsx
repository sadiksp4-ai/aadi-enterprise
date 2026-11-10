'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Check, X, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motionTransitions } from '../../lib/motion-tokens';
import { usePrefersReducedMotion } from '../../lib/use-reduced-motion';

export type VelocityToastVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type VelocityToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface VelocityToastProps {
  open: boolean;
  onDismiss?: () => void;
  title: string;
  description?: string;
  duration?: number;
  variant?: VelocityToastVariant;
  position?: VelocityToastPosition;
  showProgress?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const positionClasses: Record<VelocityToastPosition, string> = {
  'top-left': 'top-5 left-5 items-start',
  'top-center': 'top-5 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-5 right-5 items-end',
  'bottom-left': 'bottom-5 left-5 items-start',
  'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-5 right-5 items-end',
};

const variantIcon = (variant: VelocityToastVariant, custom?: React.ReactNode) => {
  if (custom) return custom;
  switch (variant) {
    case 'success':
      return <Check className="h-4 w-4 text-emerald-400" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-amber-400" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-rose-400" />;
    case 'info':
      return <Info className="h-4 w-4 text-sky-400" />;
    default:
      return <Info className="h-4 w-4 text-muted-foreground" />;
  }
};

/**
 * EasyUI VelocityToast, adapted to the site.
 *
 * Enters with velocity and settles; the progress bar responds naturally,
 * pauses on hover and resumes without a jump. Reduced motion disables the
 * progress animation and uses a plain timeout instead.
 */
export const VelocityToast: React.FC<VelocityToastProps> = ({
  open,
  onDismiss,
  title,
  description,
  duration = 4000,
  variant = 'default',
  position = 'bottom-center',
  showProgress = true,
  icon,
  className,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(open);
  const [isPaused, setIsPaused] = useState(false);

  const progressMV = useMotionValue(100);
  const progressWidth = useTransform(progressMV, (v) => `${v}%`);

  const remainingRef = useRef<number>(duration);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);
    progressMV.set(100);
    remainingRef.current = duration;
    startRef.current = performance.now();
  }, [open, duration, progressMV]);

  // Animate progress from 100 -> 0. When paused we freeze the time origin so
  // resume picks up where it left off.
  useEffect(() => {
    if (!isVisible || !showProgress || prefersReducedMotion) return;

    if (isPaused) {
      startRef.current = performance.now() - (duration - remainingRef.current);
      return;
    }

    startRef.current = performance.now() - (duration - remainingRef.current);

    const tick = () => {
      const elapsed = performance.now() - startRef.current;
      const remaining = Math.max(0, duration - elapsed);
      remainingRef.current = remaining;
      const linear = remaining / duration;
      const eased = Math.pow(linear, 1.05);
      progressMV.set(eased * 100);

      if (remaining <= 0) {
        setIsVisible(false);
        onDismiss?.();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, isPaused, duration, progressMV, showProgress, prefersReducedMotion, onDismiss]);

  // Reduced-motion fallback: plain timeout dismiss.
  useEffect(() => {
    if (!isVisible || !prefersReducedMotion) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, duration);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isVisible, duration, prefersReducedMotion, onDismiss]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  const isTop = position.startsWith('top');
  const instant = prefersReducedMotion
    ? ({ type: 'tween', duration: 0 } as const)
    : undefined;

  return (
    <div
      className={cn(
        'pointer-events-none fixed z-50 flex flex-col',
        positionClasses[position]
      )}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: isTop ? -22 : 22, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, y: isTop ? -12 : 12 }}
            transition={instant ?? motionTransitions.springSnappy}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={cn(
              'pointer-events-auto relative max-w-md min-w-[280px] overflow-hidden rounded-xl border border-border bg-popover p-3.5 font-sans text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.6)] select-none sm:min-w-[340px] sm:p-4',
              className
            )}
            role="status"
            aria-live="polite"
          >
            <div className="relative z-10 flex items-center justify-between gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card">
                {variantIcon(variant, icon)}
              </div>

              <div className="min-w-0 flex-1 pr-1">
                <p className="truncate text-xs font-semibold text-foreground">{title}</p>
                {description && (
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{description}</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="focus-ring rounded-md p-1 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {showProgress && !prefersReducedMotion && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden bg-border">
                <motion.div
                  className="h-full bg-foreground"
                  style={{ width: progressWidth }}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
