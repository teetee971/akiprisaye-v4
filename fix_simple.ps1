#!/usr/bin/env pwsh
# Script de correction simplifie - A KI PRI SA YE

Write-Host "=== CORRECTION DEPLOIEMENT A KI PRI SA YE ===" -ForegroundColor Cyan
Write-Host ""

Write-Host "PROBLEME IDENTIFIE:" -ForegroundColor Red
Write-Host "- L'index.html racine (page actualites) est deploye au lieu de l'app React" -ForegroundColor Yellow
Write-Host "- L'app React moderne est dans public/index.html" -ForegroundColor Yellow  
Write-Host "- Cloudflare Pages sert le mauvais fichier" -ForegroundColor Yellow
Write-Host ""

Write-Host "ETAPES DE CORRECTION:" -ForegroundColor Green
Write-Host "1. Sauvegarder l'index.html actuel vers actualites.html" -ForegroundColor White
Write-Host "2. Copier l'app React (public/index.html) vers la racine" -ForegroundColor White
Write-Host "3. Mettre a jour la navigation" -ForegroundColor White
Write-Host ""

Write-Host "EXECUTION EN COURS..." -ForegroundColor Yellow

# Etape 1: Sauvegarder index.html actuel
if (Test-Path "index.html") {
    Write-Host "Sauvegarde: index.html -> actualites.html" -ForegroundColor Blue
    Copy-Item "index.html" "actualites.html" -Force
    Write-Host "OK - Sauvegarde terminee" -ForegroundColor Green
} else {
    Write-Host "ERREUR - index.html non trouve" -ForegroundColor Red
}

# Etape 2: Copier l'app React
if (Test-Path "public/index.html") {
    Write-Host "Copie: public/index.html -> index.html" -ForegroundColor Blue
    Copy-Item "public/index.html" "index.html" -Force
    Write-Host "OK - App React copiee" -ForegroundColor Green
} else {
    Write-Host "ERREUR - public/index.html non trouve" -ForegroundColor Red
}

Write-Host ""
Write-Host "VERIFICATION DES FICHIERS:" -ForegroundColor Cyan

# Verification
if (Test-Path "actualites.html") {
    $size1 = (Get-Item "actualites.html").Length
    Write-Host "OK - actualites.html ($size1 octets)" -ForegroundColor Green
} else {
    Write-Host "MANQUE - actualites.html" -ForegroundColor Red
}

if (Test-Path "index.html") {
    $content = Get-Content "index.html" -Raw
    if ($content -match "div id=.root") {
        Write-Host "OK - index.html contient l'app React" -ForegroundColor Green
    } else {
        Write-Host "PROBLEME - index.html ne contient pas l'app React" -ForegroundColor Red
    }
} else {
    Write-Host "MANQUE - index.html" -ForegroundColor Red
}

Write-Host ""
Write-Host "PROCHAINES ETAPES:" -ForegroundColor Cyan
Write-Host "1. Commit et push vers GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host '   git commit -m "Fix: Deploy React app instead of actualites page"' -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Attendre le redeploiement Cloudflare (5-10 min)" -ForegroundColor White
Write-Host ""
Write-Host "3. Verifier: https://akiprisaye-web.pages.dev/" -ForegroundColor White
Write-Host "   Doit afficher l'app React moderne avec carrousel" -ForegroundColor White
Write-Host ""

Write-Host "=== CORRECTION TERMINEE ===" -ForegroundColor Green
