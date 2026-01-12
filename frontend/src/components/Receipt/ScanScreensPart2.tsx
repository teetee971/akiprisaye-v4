/**
 * Scan Module UI Screens (Part 2)
 * Screens 4-7
 */

import React from 'react';
import { ReceiptLine } from '../../types/receiptLine';

/**
 * SCREEN 4 - Visual OCR Pre-Validation
 * 
 * Goal: Transparency, user control
 */
export const OCRPreValidationScreen: React.FC<{
  croppedImage: string;
  detectedZones: {
    products: Array<{ x: number; y: number; width: number; height: number }>;
    prices: Array<{ x: number; y: number; width: number; height: number }>;
    header: Array<{ x: number; y: number; width: number; height: number }>;
  };
  qualityScore: {
    overall: string; // "Bonne", "Moyenne", etc.
    complete: boolean;
    readable: boolean;
    warnings: string[];
  };
  onRetake: () => void;
  onContinue: () => void;
}> = ({ croppedImage, detectedZones, qualityScore, onRetake, onContinue }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">Vérification visuelle</h2>
        <p className="text-sm text-gray-600">Les zones détectées sont surlignées</p>
      </div>

      {/* Image with highlighted zones */}
      <div className="relative mb-6 bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={croppedImage}
          alt="Ticket recadré"
          className="w-full"
        />
        
        {/* Overlay zones (simplified representation) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {detectedZones.products.map((zone, index) => (
            <rect
              key={`product-${index}`}
              x={zone.x}
              y={zone.y}
              width={zone.width}
              height={zone.height}
              fill="rgba(16, 185, 129, 0.2)"
              stroke="rgba(16, 185, 129, 0.8)"
              strokeWidth="2"
            />
          ))}
          {detectedZones.prices.map((zone, index) => (
            <rect
              key={`price-${index}`}
              x={zone.x}
              y={zone.y}
              width={zone.width}
              height={zone.height}
              fill="rgba(59, 130, 246, 0.2)"
              stroke="rgba(59, 130, 246, 0.8)"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      {/* Quality info box */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="text-3xl">
            {qualityScore.overall === 'Bonne' ? '✔️' : 
             qualityScore.overall === 'Moyenne' ? 'ℹ️' : '⚠️'}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2">
              Qualité du scan : {qualityScore.overall}
            </h3>
            <ul className="space-y-1 text-sm">
              {qualityScore.complete && (
                <li className="text-green-700">✔ Ticket complet</li>
              )}
              {qualityScore.readable && (
                <li className="text-green-700">✔ Texte lisible</li>
              )}
              {qualityScore.warnings.map((warning, index) => (
                <li key={index} className="text-gray-600">ℹ️ {warning}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6 text-sm">
        <p className="font-medium text-blue-900 mb-2">Légende des zones :</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500/50 border-2 border-green-500"></div>
            <span className="text-gray-700">Lignes produits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500/50 border-2 border-blue-500"></div>
            <span className="text-gray-700">Prix</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500/50 border-2 border-yellow-500"></div>
            <span className="text-gray-700">Date / enseigne</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onRetake}
          className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center gap-2"
        >
          <span>🔄</span>
          <span>Reprendre la photo</span>
        </button>
        <button
          onClick={onContinue}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
        >
          <span>✅</span>
          <span>Continuer</span>
        </button>
      </div>
    </div>
  );
};

/**
 * SCREEN 5 - Structured OCR Results
 * 
 * Goal: Readability + confidence
 */
export const StructuredOCRResultsScreen: React.FC<{
  storeName: string;
  storeLocation?: string;
  lines: ReceiptLine[];
  overallReliability: 'Élevée' | 'Moyenne' | 'Limitée';
  onEditLine: (lineId: string) => void;
  onAddManually: () => void;
  onValidate: () => void;
}> = ({ storeName, storeLocation, lines, overallReliability, onEditLine, onAddManually, onValidate }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Résultat du scan</h2>
      </div>

      {/* Store section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🏪</div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{storeName}</h3>
            {storeLocation && (
              <p className="text-sm text-gray-600">{storeLocation}</p>
            )}
          </div>
        </div>
      </div>

      {/* Reliability indicator */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Fiabilité estimée :</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            overallReliability === 'Élevée' ? 'bg-green-100 text-green-800' :
            overallReliability === 'Moyenne' ? 'bg-yellow-100 text-yellow-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {overallReliability}
          </span>
        </div>
      </div>

      {/* Detected lines (scrollable) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">🧾 Lignes détectées</h3>
          <button
            onClick={onAddManually}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            ➕ Ajouter manuellement
          </button>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {lines.map((line, index) => (
            <div
              key={line.id}
              className={`bg-white rounded-lg shadow-sm p-3 flex items-center gap-3 ${
                line.confidence_score && line.confidence_score < 0.6 ? 'border-l-4 border-orange-400' : ''
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{line.label || line.raw}</span>
                  {line.confidence_score && line.confidence_score < 0.6 && (
                    <span className="text-orange-500 text-xs">⚠️</span>
                  )}
                </div>
                {line.quantity && (
                  <span className="text-xs text-gray-500">Qté: {line.quantity}</span>
                )}
              </div>
              <div className="text-right">
                <div className="text-base font-semibold text-gray-900">
                  {line.price?.toFixed(2)} €
                </div>
              </div>
              <button
                onClick={() => onEditLine(line.id)}
                className="text-gray-400 hover:text-blue-600"
              >
                ✏️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Validate button */}
      <button
        onClick={onValidate}
        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 flex items-center justify-center gap-2"
      >
        <span>✅</span>
        <span>Valider</span>
      </button>
    </div>
  );
};

/**
 * SCREEN 6 - Analysis & Integration
 * 
 * Goal: Give immediate value
 */
export const AnalysisIntegrationScreen: React.FC<{
  automaticMessages: string[];
  badges: Array<{ type: 'bon_plan' | 'prix_moyen' | 'a_surveiller'; label: string }>;
  onViewObservatory: () => void;
  onAddToAntiCrisis: () => void;
  onFinish: () => void;
}> = ({ automaticMessages, badges, onViewObservatory, onAddToAntiCrisis, onFinish }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Analyse du ticket</h2>
      </div>

      {/* Automatic messages */}
      {automaticMessages.length > 0 && (
        <div className="space-y-3 mb-6">
          {automaticMessages.map((message, index) => (
            <div key={index} className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-sm text-blue-900">{message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Détection automatique</h3>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  badge.type === 'bon_plan' ? 'bg-green-100 text-green-800' :
                  badge.type === 'prix_moyen' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-orange-100 text-orange-800'
                }`}
              >
                {badge.type === 'bon_plan' ? '🟢' :
                 badge.type === 'prix_moyen' ? '🟡' :
                 '🔴'} {badge.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={onViewObservatory}
          className="w-full bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 flex items-center justify-center gap-2"
        >
          <span>📊</span>
          <span>Voir dans l'Observatoire</span>
        </button>

        <button
          onClick={onAddToAntiCrisis}
          className="w-full bg-white border-2 border-green-600 text-green-600 py-3 rounded-lg font-medium hover:bg-green-50 flex items-center justify-center gap-2"
        >
          <span>🧺</span>
          <span>Ajouter au Panier Anti-Crise</span>
        </button>
      </div>

      {/* Finish button */}
      <button
        onClick={onFinish}
        className="w-full bg-gray-600 text-white py-3 rounded-lg font-medium hover:bg-gray-700 flex items-center justify-center gap-2"
      >
        <span>❌</span>
        <span>Terminer</span>
      </button>
    </div>
  );
};

/**
 * SCREEN 7 - Quality Feedback (optional, non-incentive)
 * 
 * Goal: Improve future scans
 */
export const QualityFeedbackScreen: React.FC<{
  qualityScore: number; // 0-10
  factors: {
    goodLighting: boolean;
    wellFramed: boolean;
    sharpness: 'good' | 'medium' | 'poor';
  };
  tip: string;
  onClose: () => void;
}> = ({ qualityScore, factors, tip, onClose }) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Quality card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Qualité du ticket
          </h3>
          
          {/* Score */}
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {qualityScore.toFixed(1)} / 10
            </div>
          </div>

          {/* Factors */}
          <div className="space-y-2 mb-6">
            {factors.goodLighting && (
              <div className="flex items-center gap-2 text-green-700">
                <span>✔</span>
                <span className="text-sm">Bonne lumière</span>
              </div>
            )}
            {factors.wellFramed && (
              <div className="flex items-center gap-2 text-green-700">
                <span>✔</span>
                <span className="text-sm">Ticket bien cadré</span>
              </div>
            )}
            {factors.sharpness !== 'good' && (
              <div className="flex items-center gap-2 text-gray-600">
                <span>ℹ️</span>
                <span className="text-sm">
                  {factors.sharpness === 'medium' ? 'Léger flou sur certaines lignes' : 'Flou détecté'}
                </span>
              </div>
            )}
          </div>

          {/* Educational tip */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-blue-900">
              <strong>💡 Astuce :</strong> {tip}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Continuer
        </button>
      </div>
    </div>
  );
};
