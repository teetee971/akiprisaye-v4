import React, { useState } from 'react';
import { Smartphone, Info } from 'lucide-react';
import {
  searchMobilePlanPrices,
  getTerritories,
  getOfferTypes,
  type MobilePlanPrice,
} from '../../services/mobilePlanPriceService';

/**
 * Module de comparaison des prix des abonnements mobiles
 * 
 * UX Mobile-first (Samsung S24+ prioritaire)
 * Page unique, lisible à une main
 * Aucun pop-up, aucun scroll horizontal
 */
export default function AbonnementsMobile() {
  const [territoire, setTerritoire] = useState('');
  const [typeOffre, setTypeOffre] = useState('');
  const [results, setResults] = useState<MobilePlanPrice[]>([]);
  const [showResults, setShowResults] = useState(false);

  const territories = getTerritories();
  const offerTypes = getOfferTypes();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (territoire) {
      const searchResults = searchMobilePlanPrices({
        territoire,
        typeOffre: typeOffre || undefined,
      });
      setResults(searchResults);
      setShowResults(true);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="w-6 h-6 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100">
              Prix des abonnements mobiles
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            Module en préparation - Données simulées
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Search Form */}
          <section className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-5">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Territoire */}
              <div>
                <label htmlFor="territoire" className="block text-sm font-medium text-gray-300 mb-2">
                  Territoire
                </label>
                <select
                  id="territoire"
                  value={territoire}
                  onChange={(e) => setTerritoire(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionner un territoire</option>
                  {territories.map((terr) => (
                    <option key={terr} value={terr}>
                      {terr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type d'offre */}
              <div>
                <label htmlFor="typeOffre" className="block text-sm font-medium text-gray-300 mb-2">
                  Type d'offre (optionnel)
                </label>
                <select
                  id="typeOffre"
                  value={typeOffre}
                  onChange={(e) => setTypeOffre(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tous les types</option>
                  {offerTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Comparer les prix
              </button>
            </form>
          </section>

          {/* Results */}
          {showResults && (
            <>
              {results.length > 0 ? (
                <>
                  {/* Results Table */}
                  <section className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-5">
                    <h2 className="text-lg font-semibold text-gray-100 mb-4">
                      Résultats ({results.length})
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-2 text-gray-400 font-medium">
                              Opérateur
                            </th>
                            <th className="text-left py-3 px-2 text-gray-400 font-medium">
                              Prix mensuel
                            </th>
                            <th className="text-left py-3 px-2 text-gray-400 font-medium">
                              Données
                            </th>
                            <th className="text-left py-3 px-2 text-gray-400 font-medium">
                              Appels/SMS
                            </th>
                            <th className="text-left py-3 px-2 text-gray-400 font-medium">
                              Relevé le
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((plan, index) => (
                            <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30">
                              <td className="py-3 px-2">
                                <div className="text-gray-200 font-medium">{plan.operateur}</div>
                                <div className="text-xs text-gray-500">{plan.typeOffre}</div>
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-bold text-blue-400">
                                    {formatPrice(plan.prixMensuel)}
                                  </span>
                                  {index === 0 && (
                                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-full">
                                      Le moins cher
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500">/mois</div>
                              </td>
                              <td className="py-3 px-2 text-gray-300 font-medium">
                                {plan.donnees}
                              </td>
                              <td className="py-3 px-2 text-gray-300">
                                {plan.appelsSMS}
                              </td>
                              <td className="py-3 px-2 text-gray-400 text-xs">
                                {formatDate(plan.dateReleve)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Badge "Prix observé" */}
                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-xs text-blue-200">
                        <strong>Prix observé</strong> — Ce ne sont PAS des prix garantis. Les tarifs peuvent varier selon promotions et conditions.
                      </p>
                    </div>
                  </section>

                  {/* Price Comparison Summary */}
                  {results.length > 1 && (
                    <section className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-5">
                      <h2 className="text-lg font-semibold text-gray-100 mb-4">
                        Écarts de prix observés
                      </h2>
                      
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Prix le plus bas</p>
                          <p className="text-2xl font-bold text-green-400">
                            {formatPrice(results[0].prixMensuel)}
                          </p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Prix le plus élevé</p>
                          <p className="text-2xl font-bold text-red-400">
                            {formatPrice(results[results.length - 1].prixMensuel)}
                          </p>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-1">Écart maximum</p>
                          <p className="text-2xl font-bold text-orange-400">
                            {formatPrice(results[results.length - 1].prixMensuel - results[0].prixMensuel)}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-gray-400">
                        Économie potentielle en choisissant l'offre la moins chère
                      </p>
                    </section>
                  )}
                </>
              ) : (
                <div className="bg-slate-900/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-8 text-center">
                  <p className="text-gray-400">
                    Aucun résultat pour cette recherche. Essayez un autre territoire.
                  </p>
                </div>
              )}
            </>
          )}

          {/* Transparency / Methodology Block (OBLIGATOIRE) */}
          <section className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-blue-300">
                  Méthodologie & Transparence
                </h3>
                
                <div className="space-y-2 text-xs text-gray-300">
                  <p>
                    <strong>Sources</strong> — Les prix affichés proviennent d'observations citoyennes publiques et de données publiques des opérateurs. Aucune garantie de disponibilité ou d'exactitude.
                  </p>
                  
                  <p>
                    <strong>Méthode de comparaison</strong> — Les forfaits sont triés par prix mensuel croissant, puis par date de relevé. Seuls les forfaits observés récemment sont affichés.
                  </p>
                  
                  <p>
                    <strong>Limites</strong> — Les prix affichés ne tiennent pas compte des promotions temporaires, des frais d'activation, ni des conditions spécifiques (engagement, frais de résiliation, options payantes).
                  </p>
                  
                  <p>
                    <strong>Aucune affiliation</strong> — A KI PRI SA YÉ ne reçoit aucune commission des opérateurs mobiles. Comparaison neutre et indépendante.
                  </p>
                  
                  <p>
                    <strong>Données indicatives</strong> — Cet outil est destiné à l'information et à la comparaison. Il ne remplace pas une consultation des offres officielles auprès des opérateurs.
                  </p>
                  
                  <p>
                    <strong>Aucun tracking</strong> — Aucune donnée utilisateur n'est collectée. Votre recherche reste privée.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
