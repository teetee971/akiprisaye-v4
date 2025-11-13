// =============================================
// A KI PRI SA YÉ — Module Carte Interactive
// =============================================

// Import du module Firestore
import { loadMagasins } from "./magasins-firestore.js";

/**
 * Initialise et affiche la carte Leaflet
 * @param {string} selectedTerritory - "guadeloupe" | "martinique" | "guyane" | "reunion" | "mayotte" | "spm"
 */
export async function loadMap(selectedTerritory = "guadeloupe") {

    // ---- Coordonnées DOM-TOM ----
    const territories = {
        guadeloupe: { lat: 16.265, lon: -61.55, zoom: 10 },
        martinique: { lat: 14.610, lon: -61.07, zoom: 10 },
        guyane: { lat: 4.938, lon: -52.33, zoom: 8 },
        reunion: { lat: -21.115, lon: 55.536, zoom: 10 },
        mayotte: { lat: -12.823, lon: 45.166, zoom: 11 },
        spm: { lat: 46.781, lon: -56.196, zoom: 12 }
    };

    const t = territories[selectedTerritory];

    // ---- Initialisation de la carte ----
    const map = L.map("map").setView([t.lat, t.lon], t.zoom);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "© OpenStreetMap • © CARTO"
    }).addTo(map);

    // ---- Récupération des magasins Firestore ----
    let shops = [];
    try {
        shops = await loadMagasins(selectedTerritory);
    } catch (e) {
        console.error("Erreur Firestore →", e);
    }

    // ---- Ajout des marqueurs ----
    shops.forEach(shop => {
        const marker = L.marker([shop.lat, shop.lon]).addTo(map);

        const popup = `
            <b>${shop.name}</b><br>
            📍 ${shop.address}<br>
            🕒 ${shop.openingHours}<br>
            ☎️ ${shop.phone}<br>
            🏬 ${shop.chain}
        `;

        marker.bindPopup(popup);
    });

    console.log("Carte chargée avec", shops.length, "magasins.");
}