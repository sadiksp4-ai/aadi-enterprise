import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * GitHub Pages is a plain static file server with no SPA fallback: any
 * request that does not match a file serves public/404.html with HTTP 404,
 * so deep links like /about are "Not found" to crawlers. Emitting a copy of
 * the app shell as dist/<route>/index.html for each canonical route makes
 * Pages serve the React app with HTTP 200; client-side routing takes over
 * from there. Exact file matches (sitemap.xml, robots.txt, assets) are
 * unaffected — Pages only uses these for otherwise-unmatched paths.
 */
function spaRouteFallbacks(): Plugin {
	return {
		name: "spa-route-fallbacks",
		apply: "build",
		async writeBundle(options) {
			const dir = options.dir ?? "dist";
			const { readFile, writeFile, mkdir } = await import("node:fs/promises");
			const shell = await readFile(`${dir}/index.html`, "utf8");
			for (const route of ["about", "products", "clients", "partners", "contact"]) {
				await mkdir(`${dir}/${route}`, { recursive: true });
				await writeFile(`${dir}/${route}/index.html`, shell);
			}
		},
	};
}

export default defineConfig({
	plugins: [react(), spaRouteFallbacks()],
	base: "/", // Custom domain serves from root
});
