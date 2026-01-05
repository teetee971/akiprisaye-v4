# 🧾 A KI PRI SA YÉ

[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-deployed-success?logo=cloudflare&logoColor=white)](https://akiprisaye-web.pages.dev)
[![CI Schema Validation](https://img.shields.io/badge/CI-JSON%20Schema%20Validation-blue)](#)
[![Browser Only](https://img.shields.io/badge/Runtime-Browser--Only-important)](#)

**Plateforme intelligente de comparaison des prix, transparence économique et protection du consommateur – France & territoires ultramarins**

## 🌍 Présentation

**A KI PRI SA YÉ** est une plateforme web professionnelle dédiée à la lutte contre la vie chère, à la transparence des prix, et à la protection des consommateurs, couvrant l'ensemble des territoires français, y compris :

- **DOM** (Guadeloupe, Martinique, Guyane, La Réunion, Mayotte)
- **ROM / COM** (Saint-Martin, Saint-Barthélemy, Polynésie française, Nouvelle-Calédonie, Wallis-et-Futuna, Saint-Pierre-et-Miquelon, Terres australes, etc.)

Le projet repose exclusivement sur des données réelles, vérifiables et sourcées, avec une architecture moderne, évolutive et sécurisée.

---

## 🎯 Objectifs principaux

1. **Comparer les prix réels** des produits par territoire
2. **Offrir une lecture claire et sourcée** des informations économiques
3. **Donner aux citoyens** des outils concrets pour mieux consommer
4. **Permettre aux enseignes, institutions et groupes** d'accéder à des services professionnels payants
5. **Créer une référence nationale ultramarine** sur les prix et la consommation

---

## 🧠 Fonctionnalités clés (actuelles & prévues)

### 🧾 Produits & Prix

- Comparateur de prix multi-enseignes
- Historique des prix par produit et par territoire
- Sources visibles (enseignes, dates, zones)
- Prédiction des prix explicable (basée sur données historiques réelles)

### 📷 Scanner intelligent

- **Scan code-barres** (EAN-8, EAN-13, UPC)
  - Scanner caméra en temps réel
  - **Import image avec OCR fallback** (Tesseract.js)
  - Détection automatique native (BarcodeDetector API) + fallback OCR
  - Saisie manuelle avec validation checksum
- **OCR tickets de caisse**
- **Reconnaissance produit par photo**
- **Informations produit** :
  - Fabricant
  - Origine
  - Composition
  - Nutri-Score
  - Traçabilité complète

#### 🔍 Reconnaissance produit sans EAN (PR D)

Fonctionnalité expérimentale, 100 % navigateur, avec validation utilisateur obligatoire.

**Architecture :**

```
Image / Upload
   ↓
OCR (Tesseract.js – offline)
   ↓
Normalisation texte
   ↓
Extraction heuristique (nom, marque, volume)
   ↓
Recherche floue locale (Fuse.js)
   ↓
🛑 Validation utilisateur obligatoire
   ↓
Comparateur de prix existant
```

**Principes :**
- ❌ Aucune comparaison automatique
- ❌ Aucune décision machine
- ✅ Validation humaine obligatoire
- ✅ Messages clairs : Suggestion, jamais Détection confirmée

### 🗺️ Carte interactive

- Carte France + DOM / ROM / COM complète
- Géolocalisation utilisateur
- Affichage des magasins par zone
- Calcul distance / prix / meilleur choix

### 🚨 Alertes consommateurs

- Alertes officielles (DGCCRF, RappelConso)
- Fiches détaillées par produit
- Historique des alertes
- Rapports citoyens

### 💬 Communication

- Messagerie interne sécurisée
- Citoyens ↔ Enseignes ↔ Institutions

---

## 🏪 Modules professionnels (payants – sans freemium)

### 🏬 Enseignes & investisseurs

- Inscription payante des enseignes
- Gestion des magasins et prix en temps réel
- Marketplace professionnelle
- Visibilité territoriale ciblée
- Analytics & reporting

### 🏛️ Institutions & collectivités

- Tableaux de bord économiques
- Exports de données
- Rapports territoriaux
- Accès API contrôlé

### 🤖 Devis IA

- Génération de devis automatisés selon besoins
- Paiement direct intégré
- Offres personnalisées B2B / B2G

---

## 🧱 Architecture technique

### Frontend

- **React + Vite** - Framework moderne et performant
- **Tailwind CSS** - Design system professionnel
- **Design chic "Liquid Glass"** - Interface utilisateur premium
- **PWA** - Offline, mobile-first

### Backend (prévu / en cours)

- API modulaire sécurisée
- Gestion données produits, prix, alertes, entreprises
- Prédiction IA explicable

### Données entreprises

**Accès par :**
- SIRET
- SIREN
- TVA
- ID interne

**Informations disponibles :**
- Statut d'activité (ACTIVE / CEASED)
- Adresse complète
- Coordonnées GPS
- Date de création

---

## 🚀 Déploiement & CI/CD

**Hébergement :** Cloudflare Pages  
**CI/CD :** GitHub Actions  

### Build automatique

```bash
npm ci
npm run build
# Déploiement dist/
```

**Node.js 20 LTS**  
Zéro 404, assets cohérents (`/assets`)  
Rollback possible

**URL officielle :**  
👉 [https://akiprisaye-web.pages.dev](https://akiprisaye-web.pages.dev)

---

## 🚀 Démarrage Rapide

### Développement

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:5173](http://localhost:5173) dans votre navigateur.

### Production

```bash
npm run build
npm run preview
```

### Scripts Disponibles

- `npm run dev` - Serveur de développement Vite
- `npm run build` - Build de production
- `npm run preview` - Aperçu du build
- `npm run check-assets` - Vérification d'intégrité des assets
- `npm run lint` - Linter ESLint
- `npm run format` - Formatter avec Prettier
- `npm test` - Tests automatisés

---

## 🔐 Sécurité & conformité

- **CSP maîtrisée** (scripts, workers, blob autorisés si nécessaires)
- **Données sourcées et traçables**
- **Pas de données fictives**
- **Transparence utilisateur**
- **Tests de sécurité automatisés**

---

## 🛡️ CI Camera-safe (Important)

Ce projet est une application **frontend browser-only**.

Certaines fonctionnalités (caméra, upload d'images, BarcodeDetector, OCR via Tesseract)
reposent sur des **API Web natives** (`window`, `navigator.mediaDevices`, `Image`, `Canvas`)
**non disponibles en environnement Node.js**.

### Conséquence en CI
- Les tests frontend sont **désactivés volontairement** en CI Node.
- **Cloudflare Pages** est la **source de vérité** pour le build et la validation runtime.
- Aucun code produit n'est exécuté côté serveur Node.

### Ce qui est validé en production
- Pipeline image séparé (caméra / upload / OCR fallback)
- Détection EAN (BarcodeDetector → ZXing → OCR)
- Déclenchement du comparateur via `handleEAN`
- UX mobile et desktop

ℹ️ Ce choix est **intentionnel**, documenté et conforme aux bonnes pratiques
pour les applications web exploitant des API navigateur.

---

## 💰 Modèle économique (sans freemium)

- Abonnements professionnels
- Paiement à l'usage (API, rapports, prédictions)
- Marketplace enseignes
- Devis IA payants
- Licences collectivités / groupes

---

## 📌 État du projet

✅ CI/CD opérationnel  
✅ Architecture validée  
🔄 Modules en cours d'intégration via Issues GitHub  
🤖 Développement piloté par prompts Copilot

---

## 🛠️ Contribution & développement

Développement guidé par :

- Issues structurées
- Prompts Copilot détaillés
- Pipeline automatisé

👉 Voir les [Issues](https://github.com/teetee971/akiprisaye-web/issues) pour la roadmap complète.

---

## 📄 Licence

**Projet propriétaire – tous droits réservés.**  
Utilisation, reproduction ou exploitation commerciale interdites sans autorisation.

---

## 📣 Contact & vision

**A KI PRI SA YÉ** n'est pas un simple comparateur :  
c'est un **outil citoyen, économique et stratégique**, pensé pour **durer et avoir un impact réel**.

---

## ✨ Fonctionnalités Principales

### 🧴 Module d'Évaluation Cosmétique

**Nouveau!** Analyse transparente des produits cosmétiques basée uniquement sur des sources officielles :

- **Sources officielles uniquement** : CosIng (EU), ANSES, ECHA, Règlement CE 1223/2009
- **Analyse INCI** : Identification automatique des ingrédients
- **Score transparent** : Méthodologie de calcul documentée et objective
- **Niveaux de risque documentés** : Basés sur les réglementations européennes
- **Références officielles** : Liens directs vers les sources pour chaque ingrédient
- **Aucune affirmation médicale** : Respect strict des réglementations
- **Aucune donnée fictive** : 100% de données publiques vérifiables

📘 Voir [COSMETIQUE_EVALUATION_MODULE.md](./COSMETIQUE_EVALUATION_MODULE.md) pour la documentation complète.

**Accès** : `/evaluation-cosmetique`

**Tests** : 35 tests unitaires ✅

### 🏢 Registre des Entreprises (Company Registry)

Module centralisé de gestion des données d'entreprises avec qualité institutionnelle :

- **Identification multi-critères** : Recherche par SIRET, SIREN, TVA ou ID interne
- **Données officielles** : Nom légal, statut d'activité, siège social, géolocalisation
- **Validation robuste** : Vérification des codes SIRET/SIREN/TVA français
- **Intégration magasins** : Liaison automatique magasins ↔ entreprises mères
- **Système d'alerte** : Détection des entreprises au statut "CESSÉ" pour protection des consommateurs
- **API complète** : 92 tests automatisés ✅

### 🌍 Sélecteur de Territoires DROM-COM

Nouveau composant `TerritorySelector` avec support complet des 12 territoires :

- 🇬🇵 Guadeloupe
- 🇲🇶 Martinique
- 🇬🇫 Guyane
- 🇷🇪 La Réunion
- 🇾🇹 Mayotte
- 🇵🇲 Saint-Pierre-et-Miquelon
- 🇧🇱 Saint-Barthélemy
- 🇲🇫 Saint-Martin
- 🇼🇫 Wallis-et-Futuna
- 🇵🇫 Polynésie française
- 🇳🇨 Nouvelle-Calédonie
- 🇹🇫 Terres australes et antarctiques françaises

### 📱 PWA Améliorée

**Manifest PWA enrichi avec :**
- ✅ Shortcuts pour accès rapide (Comparateur, Scanner, Actualités, Carte)
- ✅ Share Target API
- ✅ Catégories et screenshots
- ✅ Icons 192px et 512px optimisés
- ✅ Mode offline complet

**Service Worker avec :**
- ✅ Cache stratégique (Cache First pour statique, Network First pour API)
- ✅ Synchronisation en arrière-plan
- ✅ Support offline pour pages principales
- ✅ Gestion dynamique du cache

### 🔧 Backend API

Structure backend disponible dans `/backend` :

**Routes API :**

**Prices API**
- `GET /api/prices` - Récupérer les prix par EAN et territoire
- `POST /api/prices` - Ajouter un nouveau prix
- `GET /api/prices/compare` - Comparer plusieurs produits

**News API**
- `GET /api/news` - Récupérer les actualités
- `GET /api/news/:id` - Récupérer une actualité spécifique
- `POST /api/news` - Créer une nouvelle actualité (admin)

**Contact API**
- `POST /api/contact` - Envoyer un message de contact
- `GET /api/contact` - Lister les messages (admin)
- `PATCH /api/contact/:id` - Mettre à jour le statut (admin)

---

## 📸 Pipeline Image avec OCR Fallback

### Architecture

Le scanner intelligent utilise une **architecture en couches** pour maximiser les chances de détection :

1. **Détection Native BarcodeDetector** (si disponible dans le navigateur)
   - API native du navigateur pour détecter les codes-barres
   - Formats supportés : EAN-13, EAN-8, UPC-A, UPC-E
   - Très rapide et précis

2. **Détection ZXing** (fallback si BarcodeDetector indisponible)
   - Bibliothèque JavaScript open-source
   - Même gamme de formats supportés
   - Compatible avec tous les navigateurs

3. **OCR avec Tesseract.js** (fallback final)
   - Reconnaissance optique de caractères
   - Extrait les chiffres de l'image avec whitelist `0123456789`
   - Regex pour identifier les codes EAN : `/\b\d{13}\b|\b\d{8}\b/`
   - **Indispensable** pour les images où le code-barres n'est pas détectable

### Flux de Traitement

```
Image Upload
    ↓
Chargement Image (new Image() + decode())
    ↓
Tentative BarcodeDetector ━━━━━✓━━━→ Code détecté → handleEAN()
    ↓ (échec)
Tentative ZXing ━━━━━━━━━━━━━━✓━━━→ Code détecté → handleEAN()
    ↓ (échec)
OCR Tesseract.js ━━━━━━━━━━━━✓━━━→ Code détecté → handleEAN()
    ↓ (échec)
Message: "❌ Aucun code détecté, saisie manuelle possible"
```

### Messages UX

- ✅ **Succès** : "✅ Code détecté automatiquement à partir de l'image: [EAN]"
- ❌ **Échec** : "❌ Aucun code détecté automatiquement. 👉 Vous pouvez saisir le code manuellement."
- 🔍 **En cours** : "🔍 Analyse de l'image en cours..." → "📝 Détection OCR en cours..."

### Fonction Unifiée `handleEAN()`

Tous les flux (caméra, image, saisie manuelle) convergent vers une **fonction unique** :

```typescript
const handleEAN = async (ean: string) => {
  // 1. Validation EAN (checksum)
  if (!validateEAN(ean)) return
  
  // 2. Résolution produit
  await resolver.resolveEAN(ean)
  
  // 3. Fetch prix (comparateur)
  // 4. Ajout historique
}
```

### Configuration Tesseract.js

```typescript
await Tesseract.recognize(img, 'eng', {
  tessedit_char_whitelist: '0123456789'  // Uniquement les chiffres
})
```

---

## 🎨 Design & UX

### Responsive Design

- ✅ Safe areas pour Samsung S24+, iPhone notch
- ✅ Touch targets minimum 44px (WCAG 2.1 AA)
- ✅ Grilles responsives mobile-first
- ✅ Typographie fluide (clamp)
- ✅ Support prefers-reduced-motion
- ✅ Mode sombre/clair automatique

---

## 🔒 Règles de Sécurité Firestore

Pour sécuriser votre base de données Firestore, appliquez les règles suivantes via la Console Firebase :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products: lecture seule pour tous
    match /products/{ean} {
      allow read: if true;
      allow write: if false; // Seulement via admin/cloud functions
    }
    
    // Stores: lecture seule pour tous
    match /stores/{storeId} {
      allow read: if true;
      allow write: if false; // Seulement via admin/cloud functions
    }
    
    // Prices: lecture seule pour tous
    match /prices/{docId} {
      allow read: if true;
      allow write: if false; // Seulement via cloud functions
    }
    
    // Receipts: utilisateurs authentifiés peuvent créer
    match /receipts/{docId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if false; // Seulement via admin/cloud functions
    }
  }
}
```

**Note importante :** Les règles ci-dessus protègent l'écriture directe dans Firestore. En production, utilisez Firebase Cloud Functions ou Admin SDK pour gérer les écritures de prix et la modération des tickets.

