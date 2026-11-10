import {
  MagneticButton,
  type MagneticButtonProps,
} from "../ui/magnetic-button";
import { cn } from "../../lib/utils";
import { usePrefersReducedMotion } from "../../lib/use-reduced-motion";
import "./MagneticCTA.css";

export type MagneticCTAProps = Omit<
  MagneticButtonProps,
  "variant" | "glow" | "strength"
> & {
  /** Approved site CTA skin. */
  variant?: "primary" | "outline";
};

/**
 * Site adapter for the EasyUI magnetic button.
 *
 * Renders the exact approved `hx-btn` / `hx-btn-primary` / `hx-btn-outline`
 * treatment (unlayered CSS overrides the vendored EasyUI utilities), with:
 * - the magnetic pull disabled when the user prefers reduced motion;
 * - no EasyUI glow layer (gradient) — the approved shadows stay.
 *
 * The hover lift and press travel are CSS-driven on the wrapper span
 * (`.hx-cta-magnetic`) so they never fight the framer-motion transform
 * springs on the button itself.
 */
export function MagneticCTA({
  children,
  variant = "primary",
  className,
  ...props
}: MagneticCTAProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <span className="hx-cta-magnetic">
      <MagneticButton
        glow={false}
        strength={prefersReducedMotion ? 0 : 0.35}
        className={cn(
          "hx-btn",
          variant === "primary" ? "hx-btn-primary" : "hx-btn-outline",
          className
        )}
        {...props}
      >
        {children}
      </MagneticButton>
    </span>
  );
}
