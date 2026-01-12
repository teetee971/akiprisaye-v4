import React, { useState } from 'react';
import { ReceiptLine } from '../../types/receiptLine';

type ReceiptLineReviewProps = {
  lines: ReceiptLine[];
  onConfirm: (validatedLines: ReceiptLine[]) => void;
  onCancel: () => void;
};

/**
 * Module I - Visual pre-validation of OCR lines
 * 
 * Allows users to review and validate OCR results before processing
 * Provides full transparency and manual correction capability
 */
export const ReceiptLineReview: React.FC<ReceiptLineReviewProps> = ({
  lines: initialLines,
  onConfirm,
  onCancel,
}) => {
  const [lines, setLines] = useState<ReceiptLine[]>(initialLines);

  const toggleLine = (id: string) => {
    setLines((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, enabled: !line.enabled } : line
      )
    );
  };

  const updateLineRaw = (id: string, value: string) => {
    setLines((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, raw: value } : line
      )
    );
  };

  const updateLinePrice = (id: string, value: string) => {
    const price = value ? parseFloat(value) : undefined;
    setLines((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, price: !isNaN(price!) ? price : undefined } : line
      )
    );
  };

  const updateLineQuantity = (id: string, value: string) => {
    const quantity = value ? parseInt(value, 10) : undefined;
    setLines((prev) =>
      prev.map((line) =>
        line.id === id ? { ...line, quantity: !isNaN(quantity!) ? quantity : undefined } : line
      )
    );
  };

  const handleConfirm = () => {
    const validatedLines = lines.filter((line) => line.enabled);
    onConfirm(validatedLines);
  };

  const enabledCount = lines.filter((line) => line.enabled).length;
  const totalCount = lines.length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Pré-validation des lignes détectées
        </h2>
        <p className="text-sm text-gray-600">
          Vérifiez et corrigez les lignes détectées par l'OCR avant validation finale
        </p>
      </div>

      {/* Information banner */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm text-blue-900">
          <strong>ℹ️ Transparence totale :</strong>
          <br />
          Vous voyez exactement ce que le système a compris.
          <br />
          Corrigez, désactivez ou validez chaque ligne avant analyse.
          <br />
          Cela garantit la qualité des données territoriales et anomalies.
        </p>
      </div>

      {/* Summary */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Lignes validées :</strong> {enabledCount} / {totalCount}
        </p>
      </div>

      {/* Lines list */}
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {lines.map((line, index) => (
          <div
            key={line.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              line.enabled
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-200 bg-gray-50 opacity-60'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Enable/disable checkbox */}
              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  checked={line.enabled}
                  onChange={() => toggleLine(line.id)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  title={line.enabled ? 'Désactiver cette ligne' : 'Activer cette ligne'}
                />
              </div>

              <div className="flex-1 space-y-2">
                {/* Line number */}
                <div className="text-xs text-gray-500 font-medium">
                  Ligne {index + 1}
                </div>

                {/* Raw text input */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Texte brut OCR :
                  </label>
                  <input
                    type="text"
                    value={line.raw}
                    onChange={(e) => updateLineRaw(line.id, e.target.value)}
                    disabled={!line.enabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="Texte détecté"
                  />
                </div>

                {/* Price and quantity inputs */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Prix (€) :
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={line.price !== undefined ? line.price : ''}
                      onChange={(e) => updateLinePrice(line.id, e.target.value)}
                      disabled={!line.enabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Quantité :
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={line.quantity !== undefined ? line.quantity : ''}
                      onChange={(e) => updateLineQuantity(line.id, e.target.value)}
                      disabled={!line.enabled}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Extracted label preview */}
                {line.label && (
                  <div className="text-xs text-gray-600">
                    <strong>Libellé détecté :</strong> {line.label}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Warning if no lines enabled */}
      {enabledCount === 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <p className="text-sm text-yellow-900">
            <strong>⚠️ Attention :</strong> Aucune ligne n'est activée.
            <br />
            Activez au moins une ligne pour continuer.
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          ← Retour
        </button>
        <button
          onClick={handleConfirm}
          disabled={enabledCount === 0}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ✓ Valider les lignes ({enabledCount})
        </button>
      </div>

      {/* Help text */}
      <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p>
          <strong>💡 Aide :</strong>
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Décochez les lignes qui ne sont pas des produits (en-tête, pied de ticket, etc.)</li>
          <li>Corrigez les textes mal reconnus directement dans le champ</li>
          <li>Vérifiez et ajustez les prix et quantités détectés</li>
          <li>Les lignes validées seront envoyées pour analyse territoriale et détection d'anomalies</li>
        </ul>
      </div>
    </div>
  );
};
