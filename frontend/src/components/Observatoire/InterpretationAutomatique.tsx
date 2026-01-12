import React from 'react';
import {
  getInterpretationText,
  CONTEXT_TEMPLATES,
  type ObservationLevel,
} from '../../utils/interpretationTexts';

/**
 * Props for InterpretationAutomatique component
 */
export type InterpretationAutomatiqueProps = {
  level: ObservationLevel;
  used: number;
  max: number;
  scopeLabel: string; // e.g., "produit", "magasin", "territoire"
};

/**
 * InterpretationAutomatique Component
 * 
 * Generates automatic neutral interpretation based ONLY on observation volume
 * - Fixed texts per level (no dynamic generation)
 * - No value judgments
 * - No price evaluation
 * - No store comparisons
 * - Legal disclaimer included
 * 
 * @param {InterpretationAutomatiqueProps} props - Component properties
 */
const InterpretationAutomatique: React.FC<InterpretationAutomatiqueProps> = ({
  level,
  used,
  max,
  scopeLabel,
}) => {
  // Get fixed interpretation text for this level
  const interpretationText = getInterpretationText(level);

  return (
    <div className="space-y-4">
      {/* Main Interpretation Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📖 Lecture des données observées
        </h3>

        {/* Interpretation Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-900 leading-relaxed">
            {interpretationText}
          </p>
        </div>

        {/* Context Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-700">
            {CONTEXT_TEMPLATES.automatic} ({used.toLocaleString('fr-FR')} sur{' '}
            {max.toLocaleString('fr-FR')}) au niveau <strong>{scopeLabel}</strong>.
          </p>
        </div>
      </section>

      {/* Mandatory Legal Disclaimer */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 text-2xl">⚖️</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-yellow-900 mb-2">
              Avertissement légal
            </p>
            <p className="text-sm text-yellow-800">{CONTEXT_TEMPLATES.legal}</p>
          </div>
        </div>
      </div>

      {/* Methodology Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-700">
          <strong>Note méthodologique :</strong> L'interprétation est strictement déterministe.
          Chaque niveau de couverture (minimal, faible, modéré, fort, maximal) correspond à un
          texte fixe, pré-validé et auditable. Aucune génération dynamique ou calcul interprétatif
          n'est effectué.
        </p>
      </div>
    </div>
  );
};

export default InterpretationAutomatique;
