# Schéma Open Data - v1.8.0

## 🎯 Vue d'ensemble

Le système d'export Open Data A KI PRI SA YÉ permet l'**export public des données brutes** en formats CSV et JSON, sans enrichissement ni transformation interprétative.

**Version**: 1.8.0  
**Date**: Janvier 2026  
**Base**: Extension de v1.7.0  
**Statut**: Module indépendant en lecture seule

---

## 📋 Objectif

Rendre les données d'observation **accessibles au public** pour :
- ✅ Transparence citoyenne
- ✅ Recherche académique
- ✅ Réutilisation par des tiers
- ✅ Analyse territoriale

**Contraintes strictes** :
- ❌ Aucune transformation interprétative
- ❌ Aucun filtrage subjectif
- ❌ Aucune donnée dérivée
- ✅ Données brutes uniquement
- ✅ Sources et métadonnées obligatoires
- ✅ Traçabilité complète

---

## 🧠 Principes fondamentaux

### 1️⃣ Données brutes uniquement

L'export ne contient **que des données observées** :
- Prix relevés
- Ingrédients scannés
- Informations nutritionnelles mesurées
- Aucun calcul, score ou interprétation

### 2️⃣ Métadonnées obligatoires

Chaque export inclut **systématiquement** :
```typescript
{
  generatedAt: "2025-01-15T10:30:00Z",  // Date de génération
  dataVersion: "1.8.0",                  // Version des données
  territory: "GP",                       // Territoire(s) couvert(s)
  sources: ["label_scan", "public_db"],  // Sources des données
  recordCount: 1543,                     // Nombre d'enregistrements
  dateRange: {                           // Plage temporelle
    start: "2024-01-01T00:00:00Z",
    end: "2025-01-15T00:00:00Z"
  },
  schemaVersion: "1.0.0",                // Version du schéma
  license: "ODbL v1.0"                   // Licence d'utilisation
}
```

### 3️⃣ Formats standards

**CSV** : Interopérabilité maximale
- Délimiteur : `,` (virgule)
- Encodage : UTF-8
- En-têtes : inclus
- Échappement : conforme RFC 4180

**JSON** : Structure complète
- Pretty print par défaut
- Métadonnées embarquées
- Validation de schéma

### 4️⃣ Licence Open Data

**Open Database License (ODbL) v1.0**

Vous êtes libre de :
- Copier, distribuer et utiliser les données
- Créer des œuvres dérivées
- Modifier, transformer et construire à partir de ces données

À condition de :
- Mentionner la source (A KI PRI SA YÉ)
- Partager sous la même licence (share-alike)
- Garder ouvert (keep open)

---

## 📊 Schéma des données

### 1️⃣ Produits (Products)

```typescript
{
  ean: "3760074380534",                   // Code EAN
  name: "Biscuits chocolat",              // Nom du produit
  brand: "MonicaBrand",                   // Marque
  category: "Biscuits",                   // Catégorie
  territory: "GP",                        // Territoire
  observedAt: "2025-01-10T14:30:00Z",     // Date d'observation
  price: 3.50,                            // Prix observé (optionnel)
  priceUnit: "EUR",                       // Unité de prix
  store: "Carrefour",                     // Magasin (optionnel)
  ingredients: [                          // Liste d'ingrédients (ordonnée)
    "Farine de blé",
    "Sucre",
    "Chocolat"
  ],
  nutrition: {                            // Valeurs nutritionnelles /100g
    energyKcal: 500,
    fats: 20,
    saturatedFats: 5,
    carbohydrates: 60,
    sugars: 30,
    proteins: 6,
    salt: 0.5
  },
  additives: ["E330", "E471"],            // Codes additifs
  allergens: ["Gluten", "Lait"],          // Allergènes
  labels: ["Bio", "AOC"],                 // Labels/certifications
  source: "label_scan",                   // Source de la donnée
  sourceReference: "scan_20250110_001",   // Référence source
  qualityScore: 0.95                      // Score de qualité (0-1)
}
```

**Champs obligatoires** :
- `ean`, `name`, `brand`, `category`, `territory`, `observedAt`
- `ingredients`, `source`, `sourceReference`, `qualityScore`

### 2️⃣ Prix (Prices)

```typescript
{
  ean: "3760074380534",
  productName: "Biscuits chocolat",
  brand: "MonicaBrand",
  territory: "GP",
  store: "Carrefour",
  price: 3.50,
  priceUnit: "EUR/kg",
  observedAt: "2025-01-10T14:30:00Z",
  source: "ticket_scan",
  sourceReference: "ticket_20250110_042"
}
```

**Champs obligatoires** :
- Tous les champs sont obligatoires pour les prix

### 3️⃣ Ingrédients (Ingredients)

```typescript
{
  name: "Huile de palme",                 // Nom de l'ingrédient
  frequency: 1247,                        // Nombre de produits le contenant
  categories: [                           // Catégories de produits
    "Biscuits",
    "Chocolat",
    "Pâtisseries"
  ],
  territories: ["GP", "MQ", "GF"],        // Territoires d'observation
  firstObserved: "2024-01-01T00:00:00Z",  // Première observation
  lastObserved: "2025-01-15T00:00:00Z"    // Dernière observation
}
```

### 4️⃣ Magasins (Stores)

```typescript
{
  name: "Carrefour",
  territory: "GP",
  productCount: 2543,                     // Nombre de produits suivis
  priceObservationCount: 18432,           // Nombre de relevés de prix
  dateRange: {
    start: "2024-01-01T00:00:00Z",
    end: "2025-01-15T00:00:00Z"
  }
}
```

---

## 🔧 Utilisation de l'API

### Export simple (JSON)

```typescript
const request: OpenDataExportRequest = {
  format: 'json',
  dataType: 'products',
  territory: 'GP',
  dateRange: {
    start: '2024-01-01T00:00:00Z',
    end: '2025-01-01T00:00:00Z'
  }
};

const response = await exportOpenData(request);

if (response.success) {
  // Télécharger le fichier
  const blob = new Blob([response.data.content], {
    type: response.data.contentType
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = response.data.filename;
  a.click();
}
```

### Export simple (CSV)

```typescript
const request: OpenDataExportRequest = {
  format: 'csv',
  dataType: 'prices',
  territory: ['GP', 'MQ'],
  minQualityScore: 0.8
};

const response = await exportOpenData(request);
```

### Export batch (tous les types)

```typescript
const request: BatchExportRequest = {
  format: 'json',
  dataTypes: ['products', 'prices', 'ingredients', 'stores'],
  filters: {
    territory: 'GP',
    dateRange: {
      start: '2024-01-01T00:00:00Z',
      end: '2025-01-01T00:00:00Z'
    },
    minQualityScore: 0.9
  }
};

const response = await exportBatch(request);

if (response.success) {
  // Plusieurs fichiers exportés
  for (const exp of response.exports) {
    console.log(`${exp.dataType}: ${exp.filename} (${exp.sizeBytes} bytes)`);
  }
}
```

### Prévisualisation

```typescript
const request: OpenDataExportRequest = {
  format: 'json',
  dataType: 'products',
  territory: 'GP'
};

// Obtenir les 10 premiers enregistrements
const preview = await previewExport(request, 10);
```

### Statistiques disponibles

```typescript
const stats = await getExportStatistics();

console.log(`Produits disponibles: ${stats.products}`);
console.log(`Prix disponibles: ${stats.prices}`);
console.log(`Territoires couverts: ${stats.territories.join(', ')}`);
console.log(`Période: ${stats.dateRange.start} à ${stats.dateRange.end}`);
```

---

## 📈 Filtres disponibles

### Par territoire

```typescript
// Territoire unique
{ territory: 'GP' }

// Territoires multiples
{ territory: ['GP', 'MQ', 'GF'] }
```

### Par plage de dates

```typescript
{
  dateRange: {
    start: '2024-01-01T00:00:00Z',
    end: '2025-01-01T00:00:00Z'
  }
}
```

### Par qualité minimale

```typescript
{ minQualityScore: 0.8 }  // Garde uniquement les données ≥ 0.8
```

### Limite de résultats

```typescript
{ limit: 1000 }  // Exporte maximum 1000 enregistrements
```

---

## ✅ Validation des données

### Validation automatique

```typescript
const products = [...];  // Vos données

const validation = validateExportData(
  products,
  ['ean', 'name', 'brand', 'territory']  // Champs requis
);

if (!validation.isValid) {
  console.error('Erreurs:', validation.errors);
  console.warn('Avertissements:', validation.warnings);
}

console.log(`Valides: ${validation.stats.validRecords}`);
console.log(`Invalides: ${validation.stats.invalidRecords}`);
console.log('Champs manquants:', validation.stats.missingFields);
```

### Critères de validation

**Produit valide** si :
- ✅ EAN présent et non vide
- ✅ Nom présent
- ✅ Marque présente
- ✅ Territoire présent
- ✅ Date d'observation présente (ISO 8601)
- ✅ Liste d'ingrédients présente (peut être vide)
- ✅ Source présente
- ✅ Score de qualité entre 0 et 1

---

## 🔍 Format CSV détaillé

### Structure

```csv
ean,name,brand,category,territory,observedAt,price,priceUnit,store,ingredients,nutrition,additives,source,sourceReference,qualityScore
"3760074380534","Biscuits chocolat","MonicaBrand","Biscuits","GP","2025-01-10T14:30:00Z",3.50,"EUR","Carrefour","Farine de blé;Sucre;Chocolat","{""energyKcal"":500,""fats"":20}","E330;E471","label_scan","scan_20250110_001",0.95
```

### Règles d'échappement

1. **Virgules** : Champ entouré de guillemets
   ```csv
   "Test, Product"
   ```

2. **Guillemets** : Doublés
   ```csv
   "Product ""Special"" Edition"
   ```

3. **Sauts de ligne** : Champ entouré de guillemets
   ```csv
   "First line
   Second line"
   ```

4. **Tableaux** : Séparés par point-virgule
   ```csv
   "Farine;Sucre;Sel"
   ```

5. **Objets** : Stringifiés en JSON
   ```csv
   "{""energyKcal"":500,""fats"":20}"
   ```

---

## 🔍 Format JSON détaillé

### Structure avec métadonnées embarquées

```json
{
  "metadata": {
    "generatedAt": "2025-01-15T10:30:00Z",
    "dataVersion": "1.8.0",
    "territory": "GP",
    "sources": ["label_scan", "public_db"],
    "recordCount": 2,
    "dateRange": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2025-01-15T00:00:00Z"
    },
    "schemaVersion": "1.0.0",
    "license": "Open Database License (ODbL) v1.0"
  },
  "records": [
    {
      "ean": "3760074380534",
      "name": "Biscuits chocolat",
      "brand": "MonicaBrand",
      ...
    },
    {
      "ean": "1234567890123",
      "name": "Yaourt nature",
      "brand": "BrandY",
      ...
    }
  ]
}
```

---

## 🚩 Feature Flag

Le module est contrôlé par le feature flag :

```env
VITE_FEATURE_OPEN_DATA_EXPORT=false
```

**Par défaut : désactivé** (`false`)

Quand désactivé :
- `exportOpenData()` → erreur "Feature not enabled"
- `exportBatch()` → erreur "Feature not enabled"
- `getExportStatistics()` → statistiques vides

---

## 🔒 Contraintes techniques

### Lecture seule

Le module ne modifie **jamais** les données :
- ✅ Lecture depuis `localStorage`
- ❌ Aucune écriture
- ❌ Aucune mutation d'état

### Pas d'impact UI

Le module est **service-only** :
- ✅ Fonctions exportées utilisables par l'UI
- ❌ Aucun composant React
- ❌ Aucune modification de l'interface

### TypeScript strict

Typage complet avec mode strict activé.

---

## 🧪 Tests

Le module dispose de **31 tests unitaires** couvrant :

1. **Feature flag** (2 tests)
2. **Format JSON** (3 tests)
3. **Format CSV** (4 tests)
4. **Filtres** (6 tests)
5. **Gestion d'erreurs** (3 tests)
6. **Export batch** (3 tests)
7. **Validation** (4 tests)
8. **Prévisualisation** (1 test)
9. **Statistiques** (3 tests)
10. **Cas limites** (2 tests)

**Total : 31 tests** (≥30 requis ✅)

---

## 📦 Stockage

Les données sont stockées dans `localStorage` :

```
Clés :
- open_data_products      → ProductExportRecord[]
- open_data_prices        → PriceExportRecord[]
- open_data_ingredients   → IngredientExportRecord[]
- open_data_stores        → StoreExportRecord[]
```

---

## 🔄 Intégration

Le module v1.8.0 :
- Réutilise les types `TerritoryCode` existants
- Compatible avec les données de v1.6.0 et v1.7.0
- Indépendant des autres modules

---

## 🛡️ Sécurité et vie privée

### Données anonymisées

Le système n'exporte **aucune donnée personnelle** :
- ✅ Données produits (publiques)
- ✅ Prix observés (publics)
- ❌ Aucune donnée utilisateur

### Licence et attribution

**Obligation** : Mentionner la source dans toute réutilisation
```
Source: A KI PRI SA YÉ - Données sous licence ODbL v1.0
URL: https://akiprisaye.com
```

---

## 📚 Cas d'usage

### Cas 1 : Export CSV pour tableur

```typescript
const response = await exportOpenData({
  format: 'csv',
  dataType: 'products',
  territory: 'GP'
});

// Ouvrir dans Excel, LibreOffice, etc.
```

### Cas 2 : API JSON pour application tierce

```typescript
const response = await exportOpenData({
  format: 'json',
  dataType: 'prices',
  dateRange: {
    start: '2024-01-01T00:00:00Z',
    end: '2024-12-31T23:59:59Z'
  },
  minQualityScore: 0.9
});

// Utiliser dans une application web/mobile
```

### Cas 3 : Recherche académique

```typescript
const response = await exportBatch({
  format: 'json',
  dataTypes: ['products', 'ingredients'],
  filters: {
    territory: ['GP', 'MQ', 'GF', 'RE', 'YT'],
    dateRange: {
      start: '2023-01-01T00:00:00Z',
      end: '2025-01-01T00:00:00Z'
    }
  }
});

// Analyse statistique complète
```

---

## 🔮 Évolutions futures

Possibles améliorations (hors scope v1.8.0) :
- Compression automatique (ZIP)
- Export incrémental (delta)
- API REST dédiée
- Webhooks pour nouveautés
- Export Parquet pour big data

---

**Version** : 1.8.0  
**Dernière mise à jour** : Janvier 2026  
**Auteur** : A KI PRI SA YÉ  
**Statut** : ✅ Implémenté
