import { useEffect, useState } from "react";

/**
 * Subscribes to a CSS media query. Runs only client-side (this app is a
 * client-rendered SPA, so there is no SSR hydration to worry about).
 *
 * Used for the desktop/mobile split in the homepage brand section so the
 * StoryCards carousel (and its window-level keyboard listeners) is only
 * mounted on the breakpoint where it is actually displayed.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", handleChange);
    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

/** True below the site's md breakpoint (where the mobile brand carousel renders). */
export function useIsMobileViewport(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
