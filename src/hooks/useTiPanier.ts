import { useCallback, useEffect, useState } from 'react';

// Local storage key for ti-panier v1
const STORAGE_KEY = 'ti-panier:v1';

// Item stored in the panier
export type TiPanierItem = {
  id: string; // unique identifier for the item
  quantity: number; // quantity for this item (integer >= 0)
  // optional metadata for consumer needs (name, price, etc.)
  meta?: Record<string, unknown>;
};

function safeParse(raw: string | null): TiPanierItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // basic validation/coercion
    return parsed
      .map((p) => ({
        id: String(p.id),
        quantity: typeof p.quantity === 'number' && Number.isFinite(p.quantity) ? Math.max(0, Math.floor(p.quantity)) : 0,
        meta: p.meta,
      }))
      .filter((p) => p.id);
  } catch {
    return [];
  }
}

function readFromStorage(): TiPanierItem[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

function writeToStorage(items: TiPanierItem[]) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota/write errors
  }
}

// Hook exposing panier operations
export function useTiPanier() {
  const [items, setItems] = useState<TiPanierItem[]>(() => readFromStorage());

  // persist whenever items change
  useEffect(() => {
    writeToStorage(items);
  }, [items]);

  // listen for storage changes from other tabs/windows
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) {
        setItems(readFromStorage());
      }
    }

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = useCallback((item: TiPanierItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      const qty = typeof item.quantity === 'number' && Number.isFinite(item.quantity) ? Math.max(0, Math.floor(item.quantity)) : 1;
      if (idx === -1) {
        return [...prev, { ...item, quantity: qty }];
      }
      const updated = [...prev];
      updated[idx] = { ...updated[idx], quantity: Math.max(0, updated[idx].quantity + qty), meta: item.meta ?? updated[idx].meta };
      return updated;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const count = items.reduce((acc, it) => acc + (typeof it.quantity === 'number' ? it.quantity : 0), 0);

  return {
    items,
    addItem,
    removeItem,
    clear,
    count,
  } as const;
}
