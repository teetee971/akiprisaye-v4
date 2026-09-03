#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${1:-akiprisaye-v4-fresh}"
MODE="${2:-frontend-only}" # frontend-only | auto
ROOT="$(pwd)"
MODE_FRONTEND_ONLY_USED=0

if [[ ! -f "$ROOT/frontend/package.json" ]]; then
  echo "ERREUR: lance ce script depuis la racine du repo (frontend/package.json introuvable)." >&2
  exit 1
fi

echo "[1/5] Build frontend + api-server"
pnpm --filter ./frontend run build
if [[ -f "$ROOT/artifacts/api-server/package.json" ]]; then
  pnpm --filter ./artifacts/api-server run build || true
elif [[ -f "$ROOT/backend/package.json" ]]; then
  pnpm --filter ./backend run build || true
fi

echo "[2/5] Prépare _worker.js"
FRONTEND_DIST="$ROOT/frontend/dist"
WORKER_FILE="$FRONTEND_DIST/_worker.js"
API_ENTRY=""
for candidate in \
  "$ROOT/artifacts/api-server/dist/index.mjs" \
  "$ROOT/backend/dist/index.mjs"
do
  if [[ -f "$candidate" ]]; then
    API_ENTRY="$candidate"
    break
  fi
done

if [[ -n "$API_ENTRY" ]]; then
  cp "$API_ENTRY" "$WORKER_FILE"
  sed -i '/__bannerCrReq/d;/__bannerPath/d;/__bannerUrl/d;/globalThis\.require *=/d;/globalThis\.__filename *=/d;/globalThis\.__dirname *=/d' "$WORKER_FILE"
else
  echo "WARN: backend bundle introuvable, passage en frontend-only." >&2
  MODE="frontend-only"
fi

if [[ -f "$WORKER_FILE" ]] && rg -q "node_modules/express|require\\(\"node:events\"\\)|require\\('node:events'\\)|from ['\"]express['\"]|require\\(['\"]express['\"]\\)" "$WORKER_FILE"; then
  if [[ "$MODE" == "frontend-only" ]]; then
    echo "WARN: Worker backend Node/Express détecté, suppression de _worker.js (mode frontend-only)." >&2
    rm -f "$WORKER_FILE"
    MODE_FRONTEND_ONLY_USED=1
  else
    echo "ERREUR: _worker.js embarque Express/CommonJS (ex: node:events) incompatible Pages Worker." >&2
    echo "Relance avec: bash scripts/deploy-pages-direct.sh $PROJECT_NAME frontend-only (mode par défaut)" >&2
    exit 2
  fi
fi

echo "[3/5] Prépare un dossier d'upload isolé"
rm -rf /tmp/cf-pages-upload
mkdir -p /tmp/cf-pages-upload
cp -R "$FRONTEND_DIST"/. /tmp/cf-pages-upload/
rm -rf /tmp/cf-pages-upload/functions /tmp/cf-pages-upload/deploy_functions
rm -f /tmp/cf-pages-upload/_redirects

# Force un changement d'asset pour éviter "Uploaded 0 files" quand utile
printf 'deploy_id=%s\n' "$(date -u +%Y%m%dT%H%M%SZ)" > /tmp/cf-pages-upload/deploy-id.txt

echo "[4/5] Vérification rapide"
ls -la /tmp/cf-pages-upload | sed -n '1,40p'

echo "[5/5] Déploiement Cloudflare Pages ($PROJECT_NAME)"
CMD=(npx -y wrangler@latest pages deploy /tmp/cf-pages-upload --project-name="$PROJECT_NAME" --commit-dirty=true --no-bundle)
echo "Commande: ${CMD[*]}"

LOG_FILE="/tmp/cf-pages-deploy.log"
"${CMD[@]}" 2>&1 | tee "$LOG_FILE"

URL=$(rg -o 'https://[^ ]+\.pages\.dev' "$LOG_FILE" | tail -n 1 || true)
if [[ -n "$URL" ]]; then
  echo "✅ URL live: $URL"
  echo "ℹ️ Note: 'Uploaded 0 files' peut être normal (assets inchangés)."
  if [[ "$MODE_FRONTEND_ONLY_USED" == "1" ]]; then
    echo "⚠️ Frontend-only actif: les endpoints API/Scanner backend ne sont pas disponibles sur ce déploiement."
  fi
else
  echo "ℹ️ Déploiement terminé. URL non détectée automatiquement; vérifie la sortie Wrangler ci-dessus."
fi
