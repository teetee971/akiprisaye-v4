import React, { useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import { useTiPanier } from "../hooks/useTiPanier";
import { GlassCard } from "./ui/glass-card";

/**
 * Drawer/modal showing saved items.
 * - Full client-side, localStorage via useTiPanier
 * - Accessible: role="dialog", aria-labelledby
 * - Mobile-first: appears from bottom on small screens
 *
 * Adds: ESC key handling and lightweight focus trap (no extra dependency)
 */
export default function TiPanierDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, clear } = useTiPanier();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  function getFocusableElements(container: HTMLElement | null) {
    if (!container) return [] as HTMLElement[];
    const selectors = [
      'a[href]',
      'area[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'button:not([disabled])',
      'iframe',
      'object',
      'embed',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ];
    return Array.from(container.querySelectorAll(selectors.join(','))) as HTMLElement[];
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusableElements(containerRef.current);
        if (focusables.length === 0) {
          e.preventDefault();
          containerRef.current?.focus();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && (active === first || active === containerRef.current)) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    if (open) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

      // Wait for DOM render then focus the first focusable or the container
      requestAnimationFrame(() => {
        const focusables = getFocusableElements(containerRef.current);
        if (focusables.length) {
          focusables[0].focus();
        } else {
          containerRef.current?.focus();
        }
      });

      document.addEventListener('keydown', onKeyDown, true);
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);

      // restore focus when closing
      if (!open) {
        previouslyFocusedRef.current?.focus?.();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-end md:items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="ti-panier-title" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 w-full max-w-md" onClick={(e) => e.stopPropagation()} ref={containerRef} tabIndex={-1}>
        <GlassCard>
          <div className="flex items-start justify-between mb-4">
            <h3 id="ti-panier-title" className="text-lg font-semibold">Ti‑panier</h3>
            <button aria-label="Fermer le ti‑panier" onClick={onClose} className="text-slate-300 hover:text-white p-1 rounded">
              <X />
            </button>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-gray-400">Votre ti‑panier est vide.</p>
          ) : (
            <ul className="space-y-3 max-h-64 overflow-auto">
              {items.map((it) => {
                const name = String((it.meta && (it.meta as any).name) ?? 'Produit');
                const price = (it.meta && (it.meta as any).price) ?? '';
                const store = (it.meta && (it.meta as any).store) ?? '';
                const territory = (it.meta && (it.meta as any).territory) ?? '';

                return (
                  <li key={it.id} className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{name}</div>
                      <div className="text-xs text-gray-400">
                        {price ? `${price}` : ''}{store ? ` — ${store}` : ''}{territory ? ` — ${territory}` : ''}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">Quantité: {it.quantity}</div>
                    </div>

                    <div className="ml-3 flex-shrink-0">
                      <button onClick={() => removeItem(it.id)} aria-label={`Supprimer ${name}`} className="p-1 rounded text-red-400 hover:text-red-200">
                        <Trash2 />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-4 flex gap-3 justify-end">
            <button onClick={() => { clear(); onClose(); }} className="px-3 py-2 bg-red-600 hover:bg-red-500 rounded-md text-white text-sm" aria-disabled={items.length === 0}>
              Vider le ti‑panier
            </button>

            <button onClick={onClose} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-white text-sm">
              Fermer
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
