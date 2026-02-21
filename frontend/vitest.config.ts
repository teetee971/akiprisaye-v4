// frontend/vitest.config.ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const abs = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  // Force Vitest/Vite à considérer "frontend/" comme racine,
  // même si tu lances la commande depuis la racine du repo.
  root: here,

  test: {
    
    setupFiles: ['src/test/setupTests.ts'],
environment: 'jsdom',
    globals: true,

    // IMPORTANT : chemin ABSOLU => plus d'erreur "/@fs/.../akiprisaye-web/src/test/setup.ts"
    setupFiles: [abs('./src/test/setup.ts')],

    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },

    // Tes fichiers de tests ciblés (chemins ABSOLUS => OK quel que soit le cwd)
    include: [
      abs('./src/services/openFoodFacts.test.ts'),
      abs('./src/services/alertProductImageService.test.ts'),
      abs('./functions/**/__tests__/*.test.ts'),
      abs('./src/test/alerts.filterActive.test.ts'),
      abs('./src/test/alerts.searchSort.test.ts'),
      abs('./src/test/alerts.serviceFallback.test.ts'),
      abs('./src/test/sanitaryAlerts.normalizer.test.ts'),
      abs('./src/test/observations.normalize.test.ts'),
      abs('./src/test/storeSelection.test.ts'),
      abs('./src/test/promosService.test.ts'),
      abs('./src/test/freemium.test.ts'),
      abs('./src/test/cloudflareRouting.test.ts'),
      abs('./src/test/actualites.page.test.jsx'),
      abs('./src/test/serviceWorkerCacheStrategy.test.ts'),
      abs('./scripts/verify-pages-api.test.ts'),
    ],

    exclude: ['**/node_modules/**', '**/.git/**'],

    testTimeout: 10_000,
    hookTimeout: 10_000,

    clearMocks: true,
    restoreMocks: true,

    // Important pour éviter des effets de bord (storages / env) :
    unstubGlobals: false,
    unstubEnvs: true,
  },
});