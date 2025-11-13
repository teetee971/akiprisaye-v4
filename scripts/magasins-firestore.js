// scripts/magasins-firestore.js
// Chargement des magasins depuis Firestore (collection "stores")

import { getDB, loadFirestore } from "../firebase-config.js";

let firestoreModulePromise = null;

// Charge le module Firestore une seule fois (lazy)
async function getFirestoreModule() {
  if (!firestoreModulePromise) {
    firestoreModulePromise = loadFirestore();
  }
  return firestoreModulePromise;
}

/**
 * Charge les magasins pour un territoire donné
 * @param {string} territory - ex: "Guadeloupe"
 * @returns {Promise<Array>}
 */
export async function loadMagasins(territory) {
  const db = await getDB();
  const firestore = await getFirestoreModule();
  const { collection, getDocs, query, where } = firestore;

  // On lit tous les docs de la collection "stores" filtrés par territory
  const colRef = collection(db, "stores");
  const q = query(colRef, where("territory", "==", territory));

  const snapshot = await getDocs(q);

  const shops = [];
  snapshot.forEach((doc) => {
    const data = doc.data();

    shops.push({
      id: doc.id,
      name: data.Name || data.name || "Magasin",
      address: data.address || "",
      lat: data.lat,
      lon: data.lon,
      chain: data.chain || "",
      territory: data.territory || territory,
      openingHours: data.openingHours || "",
      phone: data.phone || "",
    });
  });

  console.log(
    `Firestore → ${shops.length} magasin(s) trouvés pour`,
    territory
  );

  return shops;
}