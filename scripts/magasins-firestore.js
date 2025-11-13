import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { getApp } from "./firebase-config.js";

export async function loadMagasins(territory) {
  try {
    const app = await getApp();
    const db = getFirestore(app);
    const collectionRef = collection(db, `magasins_${territory}`);
    const snapshot = await getDocs(collectionRef);

    const shops = [];
    snapshot.forEach((doc) => shops.push(doc.data()));

    console.log(
      `Firestore → ${shops.length} magasins chargés pour ${territory}`
    );
    return shops;
  } catch (error) {
    console.error("Erreur Firestore (loadMagasins) →", error);
    return [];
  }
}