import React, { useState, useRef } from 'react';
import { analyzeImageQuality, getQualityMessage, ImageQualityResult } from './services/imageQualityDetection';
import { loadImage } from './services/receiptAutoCrop';

type GuidedCaptureStep = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

type CapturedPhoto = {
  id: string;
  blob: Blob;
  dataUrl: string;
  step: string;
  quality?: ImageQualityResult;
};

type GuidedReceiptCaptureProps = {
  onComplete: (photos: CapturedPhoto[]) => void;
  onCancel: () => void;
  territory: string;
};

const CAPTURE_STEPS: GuidedCaptureStep[] = [
  {
    id: 'top',
    title: 'Haut du ticket',
    description: 'Capturez le haut du ticket avec l\'enseigne et la date',
    icon: '📸',
  },
  {
    id: 'products',
    title: 'Lignes produits',
    description: 'Capturez les lignes de produits au centre du ticket',
    icon: '📸',
  },
  {
    id: 'totals',
    title: 'Totaux et bas',
    description: 'Capturez le bas du ticket avec les totaux',
    icon: '📸',
  },
];

/**
 * Guided Multi-Photo Receipt Capture
 * 
 * Guides user through capturing different zones of a long receipt
 * with automatic quality detection and recommendations
 */
export const GuidedReceiptCapture: React.FC<GuidedReceiptCaptureProps> = ({
  onComplete,
  onCancel,
  territory,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [analyzingQuality, setAnalyzingQuality] = useState(false);
  const [showQualityWarning, setShowQualityWarning] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<ImageQualityResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const analyzePhotoQuality = async (blob: Blob): Promise<ImageQualityResult | null> => {
    try {
      setAnalyzingQuality(true);
      const img = await loadImage(blob);
      const quality = await analyzeImageQuality(img);
      setCurrentQuality(quality);
      return quality;
    } catch (error) {
      console.error('Quality analysis error:', error);
      return null;
    } finally {
      setAnalyzingQuality(false);
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob(async (blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            const quality = await analyzePhotoQuality(blob);
            
            if (quality && !quality.suitable) {
              setShowQualityWarning(true);
            } else {
              addPhoto(blob, dataUrl, quality);
            }
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const quality = await analyzePhotoQuality(file);
        
        if (quality && !quality.suitable) {
          setShowQualityWarning(true);
        } else {
          addPhoto(file, dataUrl, quality);
        }
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const addPhoto = (blob: Blob, dataUrl: string, quality: ImageQualityResult | null) => {
    const newPhoto: CapturedPhoto = {
      id: `${Date.now()}-${Math.random()}`,
      blob,
      dataUrl,
      step: CAPTURE_STEPS[currentStep].id,
      quality: quality || undefined,
    };
    
    setPhotos((prev) => [...prev, newPhoto]);
    setShowQualityWarning(false);
    setCurrentQuality(null);
    
    // Move to next step if not at the end
    if (currentStep < CAPTURE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const forceAddPhoto = () => {
    if (currentQuality) {
      // User accepts photo despite quality issues
      // Implementation would capture current pending photo
      setShowQualityWarning(false);
      setCurrentQuality(null);
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleComplete = () => {
    stopCamera();
    onComplete(photos);
  };

  const currentStepInfo = CAPTURE_STEPS[currentStep];
  const progress = ((currentStep + 1) / CAPTURE_STEPS.length) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📸 Capture guidée - Ticket long
        </h2>
        <p className="text-sm text-gray-600">
          Territoire : <span className="font-semibold">{territory}</span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Étape {currentStep + 1}/{CAPTURE_STEPS.length}
          </span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current step */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          {currentStepInfo.icon} {currentStepInfo.title}
        </h3>
        <p className="text-sm text-blue-800">{currentStepInfo.description}</p>
      </div>

      {/* Quality warning */}
      {showQualityWarning && currentQuality && (
        <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
          <h4 className="text-sm font-semibold text-orange-900 mb-2">
            ⚠️ Qualité d'image détectée
          </h4>
          <p className="text-sm text-orange-800 mb-3">{getQualityMessage(currentQuality)}</p>
          {currentQuality.issues.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-orange-900 mb-1">Problèmes détectés :</p>
              <ul className="list-disc list-inside text-xs text-orange-800 space-y-1">
                {currentQuality.issues.map((issue, index) => (
                  <li key={index}>{issue.message}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setShowQualityWarning(false)}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded font-medium text-sm hover:bg-orange-700"
            >
              🔄 Reprendre la photo
            </button>
            <button
              onClick={forceAddPhoto}
              className="flex-1 bg-gray-600 text-white py-2 px-4 rounded font-medium text-sm hover:bg-gray-700"
            >
              → Continuer quand même
            </button>
          </div>
        </div>
      )}

      {/* Camera/capture controls */}
      {!showQualityWarning && (
        <div className="mb-6">
          {isCameraActive ? (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg bg-black"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-2">
                <button
                  onClick={capturePhoto}
                  disabled={analyzingQuality}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {analyzingQuality ? 'Analyse...' : '📸 Capturer'}
                </button>
                <button
                  onClick={stopCamera}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                >
                  ✖️ Fermer caméra
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={startCamera}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                📷 Ouvrir la caméra
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OU</span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                📁 Choisir un fichier
              </button>
            </div>
          )}
        </div>
      )}

      {/* Captured photos */}
      {photos.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            📸 Photos capturées ({photos.length}/{CAPTURE_STEPS.length})
          </h3>
          <div className="space-y-3">
            {photos.map((photo, index) => {
              const step = CAPTURE_STEPS.find((s) => s.id === photo.step);
              return (
                <div key={photo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <img
                    src={photo.dataUrl}
                    alt={`Photo ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border border-gray-300"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{step?.title || `Photo ${index + 1}`}</p>
                    {photo.quality && (
                      <p className="text-xs text-gray-600">
                        Qualité : {photo.quality.score}/100
                        {photo.quality.issues.length > 0 && ` - ${photo.quality.issues.length} point${photo.quality.issues.length > 1 ? 's' : ''} à vérifier`}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removePhoto(photo.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          ← Annuler
        </button>
        <button
          onClick={handleComplete}
          disabled={photos.length === 0}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          ✓ Analyser ({photos.length} photo{photos.length > 1 ? 's' : ''})
        </button>
      </div>

      {/* Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p>
          <strong>💡 Conseil :</strong>
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Tenir le ticket bien droit et à plat</li>
          <li>Assurer un bon éclairage uniforme</li>
          <li>Éviter les reflets et ombres</li>
          <li>La qualité est vérifiée automatiquement</li>
        </ul>
      </div>
    </div>
  );
};
