import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");

if (container) {
  try {
    const root = createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    console.info("[React] App montée avec succès");
  } catch (err) {
    console.error("[React] Erreur au montage", err);
    // fallback HTML reste visible
  }
}