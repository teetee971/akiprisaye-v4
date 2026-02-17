import { describe, expect, test } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

describe('Cloudflare SPA routing config', () => {
  test('Cloudflare routing files are present in public/', () => {
    expect(existsSync(path.resolve('public/_redirects'))).toBe(true);
    expect(existsSync(path.resolve('public/_headers'))).toBe(true);
  });

  test('build script relies on native Cloudflare Pages SPA fallback', () => {
    const packageJsonPath = path.resolve('package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as { scripts?: Record<string, string> };

    expect(packageJson.scripts?.build).toBe('vite build');
  });

  test('redirects keep API/assets passthrough before SPA fallback', () => {
    const redirectsPath = path.resolve('public/_redirects');
    const redirects = readFileSync(redirectsPath, 'utf8')
      .split('\n')
      .map(line => line.trim())
      .filter(Boolean);

    expect(redirects).toEqual([
      '/api/*     /api/:splat     200',
      '/assets/*  /assets/:splat  200',
      '/*         /index.html     200',
    ]);
  });

  test('route aliases redirect deep-link variants to canonical auth/account routes', () => {
    const appPath = path.resolve('src/App.tsx');
    const appSource = readFileSync(appPath, 'utf8');

    const expectedAliases = [
      ['auth/login', '/login'],
      ['signin', '/login'],
      ['auth/register', '/inscription'],
      ['signup', '/inscription'],
      ['auth/reset-password', '/reset-password'],
      ['forgot-password', '/reset-password'],
      ['moncompte', '/mon-compte'],
      ['account', '/mon-compte'],
    ];

    for (const [alias, canonicalPath] of expectedAliases) {
      expect(appSource).toContain(`<Route path="${alias}" element={<Navigate to="${canonicalPath}" replace />} />`);
    }
  });
});
