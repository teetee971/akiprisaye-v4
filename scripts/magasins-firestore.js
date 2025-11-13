// =====================================================
// A KI PRI SA YÉ — Module Firestore pour magasins
// =====================================================

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { getApp } from "./firebase-config.js";

/**
 * Charge la liste des magasins depuis Firestore
 * @param {string} territory - ex: "guadeloupe", "martinique"
 * @returns {Promise<Array>}
 */
export async function loadMagasins(territory) {

    try {
        const app = await getApp();
        const db = getFirestore(app);

        // Nom de collection : magasins_guadeloupe / magasins_martinique / etc.
        const collectionRef = collection(db, `magasins_${territory}`);

        const snapshot = await getDocs(collectionRef);

        const shops = [];

        snapshot.forEach(doc => {
            shops.push(doc.data());
        });

        console.log(`Firestore → ${shops.length} magasins chargés pour ${territory}`);

        return shops;

    } catch (error) {
        console.error("Erreur Firestore (loadMagasins) →", error);
        return [];
    }
}