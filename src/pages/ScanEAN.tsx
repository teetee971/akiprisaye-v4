// src/pages/ScanEAN.tsx
import React, { useState } from 'react'
import { useEANScanner } from '../hooks/useEANScanner'
import { useEANResolver } from '../hooks/useEANResolver'
import { useScanHistory } from '../hooks/useScanHistory'
import { validateEAN } from '../services/eanPublicCatalog'
import ScanCamera from '../components/ScanCamera'
import ScanResultCard from '../components/ScanResultCard'
import ScanErrorState from '../components/ScanErrorState'
import AddToTiPanierButton from '../components/AddToTiPanierButton'
import { GlassCard } from '../components/ui/glass-card'

export default function ScanEAN() {
  const [manualEAN, setManualEAN] = useState('')
  const [manualError, setManualError] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const scanner = useEANScanner()
  const resolver = useEANResolver()
  const { history, addToHistory, removeFromHistory, clearHistory } = useScanHistory()

  // Handle manual EAN search
  const handleManualSearch = async () => {
    setManualError(null)

    if (!manualEAN.trim()) {
      setManualError('Veuillez saisir un code EAN')
      return
    }

    if (!validateEAN(manualEAN.trim())) {
      setManualError('Code EAN invalide (vérifiez la longueur et le checksum)')
      return
    }

    await resolver.resolveEAN(manualEAN.trim())
    
    if (resolver.product) {
      addToHistory({
        ean: manualEAN.trim(),
        productName: resolver.product.name,
      })
    }
  }

  // Handle camera detection (placeholder - would need real barcode library)
  const handleCameraDetection = async (ean: string) => {
    scanner.setDetectedEAN(ean)
    await resolver.resolveEAN(ean)
    
    if (resolver.product) {
      addToHistory({
        ean,
        productName: resolver.product.name,
      })
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl" role="main">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Scanner EAN</h1>
        
        {/* Avertissement obligatoire */}
        <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg text-sm text-blue-200 mb-6">
          <strong>ℹ️ Information</strong>
          <p className="mt-2">
            Le scan permet d'identifier un produit à partir de son code EAN.
            Les informations affichées reposent uniquement sur des données observées ou publiques disponibles.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Scan par caméra */}
        <GlassCard title="📷 Scanner avec la caméra">
          <ScanCamera
            videoRef={scanner.videoRef}
            isScanning={scanner.isScanning}
            error={scanner.error}
            onStartScan={scanner.startScanning}
            onStopScan={scanner.stopScanning}
          />
        </GlassCard>

        {/* Saisie manuelle */}
        <GlassCard title="⌨️ Saisie manuelle">
          <div className="space-y-4">
            <div>
              <label htmlFor="manual-ean" className="block text-sm font-medium text-white/90 mb-2">
                Code EAN (8 ou 13 chiffres)
              </label>
              <input
                id="manual-ean"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={manualEAN}
                onChange={(e) => {
                  setManualEAN(e.target.value.replace(/\D/g, ''))
                  setManualError(null)
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleManualSearch()
                  }
                }}
                placeholder="3017620422003"
                className="w-full px-4 py-3 bg-white/[0.1] border border-white/[0.22] rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Saisir le code EAN manuellement"
                aria-describedby={manualError ? 'manual-error' : undefined}
              />
              {manualError && (
                <p id="manual-error" className="mt-2 text-sm text-red-400">
                  {manualError}
                </p>
              )}
            </div>

            <button
              onClick={handleManualSearch}
              disabled={resolver.loading}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
              aria-label="Rechercher le produit"
            >
              {resolver.loading ? '🔍 Recherche...' : '🔍 Rechercher'}
            </button>
          </div>
        </GlassCard>
      </div>

      {/* Résultat */}
      {resolver.product && (
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl font-bold text-white">Résultat</h2>
          <ScanResultCard product={resolver.product} />
          <AddToTiPanierButton product={resolver.product} />
        </div>
      )}

      {resolver.error && !resolver.product && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Résultat</h2>
          <ScanErrorState message={resolver.error} />
        </div>
      )}

      {/* Historique */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">Historique des scans</h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-sm text-blue-400 hover:text-blue-300"
              aria-expanded={showHistory}
              aria-controls="scan-history"
            >
              {showHistory ? 'Masquer' : 'Afficher'} ({history.length})
            </button>
          </div>

          {showHistory && (
            <GlassCard id="scan-history">
              <div className="space-y-2">
                {history.map((entry) => (
                  <div
                    key={entry.ean}
                    className="flex items-center justify-between p-3 bg-white/[0.05] rounded-lg hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {entry.productName || 'Produit inconnu'}
                      </div>
                      <div className="text-xs text-white/50 font-mono">
                        EAN: {entry.ean}
                      </div>
                      <div className="text-xs text-white/40">
                        {new Date(entry.scannedAt).toLocaleString('fr-FR')}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromHistory(entry.ean)}
                      className="ml-3 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                      aria-label={`Supprimer ${entry.productName || entry.ean} de l'historique`}
                    >
                      🗑️
                    </button>
                  </div>
                ))}

                <button
                  onClick={clearHistory}
                  className="w-full mt-4 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                  aria-label="Effacer tout l'historique"
                >
                  Effacer tout l'historique
                </button>
              </div>
            </GlassCard>
          )}
        </div>
      )}
    </main>
  )
}
