// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,

    // IMPORTANT: utiliser fileURLToPath (plus fiable que .pathname)
    setupFiles: [fileURLToPath(new URL('./src/test/setup.ts', import.meta.url))],

    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },

    include: [
      'src/services/openFoodFacts.test.ts',
      'src/services/alertProductImageService.test.ts',
      'functions/**/*.test.ts',
      'src/test/alerts.filterActive.test.ts',
      'src/test/alerts.searchSort.test.ts',
      'src/test/alerts.serviceFallback.test.ts',
      'src/test/sanitaryAlerts.normalizer.test.ts',
      'src/test/observations.normalize.test.ts',
      'src/test/storeSelection.test.ts',
      'src/test/promosService.test.ts',
      'src/test/freemium.test.ts',
      'src/test/cloudflareRouting.test.ts',
      'src/test/actualites.page.test.jsx',
      'src/test/serviceWorkerCacheStrategy.test.ts',
      'scripts/verify-pages-api.test.ts',
    ],

    testTimeout: 10_000,
    hookTimeout: 10_000,

    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
    unstubEnvs: true,
  },
});