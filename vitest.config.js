import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  test: {
    environment: "jsdom",
    globals: false,

    include: [
      "src/**/*.test.{ts,tsx,js,jsx}",
      "frontend/src/**/*.test.{ts,tsx,js,jsx}",
    ],
  },
});