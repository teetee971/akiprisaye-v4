// frontend/src/test/setupTests.ts
import { vi } from 'vitest';

/**
 * Polyfill localStorage / sessionStorage pour Vitest + JSDOM (Termux)
 * Objectif: avoir setItem/getItem/removeItem/clear/key/length stables.
 */
function createMemoryStorage() {
  let store: Record<string, string> = {};

  return {
    get length() {
      return Object.keys(store).length;
    },
    key(index: number) {
      const keys = Object.keys(store);
      return keys[index] ?? null;
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key: string, value: string) {
      store[String(key)] = String(value);
    },
    removeItem(key: string) {
      delete store[String(key)];
    },
    clear() {
      store = {};
    },
  };
}

const memLocalStorage = createMemoryStorage();
const memSessionStorage = createMemoryStorage();

// Patch globalThis + window (selon ce que les tests utilisent)
Object.defineProperty(globalThis, 'localStorage', {
  value: memLocalStorage,
  configurable: true,
});
Object.defineProperty(globalThis, 'sessionStorage', {
  value: memSessionStorage,
  configurable: true,
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: memLocalStorage,
    configurable: true,
  });
  Object.defineProperty(window, 'sessionStorage', {
    value: memSessionStorage,
    configurable: true,
  });
}

/**
 * Optionnel: réduire le bruit "act(...)" si tu veux,
 * sans casser les tests (on ne masque pas les erreurs, juste console).
 */
const originalError = console.error;
console.error = (...args: any[]) => {
  const msg = String(args?.[0] ?? '');
  if (msg.includes('not configured to support act')) return;
  originalError(...args);
};

// Nettoyage automatique entre tests (utile pour les suites localStorage)
afterEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.restoreAllMocks();
});