# Méthodologie Dossier Produit - v1.6.0

## 🎯 Vue d'ensemble

Le système de dossier produit A KI PRI SA YÉ transforme l'analyse produit ponctuelle (v1.5.0) en **suivi longitudinal persistant** avec historisation, détection automatique des reformulations, et analyse comparative avancée.

**Version**: 1.6.0  
**Date**: Janvier 2026  
**Base**: Extension de v1.5.0 (Product Insight System)  
**Statut**: Module indépendant en lecture seule

---

## 📋 Rappel v1.5.0 (acquis)

v1.5.0 fournit déjà :
- ✅ OCR étiquettes (ingrédients, nutrition, mentions)
- ✅ Analyse explicative des ingrédients (rôle, origine, fréquence)
- ✅ Additifs détaillés avec statuts réglementaires
- ✅ Lecture nutritionnelle interprétée (densités, pas de score)
- ✅ Framework de détection de variations territoriales
- ✅ Données observées uniquement, sources citées
- ✅ Feature flag `VITE_FEATURE_PRODUCT_INSIGHT`

➡️ **v1.6.0 ne refait pas cela**  
➡️ **v1.6.0 enrichit, structure et fiabilise**

---

## 🧠 Objectif v1.6.0

Transformer chaque scan isolé en **dossier produit citoyen complet** :
- Persistant dans le temps
- Historisé et versionné
- Comparable à sa catégorie
- Traçable dans ses reformulations
- Transparent sur sa fiabilité

---

## 🧩 Nouvelles capacités v1.6.0

### 1️⃣ Dossier Produit Unifié (Product Dossier)

Chaque produit (EAN) devient une **entité persistante** enrichie au fil des observations.

```typescript
ProductDossier {
  ean: string                           // Code-barre (clé primaire)
  canonicalName: string                 // Nom normalisé du produit
  brand: string                         // Marque
  category: string                      // Catégorie
  
  firstSeen: ISODate                    // Première observation
  lastUpdated: ISODate                  // Dernière mise à jour
  totalAnalyses: number                 // Nombre total d'analyses
  
  territories: TerritoryProductSnapshot[] // État par territoire
  analysisHistory: ProductAnalysisSnapshot[] // Historique complet
  reformulations: ReformulationEvent[]  // Reformulations détectées
  
  transformation: TransformationInsight // Analyse de transformation
  categoryComparison?: CategoryComparisonInsight // Comparaison catégorie
  dataQuality: DataQualityInsight       // Métriques de qualité
}
```

**Principe clé** : Un produit n'est plus un scan unique, mais un **dossier vivant** qui s'enrichit à chaque observation.

---

### 2️⃣ Historisation intelligente

Chaque nouvelle analyse crée un **snapshot daté** :

```typescript
ProductAnalysisSnapshot {
  id: string
  timestamp: ISODate
  territory: TerritoryCode
  sourceType: 'label_scan' | 'ticket_scan' | 'public_db'
  confidenceScore: number
  
  ingredients: IngredientInsight[]
  nutrition: NutritionInsight
  additives: AdditiveInsight[]
  
  differencesFromPrevious?: ProductDelta
  sources: SourceReference[]
}
```

**Différences calculées automatiquement** :
- Ajout/retrait d'ingrédient
- Modification nutritionnelle (avec % de changement)
- Changement d'additif
- Niveau de signification : minor / moderate / major

**Exemple de delta** :
```typescript
ProductDelta {
  ingredientChanges: {
    added: ["Sirop de glucose-fructose"]
    removed: ["Sucre"]
  }
  nutritionalChanges: {
    sugars: {
      previous: 45.0
      current: 48.2
      percentChange: +7.1%
    }
  }
  significance: "moderate"
  description: "1 ingrédient ajouté, 1 retiré, 1 valeur nutritionnelle modifiée"
}
```

➡️ **Détection automatique des reformulations silencieuses**

---

### 3️⃣ Indice de transformation alimentaire

Classification factuelle du niveau de transformation, **sans score propriétaire** :

```typescript
TransformationInsight {
  processingLevel: 'low' | 'moderate' | 'high' | 'ultra'
  
  indicators: {
    ingredientCount: number
    additiveCount: number
    syntheticRatio: number        // Ratio d'ingrédients synthétiques
    ultraProcessedMarkers: number // Marqueurs d'ultra-transformation
  }
  
  explanation: string
  criteriaMatched: string[]
  sources: SourceReference[]
}
```

**Critères de classification** :

| Niveau | Critères |
|--------|----------|
| **Low** | < 5 ingrédients, aucun additif, 0% synthétique |
| **Moderate** | 5-15 ingrédients, quelques additifs (1-3) |
| **High** | > 15 ingrédients, plusieurs additifs (3-5), ou > 30% synthétique |
| **Ultra** | > 15 ingrédients + > 5 additifs, ou >= 3 marqueurs ultra-transformation |

**Marqueurs d'ultra-transformation** :
- Nombre élevé d'additifs (> 5)
- Nombre élevé d'ingrédients (> 15)
- Multiples ingrédients synthétiques (> 3)
- Multiples exhausteurs de goût (> 2)

**Exemple d'explication** :
> "Produit ultra-transformé avec 22 ingrédients, 7 additifs, et 4 marqueurs d'ultra-transformation."

✔️ **Ce n'est pas un Nutri-Score**  
✔️ **Ce n'est pas une recommandation**  
✔️ **C'est une lecture factuelle expliquée**

---

### 4️⃣ Analyse comparative intra-catégorie

Positionnement du produit dans sa catégorie, **sans jugement de valeur** :

```typescript
CategoryComparisonInsight {
  category: string
  sampleSize: number
  lastUpdated: ISODate
  
  percentiles: {
    sugars: number      // 0-100 (ex: 75 = 75e percentile)
    salt: number
    calories: number
    fats?: number
    additives?: number
  }
  
  positioning: {
    sugars: 'below_average' | 'average' | 'above_average'
    salt: 'below_average' | 'average' | 'above_average'
    calories: 'below_average' | 'average' | 'above_average'
  }
  
  categoryStats: {
    sugars: { min, max, median, mean }
    salt: { min, max, median, mean }
    calories: { min, max, median, mean }
  }
}
```

**Classification du positionnement** :
- **below_average** : Percentile < 33
- **average** : Percentile 33-66
- **above_average** : Percentile > 66

**Exemple de restitution** :
> "Ce produit contient **48.2g de sucres pour 100g**, ce qui le positionne dans le **75e percentile** de sa catégorie (biscuits chocolatés). En d'autres termes, **75% des produits de cette catégorie contiennent moins de sucres**."

➡️ L'utilisateur comprend **où se situe le produit**, sans notation, sans jugement d'achat.

---

### 5️⃣ Qualité et fiabilité des données

Transparence totale sur la qualité des informations :

```typescript
DataQualityInsight {
  ocrReliability: number              // 0-1
  crossSourceConsistency: boolean     // Vérifié par plusieurs sources
  sampleSize: number                  // Nombre d'observations
  lastObservationAgeDays: number      // Fraîcheur des données
  dataCompleteness: number            // 0-1
  verificationStatus: 'unverified' | 'user_verified' | 'cross_verified' | 'official'
  
  warnings?: string[]
  recommendations?: string[]
}
```

**Avertissements automatiques** :
- "Fiabilité OCR faible - vérification recommandée" (< 0.7)
- "Données anciennes - mise à jour recommandée" (> 180 jours)
- "Peu d'observations - fiabilité limitée" (< 3 scans)

**Recommandations automatiques** :
- "Scanner à nouveau pour améliorer la fiabilité"
- "Vérifier avec une autre source"

➡️ **Aucune donnée présentée comme absolue**  
➡️ **Transparence totale sur les limitations**

---

### 6️⃣ Détection des reformulations

Identification automatique des changements de formulation :

```typescript
ReformulationEvent {
  detectedAt: ISODate
  territory: TerritoryCode
  type: 'ingredient_change' | 'nutritional_change' | 'additive_change' | 'comprehensive'
  
  delta: ProductDelta
  isSilent: boolean                   // Reformulation non déclarée
  
  impact: {
    nutritional: 'positive' | 'negative' | 'neutral' | 'mixed'
    transparency: 'improved' | 'degraded' | 'unchanged'
  }
}
```

**Reformulation silencieuse** : Changement de formulation non communiqué au consommateur.

**Évaluation d'impact nutritionnel** :
- **Positive** : Réduction sucre/sel > 5%
- **Négative** : Augmentation sucre/sel > 5%
- **Mixed** : Changements contradictoires
- **Neutral** : Changements < 5%

**Exemple de détection** :
> **Reformulation détectée le 15/12/2025 (Guadeloupe)**  
> Type : Changement nutritionnel  
> Impact : Négatif  
> Détails : Sucres +7.1% (45.0g → 48.2g), 1 ingrédient substitué (Sucre → Sirop de glucose-fructose)

---

## 🔬 Architecture technique

### Flux de traitement

```
1. Scan étiquette (v1.5.0)
   ↓
2. Analyse produit (ProductInsight)
   ↓
3. Chargement ou création ProductDossier
   ↓
4. Création ProductAnalysisSnapshot
   ↓
5. Calcul ProductDelta (vs snapshot précédent)
   ↓
6. Détection reformulation (si delta significatif)
   ↓
7. Mise à jour TerritorySnapshot
   ↓
8. Recalcul TransformationInsight
   ↓
9. Recalcul DataQualityInsight
   ↓
10. Sauvegarde ProductDossier
```

### Stockage

**LocalStorage** (pour MVP) :
- Clé : `product_dossier_{EAN}`
- Format : JSON stringifié
- Pas de limite de taille pratique (< 5MB par dossier)

**Production future** :
- Base de données centralisée (PostgreSQL/MongoDB)
- API RESTful pour accès multi-utilisateur
- Agrégation statistiques catégorielles

---

## 📊 Métriques de stabilité produit

### Score de stabilité (0-1)

Calculé à partir de :
- Nombre de reformulations
- Âge du produit
- Fréquence moyenne des changements

**Formule** :
```
reformulationRate = reformulations / (ageInYears)
stabilityScore = max(0, min(1, 1 - (reformulationRate / 5)))
```

**Interprétation** :
- 0.9-1.0 : Très stable
- 0.7-0.9 : Stable
- 0.5-0.7 : Moyennement stable
- < 0.5 : Instable

---

## 🔒 Contraintes et limitations

### Contraintes strictes

✅ **Lecture seule** : Aucune modification de l'UI existante  
✅ **Données observées** : Uniquement données vérifiables (photos, OCR, bases publiques)  
✅ **Pas de recommandation** : Aucun conseil d'achat ou de consommation  
✅ **Pas de conseil médical** : Information factuelle uniquement  
✅ **Pas de score propriétaire** : Classification factuelle, pas de notation  
✅ **Sources citées** : Traçabilité complète de chaque information  
✅ **Feature flag** : `VITE_FEATURE_PRODUCT_DOSSIER` (défaut: false)

### Limitations techniques

1. **Qualité OCR** : Dépend de la qualité des photos
2. **Comparaison catégorie** : Nécessite échantillon suffisant (min 30 produits)
3. **Détection reformulation** : Limitée aux données disponibles
4. **Stockage local** : Limité aux produits scannés par l'utilisateur (pour MVP)

### Avertissements aux utilisateurs

⚠️ **Ce système n'est pas un conseil médical**  
⚠️ **Ne remplace pas la lecture de l'étiquette originale**  
⚠️ **En cas d'allergie, toujours vérifier l'étiquette physique**  
⚠️ **Les reformulations peuvent ne pas être détectées instantanément**

---

## 📚 Sources et références

### Bases de données

1. **Open Food Facts**
   - Base collaborative mondiale
   - API publique pour comparaisons catégorielles
   - Licence : ODbL

2. **Bases réglementaires**
   - NOVA classification (niveaux de transformation)
   - Seuils nutritionnels OMS/ANSES
   - Classification INCA3 (Anses)

### Méthodologie scientifique

- **NOVA** : Classification des aliments selon leur niveau de transformation
- **Repères nutritionnels** : ANSES/OMS pour seuils de densité
- **Percentiles** : Distribution statistique standard

---

## 🚀 Évolutions futures

### v1.7.0 - Observatoire comparatif DOM/Métropole
- Agrégation statistiques territoriales
- Comparaison systématique DOM vs Métropole
- Détection écarts prix/qualité

### v1.8.0 - Corrélation prix ↔ formulation
- Analyse prix au kg vs niveau de transformation
- Détection "sur-transformation" pour segments prix
- Optimisation rapport qualité/prix

### v2.0.0 - Plateforme publique open-data
- API publique pour chercheurs, presse, collectivités
- Observatoire vie chère avec données produit
- Données anonymisées, agrégées, publiques

---

## 📞 Contact et contributions

Pour signaler une erreur ou contribuer :
- Email : contact@akiprisaye.com
- Plateforme : https://akiprisaye.com

**Licence** : Données open-source sous licence ODbL  
**Code** : Disponible sous licence MIT

---

*Document mis à jour le 2 janvier 2026*  
*Version : 1.6.0*  
*Base : Product Insight System v1.5.0*
