/**
 * AUTO IMPORT DES MAGASINS GUADELOUPE / MARTINIQUE / GUYANE / REUNION / MAYOTTE
 * Compatible Cloudflare Pages + Firebase JS SDK
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDocs, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* 🔵 LISTE MAGASINS GUADELOUPE – EXTENSIBLE */
export const storesList = [
  {
    name: "Super U Bas-du-Fort",
    address: "Bas-du-Fort, Le Gosier, Guadeloupe",
    chain: "Super U",
    territory: "guadeloupe"
  },
  {
    name: "Carrefour Destrellan",
    address: "Destrellan, Baie-Mahault, Guadeloupe",
    chain: "Carrefour",
    territory: "guadeloupe"
  },
  {
    name: "Ecomax Bergevin",
    address: "Bergevin, Pointe-à-Pitre, Guadeloupe",
    chain: "Ecomax",
    territory: "guadeloupe"
  }
];


/* 🔵 GEO CODAGE – OpenStreetMap */
async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "akiprisaye-app/1.0 (contact)"
      }
    });

    const data = await res.json();
    if (!data[0]) return { lat: null, lon: null };

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };

  } catch (err) {
    console.error("geocode error:", err);
    return { lat: null, lon: null };
  }
}


/* 🔥 IMPORT AUTOMATIQUE */
export async function autoImport() {
  for (let store of storesList) {

    // Vérif si déjà existant
    const check = await getDocs(
        query(
            collection(db, "stores"),
            where("name", "==", store.name)
        )
    );

    if (!check.empty) {
        console.log("⏭️ Déjà existant :", store.name);
        continue;
    }

    // Géodage
    const { lat, lon } = await geocode(store.address);

    await setDoc(doc(collection(db, "stores")), {
        ...store,
        lat,
        lon,
        openingHours: "08:00 - 20:00",
        phone: store.phone || "N.C"
    });

    console.log("✅ Ajouté :", store.name);

    await new Promise(r => setTimeout(r, 1200));
  }

  console.log("🎉 IMPORTATION TERMINEE !");
}

// Lancement auto
autoImport();