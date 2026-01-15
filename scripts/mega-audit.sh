#!/bin/bash
set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║         🔍 MEGA AUDIT COMPLET - AKIPRISAYE-WEB          ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📅 Date: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# ============================================================================
# 1. BUNDLE ANALYSIS
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 1.  BUNDLE ANALYSIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -d "dist" ]; then
  echo "✅ Build directory found"
  echo ""
  
  echo "📊 Bundle sizes:"
  du -h dist/assets/*. js 2>/dev/null | sort -rh | head -10 || echo "No JS files"
  
  echo ""
  echo "📊 Total bundle size:"
  du -sh dist/assets/ 2>/dev/null || echo "No dist/assets"
  
  echo ""
  echo "📊 Gzipped sizes (estimated):"
  find dist/assets -name "*.js" -exec gzip -c {} \; 2>/dev/null | wc -c | awk '{print $1/1024/1024 " MB"}' || echo "Cannot estimate"
else
  echo "⚠️  No build found.  Run:  npm run build"
fi

echo ""

# ============================================================================
# 2. CSS ANALYSIS
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 2. CSS ANALYSIS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "scripts/analyze-css.sh" ]; then
  bash scripts/analyze-css.sh
else
  echo "⚠️  CSS analysis script not found"
  if [ -d "dist/assets" ]; then
    CSS_FILE=$(find dist/assets -name "*. css" | head -1)
    if [ -f "$CSS_FILE" ]; then
      echo "📦 CSS file: $(basename $CSS_FILE)"
      echo "📊 Size: $(du -h $CSS_FILE | awk '{print $1}')"
    fi
  fi
fi

echo ""

# ============================================================================
# 3. SECURITY CHECK
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔒 3. SECURITY CHECK"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f ".npmaudit" ]; then
  echo "✅ Security documentation found"
  grep -A 3 "## Current Status" .npmaudit || echo "Documented vulnerabilities"
else
  echo "⚠️  Running npm audit..."
  npm audit --json | grep -E '"vulnerabilities":|"total"' || npm audit
fi

echo ""

# ============================================================================
# 4. CODE QUALITY
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 4. CODE QUALITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔍 ESLint check..."
if npm run lint 2>&1 | grep -q "0 errors"; then
  echo "✅ ESLint:  0 errors"
else
  echo "⚠️  ESLint has errors.  Run: npm run lint"
fi

echo ""
echo "🔍 TypeScript check..."
if command -v tsc &> /dev/null; then
  if tsc --noEmit 2>&1 | grep -q "error TS"; then
    echo "⚠️  TypeScript has errors"
  else
    echo "✅ TypeScript: No errors"
  fi
else
  echo "⚠️  TypeScript not installed"
fi

echo ""

# ============================================================================
# 5. PERFORMANCE METRICS
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📈 5. PERFORMANCE METRICS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "performance-budget.json" ]; then
  echo "✅ Performance budgets defined"
  cat performance-budget.json | grep -E '"maxSize"|"baseline"' | head -5
else
  echo "⚠️  No performance budgets found"
fi

echo ""

if [ -d "dist" ]; then
  MAIN_JS=$(find dist/assets -name "index-*.js" | head -1)
  if [ -f "$MAIN_JS" ]; then
    SIZE=$(stat -f%z "$MAIN_JS" 2>/dev/null || stat -c%s "$MAIN_JS" 2>/dev/null)
    SIZE_KB=$((SIZE / 1024))
    echo "📦 Main bundle: ${SIZE_KB} KB"
    
    if [ $SIZE_KB -lt 600 ]; then
      echo "✅ Under 600 KB target"
    else
      echo "⚠️  Above 600 KB target"
    fi
  fi
fi

echo ""

# ============================================================================
# 6. GIT STATUS
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔀 6. GIT STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "📊 Branch:  $(git branch --show-current)"
echo "📝 Last commit: $(git log -1 --oneline)"
echo ""

UNCOMMITTED=$(git status --porcelain | wc -l)
if [ "$UNCOMMITTED" -eq 0 ]; then
  echo "✅ No uncommitted changes"
else
  echo "⚠️  $UNCOMMITTED uncommitted changes"
  git status --short
fi

echo ""

# ============================================================================
# 7. FINAL SCORE
# ============================================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━��━━━━"
echo "🏆 7. FINAL SCORE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SCORE=0

# Build exists
[ -d "dist" ] && SCORE=$((SCORE + 20)) && echo "✅ Build exists (+20)"

# CSS optimized
[ -f ".npmaudit" ] && SCORE=$((SCORE + 15)) && echo "✅ Security documented (+15)"

# No uncommitted changes
[ "$UNCOMMITTED" -eq 0 ] && SCORE=$((SCORE + 10)) && echo "✅ Git clean (+10)"

# Performance budgets
[ -f "performance-budget.json" ] && SCORE=$((SCORE + 15)) && echo "✅ Performance budgets (+15)"

# Bundle size OK
if [ -f "$MAIN_JS" ]; then
  SIZE=$(stat -f%z "$MAIN_JS" 2>/dev/null || stat -c%s "$MAIN_JS" 2>/dev/null)
  [ $((SIZE / 1024)) -lt 600 ] && SCORE=$((SCORE + 20)) && echo "✅ Bundle optimized (+20)"
fi

# Scripts exist
[ -f "scripts/analyze-css.sh" ] && SCORE=$((SCORE + 10)) && echo "✅ Analysis tools (+10)"

# Monitoring
[ -f "src/components/PerformanceMonitor.tsx" ] && SCORE=$((SCORE + 10)) && echo "✅ Performance monitoring (+10)"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎯 TOTAL SCORE: $SCORE/100"

if [ $SCORE -ge 90 ]; then
  echo "🏆 EXCELLENT!    Production ready!"
elif [ $SCORE -ge 70 ]; then
  echo "✅ GOOD!  Minor improvements possible"
elif [ $SCORE -ge 50 ]; then
  echo "⚠️  OK.  Some optimization needed"
else
  echo "❌ NEEDS WORK. Major improvements required"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Audit completed at $(date '+%H:%M:%S')"
