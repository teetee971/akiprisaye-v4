import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  build: {
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react";
            if (id.includes("leaflet")) return "map";
            if (id.includes("chart")) return "charts";
            return "vendor";
          }

          if (id.includes("/pages/")) {
            if (id.includes("Home")) return "home";
            if (id.includes("Comparateur")) return "comparateur";
            if (id.includes("Carte")) return "carte";
            if (id.includes("Actualites")) return "actualites";
            return "pages";
          }
        },
      },
    },

    chunkSizeWarningLimit: 700,
  },
});