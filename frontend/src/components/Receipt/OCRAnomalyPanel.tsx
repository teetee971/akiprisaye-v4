import React from 'react';
import {
  OCRAnomaly,
  getAnomalyTypeLabel,
  getAnomalyIcon,
  groupAnomaliesBySeverity,
} from '../services/ocrAnomalyDetector';

type OCRAnomalyPanelProps = {
  anomalies: OCRAnomaly[];
  onLineClick?: (lineIndex: number) => void;
};

/**
 * Module M - OCR Anomaly Display Panel
 * 
 * Displays detected OCR inconsistencies in a strictly neutral way
 * 
 * CONSTRAINTS:
 * - No red/green color coding
 * - No automatic correction buttons
 * - No scoring system
 * - Human decision mandatory
 * - Informational only
 */
export const OCRAnomalyPanel: React.FC<OCRAnomalyPanelProps> = ({
  anomalies,
  onLineClick,
}) => {
  if (anomalies.length === 0) {
    return (
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <p className="text-sm text-green-900">
          ✓ Aucune incohérence détectée dans l'OCR
        </p>
        <p className="text-xs text-green-700 mt-1">
          Les données semblent cohérentes. Vérifiez tout de même chaque ligne manuellement.
        </p>
      </div>
    );
  }

  const grouped = groupAnomaliesBySeverity(anomalies);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">
          🧪 Module M - Vérifications OCR
        </h4>
        <p className="text-xs text-gray-600">
          {anomalies.length} incohérence{anomalies.length > 1 ? 's' : ''} potentielle
          {anomalies.length > 1 ? 's' : ''} détectée{anomalies.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Warnings */}
      {grouped.warnings.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-orange-900 mb-2">
            ⚠️ Anomalies importantes ({grouped.warnings.length})
          </p>
          <div className="space-y-2">
            {grouped.warnings.map((anomaly, index) => (
              <AnomalyItem
                key={`warning-${index}`}
                anomaly={anomaly}
                onLineClick={onLineClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      {grouped.info.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-blue-900 mb-2">
            ℹ️ Points à vérifier ({grouped.info.length})
          </p>
          <div className="space-y-2">
            {grouped.info.map((anomaly, index) => (
              <AnomalyItem
                key={`info-${index}`}
                anomaly={anomaly}
                onLineClick={onLineClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Important disclaimer */}
      <div className="mt-3 pt-3 border-t border-gray-300">
        <p className="text-xs text-gray-700">
          <strong>⚠️ Important :</strong>
        </p>
        <ul className="list-disc list-inside mt-1 space-y-1 text-xs text-gray-600">
          <li>Ces signalements sont informatifs uniquement</li>
          <li>Aucune correction automatique ne sera effectuée</li>
          <li>Vérifiez et corrigez manuellement si nécessaire</li>
          <li>Vous restez maître de la validation finale</li>
        </ul>
      </div>
    </div>
  );
};

type AnomalyItemProps = {
  anomaly: OCRAnomaly;
  onLineClick?: (lineIndex: number) => void;
};

const AnomalyItem: React.FC<AnomalyItemProps> = ({ anomaly, onLineClick }) => {
  const handleClick = () => {
    if (anomaly.lineIndex !== undefined && onLineClick) {
      onLineClick(anomaly.lineIndex);
    }
  };

  return (
    <div
      className={`p-3 rounded border ${
        anomaly.severity === 'warning'
          ? 'bg-orange-50 border-orange-200'
          : 'bg-blue-50 border-blue-200'
      } ${anomaly.lineIndex !== undefined && onLineClick ? 'cursor-pointer hover:shadow-sm' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-2">
        <span className="text-base flex-shrink-0">{getAnomalyIcon(anomaly.type)}</span>
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-medium ${
              anomaly.severity === 'warning' ? 'text-orange-900' : 'text-blue-900'
            }`}
          >
            {anomaly.message}
            {anomaly.lineIndex !== undefined && ` (Ligne ${anomaly.lineIndex + 1})`}
          </p>
          {anomaly.details && (
            <p
              className={`text-xs mt-1 ${
                anomaly.severity === 'warning' ? 'text-orange-700' : 'text-blue-700'
              }`}
            >
              {anomaly.details}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Type : {getAnomalyTypeLabel(anomaly.type)}
          </p>
        </div>
      </div>
    </div>
  );
};

type OCRAnomalySummaryProps = {
  anomalies: OCRAnomaly[];
};

/**
 * Compact summary of OCR anomalies
 */
export const OCRAnomalySummary: React.FC<OCRAnomalySummaryProps> = ({ anomalies }) => {
  if (anomalies.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-700">
        <span>✓</span>
        <span>Pas d'incohérence détectée</span>
      </div>
    );
  }

  const grouped = groupAnomaliesBySeverity(anomalies);

  return (
    <div className="flex items-center gap-3 text-xs">
      {grouped.warnings.length > 0 && (
        <span className="text-orange-700">
          ⚠️ {grouped.warnings.length} anomalie{grouped.warnings.length > 1 ? 's' : ''}
        </span>
      )}
      {grouped.info.length > 0 && (
        <span className="text-blue-700">
          ℹ️ {grouped.info.length} point{grouped.info.length > 1 ? 's' : ''} à vérifier
        </span>
      )}
    </div>
  );
};
