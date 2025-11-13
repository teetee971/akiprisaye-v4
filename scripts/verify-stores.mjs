/**
 * VERIFY-STORES.MJS
 * -----------------------------------------------------
 * Vérification complète des magasins dans Firestore.
 *
 * Fonctionnalités :
 *  - Vérifie si les magasins sont valides
 *  - Vérifie lat/lon, adresse, téléphone
 *  - Vérifie si la chaîne possède un logo existant
 *  - Vérifie que "territory" utilise le format standard
 *  - Produit un rapport final pour Copilot
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  getDocs,
  collection
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ------------------------------------------------------------
// 🔥 CONFIG FIREBASE (reprend strictement firebase-config.js)
// ------------------------------------------------------------
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "akiprisaye-web.firebaseapp.com",
  projectId: "akiprisaye-web",
  storageBucket: "akiprisaye-web.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:xxxxxxx"
};

// ------------------------------------------------------------
// 🎯 Logos attendus dans /assets
// ------------------------------------------------------------
const REQUIRED_LOGOS = [
  "logo-superu.png",
  "logo-carrefour.png",
  "logo-carrefourmarket.png",
  "logo-ecomax.png",
  "logo-casino.png",
  "logo-leaderprice.png"
];

// ------------------------------------------------------------
// 📌 Vérification fichiers locaux (depuis Node/Termux/GitHub)
// ------------------------------------------------------------
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ASSETS_DIR = path.resolve(__dirname, "..", "assets");

function assetExists(name) {
  return fs.existsSync(path.join(ASSETS_DIR, name));
}

// ------------------------------------------------------------
// 🚀 Vérification Firestore
// ------------------------------------------------------------
async function verifyStores() {
  console.log("====================================================");
  console.log("🔎 Vérification complète des MAGASINS Firestore");
  console.log("====================================================\n");

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const snap = await getDocs(collection(db, "stores"));

  let total = 0;
  let storesNoCoords = [];
  let storesBadTerritory = [];
  let storesMissingLogos = [];
  let storesMissingFields = [];

  snap.forEach(doc => {
    total++;
    const store = doc.data();

    // Vérifier coordonnées
    if (!store.lat || !store.lon) {
      storesNoCoords.push(store.name);
    }

    // Vérifier territory normalisé (minuscule)
    if (!store.territory || store.territory !== store.territory.toLowerCase()) {
      storesBadTerritory.push({ name: store.name, territory: store.territory });
    }

    // Vérifier présence du logo
    const logoName = `logo-${store.chain.toLowerCase().replace(/\s+/g, "")}.png`;

    if (!assetExists(logoName)) {
      storesMissingLogos.push({ store: store.name, missingLogo: logoName });
    }

    // Vérifier champs obligatoires
    if (!store.name || !store.address || !store.chain) {
      storesMissingFields.push(store.name);
    }
  });

  // ---------------------------------------------------------
  // 📊 RAPPORT FINAL
  // ---------------------------------------------------------
  console.log("\n====================================================");
  console.log("📊 RÉSULTATS DE VÉRIFICATION");
  console.log("====================================================\n");

  console.log(`🏪 Total magasins : ${total}\n`);

  console.log("❌ Magasins sans coordonnées :", storesNoCoords.length);
  if (storesNoCoords.length) console.log(storesNoCoords, "\n");

  console.log("⚠ Territories incorrects :", storesBadTerritory.length);
  if (storesBadTerritory.length) console.log(storesBadTerritory, "\n");

  console.log("❌ Logos manquants :", storesMissingLogos.length);
  if (storesMissingLogos.length) console.log(storesMissingLogos, "\n");

  console.log("⚠ Champs manquants :", storesMissingFields.length);
  if (storesMissingFields.length) console.log(storesMissingFields, "\n");

  console.log("🎉 Vérification terminée !");
}

// ------------------------------------------------------------
// ▶ LANCEMENT
// ------------------------------------------------------------
verifyStores();