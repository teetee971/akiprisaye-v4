// src/test/setup.ts
import { vi, beforeEach, afterEach } from 'vitest';

type AnyObj = Record<string, any>;

class MemoryStorage implements Storage {
  private store = new Map<string, string>();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? (this.store.get(key) as string) : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(String(key), String(value));
  }
}

function defineOn(obj: AnyObj, name: string, value: any) {
  Object.defineProperty(obj, name, {
    value,
    configurable: true,
    enumerable: true,
    writable: true,
  });
}

// Un seul storage partagé pour localStorage (cohérence entre globalThis et window)
const local = new MemoryStorage();

// SessionStorage séparé (comportement proche navigateur)
const session = new MemoryStorage();

// On force sur globalThis + window (jsdom)
defineOn(globalThis as AnyObj, 'localStorage', local);
defineOn(globalThis as AnyObj, 'sessionStorage', session);

if (typeof window !== 'undefined') {
  defineOn(window as AnyObj, 'localStorage', local);
  defineOn(window as AnyObj, 'sessionStorage', session);
}

// Nettoyage entre tests (utile et stable)
beforeEach(() => {
  (globalThis as AnyObj).localStorage?.clear?.();
  (globalThis as AnyObj).sessionStorage?.clear?.();
});

// Partir propre côté mocks (fetch, timers, spies, etc.)
afterEach(() => {
  vi.restoreAllMocks();
});

// Optionnel: réduire le bruit "act(...)" (ne change pas les tests)
// Décommente si tu veux une sortie CI silencieuse.
/*
const originalError = console.error;
console.error = (...args: any[]) => {
  const msg = String(args?.[0] ?? '');
  if (msg.includes('not configured to support act')) return;
  originalError(...args);
};
*/