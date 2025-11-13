import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    query, 
    where, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/**
 * 🔥 Chargement des magasins d’un territoire
 * - Normalise "Guadeloupe" → "guadeloupe"
 * - Empêche les crash si aucun magasin n’est trouvé
 * - Retourne un tableau propre et trié par nom
 */
export async function loadStoresForTerritory(territory) {
    try {
        const storesRef = collection(db, "stores");

        const q = query(
            storesRef,
            where("territory", "==", territory.toLowerCase())
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.warn("⚠️ Aucun magasin trouvé pour :", territory);
            return [];
        }

        const results = [];
        snapshot.forEach(doc => {
            results.push({ id: doc.id, ...doc.data() });
        });

        // Tri par ordre alphabétique
        return results.sort((a, b) => a.name.localeCompare(b.name));

    } catch (error) {
        console.error("Erreur loadStoresForTerritory:", error);
        return [];
    }
}