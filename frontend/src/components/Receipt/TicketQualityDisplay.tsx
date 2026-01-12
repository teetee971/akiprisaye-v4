import React from 'react';
import {
  TicketQualityScore,
  getQualityBreakdownDescription,
  getQualitySummary,
} from '../services/ticketQualityScore';

type TicketQualityDisplayProps = {
  qualityScore: TicketQualityScore;
  showBreakdown?: boolean;
};

/**
 * Neutral display component for receipt quality score
 * 
 * CONSTRAINTS:
 * - No red/green colors
 * - No star ratings
 * - No marketing language
 * - Purely informational
 */
export const TicketQualityDisplay: React.FC<TicketQualityDisplayProps> = ({
  qualityScore,
  showBreakdown = true,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-1">
          Qualité technique du ticket
        </h4>
        <p className="text-xs text-gray-600">
          Indicateur de fiabilité des données (n'indique pas un bon ou mauvais prix)
        </p>
      </div>

      {/* Progress bar - neutral gray colors */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-700">{getQualitySummary(qualityScore)}</span>
          <span className="text-sm font-medium text-gray-900">{qualityScore.score}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gray-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${qualityScore.score}%` }}
          />
        </div>
      </div>

      {/* Message */}
      <p className="text-xs text-gray-700 mb-3">{qualityScore.message}</p>

      {/* Breakdown */}
      {showBreakdown && (
        <div className="border-t border-gray-300 pt-3">
          <p className="text-xs font-semibold text-gray-900 mb-2">Détail du score :</p>
          <div className="space-y-1">
            {getQualityBreakdownDescription(qualityScore).map((desc, index) => (
              <p key={index} className="text-xs text-gray-600">
                • {desc}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-3 pt-3 border-t border-gray-300">
        <p className="text-xs text-gray-500 italic">
          ℹ️ Ce score évalue la complétude des données, pas la qualité des prix.
          Il aide à comprendre la fiabilité de l'analyse territoriale.
        </p>
      </div>
    </div>
  );
};
