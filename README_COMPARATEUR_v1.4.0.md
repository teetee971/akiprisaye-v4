# Comparateur de Prix v1.4.0

## Vue d'ensemble

La version 1.4.0 introduit le **comparateur de prix citoyen**, une fonctionnalité de lecture seule permettant la comparaison multi-enseignes des prix par territoire.

## Caractéristiques

### ✅ Implémenté

- **Modèles TypeScript stricts** - Types complets pour la comparaison de prix
- **Service de comparaison** - Logique métier production-ready
- **Correspondance EAN** - Identification fiable des produits par code-barres
- **Agrégation territoriale** - Comparaison par territoire (DOM/ROM/COM)
- **Classement automatique** - Du moins cher au plus cher
- **Calculs d'écarts** - Pourcentages et valeurs absolues
- **Transparence des sources** - Période, volume, territoire, confiance
- **Feature flag** - `VITE_FEATURE_PRICE_COMPARISON` (défaut: false)
- **Documentation méthodologique** - `METHODOLOGIE_COMPARATEUR_v1.4.0.md`
- **Tests unitaires** - 41 tests passant avec succès

### 🎯 Principes Respectés

- ✅ Lecture seule (aucune modification de données)
- ✅ Données agrégées uniquement
- ✅ Correspondance produit basée sur EAN
- ✅ Agrégation multi-magasins par territoire
- ✅ Classement du moins cher au plus cher
- ✅ Calcul des écarts en %
- ✅ Sources transparentes (période, volume, territoire)
- ✅ Feature flags activables
- ✅ Code TypeScript strict, production-ready
- ✅ Pas de modification des versions 1.0 à 1.3

## Structure des fichiers

```
src/
├── types/
│   └── priceComparison.ts          # Types TypeScript pour comparaison de prix
├── services/
│   ├── priceComparisonService.ts   # Service de comparaison de prix
│   └── __tests__/
│       └── priceComparisonService.test.ts  # Tests unitaires (41 tests)
└── config/
    └── featureFlags.js              # Feature flag VITE_FEATURE_PRICE_COMPARISON

METHODOLOGIE_COMPARATEUR_v1.4.0.md   # Documentation méthodologique complète
CHANGELOG.md                          # Historique des changements
.env.example                          # Configuration feature flag
```

## Utilisation

### 1. Activer le feature flag

```bash
# .env.local
VITE_FEATURE_PRICE_COMPARISON=true
```

### 2. Importer le service

```typescript
import {
  comparePricesByEAN,
  calculateTerritoryAggregation,
  rankStorePrices,
} from '@/services/priceComparisonService';
import type {
  StorePricePoint,
  PriceComparisonResult,
} from '@/types/priceComparison';
```

### 3. Comparer les prix

```typescript
// Exemple: Comparer les prix d'un produit en Martinique
const storePrices: StorePricePoint[] = [
  {
    storeId: 'store1',
    storeName: 'Magasin A',
    price: 1.79,
    territory: 'MQ',
    observationDate: '2025-12-20T10:00:00Z',
    source: 'user_report',
    volume: 45,
    confidence: 'high',
    verified: true,
  },
  // ... autres magasins
];

const comparison = comparePricesByEAN(
  '3228857000906',  // EAN du produit
  storePrices,
  'MQ'              // Territoire: Martinique
);

if (comparison) {
  console.log('Prix moyen:', comparison.aggregation.averagePrice);
  console.log('Magasin le moins cher:', comparison.storePrices[0]);
  console.log('Écart max:', comparison.aggregation.priceRange);
}
```

## Fonctions principales

### `comparePricesByEAN(ean, storePrices, territory)`

Compare les prix d'un produit identifié par son EAN dans un territoire donné.

**Retourne:** `PriceComparisonResult | null`

### `calculateTerritoryAggregation(prices, territory)`

Calcule les statistiques d'agrégation pour un territoire (moyenne, min, max, amplitude).

**Retourne:** `TerritoryPriceAggregation`

### `rankStorePrices(sortedPrices, aggregation)`

Classe les magasins du moins cher au plus cher avec calcul des écarts.

**Retourne:** `StorePriceRanking[]`

### `filterStorePrices(prices, filter)`

Filtre les prix selon des critères (territoire, chaîne, âge, confiance, vérification).

**Retourne:** `StorePricePoint[]`

### `getCheapestStore(prices)` / `getMostExpensiveStore(prices)`

Trouve le magasin le moins cher / le plus cher.

**Retourne:** `StorePricePoint | null`

### `calculatePotentialSavings(prices)`

Calcule les économies potentielles en choisissant le magasin le moins cher.

**Retourne:** `{ absolute: number, percentage: number } | null`

## Tests

Lancer les tests du comparateur de prix :

```bash
npm run test -- src/services/__tests__/priceComparisonService.test.ts
```

**Couverture des tests:**
- ✅ Comparaison par EAN
- ✅ Agrégation territoriale
- ✅ Classement des prix
- ✅ Calculs de pourcentages
- ✅ Filtrage des données
- ✅ Gestion des cas limites
- ✅ Métadonnées de transparence

## Documentation

Pour la méthodologie complète de comparaison des prix, consulter :
**[METHODOLOGIE_COMPARATEUR_v1.4.0.md](./METHODOLOGIE_COMPARATEUR_v1.4.0.md)**

Cette documentation explique en détail :
- Identification des produits par EAN
- Méthode d'agrégation territoriale
- Calcul des écarts et classement
- Transparence des sources
- Qualité des données et avertissements

## Compatibilité

Cette fonctionnalité :
- ✅ N'impacte pas les versions 1.0 à 1.3
- ✅ Est désactivée par défaut (feature flag)
- ✅ Fonctionne de manière indépendante
- ✅ Respecte le principe de lecture seule
- ✅ Maintient la compatibilité TypeScript strict

## Prochaines étapes (v1.5.0+)

- Comparaison inter-territoires
- Historique des prix
- Alertes de variation
- Calcul du panier optimal
- Recommandations d'itinéraire

## Licence

Code sous licence MIT - Documentation sous Creative Commons BY-SA 4.0
