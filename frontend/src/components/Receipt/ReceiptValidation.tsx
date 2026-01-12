import React, { useState } from 'react';
import type { ReceiptProduct, ReceiptData, ObservationSourceType } from './types';
import { getSourceTypeLabel, getSourceTypeDescription } from './types';

type ReceiptValidationProps = {
  extractedText: string;
  imageData: string;
  territory: string;
  onValidate: (receiptData: ReceiptData) => void;
  onCancel: () => void;
};

export const ReceiptValidation: React.FC<ReceiptValidationProps> = ({
  extractedText,
  imageData,
  territory,
  onValidate,
  onCancel,
}) => {
  const [sourceType, setSourceType] = useState<ObservationSourceType>('ticket_caisse');
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [purchaseTime, setPurchaseTime] = useState('');
  const [products, setProducts] = useState<ReceiptProduct[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Partial<ReceiptProduct>>({
    libelle_ticket: '',
    prix: 0,
    quantite: 1,
    ean: null,
    confiance: 'manuel',
  });

  const addProduct = () => {
    if (currentProduct.libelle_ticket && currentProduct.prix) {
      setProducts([
        ...products,
        {
          libelle_ticket: currentProduct.libelle_ticket,
          prix: currentProduct.prix,
          quantite: currentProduct.quantite || 1,
          ean: currentProduct.ean || null,
          confiance: 'manuel',
        },
      ]);
      setCurrentProduct({
        libelle_ticket: '',
        prix: 0,
        quantite: 1,
        ean: null,
        confiance: 'manuel',
      });
    }
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleValidate = () => {
    if (!storeName || !storeAddress || !purchaseDate || products.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires et ajouter au moins un produit.');
      return;
    }

    const receiptData: ReceiptData = {
      type: sourceType,
      territoire: territory,
      enseigne: storeName.split(' ')[0], // Extract store brand
      magasin: {
        nom: storeName,
        adresse: storeAddress,
      },
      date_achat: purchaseDate,
      heure_achat: purchaseTime || '00:00',
      produits: products,
      preuve: {
        image: imageData,
        ocr_local: true,
      },
      auteur: 'citoyen_anonyme',
      niveau_confiance_global: products.length >= 3 ? 'élevé' : 'moyen',
      statut: 'valide',
      source_metadata: sourceType === 'presentoir_promo' ? {
        is_promotional: true,
      } : undefined,
    };

    onValidate(receiptData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ✍️ Validation manuelle du ticket
        </h2>
        <p className="text-sm text-gray-600">
          Vérifiez et complétez les informations extraites
        </p>
      </div>

      {/* Warning */}
      <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <p className="text-sm text-yellow-900">
          <strong>⚠️ Attention :</strong>
          <br />
          Chaque information doit être validée manuellement.
          <br />
          Aucune donnée n'est utilisée sans votre confirmation explicite.
        </p>
      </div>

      {/* Source Type Selection */}
      <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-gray-900 mb-3">📷 Type d'observation</h3>
        <div className="space-y-2">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="sourceType"
              value="ticket_caisse"
              checked={sourceType === 'ticket_caisse'}
              onChange={(e) => setSourceType(e.target.value as ObservationSourceType)}
              className="mt-1"
            />
            <div>
              <div className="font-medium text-gray-900">{getSourceTypeLabel('ticket_caisse')}</div>
              <div className="text-sm text-gray-600">{getSourceTypeDescription('ticket_caisse')}</div>
            </div>
          </label>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="sourceType"
              value="etiquette_rayon"
              checked={sourceType === 'etiquette_rayon'}
              onChange={(e) => setSourceType(e.target.value as ObservationSourceType)}
              className="mt-1"
            />
            <div>
              <div className="font-medium text-gray-900">{getSourceTypeLabel('etiquette_rayon')}</div>
              <div className="text-sm text-gray-600">{getSourceTypeDescription('etiquette_rayon')}</div>
            </div>
          </label>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="radio"
              name="sourceType"
              value="presentoir_promo"
              checked={sourceType === 'presentoir_promo'}
              onChange={(e) => setSourceType(e.target.value as ObservationSourceType)}
              className="mt-1"
            />
            <div>
              <div className="font-medium text-gray-900">{getSourceTypeLabel('presentoir_promo')}</div>
              <div className="text-sm text-gray-600">{getSourceTypeDescription('presentoir_promo')}</div>
            </div>
          </label>
        </div>
        {sourceType === 'presentoir_promo' && (
          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded">
            <p className="text-sm text-orange-900">
              ⚠️ <strong>Prix promotionnel :</strong> Cette observation sera marquée comme offre temporaire et stockée séparément.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: Form */}
        <div className="space-y-6">
          {/* Store Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">🏪 Informations magasin</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du magasin *
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Leader Price Fort-de-France"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse *
                </label>
                <input
                  type="text"
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: Rue Victor Hugo, Fort-de-France"
                />
              </div>
            </div>
          </div>

          {/* Purchase Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">📅 Date et heure</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'achat *
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure (optionnel)
                </label>
                <input
                  type="time"
                  value={purchaseTime}
                  onChange={(e) => setPurchaseTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Add Product */}
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-4">➕ Ajouter un produit</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={currentProduct.libelle_ticket}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, libelle_ticket: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: RIZ BLANC 1KG"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentProduct.prix || ''}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, prix: parseFloat(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1.29"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={currentProduct.quantite || 1}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, quantite: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button
                onClick={addProduct}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                ➕ Ajouter ce produit
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Preview and extracted text */}
        <div className="space-y-6">
          {/* Image preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">📸 Ticket original</h3>
            <img
              src={imageData}
              alt="Ticket scanné"
              className="w-full rounded border border-gray-300"
            />
          </div>

          {/* Extracted text */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">🔍 Texte extrait (OCR)</h3>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono bg-white p-3 rounded border border-gray-300 max-h-48 overflow-y-auto">
              {extractedText}
            </pre>
          </div>
        </div>
      </div>

      {/* Products list */}
      {products.length > 0 && (
        <div className="mt-6 bg-green-50 p-4 rounded-lg border-2 border-green-200">
          <h3 className="font-semibold text-gray-900 mb-4">
            ✅ Produits ajoutés ({products.length})
          </h3>
          <div className="space-y-2">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white p-3 rounded border border-gray-300"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{product.libelle_ticket}</p>
                  <p className="text-sm text-gray-600">
                    {product.prix.toFixed(2)} € × {product.quantite} ={' '}
                    {(product.prix * product.quantite).toFixed(2)} €
                  </p>
                </div>
                <button
                  onClick={() => removeProduct(index)}
                  className="ml-4 text-red-600 hover:text-red-800 font-medium"
                >
                  🗑️ Supprimer
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t-2 border-green-300">
            <p className="text-lg font-bold text-gray-900">
              Total : {products.reduce((sum, p) => sum + p.prix * p.quantite, 0).toFixed(2)} €
            </p>
          </div>
        </div>
      )}

      {/* Quality badge */}
      {products.length > 0 && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="text-sm text-gray-700">
            <strong>Niveau de confiance :</strong>{' '}
            <span
              className={`font-semibold ${
                products.length >= 3 ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              {products.length >= 3 ? '🟢 Élevé' : '🟡 Moyen'} ({products.length}{' '}
              {products.length > 1 ? 'produits' : 'produit'})
            </span>
          </p>
          {products.length < 3 && (
            <p className="text-xs text-gray-600 mt-1">
              (≥ 3 produits recommandés pour une observation exploitable)
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleValidate}
          disabled={!storeName || !storeAddress || !purchaseDate || products.length === 0}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ✅ Valider le ticket
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          ❌ Annuler
        </button>
      </div>

      {/* Legal disclaimer */}
      <div className="mt-6 p-4 bg-gray-50 rounded text-xs text-gray-600">
        <p>
          <strong>📋 Rappel :</strong>
          <br />
          Ces données sont enregistrées localement comme observation citoyenne.
          <br />
          Elles ne sont PAS publiées automatiquement.
          <br />
          Aucune génération ou estimation de prix n'est effectuée.
        </p>
      </div>
    </div>
  );
};
