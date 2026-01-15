#!/bin/bash
set -e

echo "🔧 OPTIMISATION DES ASSETS PUBLIC/"
echo "===================================="
echo ""

# 1. Vérifier les fichiers OCR
echo "✅ Fichiers OCR détectés:"
ls -lh public/ocr/*. gz public/ocr/*.wasm 2>/dev/null | awk '{print "  ", $5, $9}'

echo ""
echo "💡 Ces fichiers sont chargés à la demande (lazy)"

# 2. Compresser expanded-prices.json
echo ""
echo "📊 Analyse de expanded-prices. json:"
JSON_FILE="public/data/expanded-prices.json"
if [ -f "$JSON_FILE" ]; then
  ORIG_SIZE=$(du -h "$JSON_FILE" | awk '{print $1}')
  echo "  Taille actuelle: $ORIG_SIZE"
  
  gzip -9 -c "$JSON_FILE" > "${JSON_FILE}.gz"
  GZIP_SIZE=$(du -h "${JSON_FILE}.gz" | awk '{print $1}')
  echo "  Taille gzippée: $GZIP_SIZE"
else
  echo "  ⚠️  Fichier non trouvé"
fi

echo ""
echo "✅ Optimisation terminée!"
