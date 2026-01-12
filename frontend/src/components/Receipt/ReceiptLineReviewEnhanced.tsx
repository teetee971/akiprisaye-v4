import React, { useState, useEffect } from 'react';
import { ReceiptLine } from '../../types/receiptLine';
import { fuseSimilarLines, getFusionStats, isFusedLine } from './services/receiptLineFusion';
import { RecurringProductBadge, ProductHistoryInfo } from './RecurringProductBadge';
import { TicketQualityDisplay } from './TicketQualityDisplay';
import { computeTicketQuality } from './services/ticketQualityScore';
import { productFingerprint, recordProductSeen } from './services/productFingerprint';

type ReceiptLineReviewEnhancedProps = {
  lines: ReceiptLine[];
  onConfirm: (validatedLines: ReceiptLine[]) => void;
  onCancel: () => void;
  enableFusion?: boolean;
};

/**
 * Enhanced Receipt Line Review with Modules I, J, K, and L
 * 
 * Module I: Visual pre-validation of OCR lines
 * Module J: Similar line fusion for multi-photo receipts
 * Module K: Local recurring product recognition
 * Module L: Receipt quality score (informative)
 */
export const ReceiptLineReviewEnhanced: React.FC<ReceiptLineReviewEnhancedProps> = ({
  lines: initialLines,
  onConfirm,
  onCancel,
  enableFusion = true,
}) => {
  const [lines, setLines] = useState<ReceiptLine[]>(initialLines);
  const [fusionEnabled, setFusionEnabled] = useState(enableFusion);
  const [showQualityScore, setShowQualityScore] = useState(true);

  // Apply fusion when enabled
  useEffect(() => {
    if (fusionEnabled && enableFusion) {
      const fusedLines = fuseSimilarLines(initialLines);
      setLines(fusedLines);
    } else {
      setLines(initialLines);
    }
  }, [fusionEnabled, enableFusion, initialLines]);

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
    
    // Record products locally (Module K)
    validatedLines.forEach((line) => {
      if (line.label) {
        const fingerprint = productFingerprint(line.label);
        recordProductSeen(fingerprint);
      }
    });

    onConfirm(validatedLines);
  };

  const enabledCount = lines.filter((line) => line.enabled).length;
  const totalCount = lines.length;
  const fusionStats = getFusionStats(lines);

  // Calculate quality score (Module L)
  const qualityScore = computeTicketQuality({
    lines: enabledCount,
    pricedLines: lines.filter((l) => l.enabled && l.price !== undefined).length,
    hasDate: false, // Could be enhanced to detect date in lines
    hasStore: false, // Could be enhanced to detect store in lines
  });

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
          Modules actifs : Pré-validation (I), Fusion (J), Produits récurrents (K), Qualité (L)
        </p>
      </div>

      {/* Module J - Fusion controls */}
      {enableFusion && (
        <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-900">
                🔁 Module J - Fusion des lignes similaires
              </p>
              <p className="text-xs text-purple-700 mt-1">
                {fusionStats.totalFusions > 0
                  ? `${fusionStats.fusedLines} lignes fusionnées (${fusionStats.totalFusions} fusions)`
                  : 'Aucune fusion détectée'}
              </p>
            </div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={fusionEnabled}
                onChange={(e) => setFusionEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-purple-900">Activer la fusion</span>
            </label>
          </div>
        </div>
      )}

      {/* Module K - Product history info */}
      <div className="mb-4">
        <ProductHistoryInfo lines={lines.filter((l) => l.enabled)} />
      </div>

      {/* Module L - Quality score */}
      {showQualityScore && (
        <div className="mb-4">
          <TicketQualityDisplay qualityScore={qualityScore} showBreakdown={true} />
        </div>
      )}

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
            } ${isFusedLine(line) ? 'ring-2 ring-purple-200' : ''}`}
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
                {/* Line number and badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-xs text-gray-500 font-medium">Ligne {index + 1}</div>
                  {isFusedLine(line) && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded border border-purple-200">
                      🔁 Fusionnée
                    </span>
                  )}
                  {line.label && <RecurringProductBadge label={line.label} />}
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
          <li>Les lignes similaires sont automatiquement fusionnées (Module J)</li>
          <li>Les produits déjà observés sont marqués localement (Module K)</li>
          <li>Le score de qualité évalue la fiabilité des données, pas les prix (Module L)</li>
          <li>Corrigez les textes mal reconnus et vérifiez les prix/quantités</li>
        </ul>
      </div>
    </div>
  );
};
