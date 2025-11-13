/**
 * SCRIPT 18 — GPS PROMO PLANNER
 * -------------------------------------------------------------
 * Analyse un trajet Google Maps et propose automatiquement
 * des arrêts EN PROMOTION sur ton chemin (IA + Firestore).
 *
 * Fonctionnalités :
 *  ✔ Récupère l'itinéraire Google Maps (Directions API)
 *  ✔ Analyse les points du trajet
 *  ✔ Trouve les magasins proches du trajet
 *  ✔ Vérifie les promotions Firestore
 *  ✔ Appelle l’IA locale pour recommander les arrêts
 *  ✔ Génère un itinéraire optimisé
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "akiprisaye-web.firebaseapp.com",
  projectId: "akiprisaye-web"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -----------------------------------------------
// GOOGLE MAPS DIRECTIONS API
// -----------------------------------------------
async function getRoute(start, end) {
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    start
  )}&destination=${encodeURIComponent(end)}&mode=driving&key=YOUR_GOOGLE_MAPS_API_KEY`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.routes || !data.routes.length) {
    throw new Error("Aucun itinéraire trouvé.");
  }

  return data.routes[0].overview_path || data.routes[0].legs[0].steps;
}

// -----------------------------------------------
// DISTANCE ENTRE DEUX COORDONNÉES
// -----------------------------------------------
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// -----------------------------------------------
// TROUVER LES MAGASINS À MOINS DE 1 KM DU TRAJET
// -----------------------------------------------
async function getStoresNearRoute(routePoints) {
  const storesSnap = await getDocs(collection(db, "stores"));

  let nearbyStores = [];

  storesSnap.forEach(doc => {
    const store = doc.data();

    for (const p of routePoints) {
      const dist = haversine(store.lat, store.lon, p.lat, p.lng);

      if (dist <= 1.0) {
        nearbyStores.push(store);
        break;
      }
    }
  });

  return nearbyStores;
}

// -----------------------------------------------
// TROUVER LES PROMOTIONS POUR CES MAGASINS
// -----------------------------------------------
async function getPromotionsForStores(storeNames) {
  const qPromo = query(
    collection(db, "promotions"),
    where("store", "in", storeNames)
  );

  const snap = await getDocs(qPromo);
  let promotions = [];

  snap.forEach(doc => {
    promotions.push(doc.data());
  });

  return promotions;
}

// -----------------------------------------------
// IA LOCALE POUR CHOISIR LES MEILLEURS ARRÊTS
// -----------------------------------------------
async function askLocalAI(stores, promotions) {
  const prompt = `
Tu es une IA d'analyse d'économies.
Voici la liste des magasins proches du trajet :
${JSON.stringify(stores, null, 2)}

Voici les promotions disponibles :
${JSON.stringify(promotions, null, 2)}

Réponds avec les arrêts optimaux (1 à 3 max), format JSON :
[
  {
    "store": "nom du magasin",
    "reason": "pourquoi ce choix",
    "savings": "montant estimé",
    "coords": { "lat": X, "lon": Y }
  }
]
  `;

  const res = await fetch("/ai/analyse", {
    method: "POST",
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();
  return data.result || [];
}

// -----------------------------------------------
// LANCEMENT GLOBAL
// -----------------------------------------------
export async function planOptimizedRoute(start, end) {
  console.log("🚗 Récupération itinéraire…");
  const routePoints = await getRoute(start, end);

  console.log("🛒 Recherche magasins proches du trajet…");
  const nearbyStores = await getStoresNearRoute(routePoints);

  console.log("🔥 Recherche promotions associées…");
  const promotions = await getPromotionsForStores(
    nearbyStores.map(s => s.name)
  );

  console.log("🤖 Analyse IA…");
  const recommendations = await askLocalAI(nearbyStores, promotions);

  console.log("🎉 Recommandations calculées :", recommendations);

  return {
    route: routePoints,
    stops: recommendations
  };
}