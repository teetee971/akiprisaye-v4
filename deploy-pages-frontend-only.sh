#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="${1:-akiprisaye-v4-fresh}"

pnpm --filter ./frontend run build && \
rm -rf /tmp/cf-pages-upload && mkdir -p /tmp/cf-pages-upload && \
cp -R frontend/dist/. /tmp/cf-pages-upload/ && \
rm -f /tmp/cf-pages-upload/_worker.js /tmp/cf-pages-upload/_redirects && \
rm -rf /tmp/cf-pages-upload/functions /tmp/cf-pages-upload/deploy_functions && \
printf 'deploy_id=%s\n' "$(date -u +%Y%m%dT%H%M%SZ)" > /tmp/cf-pages-upload/deploy-id.txt && \
npx -y wrangler@latest pages deploy /tmp/cf-pages-upload --project-name="$PROJECT_NAME" --commit-dirty=true
