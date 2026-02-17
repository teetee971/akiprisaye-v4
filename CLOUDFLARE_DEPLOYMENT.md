# Configuration Cloudflare Pages

Pour que le site fonctionne correctement sur https://akiprisaye.pages.dev/, les paramètres suivants doivent être configurés dans le dashboard Cloudflare Pages :

## Paramètres de Build

1. **Framework preset** : Vite
2. **Build command** : `npm run build`
3. **Build output directory** : `frontend/dist`
4. **Root directory** : `/` (racine du projet)
5. **Node version** : 20

## Variables d'environnement

Aucune variable d'environnement spéciale n'est requise pour le build basique.

## SPA Routing (Single Page Application)

Le site utilise React Router pour la navigation côté client. Pour que les routes SPA fonctionnent correctement (accès direct et rafraîchissement), le fallback doit renvoyer `index.html` avec un statut HTTP `200`.

### 1. Fichier `_redirects`

Le fichier `frontend/public/_redirects` contient :
```
/* /index.html 200
```

Ce fichier indique à Cloudflare Pages de servir `index.html` pour toutes les routes, permettant à React Router de gérer la navigation. Le fichier est automatiquement copié dans `frontend/dist/` lors du build.

### 2. Important : ne pas générer `404.html` dans `frontend/dist/`

Cloudflare Pages gère mieux le fallback SPA quand le build ne force pas un `404.html` top-level. Une copie `index.html -> 404.html` peut faire répondre les routes profondes en HTTP `404` (même si l'application React s'affiche), ce qui casse les tests de santé, le SEO et le partage de liens.

➡️ Le script de build doit rester `vite build` (sans copie vers `dist/404.html`).

**Comportement attendu :**
- ✅ Accès direct à `/comparateur` → Charge l'application React et affiche le comparateur
- ✅ Accès direct à `/observatoire` → Charge l'application React et affiche l'observatoire
- ✅ Rafraîchissement sur n'importe quelle route SPA → Maintient la page correcte
- ✅ Routes invalides → Affiche le composant 404 de React Router (pas le HTML statique)

## Vérification du Build

Pour vérifier localement que le build fonctionne :

```bash
cd frontend
npm ci
npm run build
```

Cela devrait créer un dossier `frontend/dist/` avec :
- `index.html` - Point d'entrée de l'application React
- `_redirects` - Configuration SPA pour Cloudflare Pages
- `assets/` - Fichiers JavaScript, CSS et images optimisées
- `manifest.webmanifest` et `service-worker.js`
- Autres ressources statiques depuis `frontend/public/`

## Structure Attendue

```
frontend/dist/
├── index.html (point d'entrée React)
├── _redirects (configuration SPA)
├── assets/
│   ├── index-[hash].js (bundle principal)
│   ├── vendor-react-[hash].js (React et React DOM)
│   ├── vendor-leaflet-[hash].js (cartes)
│   ├── vendor-chart-[hash].js (graphiques)
│   └── autres chunks optimisés
├── images/
├── manifest.webmanifest
├── service-worker.js
└── logo-akiprisaye.svg
```

## Dépannage

### Si le site affiche une page blanche :
1. Vérifier que la build command est bien `npm run build`
2. Vérifier que le output directory est bien `frontend/dist`
3. Vérifier les logs de déploiement dans Cloudflare Pages
4. S'assurer qu'aucune erreur n'apparaît lors du build (exécuter `npm ci && npm run build` localement pour tester)
5. Vérifier que le fichier `frontend/dist/index.html` existe

### Si les routes SPA ne fonctionnent pas (404 statique) :
1. Vérifier que le fichier `frontend/dist/_redirects` existe après le build
2. Vérifier son contenu : `/* /index.html 200`
3. Vérifier que le build n'ajoute pas de `frontend/dist/404.html` forcé
4. Attendre quelques minutes après le déploiement (propagation CDN)
5. Vider le cache du navigateur et réessayer

### Si le rafraîchissement de page ne fonctionne pas :
1. Vérifier que le fichier `frontend/dist/_redirects` est déployé
2. Vérifier dans les Developer Tools → Network que `/index.html` est bien servi avec un code 200
3. Consulter les logs Cloudflare Pages pour voir quelle ressource est servie
