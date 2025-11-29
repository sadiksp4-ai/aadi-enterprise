import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	base: "/aadi-enterprise/", // GitHub Pages serves from /{repo-name}/
});
