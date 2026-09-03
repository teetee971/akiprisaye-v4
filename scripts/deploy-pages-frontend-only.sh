#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${1:-akiprisaye-v4-fresh}"

if [[ ! -f frontend/package.json ]]; then
  echo "ERREUR: lance depuis la racine du repo" >&2
  exit 1
fi

echo "[1/4] Build frontend"
pnpm --filter ./frontend run build

echo "[2/4] Prépare upload statique pur (sans _worker.js)"
rm -rf /tmp/cf-pages-upload
mkdir -p /tmp/cf-pages-upload
cp -R frontend/dist/. /tmp/cf-pages-upload/
rm -f /tmp/cf-pages-upload/_worker.js /tmp/cf-pages-upload/_redirects
rm -rf /tmp/cf-pages-upload/functions /tmp/cf-pages-upload/deploy_functions
printf 'deploy_id=%s\n' "$(date -u +%Y%m%dT%H%M%SZ)" > /tmp/cf-pages-upload/deploy-id.txt

echo "[3/4] Deploy Pages"
CMD=(npx -y wrangler@latest pages deploy /tmp/cf-pages-upload --project-name="$PROJECT_NAME" --commit-dirty=true)
echo "Commande: ${CMD[*]}"
"${CMD[@]}" | tee /tmp/cf-pages-frontend-only.log

echo "[4/4] URL"
rg -o 'https://[^ ]+\.pages\.dev' /tmp/cf-pages-frontend-only.log | tail -n 1 || true
