'use client';

import React, { forwardRef, useId, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { motionTransitions } from '../../lib/motion-tokens';
import { usePrefersReducedMotion } from '../../lib/use-reduced-motion';

export interface LockInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label rendered above the input */
  label?: string;
  /** Helper text below the input */
  description?: string;
  /** Error message; presence triggers danger styling */
  error?: string;
  /** Optional icon at the start of the input */
  leftIcon?: React.ReactNode;
  /** Optional icon at the end of the input */
  rightIcon?: React.ReactNode;
}

/**
 * EasyUI LockInput, adapted to the site.
 *
 * The focus ring scales out from the centre and the border tweens to active,
 * giving the impression that the input snaps closed on itself when focused.
 * Under reduced motion the ring simply fades in with no scale play.
 */
export const LockInput = forwardRef<HTMLInputElement, LockInputProps>(
  (
    {
      label,
      description,
      error,
      leftIcon,
      rightIcon,
      disabled,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [isFocused, setIsFocused] = useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();

    const ringTransition = prefersReducedMotion
      ? ({ type: 'tween', duration: 0 } as const)
      : motionTransitions.springSnappy;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block select-none text-sm font-medium tracking-tight text-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative flex w-full items-center">
          {leftIcon && (
            <div
              className={cn(
                'pointer-events-none absolute left-3 flex items-center justify-center transition-colors duration-200',
                isFocused ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              'peer h-11 w-full rounded-lg border bg-card px-3.5 text-base text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              error
                ? 'border-destructive/50 focus:border-destructive'
                : 'border-border focus:border-accent-hover',
              disabled && 'cursor-not-allowed opacity-30',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={description ? `${inputId}-desc` : undefined}
            {...props}
          />

          {/* Focus ring: scales in from the centre to give the "lock into place" feel. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-lg"
            initial={false}
            animate={{
              opacity: isFocused ? 1 : 0,
              scale: isFocused && !prefersReducedMotion ? 1 : 0.94,
            }}
            transition={ringTransition}
            style={{
              boxShadow: error
                ? '0 0 0 2px rgba(217, 107, 99, 0.45)'
                : '0 0 0 2px rgba(12, 153, 144, 0.3)',
            }}
          />

          {/* Subtle border-colour lock. */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-lg"
            initial={false}
            animate={{ opacity: isFocused ? 1 : 0 }}
            transition={ringTransition}
            style={{
              boxShadow: error
                ? 'inset 0 0 0 1px rgba(217, 107, 99, 0.6)'
                : 'inset 0 0 0 1px rgba(12, 153, 144, 0.6)',
            }}
          />

          {rightIcon && (
            <div
              className={cn(
                'pointer-events-none absolute right-3 flex items-center justify-center transition-colors duration-200',
                isFocused ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {description && !error && (
          <p
            id={`${inputId}-desc`}
            className="text-xs leading-relaxed text-muted-foreground"
          >
            {description}
          </p>
        )}

        {error && (
          <motion.p
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ringTransition}
            className="text-xs font-medium text-destructive"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

LockInput.displayName = 'LockInput';
