/**
 * UniversalTransparency - Module 8 (Mandatory)
 * Display everywhere - core transparency statement.
 */
import React from 'react';
export interface UniversalTransparencyProps { compact?: boolean; showFullStatement?: boolean; }
export const UniversalTransparency: React.FC<UniversalTransparencyProps> = ({ compact = false, showFullStatement = true }) => {
  if (compact) {
    return (
      <div className="bg-gray-50 rounded p-3 text-xs text-gray-600">
        <p className="font-medium">🔒 Aucune enseigne ne peut payer pour être mise en avant.</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Transparence totale</h3>
        <p className="text-sm text-gray-600">Engagement de l'observatoire citoyen</p>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 mb-4">
        <p className="text-base font-medium text-gray-900 mb-2">Aucune enseigne ne peut payer pour être mise en avant.</p>
        <p className="text-sm text-gray-700">Aucune recommandation d'achat n'est formulée. Les données sont descriptives.</p>
      </div>
      {showFullStatement && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="bg-gray-50 rounded p-4">
            <p className="text-sm font-medium text-gray-900 mb-2">"Nous ne disons pas quoi acheter. Nous montrons ce qui est observé."</p>
            <p className="text-xs text-gray-600">Position stratégique garantissant notre indépendance et crédibilité.</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default UniversalTransparency;
