/**
 * CHECK-ASSETS.JS
 * -------------------------------------------------------
 * Vérification automatique des assets du site
 *
 * Objectifs :
 *  - Vérifier la présence de toutes les images nécessaires
 *  - Détecter les liens morts dans les pages HTML
 *  - Vérifier les logos nécessaires pour les magasins
 *  - Identifier les fichiers manquants dans /assets/
 *
 * Fonctionne sous Node.js / GitHub Actions / Termux
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ------------------------------------------------------------
// 🧩 Résolution propre des chemins
// ------------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const ASSETS = path.join(ROOT, "assets");
const HTML_DIR = ROOT;

// ------------------------------------------------------------
// 📌 Liste des assets obligatoires
// À AJOUTER selon ton branding
// ------------------------------------------------------------
const REQUIRED_ASSETS = [
  "logo-akiprisaye.png",
  "icon_512.png",
  "icon_192.png",
  "icon_128.png",
  "header-bg.jpg",
  "banner-promos.jpg",

  // logos enseignes
  "logo-superu.png",
  "logo-carrefour.png",
  "logo-ecomax.png",
  "logo-casino.png",
  "logo-leaderprice.png"
];

// ------------------------------------------------------------
// 📌 Fonction : Vérifier si un fichier existe
// ------------------------------------------------------------
function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

// ------------------------------------------------------------
// 📌 1) Vérifier les assets obligatoires
// ------------------------------------------------------------
function checkRequiredAssets() {
  console.log("\n=== 🔍 Vérification des ASSETS obligatoires ===");

  let missing = [];

  REQUIRED_ASSETS.forEach(asset => {
    const filePath = path.join(ASSETS, asset);
    if (!fileExists(filePath)) {
      console.log(`❌ Manquant : ${asset}`);
      missing.push(asset);
    } else {
      console.log(`✔ OK : ${asset}`);
    }
  });

  return missing;
}

// ------------------------------------------------------------
// 📌 2) Vérifier les liens images dans les fichiers HTML
// ------------------------------------------------------------
function checkHtmlImageLinks() {
  console.log("\n=== 🔍 Vérification des liens IMG dans les pages HTML ===");

  const htmlFiles = fs
    .readdirSync(HTML_DIR)
    .filter(f => f.endsWith(".html"));

  let broken = [];

  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(HTML_DIR, file), "utf8");

    // regex pour attraper toutes les images : <img src="...">
    const matches = [...content.matchAll(/<img[^>]+src="([^"]+)"/g)];

    for (let m of matches) {
      const src = m[1];

      // ignorer les images externes
      if (src.startsWith("http")) continue;

      const assetPath = path.join(ROOT, src);

      if (!fileExists(assetPath)) {
        console.log(`❌ ${file} → image introuvable : ${src}`);
        broken.push({ file, src });
      } else {
        console.log(`✔ ${file} → ${src}`);
      }
    }
  });

  return broken;
}

// ------------------------------------------------------------
// 📌 3) Vérification des logos magasins utilisés dans Firestore
// ------------------------------------------------------------
function checkStoreLogoNames() {
  console.log("\n=== 🔍 Vérification des logos magasins ===");

  const chains = [
    "superu",
    "carrefour",
    "carrefourmarket",
    "ecomax",
    "casino",
    "leaderprice"
  ];

  let missing = [];

  chains.forEach(name => {
    const fileName = `logo-${name}.png`;
    const filePath = path.join(ASSETS, fileName);

    if (!fileExists(filePath)) {
      console.log(`❌ Manquant : ${fileName}`);
      missing.push(fileName);
    } else {
      console.log(`✔ OK : ${fileName}`);
    }
  });

  return missing;
}

// ------------------------------------------------------------
// 📌 Exécution globale
// ------------------------------------------------------------
console.log("🚀 Vérification complète des assets…\n");

const missingAssets = checkRequiredAssets();
const brokenHtmlLinks = checkHtmlImageLinks();
const missingLogos = checkStoreLogoNames();

console.log("\n=========================");
console.log("📊 RESULTATS FINAUX");
console.log("=========================\n");

console.log(`📌 Assets obligatoires manquants : ${missingAssets.length}`);
if (missingAssets.length) console.log(missingAssets);

console.log(`📌 Liens HTML cassés : ${brokenHtmlLinks.length}`);
if (brokenHtmlLinks.length) console.log(brokenHtmlLinks);

console.log(`📌 Logos magasins manquants : ${missingLogos.length}`);
if (missingLogos.length) console.log(missingLogos);

console.log("\n🎉 Vérification terminée !");