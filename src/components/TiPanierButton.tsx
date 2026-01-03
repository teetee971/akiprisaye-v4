import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useTiPanier } from "../hooks/useTiPanier";
import TiPanierDrawer from "./TiPanierDrawer";

/**
 * Ti‑panier button (mobile-first floating + optional header placement).
 * - Shows counter
 * - Opens TiPanierDrawer
 */
export default function TiPanierButton({ float = true }: { float?: boolean }) {
  const { count } = useTiPanier();
  const [open, setOpen] = useState(false);

  const label = count > 0 ? `Ti‑panier — ${count} éléments` : "Ti‑panier vide";

  return (
    <>
      <button
        type="button"
        aria-label={label}
        title={label}
        onClick={() => setOpen(true)}
        className={
          float
            ? "fixed right-4 bottom-6 z-50 md:relative md:bottom-auto md:right-auto flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            : "inline-flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        }
      >
        <ShoppingCart size={18} aria-hidden />
        <span className="sr-only">{label}</span>
        <span aria-hidden className="font-medium">{count}</span>
      </button>

      <TiPanierDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
