#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${1:-akiprisaye-v4-fresh}"
API_BASE_URL="${2:-https://aki-horizon.thierry-marcell.replit.dev/api}"
ROOT="$(pwd)"
DIST_DIR="$ROOT/frontend/dist"
UPLOAD_DIR="/tmp/cf-pages-upload"

if [[ ! -f "$ROOT/frontend/package.json" ]]; then
  echo "ERREUR: lance ce script depuis la racine du repo (frontend/package.json introuvable)." >&2
  exit 1
fi

echo "[1/5] Build frontend"
pnpm --filter ./frontend run build

if [[ ! -d "$DIST_DIR" ]]; then
  echo "ERREUR: dist introuvable: $DIST_DIR" >&2
  exit 2
fi

echo "[2/5] Patch branding + API dans dist"
# Branding: AKI.HORIZON -> A KI PRI SA YÉ
find "$DIST_DIR" -type f \( -name "*.js" -o -name "*.mjs" -o -name "*.html" -o -name "*.css" -o -name "*.txt" \) \
  -exec sed -i "s/AKI\.HORIZON/A KI PRI SA YÉ/g" {} +

# API strategy: point frontend to remote Replit API instead of /api
# Replace quoted '/api' and "/api" occurrences in built assets.
find "$DIST_DIR" -type f \( -name "*.js" -o -name "*.mjs" -o -name "*.html" \) \
  -exec sed -i \
    -e "s#\"/api#\"${API_BASE_URL}#g" \
    -e "s#'/api#'${API_BASE_URL}#g" \
    {} +

echo "[3/5] Garantir le routing SPA (_redirects)"
printf '/* /index.html 200\n' > "$DIST_DIR/_redirects"

echo "[4/5] Préparer upload statique clean"
rm -rf "$UPLOAD_DIR"
mkdir -p "$UPLOAD_DIR"
cp -R "$DIST_DIR"/. "$UPLOAD_DIR"/
rm -f "$UPLOAD_DIR/_worker.js"
rm -rf "$UPLOAD_DIR/functions" "$UPLOAD_DIR/deploy_functions"
printf 'deploy_id=%s\n' "$(date -u +%Y%m%dT%H%M%SZ)" > "$UPLOAD_DIR/deploy-id.txt"

echo "[5/5] Deploy Cloudflare Pages ($PROJECT_NAME)"
CMD=(npx -y wrangler@latest pages deploy "$UPLOAD_DIR" --project-name="$PROJECT_NAME" --commit-dirty=true)
echo "Commande: ${CMD[*]}"
"${CMD[@]}" 2>&1 | tee /tmp/cf-pages-hybrid-deploy.log

URL=$(rg -o 'https://[^ ]+\.pages\.dev' /tmp/cf-pages-hybrid-deploy.log | tail -n 1 || true)
if [[ -n "$URL" ]]; then
  echo "✅ URL live: $URL"
fi
