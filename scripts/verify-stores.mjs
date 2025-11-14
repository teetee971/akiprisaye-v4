import fs from "fs";

console.log("🧪 Vérification JSON stores…");

const filePath = new URL("./stores.json", import.meta.url);  
const raw = fs.readFileSync(filePath, "utf8");
const stores = JSON.parse(raw);

let missing = 0;

stores.forEach(s => {
  if (!s.lat || !s.lng) {
    console.log(`❌ Manque coordonnées : ${s.name}`);
    missing++;
  }
});

if (missing === 0) {
  console.log("✅ Toutes les coordonnées sont présentes !");
} else {
  console.log(`⚠️ ${missing} magasin(s) avec coordonnées manquantes.`);
}

console.log("✔ Test terminé");
