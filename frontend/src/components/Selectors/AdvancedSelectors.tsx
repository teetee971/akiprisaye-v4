import React, { useState, useEffect } from 'react';

/**
 * Type definitions for dataset structure
 */
export type Product = {
  id: string;
  label: string;
  observations: number;
  price_min: number;
  price_max: number;
};

export type Store = {
  id: string;
  label: string;
  products: Product[];
};

export type Territory = {
  code: string;
  label: string;
  stores: Store[];
};

export type Dataset = {
  version: string;
  last_update: string;
  currency: string;
  territories: Territory[];
};

export type Selection = {
  territory?: string;
  store?: string;
  product?: string;
};

/**
 * Props for AdvancedSelectors component
 */
export type AdvancedSelectorsProps = {
  dataset: Dataset;
  onSelectionChange: (selection: Selection) => void;
  initialSelection?: Selection;
};

/**
 * AdvancedSelectors Component
 * Cascading Territory → Store → Product selection
 * Legally-safe, descriptive display only, no comparisons
 * 
 * @param {AdvancedSelectorsProps} props - Component properties
 */
const AdvancedSelectors: React.FC<AdvancedSelectorsProps> = ({
  dataset,
  onSelectionChange,
  initialSelection = {},
}) => {
  const [selectedTerritory, setSelectedTerritory] = useState<string | undefined>(
    initialSelection.territory
  );
  const [selectedStore, setSelectedStore] = useState<string | undefined>(
    initialSelection.store
  );
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>(
    initialSelection.product
  );

  // Get current territory object
  const currentTerritory = dataset.territories.find(
    (t) => t.code === selectedTerritory
  );

  // Get filtered stores for selected territory
  const availableStores = currentTerritory?.stores || [];

  // Get current store object
  const currentStore = availableStores.find((s) => s.id === selectedStore);

  // Get filtered products for selected store
  const availableProducts = currentStore?.products || [];

  // Notify parent of selection changes
  useEffect(() => {
    onSelectionChange({
      territory: selectedTerritory,
      store: selectedStore,
      product: selectedProduct,
    });
  }, [selectedTerritory, selectedStore, selectedProduct, onSelectionChange]);

  /**
   * Handle territory change
   * Resets store and product selections
   */
  const handleTerritoryChange = (territoryCode: string) => {
    setSelectedTerritory(territoryCode);
    setSelectedStore(undefined);
    setSelectedProduct(undefined);
  };

  /**
   * Handle store change
   * Resets product selection
   */
  const handleStoreChange = (storeId: string) => {
    setSelectedStore(storeId);
    setSelectedProduct(undefined);
  };

  /**
   * Handle product change
   */
  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
  };

  /**
   * Get selected product details
   */
  const getSelectedProductDetails = (): Product | null => {
    if (!selectedProduct || !currentStore) return null;
    return currentStore.products.find((p) => p.id === selectedProduct) || null;
  };

  const selectedProductDetails = getSelectedProductDetails();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔍 Sélection avancée
        </h2>
        <p className="text-sm text-gray-600">
          Exploration descriptive des données observées par territoire, enseigne et produit
        </p>
      </div>

      {/* Selectors Container */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* 1. Territory Selector - Always Active */}
          <div>
            <label
              htmlFor="territory-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              1️⃣ Territoire *
            </label>
            <select
              id="territory-select"
              value={selectedTerritory || ''}
              onChange={(e) => handleTerritoryChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
            >
              <option value="">-- Sélectionner un territoire --</option>
              {dataset.territories.map((territory) => (
                <option key={territory.code} value={territory.code}>
                  {territory.label}
                </option>
              ))}
            </select>
            {selectedTerritory && currentTerritory && (
              <p className="mt-2 text-xs text-gray-600">
                {currentTerritory.stores.length} enseigne(s) observée(s) dans ce territoire
              </p>
            )}
          </div>

          {/* 2. Store Selector - Enabled only when territory selected */}
          <div>
            <label
              htmlFor="store-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              2️⃣ Enseigne {!selectedTerritory && '(sélectionner d\'abord un territoire)'}
            </label>
            <select
              id="store-select"
              value={selectedStore || ''}
              onChange={(e) => handleStoreChange(e.target.value)}
              disabled={!selectedTerritory}
              className={`w-full px-4 py-3 border rounded-lg text-base ${
                !selectedTerritory
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              }`}
            >
              <option value="">-- Sélectionner une enseigne --</option>
              {availableStores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.label}
                </option>
              ))}
            </select>
            {selectedTerritory && !selectedStore && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-900">
                  <strong>Note :</strong> Enseignes observées dans ce territoire, sans ordre particulier.
                </p>
              </div>
            )}
            {selectedStore && currentStore && (
              <p className="mt-2 text-xs text-gray-600">
                {currentStore.products.length} produit(s) observé(s) dans cette enseigne
              </p>
            )}
          </div>

          {/* 3. Product Selector - Enabled only when store selected */}
          <div>
            <label
              htmlFor="product-select"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              3️⃣ Produit individuel {!selectedStore && '(sélectionner d\'abord une enseigne)'}
            </label>
            <select
              id="product-select"
              value={selectedProduct || ''}
              onChange={(e) => handleProductChange(e.target.value)}
              disabled={!selectedStore}
              className={`w-full px-4 py-3 border rounded-lg text-base ${
                !selectedStore
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              }`}
            >
              <option value="">-- Sélectionner un produit --</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.label} ({product.observations} observations)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Product Details Display - Only when product selected */}
      {selectedProductDetails && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📊 Données descriptives
          </h3>

          <div className="space-y-4">
            {/* Product Name */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 uppercase mb-1">Produit</p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedProductDetails.label}
              </p>
            </div>

            {/* Territory and Store */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-blue-700 uppercase mb-1">Territoire</p>
                <p className="text-base font-semibold text-blue-900">
                  {currentTerritory?.label}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-green-700 uppercase mb-1">Enseigne</p>
                <p className="text-base font-semibold text-green-900">
                  {currentStore?.label}
                </p>
              </div>
            </div>

            {/* Observations */}
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-xs text-purple-700 uppercase mb-1">Nombre d'observations</p>
              <p className="text-2xl font-bold text-purple-900">
                {selectedProductDetails.observations}
              </p>
            </div>

            {/* Price Range */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 uppercase mb-2">
                Intervalle de prix observé
              </p>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <p className="text-xs text-gray-600 mb-1">Minimum</p>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedProductDetails.price_min.toFixed(2)} {dataset.currency}
                  </p>
                </div>
                <div className="text-gray-400 text-2xl px-4">—</div>
                <div className="text-center flex-1">
                  <p className="text-xs text-gray-600 mb-1">Maximum</p>
                  <p className="text-xl font-bold text-gray-900">
                    {selectedProductDetails.price_max.toFixed(2)} {dataset.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contextual Note */}
          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <strong>Note :</strong> Ces valeurs représentent l'intervalle des prix observés
              pour ce produit dans cette enseigne et ce territoire. Elles ne constituent pas
              une garantie de prix actuels ni une comparaison avec d'autres enseignes.
            </p>
          </div>
        </div>
      )}

      {/* Legal Disclaimer - Always Visible */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 text-2xl">⚖️</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-yellow-900 mb-2">
              Avertissement légal
            </p>
            <p className="text-sm text-yellow-800">
              Les sélections permettent une <strong>consultation descriptive</strong> des données
              observées. Aucune comparaison, classement ou interprétation causale n'est effectuée
              entre enseignes. Les intervalles de prix affichés sont basés sur des observations
              citoyennes ponctuelles et ne reflètent pas nécessairement l'intégralité des prix
              pratiqués.
            </p>
          </div>
        </div>
      </div>

      {/* Usage Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-700 text-center">
          <strong>Principe de sélection :</strong> L'ordre descendant (Territoire → Enseigne →
          Produit) garantit une exploration cohérente des données sans biais de présentation.
        </p>
      </div>
    </div>
  );
};

export default AdvancedSelectors;
