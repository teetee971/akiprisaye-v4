# Cloudflare Pages deploy direct depuis Replit (monorepo pnpm)


## Commande d'urgence (100% front, sans Worker)

Si tu vois encore `Dynamic require of "node:events"`, lance directement :

```bash
bash scripts/deploy-pages-frontend-only.sh akiprisaye-v4-fresh
```

Ce script n'envoie **aucun `_worker.js`** et évite totalement le pipeline Functions/Worker.

Objectif : **déploiement direct via CLI Wrangler**, sans GitHub ni GitHub Actions.

## Important (erreurs vues sur screenshots)

Si tu copies tout le bloc Markdown (titres, puces, `1.`, `2.`, etc.) dans le shell, Bash essaie d'exécuter ces mots et renvoie :
- `command not found`
- `esbuild: command not found`
- `wrangler: command not found`

➡️ **Copie uniquement la ligne de commande**, pas le reste du document.

Si tu vois des erreurs comme :
- `bash: +: command not found`
- `bash: syntax error near unexpected token '('`
- `bash: !result.success: event not found`

alors tu as collé un **diff Git** (`diff --git ...`, lignes qui commencent par `+`/`-`) dans le shell.

✅ Pour lire un diff correctement, utilise ces commandes au lieu de coller le diff :

```bash
git status --short
git log -1 --oneline
git show --stat --name-only --oneline HEAD
git show -- frontend/src/hooks/useContinuousBarcodeScanner.ts | sed -n '1,120p'
```

Tu as aussi eu : `cd: /workspace/akiprisaye-v4: No such file or directory`.
- Sur Replit, vérifie d'abord le chemin réel avec `pwd`.
- Si ton shell est déjà dans `~/workspace`, lance la commande **sans `cd /workspace/akiprisaye-v4 &&`**.

## Flux cible (Direct Deploy)


## Option recommandée (script unique)

Exécute directement :

```bash
bash scripts/deploy-pages-direct.sh
```

Optionnel (nom de projet Pages personnalisé) :

```bash
bash scripts/deploy-pages-direct.sh akiprisaye-v4-fresh
```

Ce script automatise le build, la préparation de `_worker.js`, le retrait du banner Node (`__bannerCrReq/__bannerUrl`), l'upload isolé `/tmp/cf-pages-upload`, puis `wrangler pages deploy --no-bundle`.
Le script affiche maintenant la **commande exacte de deploy** puis extrait automatiquement l'URL `*.pages.dev` en fin d'exécution.


1. Build local sur Replit via `pnpm`.
2. Compilation du backend en `_worker.js` via `esbuild`.
3. Envoi direct de `frontend/dist` vers Cloudflare Pages via `wrangler pages deploy`.

## Précheck rapide (1 commande)

```bash
pwd && test -f frontend/package.json && echo "OK: racine monorepo" || echo "ERREUR: place-toi à la racine du repo"
```

## Commande "Ligne Droite" (UNE seule ligne)

Copie **uniquement** la ligne ci-dessous (depuis la racine du repo) :

```bash
rm -rf .wrangler functions frontend/dist/functions && pnpm --filter aki-horizon --filter api-server run build && npx -y esbuild@latest artifacts/api-server/dist/index.mjs --bundle --minify --format=esm --platform=node --target=es2022 --outfile=frontend/dist/_worker.js && chmod 644 frontend/dist/_worker.js && rm -f frontend/dist/_redirects && npx -y wrangler@latest pages deploy frontend/dist --project-name=akiprisaye-v4-fresh --commit-dirty=true --no-bundle
```

> Note : `-y` évite les prompts interactifs `Ok to proceed? (y)` pour `esbuild` et `wrangler`.

## Option encore plus sûre (script local)

Si le copier-coller mobile casse la ligne, exécute :

```bash
cat > /tmp/deploy-cf-pages.sh <<'SH'
#!/usr/bin/env bash
set -euo pipefail

# Se placer automatiquement à la racine du repo si possible
if [ -f pnpm-workspace.yaml ]; then
  :
elif [ -f /workspace/akiprisaye-v4/pnpm-workspace.yaml ]; then
  cd /workspace/akiprisaye-v4
elif [ -f /home/runner/workspace/akiprisaye-v4/pnpm-workspace.yaml ]; then
  cd /home/runner/workspace/akiprisaye-v4
else
  echo "ERREUR: racine du monorepo introuvable. Lance 'pwd' puis place-toi dans le repo." >&2
  exit 1
fi

rm -rf .wrangler functions frontend/dist/functions
pnpm --filter aki-horizon --filter api-server run build
npx -y esbuild@latest artifacts/api-server/dist/index.mjs --bundle --minify --format=esm --platform=node --target=es2022 --outfile=frontend/dist/_worker.js
chmod 644 frontend/dist/_worker.js
rm -f frontend/dist/_redirects
npx -y wrangler@latest pages deploy frontend/dist --project-name=akiprisaye-v4-fresh --commit-dirty=true --no-bundle
SH
bash /tmp/deploy-cf-pages.sh
```



## Important sur `--platform`

Dans ce projet, `artifacts/api-server/dist/index.mjs` utilise des imports Node natifs (`node:module`, `node:path`, `node:url`).

Donc :
- utiliser `--platform=browser` provoque `Could not resolve "node:*"` (vu sur tes captures) ;
- il faut conserver `--platform=node` pour que le bundle passe.

## Pourquoi cette version corrige les erreurs

- **Bypass GitHub** : déploiement direct Replit → Cloudflare via `wrangler pages deploy`.
- **Aucune erreur de retours à la ligne shell** : commande mono-ligne + option script.
- **Pas de blocage interactif** : `npx -y` supprime les prompts `Ok to proceed?`.
- `rm -rf .../functions` : supprime les résidus qui font basculer Wrangler en mode Pages Functions.
- `--format=esm` + `--platform=node` : évite `empty-import-meta` et le crash `createRequire(... Received undefined)`.
- `--no-bundle` : force Wrangler à publier le `_worker.js` déjà compilé, sans re-bundle.

## Vérifications rapides après exécution

1. Vérifier le type de bundle :
   - pas d'avertissement `empty-import-meta`
2. Vérifier l'upload :
   - présence de `Uploaded ... files`
3. Vérifier le statut final :
   - `Success! Your site is live`


## Si tu vois encore "empty-import-meta" + erreur `createRequire`

D'après tes logs, le crash est : `The argument 'path' ... Received 'undefined' at createRequire` avec `_worker.js:1:366`.

Cela indique généralement un bundle orienté Node injecté dans un runtime Worker.

Checklist rapide :

1. Vérifie que la commande contient bien `--format=esm --platform=node`.
2. Vérifie que la dernière ligne de déploiement contient bien `--no-bundle`.
3. Supprime tout `functions/` résiduel avant le deploy (déjà inclus dans la commande).
4. Si l'erreur persiste, ouvre le log Wrangler affiché en fin d'échec (`~/.config/.wrangler/logs/...`) pour confirmer la ligne fautive dans `_worker.js`.

## Plan B (si `empty-import-meta` persiste malgré tout)

Si Wrangler continue d'afficher `iife` + `createRequire(... Received 'undefined')`, teste un déploiement **sans re-bundle esbuild** du serveur :

```bash
rm -rf .wrangler functions frontend/dist/functions && pnpm --filter aki-horizon --filter api-server run build && cp artifacts/api-server/dist/index.mjs frontend/dist/_worker.js && rm -f frontend/dist/_redirects && npx -y wrangler@latest pages deploy frontend/dist --project-name=akiprisaye-v4-fresh --commit-dirty=true --no-bundle
```

Pourquoi : ce plan évite d'introduire une seconde transformation JS sur le backend avant l'upload. Si ce plan passe, le problème vient du bundling `esbuild` et non du deploy CLI.

## Plan C (isoler totalement l'upload pour éviter le mode Functions)

Le message `Failed to publish your Function` indique que Wrangler bascule encore sur un pipeline Functions.

Pour l'empêcher, déploie depuis un dossier temporaire qui contient **uniquement** les fichiers statiques + `_worker.js` :

```bash
pnpm --filter aki-horizon --filter api-server run build && cp artifacts/api-server/dist/index.mjs frontend/dist/_worker.js && rm -rf /tmp/cf-pages-upload && mkdir -p /tmp/cf-pages-upload && cp -R frontend/dist/. /tmp/cf-pages-upload/ && rm -rf /tmp/cf-pages-upload/functions && npx -y wrangler@latest pages deploy /tmp/cf-pages-upload --project-name=akiprisaye-v4-fresh --commit-dirty=true --no-bundle
```

Pourquoi : Wrangler ne "voit" plus l'arborescence du monorepo (et donc plus les indices Functions), seulement le répertoire final à publier.

## Plan D (retirer le "banner" Node qui casse `import.meta`)

Tes captures montrent explicitement `globalThis.require = __bannerCrReq(import.meta.url)` et `globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url)` dans `_worker.js`.

Ces lignes proviennent d'un shim Node injecté pendant le build backend et cassent quand Wrangler retransforme en `iife`.

Commande de contournement :

```bash
pnpm --filter aki-horizon --filter api-server run build && cp artifacts/api-server/dist/index.mjs frontend/dist/_worker.js && sed -i '/__bannerCrReq/d;/__bannerUrl/d;/globalThis\.require *=/d;/globalThis\.__filename *=/d;/globalThis\.__dirname *=/d' frontend/dist/_worker.js && npx -y wrangler@latest pages deploy frontend/dist --project-name=akiprisaye-v4-fresh --commit-dirty=true --no-bundle
```

Si cette version passe, il faudra ensuite corriger durablement le build `api-server` pour ne plus injecter ce banner Node dans la cible Cloudflare Pages.

## Si tu n'arrives pas à envoyer le ZIP au support/assistant

Pas grave — on peut avancer sans ZIP complet. Envoie seulement ces 3 éléments texte (copier-coller) :

1. **La commande exacte lancée**
2. **Les 80 dernières lignes du terminal**
3. **Le log Wrangler complet** pointé après l'échec

Commandes à exécuter dans Replit :

```bash
history | tail -n 5
```

```bash
tail -n 80 /home/runner/workspace/.config/.wrangler/logs/wrangler-*.log
```

```bash
sed -n '1,80p' frontend/dist/_worker.js
```

Avec ces trois sorties, on peut diagnostiquer sans échange de fichier ZIP.

## Limite importante: Express dans `_worker.js`

Si le log affiche `Dynamic require of "node:events" is not supported` avec une trace vers `node_modules/express/...`, le problème n'est plus le déploiement CLI : c'est une **incompatibilité runtime**.

Concrètement :
- un bundle Express/CommonJS injecte des `require()` dynamiques ;
- le runtime Pages Worker n'accepte pas ce pattern dans ce mode.

Dans ce cas, il faut choisir :
1. migrer l'API vers un `fetch(request, env, ctx)` natif Cloudflare Worker, **ou**
2. héberger l'API Express ailleurs (Fly/Render/Railway/VM) et garder Pages pour le front.

Le script `scripts/deploy-pages-direct.sh` stoppe maintenant explicitement si Express est détecté dans `_worker.js`.


### Mode `frontend-only` (défaut, déblocage immédiat)

Si ton erreur est `Dynamic require of "node:events" is not supported`, déploie le front seul :

```bash
bash scripts/deploy-pages-direct.sh akiprisaye-v4-fresh frontend-only
```

Ce mode supprime `_worker.js` quand Express est détecté et publie uniquement le site statique.

Ce mode est maintenant le mode par défaut du script.


## À propos de `Uploaded 0 files`

Ce message n'est **pas une erreur** : cela signifie que les assets statiques sont identiques à la version déjà présente sur Cloudflare.

Le script ajoute maintenant automatiquement un `deploy-id.txt` horodaté dans le dossier d'upload pour forcer au moins un changement d'asset et rendre la preuve de déploiement plus visible.


## Lecture rapide du résultat

- `Deployment complete!` + URL `*.pages.dev` = ✅ **succès**.
- `Uploaded 0 files` = ✅ **normal** si les assets sont identiques.
- `Uploaded 1 files` (ou plus) = ✅ normal aussi (nouveaux assets, ex: `deploy-id.txt`).


## Important: limite du mode `frontend-only`

Le mode `frontend-only` met le front en ligne rapidement, mais **désactive la logique backend du scanner** (pas de `_worker.js` API).

Le script `deploy-pages-direct.sh` détecte désormais plusieurs signatures Node/Express (dont `node:events`) et bascule automatiquement en suppression de `_worker.js` quand `MODE=frontend-only`.

Si l'écran affiche `Erreur d'analyse` sur `/scanner`, c'est attendu en mode frontend-only :
- le site est bien déployé,
- mais l'API d'analyse n'est pas disponible sur ce déploiement Pages.


## Compatibilité Node côté Pages

Sur `wrangler pages deploy`, les options `--compatibility-date` et `--compatibility-flags` ne sont pas supportées par certaines versions de Wrangler (erreur `Unknown arguments`).

👉 Configure `Compatibility date` et `nodejs_compat` directement dans le dashboard Cloudflare (Pages -> Settings -> Functions), puis lance le script sans ces flags.


## Si `No such file or directory` sur le script

Cela signifie que tu n'es pas dans le bon dossier projet (ou que la version locale n'est pas à jour).

Vérifie :

```bash
pwd
```

```bash
test -f ./deploy-pages-frontend-only.sh && echo "OK script racine" || echo "Script racine absent"
```

Fallback immédiat (sans script, en une seule commande) :

```bash
pnpm --filter ./frontend run build && rm -rf /tmp/cf-pages-upload && mkdir -p /tmp/cf-pages-upload && cp -R frontend/dist/. /tmp/cf-pages-upload/ && rm -f /tmp/cf-pages-upload/_worker.js /tmp/cf-pages-upload/_redirects && rm -rf /tmp/cf-pages-upload/functions /tmp/cf-pages-upload/deploy_functions && printf 'deploy_id=%s\n' "$(date -u +%Y%m%dT%H%M%SZ)" > /tmp/cf-pages-upload/deploy-id.txt && npx -y wrangler@latest pages deploy /tmp/cf-pages-upload --project-name=akiprisaye-v4-fresh --commit-dirty=true
```
