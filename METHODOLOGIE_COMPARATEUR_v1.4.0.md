# Méthodologie du Comparateur de Prix Citoyen v1.4.0

**A KI PRI SA YÉ - Comparateur de Prix Multi-Enseignes**

Version 1.4.0 - Janvier 2026

---

## Principe Fondamental

Le **comparateur de prix citoyen** est un outil de lecture et d'analyse des données de prix existantes.

Il permet de **comparer objectivement** les prix pratiqués par différentes enseignes pour un même produit, sur un territoire donné.

**Caractéristiques principales :**
- ✅ **Lecture seule** - Aucune modification des données
- ✅ **Correspondance EAN** - Identification fiable des produits
- ✅ **Agrégation territoriale** - Comparaison par zone géographique
- ✅ **Transparence totale** - Sources, périodes et volumes affichés
- ✅ **Classement objectif** - Du moins cher au plus cher

---

## Méthode de Comparaison

### 1. Identification du Produit

**Code EAN (European Article Number)**

Le comparateur identifie les produits uniquement via leur **code EAN** (code-barres).

**Avantages :**
- Identification unique et standardisée
- Aucune ambiguïté sur le produit
- Compatible avec tous les systèmes de caisse
- Vérifiable par le consommateur

**Exemple :**
```
EAN: 3228857000906
Produit: Lait demi-écrémé 1L
```

### 2. Agrégation par Territoire

Les prix sont **agrégés par territoire** selon les zones définies :

**Territoires couverts :**
- **DOM** : Guadeloupe (GP), Martinique (MQ), Guyane (GF), La Réunion (RE), Mayotte (YT)
- **ROM/COM** : Saint-Martin (MF), Saint-Barthélemy (BL), Saint-Pierre-et-Miquelon (PM), Wallis-et-Futuna (WF), Polynésie française (PF), Nouvelle-Calédonie (NC)

**Règle :**
> Un comparateur ne compare que des produits **sur un même territoire**.
> Les comparaisons inter-territoires sont affichées séparément.

### 3. Collecte Multi-Magasins

Pour chaque produit (identifié par son EAN), le système agrège les prix observés dans **tous les magasins du territoire**.

**Données collectées par magasin :**
- Identifiant du magasin
- Nom de l'enseigne
- Prix observé (en euros)
- Date d'observation
- Source de la donnée
- Volume d'observations
- Niveau de confiance
- Statut de vérification

**Exemple :**
```
Territoire: Martinique (MQ)
Produit: Lait UHT 1L (EAN: 3228857000906)

Magasin 1: Carrefour Fort-de-France → 1.95 €
Magasin 2: Super U Lamentin → 1.89 €
Magasin 3: Leader Price Schoelcher → 1.79 €
```

### 4. Classement des Prix

Les prix sont **classés du moins cher au plus cher**.

**Affichage pour chaque magasin :**
1. **Rang** - Position dans le classement (1 = le moins cher)
2. **Prix** - Prix observé en euros
3. **Écart avec le moins cher** - En euros et en pourcentage
4. **Écart avec la moyenne** - En euros et en pourcentage
5. **Catégorie** - Position relative (moins cher, dans la moyenne, plus cher)

**Exemple :**
```
Rang 1: Leader Price Schoelcher
  Prix: 1.79 €
  Écart/moins cher: 0.00 € (0%)
  Écart/moyenne: -0.09 € (-4.8%)
  Catégorie: Le moins cher

Rang 2: Super U Lamentin
  Prix: 1.89 €
  Écart/moins cher: +0.10 € (+5.6%)
  Écart/moyenne: +0.01 € (+0.5%)
  Catégorie: Dans la moyenne

Rang 3: Carrefour Fort-de-France
  Prix: 1.95 €
  Écart/moins cher: +0.16 € (+8.9%)
  Écart/moyenne: +0.07 € (+3.7%)
  Catégorie: Plus cher
```

### 5. Calcul des Écarts

#### Écart avec le moins cher

**Formule :**
```
Écart absolu = Prix du magasin - Prix le moins cher
Écart relatif (%) = (Écart absolu / Prix le moins cher) × 100
```

**Exemple :**
```
Prix magasin: 1.95 €
Prix le moins cher: 1.79 €

Écart absolu = 1.95 - 1.79 = 0.16 €
Écart relatif = (0.16 / 1.79) × 100 = 8.9%
```

#### Écart avec la moyenne

**Formule :**
```
Prix moyen = Somme des prix / Nombre de magasins
Écart absolu = Prix du magasin - Prix moyen
Écart relatif (%) = (Écart absolu / Prix moyen) × 100
```

**Exemple :**
```
Prix moyen = (1.79 + 1.89 + 1.95) / 3 = 1.88 €
Prix magasin: 1.95 €

Écart absolu = 1.95 - 1.88 = 0.07 €
Écart relatif = (0.07 / 1.88) × 100 = 3.7%
```

### 6. Agrégation Territoriale

Pour chaque produit sur un territoire, le système calcule :

**Statistiques d'agrégation :**
- **Prix moyen** - Moyenne arithmétique de tous les prix
- **Prix minimum** - Prix le plus bas observé
- **Prix maximum** - Prix le plus élevé observé
- **Amplitude** - Différence entre max et min
- **Amplitude relative** - Amplitude en % du prix minimum
- **Nombre de magasins** - Nombre de points de vente dans la comparaison
- **Période d'observation** - Date la plus ancienne et la plus récente
- **Volume total** - Nombre d'observations agrégées

**Exemple :**
```
Territoire: Martinique (MQ)
Produit: Lait UHT 1L (EAN: 3228857000906)

Prix moyen: 1.88 €
Prix minimum: 1.79 €
Prix maximum: 1.95 €
Amplitude: 0.16 € (8.9% du prix min)
Magasins: 3
Période: 2025-12-15 → 2026-01-01
Observations: 156
```

---

## Transparence des Sources

### Traçabilité Complète

Chaque prix affiché est accompagné de :

1. **Source de la donnée**
   - `official_site` : Site officiel
   - `public_listing` : Listing public
   - `user_report` : Rapport citoyen
   - `observateur` : Observatoire des prix

2. **Date d'observation**
   - Format ISO 8601 (YYYY-MM-DD)
   - Permet d'évaluer la fraîcheur de la donnée

3. **Volume d'observations**
   - Nombre d'observations agrégées pour ce prix
   - Indicateur de fiabilité

4. **Niveau de confiance**
   - `high` : Confiance élevée (sources multiples, vérifiées)
   - `medium` : Confiance moyenne (source unique ou récente)
   - `low` : Confiance faible (donnée à vérifier)

5. **Statut de vérification**
   - `verified: true` : Vérifié par plusieurs sources
   - `verified: false` : Non vérifié

### Métadonnées de Comparaison

Chaque comparaison inclut des métadonnées complètes :

```json
{
  "methodology": "v1.4.0",
  "aggregationMethod": "mean",
  "dataQuality": {
    "totalStores": 3,
    "storesWithData": 3,
    "coveragePercentage": 100,
    "oldestObservation": "2025-12-15T10:00:00Z",
    "newestObservation": "2026-01-01T14:30:00Z"
  },
  "sources": [
    {
      "source": "user_report",
      "observationCount": 120,
      "storeCount": 3,
      "percentage": 76.9
    },
    {
      "source": "official_site",
      "observationCount": 36,
      "storeCount": 1,
      "percentage": 23.1
    }
  ]
}
```

---

## Qualité des Données

### Avertissements

Le système génère des **avertissements automatiques** si :

1. **Couverture limitée** - Moins de 50% des magasins ont des données
   ```
   ⚠️ Couverture limitée - moins de 50% des magasins ont des données
   ```

2. **Données anciennes** - Certaines observations ont plus de 30 jours
   ```
   ⚠️ Certaines données de prix ont plus de 30 jours
   ```

### Filtres de Qualité

Le comparateur peut filtrer les prix selon :

- **Âge maximum** - Exclure les prix trop anciens
- **Confiance minimum** - Ne garder que les données fiables
- **Vérification** - Uniquement les prix vérifiés
- **Enseigne** - Filtrer par chaîne de magasins

---

## Cas d'Usage

### 1. Recherche du meilleur prix

**Objectif :** Trouver où acheter un produit au meilleur prix

**Processus :**
1. Scanner ou saisir le code EAN du produit
2. Sélectionner le territoire
3. Consulter le classement
4. Identifier le magasin le moins cher

### 2. Estimation des économies

**Objectif :** Calculer les économies potentielles

**Processus :**
1. Comparer le prix le plus élevé au prix le plus bas
2. Calculer l'écart absolu et relatif
3. Multiplier par la fréquence d'achat

**Exemple :**
```
Produit: Lait 1L
Prix le plus bas: 1.79 €
Prix le plus élevé: 1.95 €
Économie par achat: 0.16 €

Si achat hebdomadaire (52 fois/an):
Économie annuelle: 0.16 × 52 = 8.32 €
```

### 3. Suivi des variations

**Objectif :** Observer l'évolution des écarts de prix

**Processus :**
1. Comparer à différentes dates
2. Observer les variations d'amplitude
3. Identifier les tendances

---

## Limitations et Garanties

### Ce que le comparateur fait

✅ **Affiche les prix observés** tels que collectés  
✅ **Classe objectivement** du moins cher au plus cher  
✅ **Calcule les écarts** de manière transparente  
✅ **Indique les sources** de chaque donnée  
✅ **Signale les données anciennes** ou incomplètes  

### Ce que le comparateur ne fait PAS

❌ **Ne prédit pas** les prix futurs  
❌ **Ne simule pas** de données manquantes  
❌ **Ne juge pas** les enseignes  
❌ **Ne modifie pas** les données sources  
❌ **Ne garantit pas** la disponibilité actuelle du produit  

---

## Mise en Œuvre Technique

### Architecture

- **Read-only** : Aucune modification des données sources
- **TypeScript strict** : Typage complet pour la fiabilité
- **Feature flag** : `VITE_FEATURE_PRICE_COMPARISON` (par défaut: false)
- **Production-ready** : Tests unitaires et validation complète

### Respect des versions antérieures

Le comparateur v1.4.0 :
- N'impacte **aucun comportement** des versions 1.0 à 1.3
- Est **activable/désactivable** via feature flag
- Fonctionne de manière **indépendante** des autres modules

---

## Évolutions Futures

### Version 1.5.0 (prévue)
- Comparaison inter-territoires
- Historique des prix
- Alertes de variation

### Version 1.6.0 (prévue)
- Calcul du panier optimal
- Recommandations d'itinéraire
- Export des comparaisons

---

## Contact et Références

**Documentation technique :** `/src/services/priceComparisonService.ts`  
**Types TypeScript :** `/src/types/priceComparison.ts`  
**Tests unitaires :** `/src/services/__tests__/priceComparisonService.test.ts`

**Méthodologie générale :** `METHODOLOGIE_OFFICIELLE_v2.0.md`

---

**Document officiel**  
**Version :** 1.4.0  
**Date :** Janvier 2026  
**Licence :** Creative Commons BY-SA 4.0
