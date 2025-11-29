/**
 * Utility function to resolve asset paths for GitHub Pages deployment.
 * 
 * @param path The path to the asset (e.g., "/logo.png" or "logo.png")
 * @returns The full path including the base URL (e.g., "/aadi-enterprise/logo.png")
 */
export const getAssetUrl = (path: string | undefined): string => {
  if (!path) return "";
  
  // If path is external (http/https) or data URL, return as is
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  // import.meta.env.BASE_URL is set in vite.config.ts (e.g., "/aadi-enterprise/")
  return `${import.meta.env.BASE_URL}${cleanPath}`;
};
