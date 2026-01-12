import React, { useState } from 'react';
import { ReceiptScanner } from './ReceiptScanner';
import { ReceiptValidation } from './ReceiptValidation';
import type { ReceiptData } from './types';

type ReceiptWorkflowProps = {
  territory: string;
  onSubmit: (receiptData: ReceiptData) => void;
};

type WorkflowState = 'scan' | 'validate' | 'complete';

export const ReceiptWorkflow: React.FC<ReceiptWorkflowProps> = ({ territory, onSubmit }) => {
  const [workflowState, setWorkflowState] = useState<WorkflowState>('scan');
  const [extractedText, setExtractedText] = useState('');
  const [imageData, setImageData] = useState('');
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const handleScanComplete = (text: string, image: string) => {
    setExtractedText(text);
    setImageData(image);
    setWorkflowState('validate');
  };

  const handleValidate = (data: ReceiptData) => {
    setReceiptData(data);
    setWorkflowState('complete');
    onSubmit(data);
  };

  const handleCancel = () => {
    setWorkflowState('scan');
    setExtractedText('');
    setImageData('');
  };

  const handleReset = () => {
    setWorkflowState('scan');
    setExtractedText('');
    setImageData('');
    setReceiptData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Progress indicator */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div
            className={`flex-1 text-center ${
              workflowState === 'scan' ? 'font-bold text-blue-600' : 'text-gray-500'
            }`}
          >
            <div
              className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                workflowState === 'scan' ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}
            >
              1
            </div>
            <p className="text-sm">📷 Scan</p>
          </div>
          <div className="flex-1 h-1 bg-gray-300">
            <div
              className={`h-full transition-all duration-500 ${
                workflowState !== 'scan' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            ></div>
          </div>
          <div
            className={`flex-1 text-center ${
              workflowState === 'validate' ? 'font-bold text-blue-600' : 'text-gray-500'
            }`}
          >
            <div
              className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                workflowState === 'validate' ? 'bg-blue-600 text-white' : 'bg-gray-300'
              }`}
            >
              2
            </div>
            <p className="text-sm">✍️ Validation</p>
          </div>
          <div className="flex-1 h-1 bg-gray-300">
            <div
              className={`h-full transition-all duration-500 ${
                workflowState === 'complete' ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            ></div>
          </div>
          <div
            className={`flex-1 text-center ${
              workflowState === 'complete' ? 'font-bold text-green-600' : 'text-gray-500'
            }`}
          >
            <div
              className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                workflowState === 'complete' ? 'bg-green-600 text-white' : 'bg-gray-300'
              }`}
            >
              3
            </div>
            <p className="text-sm">✅ Terminé</p>
          </div>
        </div>
      </div>

      {/* Content based on state */}
      {workflowState === 'scan' && (
        <ReceiptScanner onScanComplete={handleScanComplete} territory={territory} />
      )}

      {workflowState === 'validate' && (
        <ReceiptValidation
          extractedText={extractedText}
          imageData={imageData}
          territory={territory}
          onValidate={handleValidate}
          onCancel={handleCancel}
        />
      )}

      {workflowState === 'complete' && receiptData && (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
              <svg
                className="w-16 h-16 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">✅ Ticket validé</h2>
            <p className="text-gray-600">
              Votre observation a été enregistrée avec succès
            </p>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">📋 Résumé</h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Territoire :</strong> {receiptData.territoire}
              </p>
              <p>
                <strong>Magasin :</strong> {receiptData.magasin.nom}
              </p>
              <p>
                <strong>Date :</strong> {receiptData.date_achat} à {receiptData.heure_achat}
              </p>
              <p>
                <strong>Produits :</strong> {receiptData.produits.length}
              </p>
              <p>
                <strong>Confiance :</strong>{' '}
                <span
                  className={`font-semibold ${
                    receiptData.niveau_confiance_global === 'élevé'
                      ? 'text-green-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {receiptData.niveau_confiance_global === 'élevé' ? '🟢 Élevé' : '🟡 Moyen'}
                </span>
              </p>
            </div>
          </div>

          {/* Products list */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">🛒 Produits enregistrés</h3>
            <div className="space-y-2">
              {receiptData.produits.map((product, index) => (
                <div key={index} className="bg-white p-3 rounded border border-gray-300">
                  <p className="font-medium text-gray-900">{product.libelle_ticket}</p>
                  <p className="text-sm text-gray-600">
                    {product.prix.toFixed(2)} € × {product.quantite}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Information */}
          <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-500 mb-6">
            <p className="text-sm text-yellow-900">
              <strong>ℹ️ Information :</strong>
              <br />
              Cette observation est enregistrée localement.
              <br />
              Elle n'est PAS publiée automatiquement.
              <br />
              Elle pourra être utilisée pour le module Anti-Crise après validation.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              📷 Scanner un autre ticket
            </button>
          </div>

          {/* Quality indicator */}
          <div className="mt-6 p-3 bg-gray-100 rounded text-sm text-gray-700">
            <p>
              <strong>🎯 Pour une utilisation optimale :</strong>
              <br />≥ 3 tickets pour le même produit/magasin = observation exploitable
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
