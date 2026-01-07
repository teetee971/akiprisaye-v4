import React, { useState, useEffect } from 'react';
import { Camera, Search, Barcode, Receipt } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import ReceiptScanner from '../components/ReceiptScanner';
import type { ReceiptAnalysisResult } from '../services/receiptScanService';

/**
 * UNIFIED PRICE SEARCH HUB
 * 
 * Single entry point merging:
 * - Text-based product search
 * - Barcode (EAN) scanning  
 * - Product photo scanning
 * - Receipt (ticket de caisse) scanning
 * 
 * All paths converge to the SAME comparison result view.
 * 16 "wow effect" components are contextual enhancements shown conditionally.
 */

type SearchMode = 'text' | 'barcode' | 'photo' | 'receipt';

export default function RecherchePrix() {
  const [searchParams] = useSearchParams();
  const [searchMode, setSearchMode] = useState<SearchMode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [receiptAnalysis, setReceiptAnalysis] = useState<ReceiptAnalysisResult | null>(null);
  
  // Check for source parameter (e.g., ?source=ticket)
  useEffect(() => {
    const source = searchParams.get('source');
    if (source === 'ticket') {
      setSearchMode('receipt');
    }
  }, [searchParams]);

  const handleSearchModeSelect = (mode: SearchMode) => {
    setSearchMode(mode);
    
    // Redirect to appropriate scan interface if needed
    switch (mode) {
      case 'barcode':
        window.location.href = '/scan-ean?from=recherche-prix';
        break;
      case 'photo':
        window.location.href = '/analyse-photo-produit?from=recherche-prix';
        break;
      case 'receipt':
        // Stay on this page - render ReceiptScanner component
        break;
      case 'text':
        // Stay on this page for text search
        break;
    }
  };
  
  const handleReceiptAnalysisComplete = (result: ReceiptAnalysisResult) => {
    setReceiptAnalysis(result);
    // TODO: Navigate to comparison view with receipt data
    // For now, just log it
    console.log('Receipt analysis complete:', result);
  };

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to comparator with search query
      window.location.href = `/comparateur?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <Helmet>
        <title>Recherche de prix | A KI PRI SA YÉ</title>
        <meta 
          name="description" 
          content="Point d'entrée unique pour rechercher, scanner et comparer les prix. Recherche par nom, code-barres, photo produit ou ticket de caisse." 
        />
      </Helmet>

      <div className="min-h-screen bg-slate-950 dark:bg-slate-900 pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Receipt Scanner Mode */}
          {searchMode === 'receipt' ? (
            <ReceiptScanner 
              onAnalysisComplete={handleReceiptAnalysisComplete}
              onClose={() => setSearchMode(null)}
            />
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Recherche de prix
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Recherchez, scannez et comparez les prix dans votre territoire en 3 étapes simples.
                </p>
              </div>

          {/* Main Search Input */}
          <div className="glass-container mb-8">
            <form onSubmit={handleTextSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un produit par nom..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  aria-label="Recherche de produit par nom"
                />
              </div>
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors"
                aria-label="Lancer la recherche"
              >
                Rechercher
              </button>
            </form>
          </div>

          {/* Search Mode Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            
            {/* Receipt Scan - PROMINENT */}
            <button
              onClick={() => handleSearchModeSelect('receipt')}
              className="glass-card p-8 hover:bg-orange-500/10 transition-all group border-2 border-orange-500/40 hover:border-orange-500/60 relative overflow-hidden"
              aria-label="Scanner ticket de caisse"
            >
              {/* Badge "Nouveau" */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                NOUVEAU
              </div>
              <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/30 transition-colors mx-auto">
                <Receipt className="w-8 h-8 text-orange-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-3">
                📋 Scanner votre ticket de caisse
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Analysez tous les produits de votre ticket en une seule fois
              </p>
              <ul className="text-xs text-gray-400 space-y-1 text-left">
                <li>✓ Reconnaissance automatique des produits</li>
                <li>✓ Comparaison avec les prix du territoire</li>
                <li>✓ Traitement 100% local (RGPD conforme)</li>
              </ul>
              <div className="mt-6 px-6 py-3 bg-orange-600/20 hover:bg-orange-600/30 rounded-lg text-orange-300 font-semibold transition-colors inline-block">
                Commencer →
              </div>
            </button>

            {/* Text Search */}
            <button
              onClick={() => handleSearchModeSelect('text')}
              className="glass-card p-6 hover:bg-slate-800/60 transition-all group"
              aria-label="Recherche par nom"
            >
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Search className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">
                Recherche par nom
              </h3>
              <p className="text-sm text-gray-400">
                Recherchez un produit par son nom
              </p>
            </button>

          </div>

          {/* Secondary Search Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            
            {/* Barcode Scan */}
            <button
              onClick={() => handleSearchModeSelect('barcode')}
              className="glass-card p-4 hover:bg-slate-800/60 transition-all group"
              aria-label="Scanner code-barres"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors flex-shrink-0">
                  <Barcode className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    Scanner code-barres
                  </h3>
                  <p className="text-xs text-gray-400">
                    Scannez le code EAN du produit
                  </p>
                </div>
              </div>
            </button>

            {/* Photo Scan */}
            <button
              onClick={() => handleSearchModeSelect('photo')}
              className="glass-card p-4 hover:bg-slate-800/60 transition-all group"
              aria-label="Photographier produit"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors flex-shrink-0">
                  <Camera className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    Photographier produit
                  </h3>
                  <p className="text-xs text-gray-400">
                    Recherche assistée par photo
                  </p>
                </div>
              </div>
            </button>

          </div>

          {/* Information Banner */}
          <div className="glass-card p-6 border border-blue-500/30">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-xl">ℹ️</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">
                  Outil d'intérêt général
                </h3>
                <p className="text-sm text-gray-300 mb-3">
                  Cet observatoire est un <strong>outil d'information citoyenne</strong>, 
                  basé sur des données publiques et des contributions volontaires.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>✓ Données réelles • Aucune estimation arbitraire</li>
                  <li>✓ Transparence totale • Méthodologie accessible</li>
                  <li>✓ RGPD compliant • Pas de tracking utilisateur</li>
                </ul>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Comment ça marche ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Recherchez</h3>
                <p className="text-sm text-gray-400">
                  Par nom, code-barres, photo ou ticket de caisse
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-400">2</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Comparez</h3>
                <p className="text-sm text-gray-400">
                  Consultez les prix dans votre territoire
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-400">3</span>
                </div>
                <h3 className="text-white font-semibold mb-2">Économisez</h3>
                <p className="text-sm text-gray-400">
                  Trouvez les meilleurs prix et optimisez vos courses
                </p>
              </div>

            </div>
          </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}
