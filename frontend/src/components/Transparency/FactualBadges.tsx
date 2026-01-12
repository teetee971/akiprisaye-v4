/**
 * FactualBadges - Module 7
 * Technical indicators only - no stars, no ratings.
 */
import React from 'react';
export type BadgeType = 'minimum_observed' | 'insufficient_data' | 'high_variability' | 'stable_price';
export interface FactualBadge { type: BadgeType; value?: string | number; }
export interface FactualBadgesProps { badges: FactualBadge[]; }
const BADGE_CONFIG: Record<BadgeType, { label: string; colorClass: string }> = {
  minimum_observed: { label: 'Prix minimum observé', colorClass: 'bg-blue-100 text-blue-800 border-blue-300' },
  insufficient_data: { label: 'Données insuffisantes', colorClass: 'bg-gray-100 text-gray-800 border-gray-300' },
  high_variability: { label: 'Forte variabilité', colorClass: 'bg-orange-100 text-orange-800 border-orange-300' },
  stable_price: { label: 'Prix stable', colorClass: 'bg-gray-100 text-gray-800 border-gray-300' },
};
export const FactualBadges: React.FC<FactualBadgesProps> = ({ badges }) => {
  if (badges.length === 0) return null;
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Indicateurs techniques</h4>
      <div className="flex flex-wrap gap-2 mb-4">
        {badges.map((badge, index) => {
          const config = BADGE_CONFIG[badge.type];
          return (
            <div key={index} className={`px-3 py-1.5 rounded-full border text-xs font-medium ${config.colorClass}`}>
              {config.label}{badge.value && <span className="ml-1 font-normal">• {badge.value}</span>}
            </div>
          );
        })}
      </div>
      <div className="border-t border-gray-200 pt-3">
        <div className="text-xs text-gray-600 space-y-1">
          <p className="font-medium">❌ Pas d'étoiles • ❌ Pas de notes • ✅ Badges techniques uniquement</p>
        </div>
      </div>
    </div>
  );
};
export default FactualBadges;
