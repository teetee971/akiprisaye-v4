import { afterEach, vi } from 'vitest';

/**
 * Storage mock 100% compatible
 * On remplace complètement localStorage
 */

class MemoryStorage {
  private store: Record<string, string> = {};

  get length() {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return keys[index] ?? null;
  }

  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

const mockLocalStorage = new MemoryStorage();
const mockSessionStorage = new MemoryStorage();

/**
 * ⚠️ IMPORTANT
 * On force le remplacement total via vi.stubGlobal
 */
vi.stubGlobal('localStorage', mockLocalStorage);
vi.stubGlobal('sessionStorage', mockSessionStorage);

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.localStorage = mockLocalStorage;
  // @ts-ignore
  window.sessionStorage = mockSessionStorage;
}

/**
 * Nettoyage automatique
 */
afterEach(() => {
  mockLocalStorage.clear();
  mockSessionStorage.clear();
  vi.restoreAllMocks();
});