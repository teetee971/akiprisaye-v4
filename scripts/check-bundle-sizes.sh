#!/bin/bash
set -e

echo "📊 VÉRIFICATION DES TAILLES DE BUNDLE"
echo "======================================"
echo ""

# Limites (en KB)
MAX_INDEX=550
MAX_VENDOR=200
MAX_CSS=110

# Vérifier que dist existe
if [ ! -d "dist/assets" ]; then
  echo "⚠️  dist/ n'existe pas.  Lancez 'npm run build' d'abord."
  exit 0
fi

# Vérifier index
INDEX_SIZE=$(find dist/assets -name "index-*. js" -exec du -k {} \; 2>/dev/null | awk '{print $1}' | head -1)
if [ -n "$INDEX_SIZE" ]; then
  echo "📦 index. js: ${INDEX_SIZE} KB (max: ${MAX_INDEX} KB)"
  if [ "$INDEX_SIZE" -gt "$MAX_INDEX" ]; then
    echo "   ❌ TROP GROS!"
  else
    echo "   ✅ OK"
  fi
fi

# Vérifier vendors
echo ""
echo "📦 Vendor chunks:"
find dist/assets -name "vendor-*.js" -exec du -k {} \; 2>/dev/null | while read size file; do
  name=$(basename "$file")
  echo "   $name:  ${size} KB"
  if [ "$size" -gt "$MAX_VENDOR" ]; then
    echo "      ⚠️  > ${MAX_VENDOR} KB"
  fi
done

# Vérifier CSS
echo ""
CSS_SIZE=$(find dist/assets -name "*.css" -exec du -k {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}')
if [ -n "$CSS_SIZE" ]; then
  echo "🎨 Total CSS: ${CSS_SIZE} KB (max: ${MAX_CSS} KB)"
  if [ "$CSS_SIZE" -gt "$MAX_CSS" ]; then
    echo "   ⚠️  CSS un peu gros"
  else
    echo "   ✅ OK"
  fi
fi

echo ""
echo "✅ Vérification terminée!"
