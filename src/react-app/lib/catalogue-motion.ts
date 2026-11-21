import type { Variants } from "framer-motion";

/**
 * Shared motion primitives for the catalogue pages (Stage 2C).
 *
 * These mirror the Stage 2B.1 Products Hub language exactly — one easing curve,
 * one viewport config and four variants — so every catalogue surface reveals
 * with the same rhythm. Everything animates opacity/transform only, enters
 * once, and resolves in under a second.
 *
 * MotionConfig (App.tsx, reducedMotion="user") drops the transform half for
 * users who prefer reduced motion; callers should also pass `reduced` to
 * `heroReveal` so delays collapse to a single short fade.
 */

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const SECTION_VIEWPORT = { once: true, amount: 0.2 } as const;

export const sectionHeadVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
  },
};

export const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.055, delayChildren: 0.04 },
  },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT },
  },
};

/** Capped stagger for grids whose item count can grow (34-brand directory). */
export const revealItemDelayed: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: EASE_OUT,
      delay: Math.min(index, 8) * 0.028,
    },
  }),
};

/** Hero elements fade up in reading order; reduced motion fades without delay. */
export function heroReveal(delay: number, reduced: boolean) {
  return {
    initial: { opacity: 0, y: reduced ? 0 : 14 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0.3 : 0.6,
      delay: reduced ? 0 : delay,
      ease: EASE_OUT,
    },
  };
}

/** Fade used for result-count and filter transitions (never remounts on typing). */
export function resultFade(reduced: boolean, duration = 0.25) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: reduced ? 0.15 : duration, ease: EASE_OUT },
  };
}
