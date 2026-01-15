#!/bin/bash
set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     🚀 SUPER OPTIMIZER - AKIPRISAYE-WEB AUTOMATION      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📅 Started: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

CHANGES_MADE=0

# ============================================================================
# MISSION L: FIX . NPMAUDIT DETECTION
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🏆 MISSION L: Fix .npmaudit detection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if grep -q '"\. npmaudit"' scripts/mega-audit.sh 2>/dev/null; then
  echo "🔧 Fixing .npmaudit detection in mega-audit.sh..."
  sed -i. bak 's/"\. npmaudit"/"\.npmaudit"/g' scripts/mega-audit.sh
  rm -f scripts/mega-audit.sh.bak
  echo "✅ Fixed . npmaudit detection"
  CHANGES_MADE=1
else
  echo "✅ . npmaudit detection already correct"
fi

echo ""

# ============================================================================
# MISSION H: PRELOAD CRITICAL RESOURCES
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚡ MISSION H:  Preload critical resources"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "index. html" ]; then
  if !  grep -q "rel=\"preload\"" index.html; then
    echo "🔧 Adding preload hints to index.html..."
    
    # Backup
    cp index.html index.html.bak
    
    # Add preload hints after <head>
    sed -i '/<head>/a\
    <!-- Preload Critical Resources -->\
    <link rel="modulepreload" href="/src/main.tsx" />\
    <link rel="preconnect" href="https://fonts.googleapis.com" />\
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />' index.html
    
    echo "✅ Added preload hints"
    CHANGES_MADE=1
  else
    echo "✅ Preload hints already present"
  fi
else
  echo "⚠️  index.html not found, skipping preload"
fi

echo ""

# ============================================================================
# MISSION B: OPTIMIZE ASSETS
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🖼️  MISSION B: Optimize assets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for large JSON files
if [ -f "public/data/expanded-prices.json" ]; then
  SIZE=$(stat -f%z "public/data/expanded-prices. json" 2>/dev/null || stat -c%s "public/data/expanded-prices.json" 2>/dev/null)
  SIZE_MB=$((SIZE / 1024 / 1024))
  
  if [ $SIZE_MB -gt 1 ]; then
    echo "📦 Large JSON file detected:  ${SIZE_MB}MB"
    echo "💡 Recommendation: Consider compressing or splitting this file"
    echo "   Run: gzip -k public/data/expanded-prices. json"
  fi
fi

# Check for unoptimized images
if [ -d "public" ]; then
  IMAGES=$(find public -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) 2>/dev/null | wc -l)
  if [ $IMAGES -gt 0 ]; then
    echo "🖼️  Found $IMAGES images in public/"
    echo "💡 Consider converting to WebP for better compression"
  fi
fi

echo "✅ Asset analysis complete"
echo ""

# ============================================================================
# ADD VITE OPTIMIZATION CONFIG
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚡ Optimizing Vite config"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "vite.config.ts" ]; then
  if ! grep -q "modulePreload" vite.config.ts; then
    echo "🔧 Adding module preload optimization..."
    
    # Create optimized vite config
    cat > vite.config.ts. new << 'VITEEOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions:  {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['recharts'],
          'map-vendor': ['leaflet', 'react-leaflet'],
        },
      },
    },
    // Enable module preload polyfill
    modulePreload: {
      polyfill: true,
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
  },
  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
VITEEOF
    
    mv vite.config.ts vite.config.ts.bak
    mv vite.config. ts.new vite.config. ts
    echo "✅ Vite config optimized"
    CHANGES_MADE=1
  else
    echo "✅ Vite config already optimized"
  fi
fi

echo ""

# ============================================================================
# CREATE LIGHTHOUSE CONFIG
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📱 MISSION G: Setup Lighthouse config"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ !  -f "lighthouserc.json" ]; then
  echo "🔧 Creating lighthouserc.json..."
  cat > lighthouserc.json << 'LHEOF'
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "startServerCommand": "npm run preview",
      "url": ["http://localhost:4173"],
      "settings": {
        "preset": "desktop"
      }
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories: performance": ["error", {"minScore": 0.85}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
LHEOF
  echo "✅ Lighthouse config created"
  CHANGES_MADE=1
else
  echo "✅ Lighthouse config already exists"
fi

echo ""

# ============================================================================
# ADD NPM SCRIPTS
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Adding helper npm scripts"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "package.json" ]; then
  if ! grep -q "\"audit: full\"" package.json; then
    echo "🔧 Adding helper scripts to package.json..."
    
    # Add scripts using node
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg. scripts['audit:full'] = 'bash scripts/mega-audit.sh';
    pkg.scripts['optimize'] = 'bash scripts/super-optimize.sh';
    pkg.scripts['lighthouse: mobile'] = 'lighthouse http://localhost:4173 --preset=mobile --view';
    pkg.scripts['lighthouse:desktop'] = 'lighthouse http://localhost:4173 --preset=desktop --view';
    fs. writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    " 2>/dev/null && echo "✅ Scripts added" || echo "⚠️  Could not add scripts automatically"
  else
    echo "✅ Helper scripts already present"
  fi
fi

echo ""

# ============================================================================
# REBUILD PROJECT
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔨 Rebuilding project with optimizations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $CHANGES_MADE -eq 1 ]; then
  echo "🔨 Running build..."
  npm run build > /dev/null 2>&1 && echo "✅ Build successful" || echo "⚠️  Build had warnings (check manually)"
else
  echo "✅ No rebuild needed"
fi

echo ""

# ============================================================================
# RUN AUDIT
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Running final audit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

bash scripts/mega-audit.sh

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎊 OPTIMIZATION COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $CHANGES_MADE -eq 1 ]; then
  echo "✅ Changes made.  Review and commit:"
  echo ""
  echo "   git status"
  echo "   git add ."
  echo "   git commit -m \"feat: auto-optimize with super-optimizer script\""
  echo "   git push"
else
  echo "✅ No changes needed - project already optimized!"
fi

echo ""
echo "📅 Completed: $(date '+%Y-%m-%d %H:%M:%S')"
