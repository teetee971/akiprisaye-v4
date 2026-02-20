// src/test/setup.ts
import { vi } from 'vitest';

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
    return this.store.has(key) ? this.store.get(key)! : null;
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

/**
 * Sous Termux/Node, on peut avoir un "localStorage" injecté mais incomplet
 * (ex: warning --localstorage-file). Donc:
 * 1) si localStorage n'existe pas -> on injecte
 * 2) si localStorage existe mais méthodes manquantes -> on patch les méthodes
 * 3) si remplacement impossible (non configurable) -> patch sur l'objet existant
 */
function ensureWorkingLocalStorage(target: AnyObj) {
  const mem = new MemoryStorage();

  const existing = target.localStorage;
  const isValid =
    existing &&
    typeof existing.getItem === 'function' &&
    typeof existing.setItem === 'function' &&
    typeof existing.removeItem === 'function' &&
    typeof existing.clear === 'function';

  if (isValid) return;

  // Si on a déjà un objet mais cassé : on le "patch"
  if (existing && typeof existing === 'object') {
    if (typeof existing.getItem !== 'function') existing.getItem = mem.getItem.bind(mem);
    if (typeof existing.setItem !== 'function') existing.setItem = mem.setItem.bind(mem);
    if (typeof existing.removeItem !== 'function') existing.removeItem = mem.removeItem.bind(mem);
    if (typeof existing.clear !== 'function') existing.clear = mem.clear.bind(mem);
    if (typeof existing.key !== 'function') existing.key = mem.key.bind(mem);
    if (typeof existing.length !== 'number') {
      Object.defineProperty(existing, 'length', { get: () => mem.length });
    }
    return;
  }

  // Sinon, on tente de définir proprement
  try {
    Object.defineProperty(target, 'localStorage', {
      value: mem,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  } catch {
    // Dernier recours: assignation directe
    target.localStorage = mem;
  }
}

ensureWorkingLocalStorage(globalThis as AnyObj);
if (typeof window !== 'undefined') ensureWorkingLocalStorage(window as AnyObj);

// (optionnel) réduire le bruit "act(...)"
const originalWarn = console.warn;
vi.spyOn(console, 'warn').mockImplementation((...args) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('not configured to support act')) return;
  originalWarn(...args);
});