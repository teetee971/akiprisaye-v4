import React from 'react';

/**
 * Type definitions for the neutral statistical analysis component
 */
type AnalyseStatistiqueNeutreProps = {
  signalLevel: number;
  interpretation: string;
  enseignesPresentes: string[];
  observations: {
    used: number;
    max: number;
    method: 'full' | 'stratified';
  };
};

/**
 * AnalyseStatistiqueNeutre Component
 * Displays neutral statistical analysis without causal attribution
 * Legally safe component for public sector use
 * 
 * @param {AnalyseStatistiqueNeutreProps} props - Component properties
 */
const AnalyseStatistiqueNeutre: React.FC<AnalyseStatistiqueNeutreProps> = ({
  signalLevel,
  interpretation,
  enseignesPresentes,
  observations,
}) => {
  /**
   * Get signal level badge color and label
   * Uses neutral, non-accusatory terminology
   */
  const getSignalBadge = (level: number) => {
    if (level >= 80) {
      return {
        color: 'bg-red-100 text-red-800 border-red-300',
        label: 'Signal fort',
      };
    } else if (level >= 50) {
      return {
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        label: 'Signal modéré',
      };
    } else if (level >= 20) {
      return {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        label: 'Signal faible',
      };
    } else {
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        label: 'Signal minimal',
      };
    }
  };

  const signalBadge = getSignalBadge(signalLevel);

  /**
   * Get method label in French
   */
  const getMethodLabel = (method: 'full' | 'stratified'): string => {
    return method === 'full' ? 'Exhaustive' : 'Stratifiée';
  };

  return (
    <div className="space-y-6">
      {/* Interpretation Block */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            🧠 Interprétation statistique
          </h3>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${signalBadge.color}`}
          >
            {signalBadge.label} ({signalLevel}%)
          </span>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 leading-relaxed">
            {interpretation}
          </p>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-700">
            <strong>Note méthodologique :</strong> Le niveau de signal indique l'intensité statistique
            observée dans les données, sans attribution causale ni désignation d'acteur spécifique.
          </p>
        </div>
      </div>

      {/* Stores Block - Neutral Listing */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🏪 Enseignes présentes dans l'analyse
        </h3>

        <div className="bg-gray-50 rounded-lg p-4">
          {enseignesPresentes.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {enseignesPresentes.map((enseigne, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 border border-gray-200"
                >
                  <span className="text-gray-400">•</span>
                  <span className="text-sm font-medium text-gray-900">
                    {enseigne}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic text-center py-4">
              Aucune enseigne disponible
            </p>
          )}
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-900">
            <strong>⚠️ Important :</strong> Cette liste indique uniquement la présence d'observations
            pour ces enseignes. Elle ne constitue ni un classement, ni une évaluation comparative.
          </p>
        </div>
      </div>

      {/* Observations Volume Block */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          📊 Volume d'observations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-xs text-blue-700 uppercase font-semibold mb-2">
              Observations utilisées
            </p>
            <p className="text-3xl font-bold text-blue-900">
              {observations.used.toLocaleString('fr-FR')}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-xs text-green-700 uppercase font-semibold mb-2">
              Base maximale
            </p>
            <p className="text-3xl font-bold text-green-900">
              {observations.max.toLocaleString('fr-FR')}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-xs text-purple-700 uppercase font-semibold mb-2">
              Méthode
            </p>
            <p className="text-xl font-bold text-purple-900">
              {getMethodLabel(observations.method)}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Taux d'utilisation</span>
            <span className="text-xs font-semibold text-gray-900">
              {observations.max > 0
                ? ((observations.used / observations.max) * 100).toFixed(1)
                : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  observations.max > 0
                    ? (observations.used / observations.max) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-700">
            <strong>Méthodologie :</strong>{' '}
            {observations.method === 'full'
              ? 'Analyse exhaustive de toutes les observations disponibles dans la période sélectionnée.'
              : 'Échantillonnage stratifié garantissant la représentativité statistique des données.'}
          </p>
        </div>
      </div>

      {/* Mandatory Legal Disclaimer */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 text-2xl">⚖️</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-yellow-900 mb-2">
              Avertissement légal et méthodologique
            </p>
            <div className="space-y-2 text-xs text-yellow-800">
              <p>
                <strong>1. Nature des données :</strong> Les informations présentées sont issues
                d'observations citoyennes ponctuelles et ne constituent pas une représentation
                exhaustive du marché.
              </p>
              <p>
                <strong>2. Absence d'attribution causale :</strong> Aucun lien de causalité n'est
                établi entre les enseignes listées et les signaux statistiques observés. La présence
                d'une enseigne dans cette liste n'implique aucune responsabilité ni jugement.
              </p>
              <p>
                <strong>3. Portée limitée :</strong> Cette analyse a une valeur purement informative
                et ne peut être utilisée à des fins contractuelles, juridiques ou comme preuve dans
                un litige.
              </p>
              <p>
                <strong>4. Méthodologie transparente :</strong> Les méthodes statistiques utilisées
                sont documentées et auditables. La transparence méthodologique ne garantit pas
                l'exhaustivité des données sources.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Context Note */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-700 text-center">
          <strong>Principe de neutralité :</strong> Cet outil vise à informer le public sur les
          tendances statistiques observées, sans désigner ni interpréter causalement les acteurs
          économiques. Pour toute question méthodologique, consultez notre documentation complète.
        </p>
      </div>
    </div>
  );
};

export default AnalyseStatistiqueNeutre;
