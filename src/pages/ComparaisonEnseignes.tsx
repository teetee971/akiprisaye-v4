// src/pages/ComparaisonEnseignes.tsx
import React, { useEffect, useState } from 'react'
import { GlassCard } from '../components/ui/glass-card'
import PriceComparisonTable from '../components/PriceComparisonTable'
import PriceDataWarning from '../components/PriceDataWarning'
import {
  getProductList,
  getObservationsByEAN,
  getUniqueTerritories,
} from '../services/priceObservationService'
import {
  aggregateObservations,
  groupByStore,
  hasOldData,
  countUniqueStores,
} from '../services/priceAggregationService'
import { initAutoUpdate, getLastUpdateDate } from '../services/priceUpdateScheduler'
import type { PriceObservation } from '../types/priceObservation'

export default function ComparaisonEnseignes() {
  const [selectedEAN, setSelectedEAN] = useState<string>('')
  const [selectedTerritory, setSelectedTerritory] = useState<string>('all')
  const [observations, setObservations] = useState<PriceObservation[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const products = getProductList()
  const territories = getUniqueTerritories()

  // Initialiser la mise à jour automatique au montage
  useEffect(() => {
    initAutoUpdate()
    setLastUpdate(getLastUpdateDate())
  }, [])

  // Charger les observations quand un produit est sélectionné
  useEffect(() => {
    if (!selectedEAN) {
      setObservations([])
      return
    }

    let obs = getObservationsByEAN(selectedEAN)

    // Filtrer par territoire si sélectionné
    if (selectedTerritory !== 'all') {
      obs = obs.filter((o) => o.territory === selectedTerritory)
    }

    setObservations(obs)
  }, [selectedEAN, selectedTerritory])

  // Sélectionner le premier produit par défaut
  useEffect(() => {
    if (products.length > 0 && !selectedEAN) {
      setSelectedEAN(products[0].ean)
    }
  }, [products, selectedEAN])

  const aggregation = aggregateObservations(observations)
  const groupedStores = groupByStore(observations)
  const oldData = hasOldData(observations)
  const storeCount = countUniqueStores(observations)

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl" role="main">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Comparaison inter-enseignes</h1>

        {/* Avertissement obligatoire */}
        <div className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg text-sm text-blue-200 mb-6">
          <strong>ℹ️ Information importante</strong>
          <p className="mt-2">
            Cette comparaison présente des prix observés à des dates différentes, selon les données publiques
            disponibles. Elle ne constitue ni une recommandation d'achat, ni un classement commercial.
          </p>
        </div>

        {lastUpdate && (
          <div className="text-xs text-white/50 mb-4">
            Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
          </div>
        )}
      </div>

      {/* Filtres */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <GlassCard title="Sélection du produit">
          <select
            value={selectedEAN}
            onChange={(e) => setSelectedEAN(e.target.value)}
            className="w-full px-4 py-3 bg-white/[0.1] border border-white/[0.22] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Sélectionner un produit"
          >
            {products.map((product) => (
              <option key={product.ean} value={product.ean} className="bg-gray-800">
                {product.name} ({product.ean})
              </option>
            ))}
          </select>
        </GlassCard>

        <GlassCard title="Territoire">
          <select
            value={selectedTerritory}
            onChange={(e) => setSelectedTerritory(e.target.value)}
            className="w-full px-4 py-3 bg-white/[0.1] border border-white/[0.22] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filtrer par territoire"
          >
            <option value="all" className="bg-gray-800">
              Tous les territoires
            </option>
            {territories.map((territory) => (
              <option key={territory} value={territory} className="bg-gray-800">
                {territory}
              </option>
            ))}
          </select>
        </GlassCard>
      </div>

      {/* Avertissements sur les données */}
      {(oldData || storeCount < 2) && (
        <div className="mb-6">
          <PriceDataWarning hasOldData={oldData} storeCount={storeCount} />
        </div>
      )}

      {/* Statistiques factuelles */}
      {aggregation && (
        <div className="mb-6">
          <GlassCard title="Statistiques factuelles">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-white/60 text-sm mb-1">Prix minimum observé</div>
                <div className="text-2xl font-bold text-green-400">
                  {aggregation.minPrice.toFixed(2)} €
                </div>
              </div>

              <div>
                <div className="text-white/60 text-sm mb-1">Prix maximum observé</div>
                <div className="text-2xl font-bold text-red-400">
                  {aggregation.maxPrice.toFixed(2)} €
                </div>
              </div>

              <div>
                <div className="text-white/60 text-sm mb-1">Prix moyen</div>
                <div className="text-2xl font-bold text-blue-400">
                  {aggregation.averagePrice.toFixed(2)} €
                </div>
              </div>

              <div>
                <div className="text-white/60 text-sm mb-1">Nombre d'observations</div>
                <div className="text-2xl font-bold text-white">{aggregation.observationCount}</div>
              </div>

              <div>
                <div className="text-white/60 text-sm mb-1">Période couverte</div>
                <div className="text-sm text-white">
                  {new Date(aggregation.periodStart).toLocaleDateString('fr-FR')}
                  <br />→<br />
                  {new Date(aggregation.periodEnd).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tableau de comparaison */}
      <GlassCard title="Observations de prix">
        <PriceComparisonTable observations={observations} groupedByStore={groupedStores} />
      </GlassCard>
    </main>
  )
}
