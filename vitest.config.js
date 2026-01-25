import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",

    // ⛔ AUCUN setupFiles
    // ⛔ AUCUN setup.ts
    // ⛔ AUCUN frontend/

    globals: false,

    include: [
      "src/**/*.test.{ts,tsx,js,jsx}",
      "frontend/src/**/*.test.{ts,tsx,js,jsx}",
    ],
  },
});