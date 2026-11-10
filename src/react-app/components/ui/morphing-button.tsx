'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Loader2, Save } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motionTransitions } from '../../lib/motion-tokens';
import { usePrefersReducedMotion } from '../../lib/use-reduced-motion';

export type ButtonStatusState = 'idle' | 'loading' | 'success' | 'error';
export type MorphingButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

export interface MorphingButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'style'
  > {
  /** Current state of button */
  status?: ButtonStatusState;
  /** Idle state label */
  idleText?: string;
  /** Loading state label */
  loadingText?: string;
  /** Success state label */
  successText?: string;
  /** Error state label */
  errorText?: string;
  /** Visual variant tone */
  variant?: MorphingButtonVariant;
  /** Custom idle icon */
  idleIcon?: React.ReactNode;
  /** Custom success icon */
  successIcon?: React.ReactNode;
  /** Custom error icon */
  errorIcon?: React.ReactNode;
  /** Click action handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Custom class name */
  className?: string;
}

/**
 * EasyUI MorphingButton, adapted to the site palette.
 *
 * Morphs between idle, loading, success and error states. Tap scale and
 * cross-fades are disabled automatically for users who prefer reduced motion.
 */
export const MorphingButton: React.FC<MorphingButtonProps> = ({
  status = 'idle',
  idleText = 'Save Changes',
  loadingText = 'Saving...',
  successText = 'Saved',
  errorText = 'Failed',
  variant = 'primary',
  idleIcon = <Save className="h-3.5 w-3.5" />,
  successIcon = <Check className="h-3.5 w-3.5 text-emerald-400" />,
  errorIcon = <AlertCircle className="h-3.5 w-3.5 text-rose-400" />,
  disabled = false,
  onClick,
  className,
  ...props
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  const variantStyles: Record<MorphingButtonVariant, string> = {
    primary:
      'bg-primary text-primary-foreground hover:bg-primary/90 border-transparent cursor-pointer',
    secondary:
      'bg-card text-foreground hover:bg-card/80 border-border hover:border-accent-hover/60 cursor-pointer',
    danger:
      'bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground border border-destructive/30 cursor-pointer',
    ghost:
      'bg-transparent text-muted-foreground hover:text-foreground hover:bg-card border-transparent cursor-pointer',
  };

  const transition = prefersReducedMotion
    ? ({ type: 'tween', duration: 0 } as const)
    : motionTransitions.springSnappy;

  return (
    <motion.button
      whileTap={
        disabled || isLoading || prefersReducedMotion
          ? undefined
          : { scale: 0.97 }
      }
      transition={motionTransitions.springSnappy}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        'relative inline-flex min-h-[38px] min-w-[120px] select-none items-center justify-center overflow-hidden rounded-lg border px-4 py-2 text-xs font-medium transition-colors duration-200 focus-ring sm:text-sm',
        variantStyles[variant],
        disabled && 'cursor-not-allowed opacity-30',
        className
      )}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isLoading && (
          <motion.span
            key="loading"
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -6 }}
            transition={transition}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>{loadingText}</span>
          </motion.span>
        )}

        {isSuccess && (
          <motion.span
            key="success"
            initial={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.8 }}
            transition={transition}
            className="flex items-center gap-2 font-semibold text-emerald-400"
          >
            {successIcon}
            <span>{successText}</span>
          </motion.span>
        )}

        {isError && (
          <motion.span
            key="error"
            initial={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0, scale: prefersReducedMotion ? 1 : 0.8 }}
            transition={transition}
            className="flex items-center gap-2 font-semibold text-rose-400"
          >
            {errorIcon}
            <span>{errorText}</span>
          </motion.span>
        )}

        {status === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 6 }}
            transition={transition}
            className="flex items-center gap-2"
          >
            {idleIcon}
            <span>{idleText}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
