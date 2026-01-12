import React from 'react';
import {
  StoreChainQualityHistory,
  getQualityIcon,
  getQualityDescription,
  getQualityColor,
  generateQualityBadges,
  QUALITY_DISCLAIMER,
  getMethodologyExplanation,
} from '../../types/ocrQualityHistory';

type OCRQualityCardProps = {
  history: StoreChainQualityHistory;
  showDetails?: boolean;
};

/**
 * OCR Quality Card - Neutral display of document quality metrics
 * 
 * CONSTRAINTS:
 * - NO store rating
 * - NO commercial comparison
 * - ONLY technical document quality
 * - Mandatory disclaimer displayed
 */
export const OCRQualityCard: React.FC<OCRQualityCardProps> = ({
  history,
  showDetails = false,
}) => {
  const badges = generateQualityBadges(history.causes_principales);
  const primaryQuality = getPrimaryQuality(history.qualité_ocr);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: getQualityColor(primaryQuality) }}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          📋 Qualité documentaire
        </h3>
        <p className="text-sm text-gray-600">
          {history.enseigne} • {history.territoire}
        </p>
      </div>

      {/* Primary indicator */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{getQualityIcon(primaryQuality)}</span>
          <div>
            <p className="text-lg font-medium text-gray-900">
              {getQualityDescription(primaryQuality)}
            </p>
            <p className="text-xs text-gray-500">
              Basé sur {history.tickets_analysés} ticket{history.tickets_analysés > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Distribution */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-700 mb-2">Répartition :</p>
        <div className="space-y-2">
          <QualityBar
            level="excellente"
            percentage={history.qualité_ocr.excellente}
            label="Majoritairement lisible"
          />
          <QualityBar
            level="correcte"
            percentage={history.qualité_ocr.correcte}
            label="Lisibilité variable"
          />
          <QualityBar
            level="limitée"
            percentage={history.qualité_ocr.limitée}
            label="Données limitées"
          />
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Caractéristiques techniques :</p>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                  badge.severity === 'warning'
                    ? 'bg-orange-50 text-orange-800 border border-orange-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}
                title={badge.description}
              >
                <span>{badge.icon}</span>
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main causes */}
      {history.causes_principales.length > 0 && showDetails && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-2">Causes principales :</p>
          <ul className="space-y-1">
            {history.causes_principales.slice(0, 3).map((cause, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>{cause.description} ({Math.round(cause.frequency)}%)</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mandatory disclaimer */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 italic">
          ℹ️ {QUALITY_DISCLAIMER}
        </p>
      </div>

      {/* Methodology link */}
      {showDetails && (
        <details className="mt-3">
          <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
            📖 Voir la méthodologie
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-700 whitespace-pre-line">
            {getMethodologyExplanation()}
          </div>
        </details>
      )}
    </div>
  );
};

type QualityBarProps = {
  level: 'excellente' | 'correcte' | 'limitée';
  percentage: number;
  label: string;
};

const QualityBar: React.FC<QualityBarProps> = ({ level, percentage, label }) => {
  const color = getQualityColor(level);
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-xs font-medium text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

/**
 * Get primary quality level (highest percentage)
 */
function getPrimaryQuality(distribution: {
  excellente: number;
  correcte: number;
  limitée: number;
}): 'excellente' | 'correcte' | 'limitée' {
  if (distribution.excellente >= distribution.correcte && distribution.excellente >= distribution.limitée) {
    return 'excellente';
  }
  if (distribution.correcte >= distribution.limitée) {
    return 'correcte';
  }
  return 'limitée';
}

type OCRQualitySummaryProps = {
  histories: StoreChainQualityHistory[];
  territoire?: string;
};

/**
 * Summary view of OCR quality across multiple stores
 */
export const OCRQualitySummary: React.FC<OCRQualitySummaryProps> = ({
  histories,
  territoire,
}) => {
  if (histories.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600">
          Aucune donnée de qualité documentaire disponible
        </p>
      </div>
    );
  }

  const totalTickets = histories.reduce((sum, h) => sum + h.tickets_analysés, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        📊 Vue d'ensemble - Qualité documentaire
      </h3>

      {territoire && (
        <p className="text-sm text-gray-600 mb-4">
          Territoire : <span className="font-semibold">{territoire}</span>
        </p>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{histories.length}</p>
          <p className="text-xs text-gray-600">Enseignes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
          <p className="text-xs text-gray-600">Tickets analysés</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">
            {calculateAverageQuality(histories)}%
          </p>
          <p className="text-xs text-gray-600">Qualité moyenne</p>
        </div>
      </div>

      <div className="space-y-3">
        {histories.map((history, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div className="flex items-center gap-2">
              <span className="text-xl">{getQualityIcon(getPrimaryQuality(history.qualité_ocr))}</span>
              <span className="text-sm font-medium text-gray-900">{history.enseigne}</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">{history.tickets_analysés} tickets</p>
              <p className="text-xs text-gray-500">
                {getQualityDescription(getPrimaryQuality(history.qualité_ocr))}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Mandatory disclaimer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-600 italic">
          ℹ️ {QUALITY_DISCLAIMER}
        </p>
      </div>
    </div>
  );
};

/**
 * Calculate average quality across histories
 */
function calculateAverageQuality(histories: StoreChainQualityHistory[]): number {
  if (histories.length === 0) return 0;

  let totalScore = 0;
  let totalTickets = 0;

  for (const history of histories) {
    const score =
      history.qualité_ocr.excellente * 90 +
      history.qualité_ocr.correcte * 70 +
      history.qualité_ocr.limitée * 40;

    totalScore += score * history.tickets_analysés;
    totalTickets += history.tickets_analysés;
  }

  return totalTickets > 0 ? Math.round(totalScore / (totalTickets * 100) * 100) : 0;
}
