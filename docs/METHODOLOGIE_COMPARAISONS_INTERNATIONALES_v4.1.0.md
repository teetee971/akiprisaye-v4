# Méthodologie des Comparaisons Internationales v4.1.0

## Vue d'ensemble

Ce document décrit la méthodologie utilisée pour comparer le coût de la vie entre pays et territoires. Les comparaisons sont **purement factuelles**, **transparentes** et **sans jugement de valeur**.

## Principes fondamentaux

### 1. Normalisation monétaire
Toutes les valeurs sont normalisées en **EUR** (Euro) pour permettre la comparaison.

**Formule :**
```
Valeur_normalisée = Valeur_locale × Taux_de_change
```

**Sources des taux de change :**
- Banque Centrale Européenne (ECB) - données quotidiennes
- Cache local pour la résilience
- Taux fixes pour les devises historiques

### 2. Ajustement PPA (Parité de Pouvoir d'Achat)
La PPA ajuste les valeurs pour refléter le **pouvoir d'achat réel** dans chaque pays.

**Formule :**
```
Valeur_ajustée_PPA = Valeur_normalisée × Facteur_PPA
```

Où :
```
Facteur_PPA = Taux_PPA / Taux_de_change
```

**Sources PPA :**
- OCDE (prioritaire)
- Banque Mondiale
- FMI
- Eurostat

**Exemple :**
- Produit à 100 USD aux États-Unis
- Taux de change : 1 USD = 0.92 EUR
- Valeur normalisée : 92 EUR
- Taux PPA : 1.05
- Facteur PPA : 1.05 / 0.92 = 1.14
- Valeur ajustée PPA : 92 × 1.14 = 105 EUR

Cela signifie que 100 USD aux États-Unis ont un **pouvoir d'achat équivalent** à 105 EUR en France.

---

## Types de comparaisons

### 1. DOM vs France Métropolitaine

**Objectif :** Mesurer l'écart de coût de la vie entre les DOM et la métropole.

**Indicateurs comparés :**
- Panier alimentaire
- Logement
- Transport
- Énergie
- Indice global (IEVR)

**Facteurs spécifiques pris en compte :**

#### Octroi de mer
Taxe locale sur les importations dans les DOM.
```
Impact_octroi = (Prix_DOM - Prix_métropole) × Taux_octroi_estimé
```

Taux estimés : 5-15% selon les produits.

#### Frais de transport maritime
Coût du transport des marchandises.
```
Impact_transport = (Prix_DOM - Prix_métropole) × Part_import × Coût_transport_unitaire
```

Part d'importation : 80-95% selon les territoires.

#### Production locale
Pourcentage de produits produits localement.
```
Taux_production_locale = Nb_produits_locaux / Nb_produits_total × 100
```

Plus le taux est élevé, moins l'impact du transport est important.

**Formule finale DOM-Métropole :**
```
Écart_DOM = ((Prix_DOM / Prix_métropole) - 1) × 100
```

**Pas d'ajustement PPA** entre DOM et métropole (même devise, même zone économique).

---

### 2. France vs Union Européenne

**Objectif :** Positionner la France par rapport à ses voisins européens.

**Méthode :**
1. Collecter les données pour les 27 pays de l'UE
2. Normaliser en EUR (si nécessaire pour pays hors zone euro)
3. Appliquer l'ajustement PPA
4. Calculer moyenne et médiane UE
5. Calculer la position de la France

**Indicateurs :**
- Indice global du coût de la vie
- Alimentation
- Logement
- Transport
- Santé
- Éducation

**Classement :**
```
Rang_France = Position de la France dans le classement croissant (1 = moins cher, 27 = plus cher)
```

**Important :** Le classement est **purement factuel**, il ne signifie pas qu'un pays est "meilleur" qu'un autre.

**Écart à la moyenne UE :**
```
Écart_France_UE = ((Indice_France / Indice_moyenne_UE) - 1) × 100
```

---

### 3. UE vs International

**Objectif :** Comparer le coût de la vie dans l'UE avec d'autres régions du monde.

**Régions comparées :**
- Amérique du Nord (NAFTA)
- Asie
- Océanie
- Afrique
- Amérique du Sud

**Méthode :**
1. Calculer l'indice moyen UE (base 100)
2. Pour chaque pays international :
   - Normaliser en EUR
   - Appliquer l'ajustement PPA
   - Calculer l'écart à l'UE

**Formule :**
```
Écart_pays_international = ((Indice_pays_PPA / Indice_UE_moyen) - 1) × 100
```

**Interprétation :**
- Écart positif : coût de la vie plus élevé que la moyenne UE
- Écart négatif : coût de la vie moins élevé que la moyenne UE

---

## Qualité des données

### Niveaux de confiance

| Niveau | Critères | Utilisation |
|--------|----------|-------------|
| **High** | ≥ 10 sources, données < 30 jours, OCDE/Eurostat | Comparaisons officielles |
| **Medium** | 5-9 sources, données < 90 jours, sources mixtes | Comparaisons indicatives |
| **Low** | < 5 sources, données > 90 jours, sources non officielles | Comparaisons préliminaires |

### Score de qualité
```
Score_qualité = (
  (Nb_sources / 15) × 40 +
  (Fraîcheur_données / 30) × 30 +
  (Fiabilité_source) × 30
) × 100
```

Où :
- `Nb_sources` : nombre de sources différentes (max 15)
- `Fraîcheur_données` : nombre de jours depuis la dernière mise à jour (max 30)
- `Fiabilité_source` : 0.5 (non officielle), 0.75 (mixte), 1.0 (officielle)

---

## Limitations et avertissements

### 1. Pas de hiérarchie subjective
Les classements sont **purement factuels**. Un coût de la vie plus bas ne signifie pas nécessairement une meilleure qualité de vie.

### 2. Variations locales
Les données sont des **moyennes nationales**. Les variations locales (ville vs campagne) peuvent être importantes.

### 3. Facteurs non mesurés
Les comparaisons ne prennent pas en compte :
- Qualité des services publics
- Accès aux soins
- Sécurité
- Climat
- Culture
- Opportunités professionnelles

### 4. Délai de mise à jour
Les données peuvent avoir un délai de 1 à 3 mois selon les sources.

### 5. Ajustement PPA imparfait
La PPA est une **approximation**. Le pouvoir d'achat réel peut varier selon les habitudes de consommation.

---

## Formules de calcul détaillées

### Écart absolu
```
Écart_absolu = Prix_pays_A - Prix_pays_B
```

### Écart relatif (pourcentage)
```
Écart_relatif = ((Prix_pays_A / Prix_pays_B) - 1) × 100
```

### Indice avec base 100
```
Indice_pays_A = (Prix_pays_A / Prix_référence) × 100
```

### Moyenne pondérée
```
Indice_global = Σ(Indice_i × Poids_i)
```

Où la somme des poids = 1.

**Exemple IEVR :**
```
IEVR = 0.35×Alimentation + 0.25×Transport + 0.30×Logement + 0.10×Autres
```

### Tendance temporelle
```
Tendance = (Valeur_actuelle - Valeur_passée) / Valeur_passée × 100
```

Classification :
- Convergence : écart diminue de > 5%
- Divergence : écart augmente de > 5%
- Stable : variation < 5%

---

## Sources de données

### Sources primaires
1. **OCDE** : données PPA, indices de prix
2. **Eurostat** : données UE harmonisées
3. **INSEE** : données France et DOM
4. **Banque Mondiale** : données internationales
5. **FMI** : taux de change et PPA

### Sources secondaires
1. **Numbeo** : contributions citoyennes (vérifiées)
2. **Relevés terrain** : prix observés localement
3. **APIs commerciales** : agrégateurs de prix

### Fréquence de mise à jour
- Taux de change : quotidien
- Taux PPA : annuel (OCDE/Eurostat)
- Indices nationaux : mensuel (INSEE/Eurostat)
- Données internationales : trimestriel

---

## Validation

### Tests de cohérence

#### 1. Triangle de cohérence
Si A < B et B < C, alors A < C.

```python
def test_coherence(A, B, C):
    if A < B and B < C:
        assert A < C, "Incohérence détectée"
```

#### 2. Borne de variation
Les variations annuelles doivent rester dans des bornes raisonnables.

```
-20% < Variation_annuelle < +30%
```

Au-delà, vérification manuelle requise.

#### 3. Convergence PPA
Sur le long terme, les écarts ajustés PPA doivent converger.

```
Écart_PPA_année_n < Écart_PPA_année_n-5
```

---

## Cas d'usage

### 1. Chercheur
**Objectif :** Étudier l'évolution des écarts de prix DOM-Métropole.

**Données utilisées :**
- Séries longues (10 ans)
- Ajustement PPA
- Décomposition par catégorie

### 2. Collectivité territoriale
**Objectif :** Justifier des politiques de compensation.

**Données utilisées :**
- Écart global
- Facteurs explicatifs (octroi de mer, transport)
- Comparaison avec territoires similaires

### 3. Journaliste
**Objectif :** Article sur le coût de la vie en Europe.

**Données utilisées :**
- Classement France vs UE
- Évolution sur 5 ans
- Comparaison avec pays voisins

---

## Références

- OCDE (2025). "Purchasing Power Parities (PPP)"
- Eurostat (2025). "Comparative Price Levels"
- INSEE (2025). "Indices des Prix à la Consommation"
- Banque Mondiale (2025). "International Comparison Program"

---

## Versions

| Version | Date | Changements |
|---------|------|-------------|
| 4.1.0 | 2026-01-01 | Version initiale des comparaisons internationales |

---

## Contact

Pour toute question sur la méthodologie :
- Email : methodologie@akiprisaye.fr
- Documentation complète : https://akiprisaye.fr/docs/methodologie-comparaisons-internationales
