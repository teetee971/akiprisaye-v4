# CI Policy – A KI PRI SA YÉ

## Objectifs

### 1. Reproductibilité stricte
- Chaque build doit produire le même résultat pour un même commit
- Utilisation de versions exactes des dépendances (`package-lock.json`)
- Environnement Node.js fixe (v20 LTS uniquement)

### 2. Zéro annulation implicite
- Les workflows ne s'annulent jamais automatiquement
- `cancel-in-progress: false` pour éviter les interruptions
- Chaque build va jusqu'au bout (success ou failure)

### 3. Données auditables
- Exports open-data horodatés
- Checksum SHA-256 pour chaque fichier exporté
- Traçabilité complète de la provenance

## Règles strictes

### Node.js
- **Version unique :** Node.js 20 LTS
- **Pas de version flottante :** toujours spécifier `node-version: 20`
- **Cache npm activé :** `cache: npm` pour accélérer les builds

### Installation des dépendances
- **Commande obligatoire :** `npm ci` (jamais `npm install`)
- **Raison :** `npm ci` supprime `node_modules/` et réinstalle depuis `package-lock.json`
- **Bénéfice :** reproductibilité garantie

### Tests unitaires
- **Requis :** tous les tests doivent passer
- **Commande :** `npm test -- --run` (mode non-watch)
- **Échec :** le build échoue si un test échoue

### Build
- **Mode lecture seule :** pas d'écriture base de données
- **Commande :** `npm run build`
- **Artefacts :** stockés dans `dist/` (non commités)

### Exports open-data
- **Déclenchement :** uniquement sur tags `v*.*.*`
- **Format :** CSV + JSON avec métadonnées
- **Checksum :** SHA-256 pour chaque fichier
- **Stockage :** artifacts GitHub + GitHub Releases

### Linting
- **Mode non-bloquant :** `npm run lint || true`
- **Raison :** ne pas bloquer le build pour des warnings cosmétiques
- **À terme :** passer en mode bloquant quand le code est propre

## Non-objectifs (ce que la CI ne fait PAS)

### ❌ Pas de déploiement automatique
- La CI ne déploie jamais automatiquement en production
- Le déploiement reste manuel et contrôlé
- Raison : sécurité et validation humaine

### ❌ Pas de modification UI
- La CI ne modifie jamais l'interface utilisateur
- Pas de génération de composants dynamiques
- Raison : prévisibilité et contrôle

### ❌ Pas d'écriture base de données
- Aucune connexion Firebase en mode écriture
- Pas de seed de données
- Mode lecture seule strict

### ❌ Pas de secrets requis
- La CI publique ne nécessite aucun secret
- Pas de tokens API externes
- Exception : `GITHUB_TOKEN` automatique pour les releases

## Workflow détaillé

### 1. Build & Test (toujours)
Déclenché sur :
- Push sur `main`
- Pull requests vers `main`
- Tags `v*.*.*`

Étapes :
1. Checkout du code
2. Setup Node.js 20
3. Installation `npm ci`
4. Lint (non-bloquant)
5. Tests unitaires (bloquant)
6. Build (bloquant)

Durée : 5-10 minutes
Timeout : 15 minutes max

### 2. Open-Data Snapshot (uniquement sur tags)
Déclenché sur :
- Tags `v*.*.*` (ex: `v5.1.0`)

Étapes :
1. Checkout du code
2. Setup Node.js 20
3. Installation `npm ci`
4. Export open-data (`npm run export:open-data`)
5. Génération checksums SHA-256
6. Upload artifacts

Durée : 3-5 minutes
Rétention : 90 jours

### 3. Release Assets (uniquement sur tags)
Déclenché sur :
- Tags `v*.*.*` après snapshot réussi

Étapes :
1. Download artifacts du snapshot
2. Attach aux GitHub Releases

Durée : 1-2 minutes

## Structure des exports

### Nomenclature
```
exports/
  ├── v5.1.0-2026-01-15/
  │   ├── cost-of-living-martinique.csv
  │   ├── cost-of-living-martinique.json
  │   ├── metadata.json
  │   └── README.md
  ├── CHECKSUMS.sha256
  └── manifest.json
```

### Métadonnées obligatoires
Chaque export inclut :
- `source` : origine des données
- `period` : période couverte
- `territory` : territoire concerné
- `methodology` : version de la méthodologie
- `generated_at` : horodatage ISO 8601
- `checksum` : SHA-256 du fichier

### Exemple metadata.json
```json
{
  "dataset": "cost-of-living-martinique",
  "version": "5.1.0",
  "source": "Observatoire du Coût de la Vie",
  "territory": "MTQ",
  "period": {
    "start": "2024-01-01",
    "end": "2026-01-15"
  },
  "methodology": "https://akiprisaye.fr/docs/methodologie-v5.1.0",
  "generated_at": "2026-01-15T10:30:00Z",
  "license": "ODbL-1.0",
  "format": "csv",
  "encoding": "UTF-8",
  "delimiter": ";",
  "checksum": {
    "algorithm": "SHA-256",
    "value": "a1b2c3d4..."
  }
}
```

## Validation avant merge

### Checklist
- [ ] Tests unitaires passent
- [ ] Build réussit
- [ ] Lint ne produit pas d'erreurs critiques
- [ ] Documentation à jour
- [ ] Feature flags respectés (OFF par défaut)
- [ ] Aucune régression UI

### Commandes locales
Avant de pusher :
```bash
# Installation propre
npm ci

# Tests
npm test

# Lint
npm run lint

# Build
npm run build

# Export (si applicable)
npm run export:open-data
```

## Monitoring et alertes

### Métriques suivies
- Durée des builds (objectif < 10 min)
- Taux de réussite (objectif > 95%)
- Taille des artifacts (suivi de la croissance)

### Alertes
- Build échoue sur `main` → notification immédiate
- Tests échouent → investigation prioritaire
- Timeout dépassé → optimisation requise

## Évolution

### Court terme (Q1 2026)
- Passage du lint en mode bloquant
- Ajout de tests e2e (optionnels)
- Optimisation du cache npm

### Moyen terme (Q2-Q3 2026)
- Tests de performance
- Validation des exports open-data
- Integration avec data.gouv.fr

### Long terme (Q4 2026+)
- CD (Continuous Deployment) manuel
- Preview deployments pour les PRs
- Tests de compatibilité navigateurs

## Contact et support

### Questions techniques
- GitHub Issues : https://github.com/teetee971/akiprisaye-web/issues
- Tag : `ci`, `build`

### Incidents CI
- Vérifier GitHub Status : https://www.githubstatus.com/
- Relancer le workflow manuellement si besoin
- Signaler les bugs persistants

---

**Version :** 5.1.0  
**Date de publication :** 15 janvier 2026  
**Prochaine révision :** 1er avril 2026
