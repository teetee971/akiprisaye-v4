// frontend/vitest.config.ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url)); // => .../akiprisaye-web/frontend
const setupPath = resolve(HERE, 'src/test/setup.ts');

export default defineConfig({
  // Force Vitest/Vite à considérer "frontend" comme racine, quoi qu'il arrive
  root: HERE,

  test: {
    environment: 'jsdom',
    globals: true,

    // Chemin absolu, donc plus aucun risque de résolution sur le repo root
    setupFiles: [setupPath],

    environmentOptions: {
      jsdom: { url: 'http://localhost/' },
    },

    // Tu peux garder ta liste si tu veux. Sinon, la version simple: ['**/*.{test,spec}.{ts,tsx,js,jsx}']
    include: [
      'src/services/openFoodFacts.test.ts',
      'src/services/alertProductImageService.test.ts',
      'functions/**/*.test.ts',
      'src/test/**/*.test.ts',
      'src/test/**/*.test.jsx',
      'scripts/**/*.test.ts',
    ],

    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: false,
    unstubEnvs: true,
  },
});