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
});
