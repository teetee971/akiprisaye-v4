import { describe, expect, test } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = path.resolve(HERE, '..', '..');
const P = (...p: string[]) => path.resolve(FRONTEND_ROOT, ...p);

function findFirstExisting(paths: string[]) {
  return paths.find((p) => existsSync(p));
}

describe('Service worker cache strategy', () => {
  test('does not precache index.html and uses no-store network-first for documents', () => {
    const swPath = findFirstExisting([
      P('public/service-worker.js'),
      P('src/service-worker.js'),
      P('src/service-worker.ts'),
    ]);

    expect(swPath).toBeTruthy();
    const swSource = readFileSync(swPath!, 'utf8');

    expect(swSource).not.toContain('/index.html');
    expect(swSource).toContain("fetch(request, { cache: 'no-store' })");
    expect(swSource).toContain("request.mode === 'navigate'");
    expect(swSource).toContain("request.destination === 'document'");
  });

  test('keeps skipWaiting and clients.claim lifecycle protections', () => {
    const swPath = findFirstExisting([
      P('public/service-worker.js'),
      P('src/service-worker.js'),
      P('src/service-worker.ts'),
    ]);

    expect(swPath).toBeTruthy();
    const swSource = readFileSync(swPath!, 'utf8');

    expect(swSource).toContain('self.skipWaiting');
    expect(swSource).toContain('self.clients.claim');
  });

  test('bootstraps build-id mismatch guard and SW registration in app entrypoint', () => {
    const mainPath = findFirstExisting([
      P('src/main.tsx'),
      P('src/main.jsx'),
      P('src/main.ts'),
      P('src/main.js'),
    ]);

    expect(mainPath).toBeTruthy();
    const mainSource = readFileSync(mainPath!, 'utf8');

    expect(mainSource).toContain('enforceBuildVersionSync');
    expect(mainSource).toContain('registerAppServiceWorker');
    expect(mainSource).toContain('VITE_APP_BUILD_ID');
  });
});