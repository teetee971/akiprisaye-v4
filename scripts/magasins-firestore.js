import { getDB } from "../firebase-config.js";

export async function getStoresByTerritory(territory) {
  const db = await getDB();

  const { collection, query, where, getDocs } = await import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );

  const q = query(collection(db, "stores"), where("territory", "==", territory));

  const snap = await getDocs(q);

  const stores = [];
  snap.forEach(doc => stores.push({ id: doc.id, ...doc.data() }));

  return stores;
}