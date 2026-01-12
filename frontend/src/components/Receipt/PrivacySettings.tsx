import React, { useState, useEffect } from 'react';
import {
  getLocalDataInfo,
  clearLocalData,
  exportLocalData,
  getLocalStorageUsage,
  formatBytes,
  getPrivacyStatus,
  PRIVACY_NOTICE,
  getDataRetentionPolicy,
  DataStorageInfo,
} from './services/privacyControls';

/**
 * Privacy Settings & Data Management Component
 * 
 * RGPD-compliant user controls for local data
 * 100% transparent, user has full control
 */
export const PrivacySettings: React.FC = () => {
  const [dataInfo, setDataInfo] = useState<DataStorageInfo[]>([]);
  const [storageUsage, setStorageUsage] = useState({ used: 0, available: 0, percentage: 0 });
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setDataInfo(getLocalDataInfo());
    setStorageUsage(getLocalStorageUsage());
  };

  const handleClearData = (type: string) => {
    const success = clearLocalData(type as any);
    if (success) {
      refreshData();
      setShowConfirmDialog(null);
    }
  };

  const handleExportData = () => {
    const data = exportLocalData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `akiprisaye-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const privacyStatus = getPrivacyStatus();
  const retentionPolicy = getDataRetentionPolicy();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🔒 Confidentialité & Données Locales
        </h1>
        <p className="text-sm text-gray-600">
          Gestion complète de vos données personnelles
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          ℹ️ Garantie de Confidentialité
        </h2>
        <p className="text-sm text-blue-800 mb-4">
          {PRIVACY_NOTICE.fr}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatusBadge
            icon="📱"
            label="100% Local"
            active={privacyStatus.localOnly}
          />
          <StatusBadge
            icon="🚫"
            label="Pas de tracking"
            active={privacyStatus.noTracking}
          />
          <StatusBadge
            icon="👤"
            label="Sans compte"
            active={privacyStatus.noAccount}
          />
          <StatusBadge
            icon="✈️"
            label="Mode avion OK"
            active={privacyStatus.offlineCapable}
          />
          <StatusBadge
            icon="⚖️"
            label="RGPD"
            active={privacyStatus.rgpdCompliant}
          />
        </div>
      </div>

      {/* Storage Usage */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          💾 Utilisation du Stockage Local
        </h2>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Espace utilisé</span>
            <span className="text-sm font-medium text-gray-900">
              {formatBytes(storageUsage.used)} / {formatBytes(storageUsage.available)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${storageUsage.percentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {storageUsage.percentage.toFixed(1)}% utilisé
          </p>
        </div>

        {dataInfo.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Aucune donnée stockée localement</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dataInfo.map((info, index) => (
              <DataInfoCard
                key={index}
                info={info}
                onClear={() => setShowConfirmDialog(info.type)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Data Retention Policy */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          📋 Politique de Conservation
        </h2>
        <div className="space-y-3">
          <PolicyItem
            label="Images de tickets"
            value={retentionPolicy.images}
            icon="📷"
          />
          <PolicyItem
            label="Texte OCR"
            value={retentionPolicy.ocrText}
            icon="📝"
          />
          <PolicyItem
            label="Scores de qualité"
            value={retentionPolicy.qualityScores}
            icon="📊"
          />
          <PolicyItem
            label="Contrôle utilisateur"
            value={retentionPolicy.userControl}
            icon="🎛️"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          ⚙️ Actions
        </h2>
        <div className="space-y-3">
          <button
            onClick={handleExportData}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>📤</span>
            <span>Exporter mes données (JSON)</span>
          </button>

          <button
            onClick={() => setShowConfirmDialog('all')}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
          >
            <span>🗑️</span>
            <span>Supprimer toutes les données</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Ces actions sont immédiates et irréversibles
        </p>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <ConfirmDialog
          type={showConfirmDialog}
          onConfirm={() => handleClearData(showConfirmDialog)}
          onCancel={() => setShowConfirmDialog(null)}
        />
      )}

      {/* Footer Info */}
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-xs text-gray-600">
          <strong>Conformité RGPD :</strong> En tant que traitement strictement local,
          ce système n'entre pas dans le champ d'application du RGPD.
          Aucune donnée personnelle n'est transmise à un tiers.
        </p>
      </div>
    </div>
  );
};

type StatusBadgeProps = {
  icon: string;
  label: string;
  active: boolean;
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ icon, label, active }) => (
  <div
    className={`p-3 rounded-lg text-center ${
      active ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
    }`}
  >
    <div className="text-2xl mb-1">{icon}</div>
    <div className={`text-xs font-medium ${active ? 'text-green-900' : 'text-gray-600'}`}>
      {label}
    </div>
  </div>
);

type DataInfoCardProps = {
  info: DataStorageInfo;
  onClear: () => void;
};

const DataInfoCard: React.FC<DataInfoCardProps> = ({ info, onClear }) => {
  const typeLabels: Record<string, string> = {
    quality_history: 'Historique qualité OCR',
    recurring_products: 'Produits récurrents',
    user_preferences: 'Préférences utilisateur',
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          {typeLabels[info.type] || info.type}
        </p>
        <p className="text-xs text-gray-600">
          {info.itemCount} élément{info.itemCount > 1 ? 's' : ''} • {formatBytes(info.size)}
        </p>
      </div>
      <button
        onClick={onClear}
        className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded border border-red-600 hover:bg-red-50"
      >
        Supprimer
      </button>
    </div>
  );
};

type PolicyItemProps = {
  label: string;
  value: string;
  icon: string;
};

const PolicyItem: React.FC<PolicyItemProps> = ({ label, value, icon }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
    <span className="text-xl">{icon}</span>
    <div>
      <p className="text-sm font-medium text-gray-900">{label}</p>
      <p className="text-xs text-gray-600 mt-1">{value}</p>
    </div>
  </div>
);

type ConfirmDialogProps = {
  type: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ type, onConfirm, onCancel }) => {
  const messages: Record<string, string> = {
    all: 'Êtes-vous sûr de vouloir supprimer TOUTES les données locales ? Cette action est irréversible.',
    quality_history: 'Supprimer l\'historique de qualité OCR ?',
    recurring_products: 'Supprimer la liste des produits récurrents ?',
    user_preferences: 'Réinitialiser les préférences utilisateur ?',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          ⚠️ Confirmation
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {messages[type] || 'Confirmer la suppression ?'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};
