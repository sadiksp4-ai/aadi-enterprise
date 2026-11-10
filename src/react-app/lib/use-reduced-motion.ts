import { useReducedMotion } from "framer-motion";

/**
 * Shared reduced-motion guard.
 *
 * The app is wrapped in <MotionConfig reducedMotion="user"> (App.tsx), which
 * automatically disables transform/layout animations library-wide. This hook
 * exists for the remaining cases that MotionConfig cannot reach:
 * imperative MotionValue springs (e.g. magnetic pull) and CSS-driven effects.
 *
 * Returns true when the user has requested reduced motion.
 */
export function usePrefersReducedMotion(): boolean {
  return useReducedMotion() ?? false;
}
