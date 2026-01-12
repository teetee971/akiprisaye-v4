/**
 * Scan Module UI Screens
 * 
 * Complete UI specification for A KI PRI SA YÉ scan module
 * Sober, educational, robust, OCR-quality focused
 * 
 * Philosophy: "Guide without blocking, reassure without complexity"
 */

import React, { useState, useRef, useEffect } from 'react';
import { analyzeImageQuality, ImageQualityResult } from '../services/imageQualityDetection';
import { assessCaptureQuality, getRandomEducationalTip, PRIVACY_REASSURANCE } from '../services/captureGuidance';

/**
 * SCREEN 1 - Home/Welcome Screen
 * 
 * Goal: Launch scan without friction, reassure user
 */
export const ScanHomeScreen: React.FC<{
  onStartStandardScan: () => void;
  onStartLongReceipt: () => void;
  onShowTips: () => void;
}> = ({ onStartStandardScan, onStartLongReceipt, onShowTips }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      {/* Camera Icon (centered) */}
      <div className="mb-8">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-5xl text-white">📸</span>
        </div>
      </div>

      {/* Primary Button */}
      <button
        onClick={onStartStandardScan}
        className="w-full max-w-md bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-700 transition-colors mb-4"
      >
        Scanner un ticket
      </button>

      {/* Secondary Button (discrete) */}
      <button
        onClick={onStartLongReceipt}
        className="w-full max-w-md bg-white border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-medium text-base hover:bg-blue-50 transition-colors mb-6"
      >
        Scanner un ticket long
      </button>

      {/* Tips Link */}
      <button
        onClick={onShowTips}
        className="text-blue-600 underline text-sm hover:text-blue-800"
      >
        Conseils pour un bon scan
      </button>

      {/* Micro-text (reassurance) */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-600">
          🔒 Traitement local • ❌ Aucune donnée personnelle • 💶 Aucun paiement
        </p>
      </div>
    </div>
  );
};

/**
 * SCREEN 2 - Active Camera (standard scan)
 * 
 * Goal: Guide without blocking
 */
export const ActiveCameraScreen: React.FC<{
  onCapture: (image: Blob) => void;
  onCancel: () => void;
}> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [qualityIndicators, setQualityIndicators] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            onCapture(blob);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Video stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Ticket silhouette overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-4/5 h-3/5 border-4 border-white border-dashed rounded-lg opacity-50">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
        </div>
      </div>

      {/* Real-time indicators (non-intrusive) */}
      <div className="absolute top-4 left-4 right-4 flex flex-col gap-2">
        {qualityIndicators.map((indicator, index) => (
          <div
            key={index}
            className={`px-3 py-2 rounded-lg text-sm font-medium ${
              indicator.startsWith('✔️') ? 'bg-green-500/80' : 'bg-orange-500/80'
            } text-white backdrop-blur`}
          >
            {indicator}
          </div>
        ))}
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex items-center justify-around">
          {/* Flash toggle */}
          <button
            onClick={() => setFlashEnabled(!flashEnabled)}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur"
          >
            <span className="text-2xl">{flashEnabled ? '⚡' : '⛶'}</span>
          </button>

          {/* Capture button (central) */}
          <button
            onClick={handleCapture}
            className="w-20 h-20 bg-white rounded-full border-4 border-blue-500 shadow-lg hover:scale-110 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-blue-500"></div>
          </button>

          {/* Info button */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur"
          >
            <span className="text-2xl">ⓘ</span>
          </button>
        </div>
      </div>

      {/* Help overlay */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-4">💡 Conseils rapides</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✔️ Posez le ticket bien à plat</li>
              <li>✔️ Tenez le téléphone droit au-dessus</li>
              <li>✔️ Utilisez la lumière naturelle si possible</li>
              <li>✔️ Évitez les reflets et le flash</li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {/* Cancel button */}
      <button
        onClick={onCancel}
        className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center backdrop-blur"
      >
        <span className="text-white text-xl">✕</span>
      </button>
    </div>
  );
};

/**
 * SCREEN 3 - Long Receipt Mode (multi-photo)
 * 
 * Goal: Capture long receipts without stress
 */
export const LongReceiptCameraScreen: React.FC<{
  onPhotoCaptured: (image: Blob) => void;
  onComplete: () => void;
  onCancel: () => void;
  currentPhoto: number;
  totalPhotos: number;
}> = ({ onPhotoCaptured, onComplete, onCancel, currentPhoto, totalPhotos }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCapture = () => {
    // Similar to standard camera but with multi-photo tracking
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            onPhotoCaptured(blob);
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Progress banner (top) */}
      <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white p-4 text-center z-10">
        <p className="font-semibold">
          📄 Ticket long — Photo {currentPhoto} / {totalPhotos}
        </p>
      </div>

      {/* Video stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Overlap zone indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-16">
        <div className="relative w-4/5 h-3/5">
          {currentPhoto > 1 && (
            <div className="absolute top-0 left-0 right-0 h-16 bg-yellow-500/30 border-2 border-yellow-500 border-dashed">
              <div className="flex items-center justify-center h-full text-yellow-200 font-semibold text-sm">
                ↑ Zone de chevauchement
              </div>
            </div>
          )}
          <div className="w-full h-full border-4 border-white border-dashed rounded-lg"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
            <div className="text-white text-3xl">↓</div>
          </div>
        </div>
      </div>

      {/* Educational message */}
      <div className="absolute top-20 left-4 right-4 bg-black/70 text-white p-3 rounded-lg text-sm backdrop-blur">
        Prenez le ticket de haut en bas, sans sauter de lignes
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="flex items-center justify-around gap-4">
          {/* Cancel button */}
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg font-medium"
          >
            ❌ Annuler
          </button>

          {/* Capture button */}
          <button
            onClick={handleCapture}
            className="w-20 h-20 bg-white rounded-full border-4 border-blue-500 shadow-lg"
          >
            🔘
          </button>

          {/* Complete button (enabled after min 2 photos) */}
          <button
            onClick={onComplete}
            disabled={currentPhoto < 2}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            ✔️ Terminer
          </button>
        </div>
      </div>
    </div>
  );
};

// Additional screens (4-7) will be in separate file due to length...
