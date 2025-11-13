// scripts/load-map.js
// Charge la carte + les magasins Firestore

import { TERRITORIES } from "./territories.js";
import { getStoresByTerritory } from "./magasins-firestore.js";

let map = null;
let markersLayer = null;

/**
 * Initialise la carte
 */
export function initMap() {
  map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
  });

  // Fond sombre (CartoDB)
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
}

/**
 * Charge les magasins pour un territoire donné
 * @param {string} territoryId
 */
export async function loadTerritory(territoryId) {
  if (!map) initMap();

  // Trouver territoire dans la liste
  const territory = TERRITORIES.find((t) => t.id === territoryId);
  if (!territory) {
    console.error("Territoire inconnu :", territoryId);
    return;
  }

  // Centre et zoom du territoire
  map.setView([territory.center.lat, territory.center.lon], 12);

  // Nettoyer l’ancienne couche de marqueurs
  markersLayer.clearLayers();

  // Charger les magasins Firestore
  const stores = await getStoresByTerritory(territoryId);

  stores.forEach((shop) => {
    if (!shop.lat || !shop.lon) return;

    const marker = L.marker([shop.lat, shop.lon]).addTo(markersLayer);

    // Popup + GPS + Promotions IA
    marker.bindPopup(`
      <div>
        <strong>${shop.name}</strong><br>
        ${shop.address}<br>
        <button onclick="openGPS(${shop.lat}, ${shop.lon})">📍 Ouvrir GPS</button><br>
        <button onclick="suggestPromotions('${territoryId}')">🔥 Promotions sur le trajet</button>
      </div>
    `);
  });
}


// GPS
window.openGPS = function(lat, lon) {
  const url = `https://maps.google.com/?q=${lat},${lon}`;
  window.open(url, "_blank");
};

// Suggestions IA
window.suggestPromotions = function(territoryId) {
  alert("🧠 Analyse IA du trajet… bientôt disponible !");
};