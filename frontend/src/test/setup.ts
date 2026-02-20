import { vi } from 'vitest';

type LSMap = Record<string, string>;

function createLocalStorageMock() {
  let store: LSMap = {};

  return {
    get length() {
      return Object.keys(store).length;
    },
    key(i: number) {
      const keys = Object.keys(store);
      return keys[i] ?? null;
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key: string, value: string) {
      store[key] = String(value);
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
  };
}

// jsdom sous Termux peut donner un localStorage incomplet → on force un mock complet
const ls = createLocalStorageMock();

// @ts-expect-error - vitest global
globalThis.localStorage = ls;
// @ts-expect-error - vitest global
globalThis.window = globalThis.window ?? ({} as any);
// @ts-expect-error - vitest global
globalThis.window.localStorage = ls;

// Certains tests utilisent fetch
if (!('fetch' in globalThis)) {
  // @ts-expect-error - vitest global
  globalThis.fetch = vi.fn();
}

// Nettoyage automatique entre tests
beforeEach(() => {
  ls.clear();
  vi.clearAllMocks();
});