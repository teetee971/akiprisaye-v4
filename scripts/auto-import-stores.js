import { getDB } from "../firebase-config.js";

async function geocode(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;

  const res = await fetch(url, {
    headers: { "User-Agent": "akiprisaye-web/1.0" }
  });

  const json = await res.json();

  if (!json[0]) return { lat: null, lon: null };

  return { lat: parseFloat(json[0].lat), lon: parseFloat(json[0].lon) };
}

const STORES = [
  {
    name: "Carrefour Destrellan",
    chain: "Carrefour",
    address: "Destrellan, Baie-Mahault, Guadeloupe",
    territory: "guadeloupe",
  },
  {
    name: "Super U Bas du Fort",
    chain: "Super U",
    address: "Bas-du-Fort, Le Gosier, Guadeloupe",
    territory: "guadeloupe",
  }
];

export async function autoImportStores() {
  console.log("🚀 IMPORT AUTOMATIQUE…");

  const db = await getDB();
  const { collection, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

  for (const store of STORES) {
    const geo = await geocode(store.address);

    const ref = doc(collection(db, "stores"));

    await setDoc(ref, {
      ...store,
      lat: geo.lat,
      lng: geo.lon,
      createdAt: Date.now(),
    });

    await new Promise(r => setTimeout(r, 1000));
  }

  console.log("🎉 Import terminé !");
}

autoImportStores();