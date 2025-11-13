import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔥 Fonction correcte et exportée
export async function loadStoresForTerritory(territory) {
    try {
        const storesRef = collection(db, "stores");
        const q = query(storesRef, where("territory", "==", territory.toLowerCase()));
        const snapshot = await getDocs(q);

        const stores = [];
        snapshot.forEach(doc => stores.push({ id: doc.id, ...doc.data() }));

        return stores;
    } catch (err) {
        console.error("Erreur Firestore loadStoresForTerritory:", err);
        return [];
    }
}