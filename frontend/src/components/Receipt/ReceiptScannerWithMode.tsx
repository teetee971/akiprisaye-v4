import React, { useState } from 'react';
import { ReceiptScanner } from './ReceiptScanner';
import { ReceiptMultiCapture } from './ReceiptMultiCapture';

type ReceiptScannerWithModeProps = {
  onScanComplete: (extractedText: string, imageData: string | string[]) => void;
  territory: string;
};

type ScanMode = 'single' | 'multi';

/**
 * Enhanced Receipt Scanner with toggle between single and multi-photo modes
 * Provides a unified interface for both scanning modes
 */
export const ReceiptScannerWithMode: React.FC<ReceiptScannerWithModeProps> = ({
  onScanComplete,
  territory,
}) => {
  const [scanMode, setScanMode] = useState<ScanMode>('single');

  const handleSingleComplete = (text: string, image: string) => {
    onScanComplete(text, image);
  };

  const handleMultiComplete = (text: string, images: string[]) => {
    onScanComplete(text, images);
  };

  const handleCancelMulti = () => {
    setScanMode('single');
  };

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="bg-white rounded-lg shadow-md p-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Mode de capture</h3>
            <p className="text-sm text-gray-600">
              Choisissez le mode adapté à votre ticket
            </p>
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setScanMode('single')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                scanMode === 'single'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              📷 Photo unique
            </button>
            <button
              onClick={() => setScanMode('multi')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                scanMode === 'multi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              📸 Ticket long (multi-photos)
            </button>
          </div>
        </div>

        {/* Mode description */}
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            {scanMode === 'single' ? (
              <>
                <strong>📷 Photo unique :</strong> Pour les tickets courts ou de taille standard.
                Une seule photo suffit.
              </>
            ) : (
              <>
                <strong>📸 Ticket long (multi-photos) :</strong> Pour les tickets longs qui
                nécessitent plusieurs photos. L'OCR sera effectué une seule fois après
                validation de toutes les photos.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Scanner component based on mode */}
      {scanMode === 'single' ? (
        <ReceiptScanner onScanComplete={handleSingleComplete} territory={territory} />
      ) : (
        <ReceiptMultiCapture
          onResult={handleMultiComplete}
          onCancel={handleCancelMulti}
          territory={territory}
        />
      )}
    </div>
  );
};
