'use client';

import React, { forwardRef, useId, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { motionTransitions } from '../../lib/motion-tokens';
import { usePrefersReducedMotion } from '../../lib/use-reduced-motion';

export interface DrawCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
  /** Indeterminate visual state */
  indeterminate?: boolean;
}

/**
 * EasyUI DrawCheckbox, adapted to the site.
 *
 * The checkmark draws itself via path-length animation and the box springs
 * with a tiny overshoot for a tactile snap. Reduced motion removes the
 * keyframed pop and draws the mark instantly.
 */
export const DrawCheckbox = forwardRef<HTMLInputElement, DrawCheckboxProps>(
  (
    {
      className,
      label,
      description,
      checked,
      defaultChecked,
      disabled,
      indeterminate = false,
      id,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [isChecked, setIsChecked] = useState(defaultChecked || false);
    const prefersReducedMotion = usePrefersReducedMotion();

    const isControlled = checked !== undefined;
    const currentChecked = isControlled ? checked : isChecked;
    const showCheck = currentChecked || indeterminate;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setIsChecked(e.target.checked);
      onChange?.(e);
    };

    const snappy = prefersReducedMotion
      ? ({ type: 'tween', duration: 0 } as const)
      : motionTransitions.springSnappy;

    return (
      <div
        className={cn(
          'flex select-none items-start gap-2.5',
          disabled && 'cursor-not-allowed opacity-30',
          className
        )}
      >
        <div className="relative mt-0.5 flex items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={currentChecked}
            disabled={disabled}
            onChange={handleChange}
            className="peer sr-only"
            {...props}
          />

          {/* Box: a tiny pop when checked; reduced motion keeps it still. */}
          <motion.div
            onClick={() => {
              if (disabled) return;
              const input = document.getElementById(inputId) as HTMLInputElement | null;
              input?.click();
            }}
            initial={false}
            animate={{
              scale: showCheck && !prefersReducedMotion ? [0.9, 1.04, 1] : 1,
              backgroundColor: showCheck ? 'var(--accent)' : 'var(--card)',
              borderColor: showCheck ? 'var(--accent)' : 'var(--border)',
            }}
            transition={prefersReducedMotion ? snappy : { duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-4 w-4 cursor-pointer items-center justify-center rounded-[4px] border focus-ring"
            style={{
              backgroundColor: showCheck ? 'var(--accent)' : 'var(--card)',
              borderColor: showCheck ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {/* Path-draw checkmark with overshoot on stroke-dashoffset */}
            {currentChecked && !indeterminate && (
              <motion.svg
                viewBox="0 0 16 16"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-background"
                initial={{
                  pathLength: prefersReducedMotion ? 1 : 0,
                  scale: prefersReducedMotion ? 1 : 0.6,
                  opacity: prefersReducedMotion ? 1 : 0,
                }}
                animate={{
                  pathLength: 1,
                  scale: prefersReducedMotion ? 1 : [0.6, 1.18, 1],
                  opacity: 1,
                }}
                transition={
                  prefersReducedMotion
                    ? snappy
                    : {
                        pathLength: { duration: 0.28, ease: [0.65, 0, 0.35, 1] },
                        scale: { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
                        opacity: { duration: 0.12 },
                      }
                }
              >
                <motion.path
                  d="M3.5 8.5 L6.5 11.5 L12.5 5"
                  initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={prefersReducedMotion ? snappy : { duration: 0.28, ease: [0.65, 0, 0.35, 1] }}
                />
              </motion.svg>
            )}

            {/* Indeterminate: a centred bar that draws from left to right */}
            {indeterminate && (
              <motion.div
                initial={{ scaleX: prefersReducedMotion ? 1 : 0 }}
                animate={{ scaleX: 1 }}
                transition={snappy}
                style={{ transformOrigin: 'left center' }}
                className="h-[2px] w-2.5 rounded-full bg-background"
              />
            )}
          </motion.div>
        </div>

        {(label || description) && (
          <label
            htmlFor={inputId}
            className={cn('cursor-pointer text-left', disabled && 'cursor-not-allowed')}
          >
            {label && (
              <div className="text-xs font-medium leading-tight text-foreground">
                {label}
              </div>
            )}
            {description && (
              <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                {description}
              </div>
            )}
          </label>
        )}
      </div>
    );
  }
);

DrawCheckbox.displayName = 'DrawCheckbox';
