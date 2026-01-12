/**
 * AutomatedFactualInterpretation - Module 5
 * Descriptive phrases only, no recommendations.
 */
import React from 'react';
export type InterpretationType = 'high_variation' | 'stable_price' | 'low_observations' | 'notable_change';
export interface AutomatedFactualInterpretationProps {
  type: InterpretationType; value?: number; period: string; context?: string;
}
const TEMPLATES = {
  high_variation: (v: number, p: string) => `Ce produit présente une variation de prix élevée (+${v}%) sur les ${p}.`,
  stable_price: (v: number, p: string) => `Prix stable sur la période (±${v}% sur ${p}).`,
  low_observations: (v: number, p: string) => `Faible nombre d'observations (${v}) sur ${p}.`,
  notable_change: (v: number, p: string) => `Variation notable observée (+${v}%) sur ${p}.`,
};
export const AutomatedFactualInterpretation: React.FC<AutomatedFactualInterpretationProps> = ({ type, value = 0, period }) => {
  const interpretation = TEMPLATES[type](value, period);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Interprétation automatique</h4>
      <div className="p-4 bg-blue-50 rounded-lg mb-4">
        <p className="text-sm text-gray-900">{interpretation}</p>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="bg-gray-50 rounded p-2 text-xs text-gray-600">
          <p>➡️ Pas de "bon plan"</p><p>➡️ Pas de "à éviter"</p>
        </div>
      </div>
    </div>
  );
};
export default AutomatedFactualInterpretation;
