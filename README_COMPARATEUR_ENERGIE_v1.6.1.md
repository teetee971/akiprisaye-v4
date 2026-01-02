# Comparateur Citoyen Énergie et Eau v1.6.1

**A KI PRI SA YÉ - Extension Électricité, Gaz et Eau**

Version 1.6.1 - Janvier 2026

---

## Introduction

Cette version étend le **socle de comparaison v1.6.0** aux services essentiels d'**énergie et d'eau** :

✅ **Électricité** - Offres résidentielles observées  
✅ **Gaz** - Offres résidentielles observées  
✅ **Eau** - Services d'eau potable et d'assainissement observés  

---

## Principe Fondamental

Extension **strictement conforme** au socle v1.6.0 :

- ✅ **Lecture seule** - Données observées uniquement
- ✅ **Aucune recommandation** - Classement objectif du moins cher au plus cher
- ✅ **Multi-territoires** - Comparaison par zone géographique
- ✅ **Historique temporel** - Évolution des prix
- ✅ **Sources traçables** - Date, volume, origine
- ✅ **Agrégation statistique** - Min, max, moyenne, écart-type

---

## Comparateur Électricité

### Données Observées

Pour chaque offre d'électricité :

```typescript
{
  // Identifiant unique
  id: string;
  
  // Fournisseur et offre
  providerName: string;      // Ex: "EDF", "Total Energies"
  offerName: string;         // Ex: "Tarif Bleu", "Offre Verte"
  
  // Prix TTC observé (coût mensuel moyen estimé)
  priceIncludingTax: number; // En euros
  
  // Territoire
  territory: Territory;      // Ex: MARTINIQUE, GUADELOUPE
  
  // Caractéristiques techniques
  specifications: {
    powerSubscribed: number;           // Puissance (kVA): 3, 6, 9, 12, 15...
    tariffOption: string;              // "base", "heures_creuses", "tempo", "ejp"
    subscriptionPriceMonthly: number;  // Abonnement mensuel TTC (€)
    pricePerKwhPeak: number;           // Prix kWh TTC heures pleines/base (€)
    pricePerKwhOffPeak?: number;       // Prix kWh TTC heures creuses (€)
    meterType?: string;                // "classique", "linky"
    commitmentMonths?: number;         // Durée d'engagement (mois)
  };
  
  // Source traçable
  source: {
    origin: string;            // "observation directe", "open data"
    observationDate: Date;     // Date d'observation
    sampleSize: number;        // Volume d'observations
    confidenceLevel?: number;  // Niveau de confiance (0-1)
  };
  
  // Validité
  validFrom: Date;
  validUntil?: Date;
}
```

### Calcul du Coût Annuel

Le système peut calculer un **coût annuel estimé** basé sur une consommation :

```typescript
calculateAnnualCost(offer: ServiceOffer, annualConsumptionKwh: number): number
```

**Formule :**
- **Abonnement annuel** = `subscriptionPriceMonthly × 12`
- **Consommation** :
  - **Base** : `annualConsumptionKwh × pricePerKwhPeak`
  - **Heures creuses** : `annualConsumptionKwh × (60% × pricePerKwhPeak + 40% × pricePerKwhOffPeak)`

**Exemple :**
```
Offre: Tarif Bleu EDF
  Abonnement: 12 €/mois
  Prix kWh: 0.18 €
  
Consommation: 5000 kWh/an

Coût annuel:
  Abonnement: 12 × 12 = 144 €
  Consommation: 5000 × 0.18 = 900 €
  Total: 1044 € TTC
```

### Filtres Disponibles

- **Territoire** - Zone géographique (obligatoire)
- **Puissance souscrite** - kVA (ex: 6, 9, 12)
- **Option tarifaire** - base, heures_creuses, tempo, ejp
- **Prix min/max** - Fourchette de prix
- **Dates** - Période d'observation

---

## Comparateur Gaz

### Données Observées

Pour chaque offre de gaz :

```typescript
{
  id: string;
  providerName: string;      // Ex: "Engie", "TotalEnergies"
  offerName: string;         // Ex: "Gaz Fixe", "Gaz Vert"
  priceIncludingTax: number; // Coût mensuel moyen estimé (€)
  territory: Territory;
  
  specifications: {
    consumptionClass: string;          // "base", "B0", "B1", "B2i"
    tariffZone?: number;               // Zone tarifaire (1-6)
    subscriptionPriceMonthly: number;  // Abonnement mensuel TTC (€)
    pricePerKwh: number;               // Prix kWh TTC (€)
    gasType?: string;                  // "naturel", "propane", "butane"
    commitmentMonths?: number;         // Durée d'engagement (mois)
  };
  
  source: DataSource;
  validFrom: Date;
  validUntil?: Date;
}
```

### Calcul du Coût Annuel

```typescript
calculateAnnualCost(offer: ServiceOffer, annualConsumptionKwh: number): number
```

**Formule :**
- **Abonnement annuel** = `subscriptionPriceMonthly × 12`
- **Consommation** = `annualConsumptionKwh × pricePerKwh`

**Exemple :**
```
Offre: Gaz Fixe Engie
  Abonnement: 15 €/mois
  Prix kWh: 0.08 €
  
Consommation: 10000 kWh/an

Coût annuel:
  Abonnement: 15 × 12 = 180 €
  Consommation: 10000 × 0.08 = 800 €
  Total: 980 € TTC
```

### Filtres Disponibles

- **Territoire** - Zone géographique (obligatoire)
- **Classe de consommation** - base, B0, B1, B2i
- **Zone tarifaire** - 1 à 6
- **Prix min/max** - Fourchette de prix
- **Dates** - Période d'observation

---

## Comparateur Eau

### Données Observées

Pour chaque service d'eau :

```typescript
{
  id: string;
  providerName: string;      // Ex: "Veolia", "Suez"
  offerName: string;         // Ex: "Eau Totale", "Service Eau"
  priceIncludingTax: number; // Coût annuel moyen estimé (€)
  territory: Territory;
  
  specifications: {
    serviceType: string;                // "eau_potable", "assainissement", "combine"
    subscriptionPriceAnnual: number;    // Abonnement annuel TTC (€)
    pricePerCubicMeter: number;         // Prix m³ eau potable TTC (€)
    pricePerCubicMeterSanitation?: number; // Prix m³ assainissement TTC (€)
    taxesIncluded?: boolean;            // Taxes et redevances incluses
    managementType?: string;            // "regie", "dsp", "affermage"
  };
  
  source: DataSource;
  validFrom: Date;
  validUntil?: Date;
}
```

### Calcul du Coût Annuel

```typescript
calculateAnnualCost(offer: ServiceOffer, annualConsumptionM3: number): number
```

**Formule :**
- **Abonnement annuel** = `subscriptionPriceAnnual`
- **Eau potable** = `annualConsumptionM3 × pricePerCubicMeter`
- **Assainissement** = `annualConsumptionM3 × pricePerCubicMeterSanitation` (si applicable)

**Exemple :**
```
Offre: Eau Totale Veolia
  Abonnement: 60 €/an
  Prix m³ eau: 2.50 €
  Prix m³ assainissement: 1.50 €
  
Consommation: 120 m³/an (famille de 4)

Coût annuel:
  Abonnement: 60 €
  Eau potable: 120 × 2.50 = 300 €
  Assainissement: 120 × 1.50 = 180 €
  Total: 540 € TTC
```

### Filtres Disponibles

- **Territoire** - Zone géographique (obligatoire)
- **Type de service** - eau_potable, assainissement, combine
- **Prix min/max** - Fourchette de prix
- **Dates** - Période d'observation

---

## Utilisation des Services

### Électricité

```typescript
import { ElectricityComparisonService } from './services/comparison/energy';

const service = ElectricityComparisonService.getInstance();

// Comparaison simple
const result = await service.compareOffers(Territory.MARTINIQUE, {
  specificFilters: {
    powerSubscribed: 6,
    tariffOption: 'base'
  }
});

// Avec coût annuel estimé
const resultWithCost = await service.compareWithEstimatedCost(
  Territory.MARTINIQUE,
  5000, // kWh/an
  { specificFilters: { powerSubscribed: 6 } }
);
```

### Gaz

```typescript
import { GasComparisonService } from './services/comparison/energy';

const service = GasComparisonService.getInstance();

const result = await service.compareOffers(Territory.MARTINIQUE, {
  specificFilters: {
    consumptionClass: 'B1'
  }
});
```

### Eau

```typescript
import { WaterComparisonService } from './services/comparison/energy';

const service = WaterComparisonService.getInstance();

const result = await service.compareOffers(Territory.MARTINIQUE, {
  specificFilters: {
    serviceType: 'combine'
  }
});
```

---

## Conformité et Garanties

### Respect du Socle v1.6.0

✅ **Héritage strict** de `ServiceComparisonCore`  
✅ **Méthodologie identique** (agrégation, classement, historique)  
✅ **Types compatibles** avec le système de base  
✅ **Tests unitaires** complets (14 tests passing)  

### Spécificités Énergie/Eau

✅ **Calcul de coût annuel** - Utilitaire mais **non obligatoire**  
✅ **Filtres spécifiques** - Adaptés à chaque type de service  
✅ **Sources traçables** - Date, origine, volume obligatoires  
✅ **Aucune interprétation** - Données brutes uniquement  

### Limites Assumées

❗ **Pas de conseil personnalisé** - Calculs basés sur consommations types  
❗ **Pas de simulation précise** - Estimations approximatives  
❗ **Pas de prise en compte des aides** - Prix publics uniquement  
❗ **Pas d'évaluation qualitative** - Prix et caractéristiques techniques uniquement  

---

## Feature Flags

Trois feature flags **indépendants** :

```typescript
{
  "electricity_comparison_enabled": boolean,
  "gas_comparison_enabled": boolean,
  "water_comparison_enabled": boolean
}
```

**Activation/désactivation sans impact** sur les autres services.

---

## Tests Unitaires

**14 tests passing** couvrant :

- Création d'instances (singleton)
- Comparaison d'offres
- Calculs de coûts annuels
- Filtres spécifiques
- Validations de données

**Commande :**
```bash
npm test -- energyServices.test.ts
```

---

## Évolutions Futures

**Version 1.7.0** - Télécoms (Internet, Mobile)  
**Version 1.8.0** - Assurances (Auto, Habitation, Santé)  
**Version 2.0.0** - Agrégation multi-services  

---

## Contact et Support

**Documentation technique :** `backend/src/services/comparison/energy/`  
**Tests unitaires :** `backend/src/services/comparison/energy/__tests__/`  
**Méthodologie générale :** `METHODOLOGIE_SERVICES_v1.6.0.md`  

**Licence :** Licence Ouverte / Open Licence v2.0  

---

*Document généré pour la version 1.6.1 - Janvier 2026*
