import React, { useState, useEffect } from 'react';
import { Ship, TrendingUp, TrendingDown, AlertCircle, Info, Calendar, DollarSign, Clock, Car } from 'lucide-react';
import type {
  BoatPricePoint,
  BoatComparisonResult,
  BoatRoute,
  Port,
} from '../types/boatComparison';
import {
  compareBoatPricesByRoute,
  filterBoatPrices,
  calculatePotentialSavings,
} from '../services/boatComparisonService';

const BoatComparator: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boatPrices, setBoatPrices] = useState<BoatPricePoint[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<string>('PTP-PORT');
  const [selectedDestination, setSelectedDestination] = useState<string>('FDF-PORT');
  const [comparisonResult, setComparisonResult] = useState<BoatComparisonResult | null>(null);
  const [showVehicleTransport, setShowVehicleTransport] = useState(false);

  useEffect(() => {
    loadBoatData();
  }, []);

  useEffect(() => {
    if (boatPrices.length > 0 && selectedOrigin && selectedDestination) {
      performComparison();
    }
  }, [boatPrices, selectedOrigin, selectedDestination]);

  const loadBoatData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/data/boat-prices.json');
      if (!response.ok) {
        throw new Error('Impossible de charger les données des bateaux');
      }
      const data = await response.json();
      setBoatPrices(data.boatPrices || []);
      setPorts(data.ports || []);
    } catch (err) {
      console.error('Error loading boat data:', err);
      setError('Erreur lors du chargement des données des bateaux');
    } finally {
      setLoading(false);
    }
  };

  const performComparison = () => {
    const originPort = ports.find((p) => p.code === selectedOrigin);
    const destinationPort = ports.find((p) => p.code === selectedDestination);

    if (!originPort || !destinationPort) {
      setComparisonResult(null);
      return;
    }

    const route: BoatRoute = {
      origin: originPort,
      destination: destinationPort,
      routeType:
        originPort.territory === destinationPort.territory
          ? 'inter_island'
          : 'inter_territory',
      islandGroup: 'Antilles',
    };

    const result = compareBoatPricesByRoute(route, boatPrices);
    setComparisonResult(result);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPriceCategoryColor = (category: string) => {
    switch (category) {
      case 'cheapest':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'below_average':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'average':
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
      case 'above_average':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'most_expensive':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getPriceCategoryLabel = (category: string) => {
    switch (category) {
      case 'cheapest':
        return 'Le moins cher';
      case 'below_average':
        return 'En dessous de la moyenne';
      case 'average':
        return 'Prix moyen';
      case 'above_average':
        return 'Au dessus de la moyenne';
      case 'most_expensive':
        return 'Le plus cher';
      default:
        return category;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Ship className="w-12 h-12 text-blue-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-300">Chargement des données des bateaux...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-300 text-center">{error}</p>
        </div>
      </div>
    );
  }

  const gpPorts = ports.filter((p) => p.territory === 'GP');
  const mqPorts = ports.filter((p) => p.territory === 'MQ');
  const otherPorts = ports.filter((p) => p.territory !== 'GP' && p.territory !== 'MQ');

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-3">
            <Ship className="w-8 h-8 text-blue-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
              Comparateur de prix des bateaux/ferries
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            🥇 PRIORITÉ 1 — Inter-îles • Transport véhicules • Passagers réguliers
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Observer, pas vendre : Transparence sur les écarts, pas d'affiliation opaque
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {/* Filters */}
          <section className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-5">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Sélection de la traversée</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Port de départ
                </label>
                <select
                  value={selectedOrigin}
                  onChange={(e) => setSelectedOrigin(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {gpPorts.length > 0 && (
                    <optgroup label="Guadeloupe">
                      {gpPorts.map((port) => (
                        <option key={port.code} value={port.code}>
                          {port.city} ({port.island})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {mqPorts.length > 0 && (
                    <optgroup label="Martinique">
                      {mqPorts.map((port) => (
                        <option key={port.code} value={port.code}>
                          {port.city} ({port.island})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {otherPorts.length > 0 && (
                    <optgroup label="Autres territoires">
                      {otherPorts.map((port) => (
                        <option key={port.code} value={port.code}>
                          {port.city} ({port.island})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Port d'arrivée
                </label>
                <select
                  value={selectedDestination}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {gpPorts.length > 0 && (
                    <optgroup label="Guadeloupe">
                      {gpPorts.map((port) => (
                        <option key={port.code} value={port.code}>
                          {port.city} ({port.island})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {mqPorts.length > 0 && (
                    <optgroup label="Martinique">
                      {mqPorts.map((port) => (
                        <option key={port.code} value={port.code}>
                          {port.city} ({port.island})
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {otherPorts.length > 0 && (
                    <optgroup label="Autres territoires">
                      {otherPorts.map((port) => (
                        <option key={port.code} value={port.code}>
                          {port.city} ({port.island})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>
            </div>
          </section>

          {/* Comparison Results */}
          {comparisonResult ? (
            <>
              {/* Aggregation Stats */}
              <section className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-5">
                <h2 className="text-lg font-semibold text-gray-100 mb-4">Statistiques</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Prix passager moyen</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {formatPrice(comparisonResult.aggregation.passengerPricing.averagePrice)}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Prix min</p>
                    <p className="text-2xl font-bold text-green-400">
                      {formatPrice(comparisonResult.aggregation.passengerPricing.minPrice)}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Prix max</p>
                    <p className="text-2xl font-bold text-red-400">
                      {formatPrice(comparisonResult.aggregation.passengerPricing.maxPrice)}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">Fréquence</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {comparisonResult.aggregation.frequencyAnalysis.dailyServices > 0
                        ? `${comparisonResult.aggregation.frequencyAnalysis.dailyServices} services quotidiens`
                        : `${comparisonResult.aggregation.frequencyAnalysis.averageDailyFrequency.toFixed(1)}/jour`}
                    </p>
                  </div>
                </div>

                {/* Vehicle Pricing */}
                {comparisonResult.aggregation.vehiclePricing && (
                  <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
                      <Car className="w-4 h-4" />
                      Transport de véhicules disponible
                    </h3>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Prix voiture moyen</p>
                        <p className="text-lg font-semibold text-gray-200">
                          {formatPrice(comparisonResult.aggregation.vehiclePricing.carAverage)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Prix min</p>
                        <p className="text-lg font-semibold text-gray-200">
                          {formatPrice(comparisonResult.aggregation.vehiclePricing.carMin)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Prix max</p>
                        <p className="text-lg font-semibold text-gray-200">
                          {formatPrice(comparisonResult.aggregation.vehiclePricing.carMax)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Operators Comparison */}
              <section className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-5">
                <h2 className="text-lg font-semibold text-gray-100 mb-4">
                  Comparaison par opérateur ({comparisonResult.operators.length})
                </h2>
                <div className="space-y-3">
                  {comparisonResult.operators.map((ranking) => (
                    <div
                      key={ranking.boatPrice.id}
                      className={`border rounded-lg p-4 ${getPriceCategoryColor(ranking.priceCategory)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-300">
                              #{ranking.rank}
                            </span>
                            <h3 className="text-lg font-bold">{ranking.boatPrice.operator}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-slate-800/50">
                              {getPriceCategoryLabel(ranking.priceCategory)}
                            </span>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3 text-sm">
                            <div>
                              <p className="text-gray-400">Prix passager adulte</p>
                              <p className="text-xl font-bold">
                                {formatPrice(ranking.boatPrice.pricing.passengerPrice)}
                              </p>
                              {ranking.boatPrice.pricing.childPrice && (
                                <p className="text-xs text-gray-400">
                                  Enfant: {formatPrice(ranking.boatPrice.pricing.childPrice)}
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-400">Différence vs moins cher</p>
                              <p className="font-semibold">
                                {ranking.percentageDifferenceFromCheapest > 0 && '+'}
                                {ranking.percentageDifferenceFromCheapest.toFixed(1)}%
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-400">Durée de traversée</p>
                              <p className="font-semibold">{ranking.boatPrice.schedule.duration}</p>
                            </div>
                            <div>
                              <p className="text-gray-400">Fréquence</p>
                              <p className="font-semibold">{ranking.boatPrice.schedule.frequency}</p>
                            </div>
                          </div>

                          {/* Vehicle Pricing */}
                          {ranking.boatPrice.pricing.vehiclePrice && (
                            <div className="mt-3 bg-slate-800/50 rounded p-3">
                              <p className="text-xs text-gray-400 mb-2 font-semibold">
                                Transport de véhicules
                              </p>
                              <div className="grid sm:grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-400">Voiture:</span>{' '}
                                  <span className="font-semibold text-gray-200">
                                    {formatPrice(ranking.boatPrice.pricing.vehiclePrice.car)}
                                  </span>
                                </div>
                                {ranking.boatPrice.pricing.vehiclePrice.motorcycle && (
                                  <div>
                                    <span className="text-gray-400">Moto:</span>{' '}
                                    <span className="font-semibold text-gray-200">
                                      {formatPrice(ranking.boatPrice.pricing.vehiclePrice.motorcycle)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Fare Conditions */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {ranking.boatPrice.fareConditions.deckAccess && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300">
                                Accès pont
                              </span>
                            )}
                            {ranking.boatPrice.fareConditions.cabinAvailable && (
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                                Cabine disponible
                              </span>
                            )}
                            {ranking.boatPrice.fareConditions.changeable && (
                              <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                                Modifiable
                              </span>
                            )}
                          </div>

                          {/* Capacity Info */}
                          {ranking.boatPrice.capacity && (
                            <div className="mt-3 text-xs text-gray-400">
                              <p>
                                Capacité : {ranking.boatPrice.capacity.passengers} passagers
                                {ranking.boatPrice.capacity.vehicles > 0 &&
                                  `, ${ranking.boatPrice.capacity.vehicles} véhicules`}
                              </p>
                            </div>
                          )}

                          <div className="mt-3 text-xs text-gray-400">
                            <p>
                              Observation : {formatDate(ranking.boatPrice.observationDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Vehicle Transport Analysis */}
              {comparisonResult.vehicleTransportAnalysis && (
                <section className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-5">
                  <h2 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
                    <Car className="w-5 h-5" />
                    Analyse du transport de véhicules
                  </h2>
                  {comparisonResult.vehicleTransportAnalysis.recommendations.length > 0 && (
                    <div className="mb-4 space-y-2">
                      {comparisonResult.vehicleTransportAnalysis.recommendations.map((rec, idx) => (
                        <div key={idx} className="bg-orange-500/10 border border-orange-500/30 rounded p-3">
                          <p className="text-sm text-orange-200">{rec}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {comparisonResult.vehicleTransportAnalysis.operators.map((op) => (
                      <div key={op.operator} className="bg-slate-800/50 rounded-lg p-3">
                        <h3 className="text-sm font-semibold text-gray-200 mb-2">{op.operator}</h3>
                        <p className="text-xs text-gray-400 mb-2">
                          Disponibilité:{' '}
                          <span className={`font-semibold ${
                            op.availability === 'high' ? 'text-green-400' :
                            op.availability === 'medium' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {op.availability === 'high' ? 'Élevée' : op.availability === 'medium' ? 'Moyenne' : 'Faible'}
                          </span>
                        </p>
                        <div className="space-y-1">
                          {op.pricing.map((p) => (
                            <div key={p.vehicleType} className="text-xs">
                              <span className="text-gray-400 capitalize">{p.vehicleType}:</span>{' '}
                              <span className="font-semibold text-gray-200">{formatPrice(p.price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Disclaimer */}
              <section className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-blue-300 mb-1">
                      Méthodologie & Transparence
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {comparisonResult.metadata.disclaimer}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Basé sur {comparisonResult.aggregation.totalObservations} observations —{' '}
                      Dernière mise à jour : {formatDate(comparisonResult.aggregation.lastUpdate)}
                    </p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-8 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">
                Aucune donnée disponible pour cette route. Veuillez sélectionner une autre combinaison.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BoatComparator;
