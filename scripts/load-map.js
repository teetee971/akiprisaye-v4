// scripts/load-map.js
// Gestion de la carte interactive + magasins Firestore

import { TERRITORIES } from "./territories.js";
import { getStoresByTerritory } from "./magasins-firestore.js";

let map = null;
let markersLayer = null;

/**
 * Initialise la carte si ce n'est pas déjà fait
 */
export function initMap() {
  if (map) return;

  map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
  });

  // Fond sombre CartoDB
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
}

/**
 * Charge un territoire + affiche les magasins Firestore
 * @param {string} territoryId
 */
export async function loadTerritory(territoryId) {
  initMap();

  const territory = TERRITORIES.find(t => t.id === territoryId);

  if (!territory) {
    console.error("Territoire inconnu :", territoryId);
    return;
  }

  // Centrer la carte
  map.setView([territory.center.lat, territory.center.lon], 11);

  // Clean markers
  markersLayer.clearLayers();

  // Load shops depuis Firestore
  const shops = await getStoresByTerritory(territoryId);

  console.log("Magasins Firestore chargés :", shops);

  shops.forEach(shop => {
    if (!shop.lat || !shop.lon) return;

    const marker = L.marker([shop.lat, shop.lon]).addTo(markersLayer);

    const popupContent = `
      <div style="font-size:14px;">
        <strong>${shop.name}</strong><br>
        ${shop.address}<br><br>

        <button onclick="openGPS(${shop.lat}, ${shop.lon})"
          style="padding:6px 10px;background:#1e90ff;color:white;border:none;border-radius:6px;">
          📍 Ouvrir dans GPS
        </button>

        <br><br>

        <button onclick="suggestPromotions('${territoryId}')"
          style="padding:6px 10px;background:#ff5722;color:white;border:none;border-radius:6px;">
          🔥 Promotions sur le trajet
        </button>
      </div>
    `;

    marker.bindPopup(popupContent);
  });
}

// GPS button action
window.openGPS = function (lat, lon) {
  const url = `https://maps.google.com/?q=${lat},${lon}`;
  window.open(url, "_blank");
};

// IA Trajet + Promotions
window.suggestPromotions = function (territoryId) {
  alert("🧠 Analyse IA du trajet et détection des promotions... (module en cours)");
};