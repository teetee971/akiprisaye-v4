# Charte de Transparence - A KI PRI SA YÉ

## Préambule

L'Observatoire du Coût de la Vie **A KI PRI SA YÉ** s'engage à fournir des données **observées**, **vérifiables** et **transparentes** sur le coût de la vie dans les territoires français, métropolitains et ultramarins.

Cette charte définit nos engagements en matière de **transparence méthodologique**, **traçabilité des données** et **indépendance scientifique**.

---

## Article 1 - Principes fondamentaux

### 1.1 Lecture seule
- Les données ne sont jamais modifiées après collecte
- Toute correction est tracée et justifiée
- L'historique complet est conservé

### 1.2 Données observées
- Toutes les données proviennent de sources réelles
- Aucune donnée n'est inventée ou estimée sans mention explicite
- Les estimations sont clairement identifiées et justifiées

### 1.3 Méthodologie explicite
- Chaque indicateur est accompagné de sa méthodologie de calcul
- Les formules sont publiques et documentées
- Les pondérations sont justifiées et transparentes

### 1.4 Zéro recommandation
- Nous présentons les faits, nous n'interprétons pas
- Aucun conseil d'achat ou de comportement
- Aucune hiérarchisation subjective des territoires

### 1.5 Zéro scoring propriétaire
- Pas de notation subjective des produits ou territoires
- Tous les indices reposent sur des formules publiques
- Les critères de calcul sont documentés et justifiés

### 1.6 Interopérabilité statistique
- Compatibilité avec les standards INSEE et Eurostat
- Formats d'export standardisés
- Métadonnées complètes pour chaque dataset

---

## Article 2 - Sources de données

### 2.1 Sources primaires
Nos données proviennent de :
- **Open Food Facts** : données produits (code-barres, composition, nutri-score)
- **Relevés terrain** : prix observés en magasins (avec preuve photographique)
- **Contributions citoyennes** : signalements vérifiés et validés
- **APIs officielles** : INSEE, Eurostat, données publiques

### 2.2 Traçabilité
Pour chaque donnée, nous indiquons :
- **Source** : origine de la donnée
- **Date de collecte** : quand la donnée a été observée
- **Lieu** : territoire et enseigne si applicable
- **Méthode** : comment la donnée a été collectée

### 2.3 Validation
- Les contributions citoyennes sont vérifiées avant publication
- Les données aberrantes sont signalées et vérifiées
- Les corrections sont tracées et justifiées

---

## Article 3 - Méthodologies de calcul

### 3.1 Indice d'Équivalence de Vie Réelle (IEVR)

**Formule :**
```
IEVR = (0.35 × Alimentation) + (0.25 × Transport) + (0.30 × Logement) + (0.10 × Autres)
```

**Pondérations :**
- Alimentation : 35% (besoin fondamental)
- Transport : 25% (nécessité insulaire)
- Logement : 30% (coût majeur)
- Autres : 10% (divers)

**Base 100 :** France métropolitaine

**Justification des pondérations :**
- Basées sur les dépenses moyennes des ménages (INSEE)
- Adaptées aux spécificités ultramarines
- Revues annuellement

### 3.2 Indice de prix alimentaire

**Formule :**
```
Prix_alimentaire = Σ (prix_produit_i × poids_i) / n
```

**Panier de référence :**
- 50 produits alimentaires de base
- Choisis selon les recommandations nutritionnelles
- Disponibles dans tous les territoires

### 3.3 Calcul d'inflation

**Formule :**
```
Inflation = ((Prix_t - Prix_t-1) / Prix_t-1) × 100
```

**Périodes :**
- 7 jours (variation court terme)
- 30 jours (variation mensuelle)
- 90 jours (variation trimestrielle)
- 1 an (variation annuelle)

### 3.4 Détection du shrinkflation

**Formule du prix réel :**
```
Prix_réel = ((Prix_nouveau / Contenance_nouvelle) - (Prix_ancien / Contenance_ancienne)) / (Prix_ancien / Contenance_ancienne) × 100
```

**Seuil de détection :** Réduction de contenance ≥ 5% avec prix stable ou en hausse

---

## Article 4 - Indépendance et impartialité

### 4.1 Indépendance éditoriale
- Aucune pression commerciale acceptée
- Aucun partenariat influençant les données
- Aucune censure ou modification à la demande

### 4.2 Absence de conflit d'intérêts
- Pas de participation financière d'enseignes
- Pas de rémunération pour placement ou visibilité
- Financement transparent (institutionnel, recherche, open data)

### 4.3 Égalité de traitement
- Tous les territoires traités de manière équitable
- Toutes les enseignes traitées de manière équitable
- Aucun favoritisme ou discrimination

---

## Article 5 - Protection des données personnelles

### 5.1 Conformité RGPD
- Aucune donnée personnelle dans les exports publics
- Anonymisation systématique des contributions
- Droit d'accès, de rectification et de suppression

### 5.2 Données collectées
Nous collectons uniquement :
- Données produits (prix, composition, origine)
- Données territoriales (agrégées, non individuelles)
- Métadonnées techniques (horodatage, source)

Nous ne collectons **jamais** :
- ❌ Nom ou prénom des contributeurs (sauf consentement explicite)
- ❌ Adresse précise (quartier ou commune uniquement)
- ❌ Données bancaires ou de paiement
- ❌ Historique d'achat individuel

### 5.3 Conservation
- Données observées : conservation permanente (intérêt public)
- Logs d'accès : 2 ans minimum (sécurité)
- Données personnelles : suppression sur demande

---

## Article 6 - Qualité et fiabilité

### 6.1 Indicateurs de qualité
Pour chaque donnée, nous fournissons :
- **Fiabilité** : niveau de confiance (vérifié, estimé, provisoire)
- **Fraîcheur** : date de dernière mise à jour
- **Couverture** : pourcentage de territoires/produits couverts
- **Taille d'échantillon** : nombre d'observations

### 6.2 Gestion des données manquantes
- Les données manquantes sont clairement indiquées
- Aucune interpolation ou estimation sans mention explicite
- Méthodologie d'estimation documentée si applicable

### 6.3 Correction d'erreurs
- Les erreurs détectées sont corrigées rapidement
- Un historique des corrections est maintenu
- Les utilisateurs sont notifiés des corrections majeures

---

## Article 7 - Publication et citation

### 7.1 Licence Open Data
- Toutes les données agrégées sont en **Open Data**
- Licence : Open Database License (ODbL)
- Attribution requise lors de réutilisation

### 7.2 URLs pérennes
- Chaque dataset a une URL permanente
- Les URLs sont maintenues au moins 10 ans
- Versionnage explicite des méthodologies

### 7.3 Citation recommandée
```
Observatoire du Coût de la Vie (2026). 
[Nom du dataset]. 
Version [version]. 
URL: [url permanente]
Consulté le [date]
```

---

## Article 8 - Évolution de la charte

### 8.1 Révision
Cette charte est révisée :
- Annuellement (révision ordinaire)
- En cas d'évolution majeure des méthodes
- À la demande des utilisateurs institutionnels

### 8.2 Versionnage
- Chaque version de la charte est archivée
- Les changements sont documentés
- Les anciennes versions restent accessibles

### 8.3 Consultation
- Les parties prenantes sont consultées avant modification majeure
- Un délai de préavis de 30 jours est respecté
- Les commentaires publics sont acceptés

---

## Article 9 - Responsabilité

### 9.1 Engagement de qualité
Nous nous engageons à :
- Fournir des données exactes au mieux de nos capacités
- Corriger rapidement toute erreur signalée
- Maintenir un niveau de qualité élevé

### 9.2 Limitations
Nous ne garantissons pas :
- L'exhaustivité à 100% (données observées limitées par les moyens)
- L'absence totale d'erreur (vigilance humaine)
- La disponibilité permanente du service (maintenance)

### 9.3 Exclusion de responsabilité
Nous ne sommes pas responsables :
- Des décisions prises sur la base de nos données
- Des interprétations erronées
- Des usages détournés ou malveillants

---

## Article 10 - Contact et signalement

### 10.1 Contact
- **Email général** : contact@akiprisaye.fr
- **Email institutionnel** : institutional@akiprisaye.fr
- **Email données** : opendata@akiprisaye.fr

### 10.2 Signalement d'erreur
- Formulaire en ligne : https://akiprisaye.fr/signalement
- Email : erreurs@akiprisaye.fr
- Délai de traitement : 48h ouvrées

### 10.3 Transparence
- Rapport annuel de transparence publié
- Statistiques de qualité publiées trimestriellement
- Incidents de sécurité notifiés sous 72h

---

## Signature

**Observatoire du Coût de la Vie - A KI PRI SA YÉ**

Version : 4.0.0  
Date d'entrée en vigueur : 1er janvier 2026  
Prochaine révision prévue : 1er janvier 2027

---

## Annexes

### Annexe A - Glossaire
- **Donnée observée** : donnée collectée directement sur le terrain ou via API officielle
- **Donnée estimée** : donnée calculée ou interpolée à partir de données observées
- **Base 100** : référence pour les indices (France métropolitaine = 100)
- **PPA** : Parité de Pouvoir d'Achat (ajustement monétaire)
- **IEVR** : Indice d'Équivalence de Vie Réelle

### Annexe B - Références normatives
- Règlement (CE) n° 223/2009 (statistiques européennes)
- Norme ISO 8000 (qualité des données)
- RGPD (Règlement Général sur la Protection des Données)
- Recommandations INSEE sur les indices de prix

### Annexe C - Historique des versions
- v1.0 (2024-01-01) : Version initiale
- v2.0 (2025-01-01) : Ajout interopérabilité statistique
- v3.0 (2025-07-01) : Renforcement RGPD
- **v4.0 (2026-01-01)** : Portail institutionnel et méthodologies renforcées
