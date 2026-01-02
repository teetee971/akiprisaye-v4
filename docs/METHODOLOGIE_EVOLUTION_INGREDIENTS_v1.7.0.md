# Méthodologie Évolution des Ingrédients - v1.7.0

## 🎯 Vue d'ensemble

Le système d'évolution des ingrédients A KI PRI SA YÉ permet la **comparaison temporelle des formulations multi-marques** avec détection factuelle des changements observés.

**Version**: 1.7.0  
**Date**: Janvier 2026  
**Base**: Extension de v1.6.0 (Product Dossier System)  
**Statut**: Module indépendant en lecture seule

---

## 📋 Objectif

Permettre le suivi longitudinal des reformulations de produits en détectant les changements factuels dans les listes d'ingrédients :
- ✅ Ajout d'ingrédients
- ✅ Suppression d'ingrédients
- ✅ Déplacement dans l'ordre (position)
- ✅ Renommage d'ingrédients

**Contraintes strictes** :
- ❌ Aucune interprétation
- ❌ Aucune notation
- ❌ Aucune évaluation qualitative
- ✅ Données observées uniquement
- ✅ Sources citées obligatoirement
- ✅ Multi-marques autorisé
- ✅ Historique obligatoire

---

## 🧠 Principes fondamentaux

### 1️⃣ Observation factuelle uniquement

Le système se limite à **constater des faits** :
- Un ingrédient apparaît → changement détecté : "ajout"
- Un ingrédient disparaît → changement détecté : "suppression"
- Un ingrédient change de position → changement détecté : "déplacement"
- Un ingrédient change de nom → changement détecté : "renommage"

**Exemple de détection** :
```
Formulation v1 (2025-01-01) :
1. Farine de blé
2. Sucre
3. Sel

Formulation v2 (2025-06-01) :
1. Farine de blé
2. Huile de palme
3. Sucre
4. Sel

Changements détectés :
- Ajout: "Huile de palme" (position 2)
- Déplacement: "Sucre" (position 2 → 3)
- Déplacement: "Sel" (position 3 → 4)
```

### 2️⃣ Pas d'interprétation

Le système **ne juge pas** les changements :
- ❌ Pas de "bon" ou "mauvais" changement
- ❌ Pas de score de qualité
- ❌ Pas de recommandation
- ✅ Constat neutre uniquement

### 3️⃣ Multi-marques autorisé

Le système permet la comparaison entre marques :
- Identification des ingrédients communs
- Identification des ingrédients spécifiques par marque
- Fréquence de reformulation par marque
- **Sans jugement comparatif**

### 4️⃣ Sources obligatoires

Chaque observation doit être **tracée à sa source** :
- Scan d'étiquette
- Scan de ticket
- Base de données publique
- Signalement utilisateur

---

## 📊 Architecture des données

### FormulationSnapshot

Instantané d'une formulation à un moment donné.

```typescript
interface FormulationSnapshot {
  id: string                    // Identifiant unique
  ean: string                   // Code EAN du produit
  brand: string                 // Marque
  productName: string           // Nom du produit
  territory: TerritoryCode      // Territoire (GP, MQ, GF, RE, YT)
  timestamp: string             // Date ISO 8601
  ingredients: string[]         // Liste ordonnée des ingrédients
  sources: SourceReference[]    // Sources de l'observation
  quality: number               // Score de qualité (0-1)
}
```

**Caractéristiques** :
- Liste ordonnée : l'ordre a une signification réglementaire (proportion décroissante)
- Sources multiples : une observation peut combiner plusieurs sources
- Score de qualité : confiance dans la précision des données

### IngredientChange

Événement de changement détecté.

```typescript
interface IngredientChange {
  type: 'added' | 'removed' | 'moved' | 'renamed'
  ingredientName: string
  previousPosition?: number     // Position précédente (1-indexed)
  newPosition?: number          // Nouvelle position (1-indexed)
  previousName?: string         // Nom précédent (pour renommage)
  detectedAt: string           // Date de détection ISO 8601
  sources: SourceReference[]   // Sources de l'observation
}
```

**Types de changements** :
- `added` : Ingrédient ajouté à la formulation
- `removed` : Ingrédient retiré de la formulation
- `moved` : Ingrédient changé de position dans la liste
- `renamed` : Ingrédient renommé (même substance, nom différent)

### TimelineEntry

Entrée dans la chronologie d'évolution.

```typescript
interface TimelineEntry {
  id: string
  timestamp: string             // Date ISO 8601
  territory: TerritoryCode
  brand: string
  changes: IngredientChange[]   // Changements à ce moment
  snapshot: FormulationSnapshot // État complet à ce moment
}
```

### MultiBrandComparison

Résultat de comparaison multi-marques.

```typescript
interface MultiBrandComparison {
  category: string
  brands: string[]
  territories: TerritoryCode[]
  timeRange: { start: string; end: string }
  commonIngredients: string[]                    // Ingrédients communs
  brandSpecificIngredients: Record<string, string[]>  // Ingrédients spécifiques
  changeFrequency: Record<string, number>        // Fréquence de changement
  observationCount: Record<string, number>       // Nombre d'observations
}
```

---

## 🔧 Fonctionnalités

### 1️⃣ Évolution d'un produit

```typescript
const request: IngredientEvolutionRequest = {
  ean: '3760074380534',
  brand: 'MonicaBrand',          // Optionnel
  territory: 'GP',               // Optionnel
  startDate: '2025-01-01T00:00:00Z',  // Optionnel
  endDate: '2025-12-31T23:59:59Z',    // Optionnel
  significantOnly: true,         // Optionnel (ignore les entrées sans changement)
  limit: 50,                     // Optionnel (limite le nombre d'entrées)
};

const response = await getIngredientEvolution(request);
```

**Réponse** :
```typescript
{
  success: true,
  data: {
    ean: '3760074380534',
    brand: 'MonicaBrand',
    productName: 'Biscuits chocolat',
    timeline: [...],              // Chronologie ordonnée
    totalChanges: 12,             // Nombre total de changements
    changesByType: {              // Répartition par type
      added: 5,
      removed: 3,
      moved: 4,
      renamed: 0
    },
    territories: ['GP', 'MQ']
  },
  metadata: {
    processingTime: 45,           // Temps de traitement (ms)
    dataVersion: '1.7.0',
    sourcesAnalyzed: 8            // Nombre de sources analysées
  }
}
```

### 2️⃣ Comparaison multi-marques

```typescript
const request: MultiBrandComparisonRequest = {
  category: 'Biscuits chocolat',
  brands: ['BrandA', 'BrandB', 'BrandC'],
  territory: 'GP',               // Optionnel
  timeRange: {
    start: '2024-01-01T00:00:00Z',
    end: '2025-12-31T23:59:59Z'
  }
};

const response = await compareMultiBrands(request);
```

**Résultat** :
- Ingrédients communs à toutes les marques
- Ingrédients spécifiques à chaque marque
- Fréquence de reformulation par marque
- Nombre d'observations par marque

### 3️⃣ Formulation historique

```typescript
const query: HistoricalFormulationQuery = {
  ean: '3760074380534',
  date: '2025-06-15T00:00:00Z',
  territory: 'GP'                // Optionnel
};

const snapshot = await getHistoricalFormulation(query);
```

Retourne l'instantané le plus proche **avant ou à la date** spécifiée.

### 4️⃣ Statistiques de changement

```typescript
const stats = await getChangeDetectionStats(
  ['3760074380534', '1234567890123'],  // Liste d'EANs
  'GP'                                  // Territoire (optionnel)
);
```

**Résultat** :
```typescript
{
  totalFormulations: 156,
  totalChanges: 342,
  changesByType: { added: 120, removed: 98, moved: 124, renamed: 0 },
  averageChangesPerFormulation: 2.19,
  mostStable: [                        // Produits les plus stables
    { ean: '...', brand: '...', changeCount: 1 }
  ],
  mostVolatile: [                      // Produits les plus volatiles
    { ean: '...', brand: '...', changeCount: 18 }
  ]
}
```

---

## 🔍 Algorithme de détection

### Normalisation des ingrédients

Pour éviter les faux positifs :
1. Conversion en minuscules
2. Suppression des espaces en trop
3. Comparaison stricte de la chaîne normalisée

**Exemple** :
```
"Farine de Blé  " === "farine de blé" → Même ingrédient
"Huile de palme" !== "Huile de palmiste" → Ingrédients différents
```

### Détection des changements

Pour chaque paire de formulations consécutives :

1. **Détection des suppressions** :
   ```
   Pour chaque ingrédient de la formulation précédente :
     Si absent de la formulation actuelle → REMOVED
   ```

2. **Détection des ajouts** :
   ```
   Pour chaque ingrédient de la formulation actuelle :
     Si absent de la formulation précédente → ADDED
   ```

3. **Détection des déplacements** :
   ```
   Pour chaque ingrédient présent dans les deux formulations :
     Si position différente → MOVED
   ```

4. **Détection des renommages** :
   ```
   Heuristique (non implémentée dans v1.7.0) :
     Similarité de Levenshtein > 0.8 → RENAMED
   ```

---

## 📈 Cas d'usage

### Cas 1 : Suivi d'un produit sur un territoire

**Objectif** : Observer l'évolution d'un biscuit en Guadeloupe sur 1 an.

```typescript
const response = await getIngredientEvolution({
  ean: '3760074380534',
  territory: 'GP',
  startDate: '2024-01-01T00:00:00Z',
  endDate: '2024-12-31T23:59:59Z'
});

// Résultat : Timeline des changements détectés
```

### Cas 2 : Comparaison multi-marques

**Objectif** : Comparer les formulations de 3 marques de yaourts en Martinique.

```typescript
const response = await compareMultiBrands({
  category: 'Yaourts nature',
  brands: ['Yoplait', 'Danone', 'LocalBrand'],
  territory: 'MQ',
  timeRange: {
    start: '2024-01-01T00:00:00Z',
    end: '2025-01-01T00:00:00Z'
  }
});

// Résultat : Ingrédients communs et spécifiques
```

### Cas 3 : Recherche de la formulation à une date passée

**Objectif** : Retrouver la composition d'un produit au 15 juin 2024.

```typescript
const snapshot = await getHistoricalFormulation({
  ean: '3760074380534',
  date: '2024-06-15T00:00:00Z',
  territory: 'GP'
});

// Résultat : Snapshot le plus proche avant cette date
```

---

## ⚙️ Validation des données

### Validation de la qualité d'un snapshot

```typescript
const validation = validateSnapshotQuality(snapshot);

if (!validation.isValid) {
  console.log('Issues:', validation.issues);
  // Exemples d'issues :
  // - 'Missing EAN'
  // - 'Missing brand'
  // - 'Missing or empty ingredients list'
  // - 'Missing sources'
  // - 'Invalid quality score (must be 0-1)'
}
```

### Critères de qualité

Un snapshot est valide si :
- ✅ EAN présent
- ✅ Marque présente
- ✅ Nom de produit présent
- ✅ Territoire présent
- ✅ Timestamp valide (ISO 8601)
- ✅ Liste d'ingrédients non vide
- ✅ Sources présentes (≥ 1)
- ✅ Score de qualité entre 0 et 1

---

## 🚩 Feature Flag

Le module est contrôlé par le feature flag :

```env
VITE_FEATURE_INGREDIENT_EVOLUTION=false
```

**Par défaut : désactivé** (`false`)

Quand désactivé :
- `getIngredientEvolution()` → erreur "Feature not enabled"
- `compareMultiBrands()` → erreur "Feature not enabled"
- `getHistoricalFormulation()` → retourne `null`
- `getChangeDetectionStats()` → retourne stats vides

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

Typage complet avec mode strict activé :
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

## 🧪 Tests

Le module dispose de **≥30 tests unitaires** couvrant :

1. **Feature flag** (2 tests)
   - Désactivé
   - Activé

2. **getIngredientEvolution** (15 tests)
   - Produit inexistant
   - Détection d'ajouts
   - Détection de suppressions
   - Détection de déplacements
   - Filtre par marque
   - Filtre par territoire
   - Filtre par plage de dates
   - Filtre des changements significatifs
   - Limite du nombre d'entrées
   - Gestion d'EAN multiple
   - Comparaison insensible à la casse
   - Formulation vide
   - Marque inexistante
   - Métadonnées

3. **compareMultiBrands** (3 tests)
   - Feature désactivée
   - Structure de comparaison
   - Métadonnées

4. **getHistoricalFormulation** (5 tests)
   - Feature désactivée
   - Produit inexistant
   - Snapshot le plus proche
   - Filtre par territoire
   - Pas de snapshot avant date

5. **getChangeDetectionStats** (3 tests)
   - Feature désactivée
   - Statistiques multi-produits
   - Moyenne de changements

6. **validateSnapshotQuality** (6 tests)
   - Snapshot valide
   - EAN manquant
   - Marque manquante
   - Liste d'ingrédients vide
   - Score de qualité invalide
   - Sources manquantes

7. **Cas limites** (3 tests)
   - Données localStorage corrompues
   - Espaces dans les noms d'ingrédients
   - Listes d'ingrédients très longues

**Total : 37 tests**

---

## 📦 Stockage

Les snapshots sont stockés dans `localStorage` :

```
Clé : formulation_history_{ean}
Valeur : FormulationSnapshot[]
```

**Exemple** :
```javascript
localStorage.setItem(
  'formulation_history_3760074380534',
  JSON.stringify([
    {
      id: 'snapshot_1704067200000',
      ean: '3760074380534',
      brand: 'TestBrand',
      productName: 'Biscuits chocolat',
      territory: 'GP',
      timestamp: '2025-01-01T00:00:00Z',
      ingredients: ['Farine de blé', 'Sucre', 'Chocolat'],
      sources: [...],
      quality: 0.95
    }
  ])
);
```

---

## 🔄 Intégration avec v1.6.0

Le module v1.7.0 s'appuie sur les données de v1.6.0 :
- Utilise les snapshots créés par le système de dossier produit
- Réutilise les types `TerritoryCode` et `SourceReference`
- Compatible avec l'historisation existante

**Pas de rétrocompatibilité requise** : module indépendant.

---

## 🛡️ Sécurité et vie privée

### Données anonymisées

Le système ne stocke **aucune donnée personnelle** :
- ✅ EAN produit (public)
- ✅ Marque (public)
- ✅ Ingrédients (public, sur étiquette)
- ❌ Aucune donnée utilisateur

### Traçabilité

Chaque observation cite ses sources :
- Type de source (scan, base publique, signalement)
- Identifiant de source
- Date d'observation
- Territoire
- Score de confiance

---

## 📚 Références

### Cadre réglementaire

- **Règlement INCO (UE) n° 1169/2011** : Obligation d'étiquetage des ingrédients
- **Directive 2000/13/CE** : Ordre des ingrédients (proportion décroissante)

### Méthodologies connexes

- v1.5.0 : Product Insight System
- v1.6.0 : Product Dossier System

---

## 🎓 Glossaire

| Terme | Définition |
|-------|------------|
| **Formulation** | Liste ordonnée des ingrédients d'un produit |
| **Snapshot** | Instantané d'une formulation à un moment donné |
| **Timeline** | Chronologie des changements détectés |
| **Reformulation** | Changement dans la composition d'un produit |
| **Multi-marques** | Comparaison entre plusieurs marques |
| **Observation factuelle** | Constat neutre sans interprétation |

---

## 🔮 Évolutions futures

Possibles améliorations (hors scope v1.7.0) :
- Détection automatique des renommages (algorithme de similarité)
- Agrégation par catégorie de produits
- Export des chronologies
- Notifications de reformulation
- API de recherche par ingrédient

---

**Version** : 1.7.0  
**Dernière mise à jour** : Janvier 2026  
**Auteur** : A KI PRI SA YÉ  
**Statut** : ✅ Implémenté
