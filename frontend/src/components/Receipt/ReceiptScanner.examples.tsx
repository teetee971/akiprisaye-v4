import React from 'react';
import { ReceiptWorkflow, type ReceiptData } from './index';

/**
 * EXEMPLE 1: Utilisation basique
 * Scanner un ticket et l'enregistrer dans localStorage
 */
export function Example1_BasicUsage() {
  const handleSubmit = (receiptData: ReceiptData) => {
    // Enregistrer dans localStorage
    const observations = JSON.parse(localStorage.getItem('receipt_observations') || '[]');
    observations.push(receiptData);
    localStorage.setItem('receipt_observations', JSON.stringify(observations));

    console.log('✅ Observation enregistrée:', receiptData);
    alert('Ticket enregistré avec succès!');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Scanner un ticket - Exemple basique</h1>
      <ReceiptWorkflow territory="Martinique" onSubmit={handleSubmit} />
    </div>
  );
}

/**
 * EXEMPLE 2: Multi-territoires
 * Permettre la sélection du territoire avant le scan
 */
export function Example2_MultiTerritory() {
  const [selectedTerritory, setSelectedTerritory] = React.useState('Guadeloupe');
  const [submittedReceipts, setSubmittedReceipts] = React.useState<ReceiptData[]>([]);

  const territories = [
    'Guadeloupe',
    'Martinique',
    'Guyane',
    'Réunion',
    'Mayotte',
    'Saint-Martin',
    'Saint-Barthélemy',
  ];

  const handleSubmit = (receiptData: ReceiptData) => {
    setSubmittedReceipts((prev) => [...prev, receiptData]);
    console.log('Observation pour', receiptData.territoire);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Scanner un ticket - Multi-territoires</h1>

      {/* Territory selector */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <label className="block mb-2 font-medium text-gray-700">
          📍 Sélectionner le territoire:
        </label>
        <select
          value={selectedTerritory}
          onChange={(e) => setSelectedTerritory(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          {territories.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Workflow */}
      <ReceiptWorkflow territory={selectedTerritory} onSubmit={handleSubmit} />

      {/* Statistics */}
      {submittedReceipts.length > 0 && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">
            📊 Statistiques de session
          </h3>
          <p className="text-sm text-green-800">
            {submittedReceipts.length} ticket(s) scanné(s)
          </p>
          <p className="text-sm text-green-800">
            {submittedReceipts.reduce((sum, r) => sum + r.produits.length, 0)} produit(s) au
            total
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * EXEMPLE 3: Avec statistiques en temps réel
 * Afficher des statistiques sur les observations collectées
 */
export function Example3_WithStatistics() {
  const [observations, setObservations] = React.useState<ReceiptData[]>([]);

  const handleSubmit = (receiptData: ReceiptData) => {
    setObservations((prev) => [...prev, receiptData]);

    // Sauvegarder dans localStorage
    localStorage.setItem('receipt_observations', JSON.stringify([...observations, receiptData]));
  };

  // Calculer statistiques
  const stats = React.useMemo(() => {
    const totalProducts = observations.reduce((sum, obs) => sum + obs.produits.length, 0);
    const uniqueStores = new Set(observations.map((obs) => obs.magasin.nom)).size;
    const highConfidence = observations.filter(
      (obs) => obs.niveau_confiance_global === 'élevé'
    ).length;

    return {
      totalReceipts: observations.length,
      totalProducts,
      uniqueStores,
      highConfidence,
      confidenceRate:
        observations.length > 0
          ? Math.round((highConfidence / observations.length) * 100)
          : 0,
    };
  }, [observations]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Scanner un ticket - Avec statistiques</h1>

      {/* Statistics dashboard */}
      {observations.length > 0 && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-blue-900">{stats.totalReceipts}</p>
            <p className="text-sm text-blue-700">Tickets scannés</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-green-900">{stats.totalProducts}</p>
            <p className="text-sm text-green-700">Produits observés</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-purple-900">{stats.uniqueStores}</p>
            <p className="text-sm text-purple-700">Magasins différents</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-2xl font-bold text-orange-900">{stats.confidenceRate}%</p>
            <p className="text-sm text-orange-700">Confiance élevée</p>
          </div>
        </div>
      )}

      <ReceiptWorkflow territory="Martinique" onSubmit={handleSubmit} />
    </div>
  );
}

/**
 * EXEMPLE 4: Avec historique des observations
 * Afficher l'historique complet avec possibilité d'export
 */
export function Example4_WithHistory() {
  const [observations, setObservations] = React.useState<ReceiptData[]>(() => {
    const saved = localStorage.getItem('receipt_observations');
    return saved ? JSON.parse(saved) : [];
  });

  const handleSubmit = (receiptData: ReceiptData) => {
    const updated = [...observations, receiptData];
    setObservations(updated);
    localStorage.setItem('receipt_observations', JSON.stringify(updated));
  };

  const exportJSON = () => {
    const dataStr = JSON.stringify(observations, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `observations-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const clearHistory = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
      setObservations([]);
      localStorage.removeItem('receipt_observations');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Scanner un ticket - Avec historique</h1>

      <ReceiptWorkflow territory="Martinique" onSubmit={handleSubmit} />

      {/* History section */}
      {observations.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              📋 Historique ({observations.length})
            </h2>
            <div className="flex gap-2">
              <button
                onClick={exportJSON}
                className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                💾 Exporter JSON
              </button>
              <button
                onClick={clearHistory}
                className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
              >
                🗑️ Effacer tout
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {observations.map((obs, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{obs.magasin.nom}</p>
                    <p className="text-sm text-gray-600">{obs.date_achat}</p>
                    <p className="text-sm text-gray-600">
                      {obs.produits.length} produit(s) - Confiance:{' '}
                      <span
                        className={
                          obs.niveau_confiance_global === 'élevé'
                            ? 'text-green-600 font-semibold'
                            : 'text-yellow-600 font-semibold'
                        }
                      >
                        {obs.niveau_confiance_global}
                      </span>
                    </p>
                  </div>
                  <span className="text-gray-400 text-xs">#{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * EXEMPLE 5: Intégration avec Anti-Crisis Basket
 * Montrer la compatibilité avec le module Anti-Crisis
 */
export function Example5_AntiCrisisIntegration() {
  const [observations, setObservations] = React.useState<ReceiptData[]>([]);

  const handleSubmit = (receiptData: ReceiptData) => {
    setObservations((prev) => [...prev, receiptData]);
  };

  // Grouper par produit et calculer si exploitable (≥3 observations)
  const productStats = React.useMemo(() => {
    const stats = new Map<string, { count: number; avgPrice: number; stores: Set<string> }>();

    observations.forEach((obs) => {
      obs.produits.forEach((product) => {
        const key = product.libelle_ticket.toUpperCase();
        const current = stats.get(key) || { count: 0, avgPrice: 0, stores: new Set() };
        current.count++;
        current.avgPrice =
          (current.avgPrice * (current.count - 1) + product.prix) / current.count;
        current.stores.add(obs.magasin.nom);
        stats.set(key, current);
      });
    });

    return Array.from(stats.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      avgPrice: data.avgPrice,
      storeCount: data.stores.size,
      exploitable: data.count >= 3,
    }));
  }, [observations]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Scanner un ticket - Intégration Anti-Crisis
      </h1>

      <ReceiptWorkflow territory="Martinique" onSubmit={handleSubmit} />

      {/* Product analysis for Anti-Crisis */}
      {productStats.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🛒 Analyse pour Panier Anti-Crise
          </h2>

          <div className="space-y-3">
            {productStats.map((product, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  product.exploitable
                    ? 'bg-green-50 border-green-300'
                    : 'bg-yellow-50 border-yellow-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <div className="flex gap-4 mt-1 text-sm text-gray-600">
                      <span>📊 {product.count} observation(s)</span>
                      <span>🏪 {product.storeCount} magasin(s)</span>
                      <span>💰 Moy: {product.avgPrice.toFixed(2)} €</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {product.exploitable ? (
                      <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-semibold">
                        ✅ Exploitable
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-full font-semibold">
                        🟡 {3 - product.count} obs. nécessaire(s)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {productStats.filter((p) => p.exploitable).length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded border-l-4 border-blue-500">
              <p className="text-sm text-blue-900">
                <strong>ℹ️ Information:</strong>
                <br />
                {productStats.filter((p) => p.exploitable).length} produit(s) exploitable(s) pour
                le module Anti-Crise (≥3 observations)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * EXEMPLE 6: Mode démo avec données de test
 * Pour tester l'interface sans scanner de vrais tickets
 */
export function Example6_DemoMode() {
  const [demoData] = React.useState<ReceiptData>({
    type: 'ticket_caisse',
    territoire: 'Martinique',
    enseigne: 'Leader Price',
    magasin: {
      nom: 'Leader Price Fort-de-France',
      adresse: 'Rue Victor Hugo, Fort-de-France',
    },
    date_achat: '2026-01-12',
    heure_achat: '14:32',
    produits: [
      {
        libelle_ticket: 'RIZ BLANC 1KG',
        prix: 1.29,
        quantite: 1,
        ean: null,
        confiance: 'manuel',
      },
      {
        libelle_ticket: 'HUILE TOURNESOL 1L',
        prix: 2.49,
        quantite: 1,
        ean: null,
        confiance: 'manuel',
      },
      {
        libelle_ticket: 'FARINE T55 1KG',
        prix: 0.99,
        quantite: 2,
        ean: null,
        confiance: 'manuel',
      },
    ],
    preuve: {
      image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg...',
      ocr_local: true,
    },
    auteur: 'citoyen_demo',
    niveau_confiance_global: 'élevé',
    statut: 'valide',
  });

  const handleSubmit = (receiptData: ReceiptData) => {
    console.log('Mode démo - Données:', receiptData);
    alert('Mode démo: données enregistrées uniquement en console');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Scanner un ticket - Mode démo</h1>

      {/* Demo data preview */}
      <div className="mb-6 bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
        <h3 className="font-semibold text-purple-900 mb-3">🎭 Données de démonstration</h3>
        <pre className="text-xs text-purple-800 bg-white p-3 rounded overflow-x-auto">
          {JSON.stringify(demoData, null, 2)}
        </pre>
      </div>

      <ReceiptWorkflow territory="Martinique" onSubmit={handleSubmit} />
    </div>
  );
}
