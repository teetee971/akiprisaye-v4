import React, { useState, useRef } from 'react';
import { runMultiReceiptOCR } from './services/multiReceiptOCR';

type ReceiptMultiCaptureProps = {
  onResult: (text: string, images: string[]) => void;
  onCancel?: () => void;
  territory: string;
};

type CapturedImage = {
  id: string;
  blob: Blob;
  dataUrl: string;
};

export const ReceiptMultiCapture: React.FC<ReceiptMultiCaptureProps> = ({
  onResult,
  onCancel,
  territory,
}) => {
  const [images, setImages] = useState<CapturedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      setError('Impossible d\'accéder à la caméra. Utilisez le bouton "Choisir un fichier".');
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

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            addImage(blob, dataUrl);
          }
        }, 'image/jpeg', 0.9);
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Le fichier est trop volumineux (maximum 5 MB).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        addImage(file, dataUrl);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
    // Reset input to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const addImage = (blob: Blob, dataUrl: string) => {
    const newImage: CapturedImage = {
      id: `${Date.now()}-${Math.random()}`,
      blob,
      dataUrl,
    };
    setImages((prev) => [...prev, newImage]);
    setError(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const retakeImage = (id: string) => {
    removeImage(id);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const analyze = async () => {
    if (images.length === 0) return;

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const blobs = images.map((img) => img.blob);
      const text = await runMultiReceiptOCR(blobs, setProgress);
      const dataUrls = images.map((img) => img.dataUrl);
      
      setLoading(false);
      onResult(text, dataUrls);
    } catch (err) {
      setError('Erreur lors de l\'analyse des photos. Veuillez réessayer.');
      console.error('OCR error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📷 Scanner un ticket long (plusieurs photos)
        </h2>
        <p className="text-sm text-gray-600">
          Territoire : <span className="font-semibold">{territory}</span>
        </p>
      </div>

      {/* Important information */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm text-blue-900">
          <strong>ℹ️ Information importante :</strong>
          <br />
          Analyse locale en cours — aucune donnée transmise
          <br />
          L'OCR est effectué localement sur votre appareil.
          <br />
          Vous pouvez prendre plusieurs photos pour un même ticket.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-900">{error}</p>
        </div>
      )}

      {/* Camera view */}
      {isCameraActive && (
        <div className="space-y-4 mb-6">
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
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              📸 Capturer
            </button>
            <button
              onClick={stopCamera}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              ✖️ Fermer caméra
            </button>
          </div>
        </div>
      )}

      {/* Image list */}
      {images.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            📸 Photos capturées ({images.length})
          </h3>
          <ul className="space-y-3">
            {images.map((image, index) => (
              <li
                key={image.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <img
                  src={image.dataUrl}
                  alt={`Photo ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border border-gray-300"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Photo {index + 1}</p>
                  <p className="text-xs text-gray-500">
                    {(image.blob.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => retakeImage(image.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded border border-blue-600 hover:bg-blue-50"
                    disabled={loading}
                  >
                    🔄 Reprendre
                  </button>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded border border-red-600 hover:bg-red-50"
                    disabled={loading}
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action buttons */}
      {!loading && (
        <div className="space-y-3">
          {!isCameraActive && (
            <>
              <button
                onClick={startCamera}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                📷 Ajouter une photo (caméra)
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
                disabled={loading}
              >
                📁 Ajouter une photo (fichier)
              </button>

              {images.length > 0 && (
                <>
                  <div className="pt-3 border-t border-gray-300"></div>
                  <button
                    onClick={analyze}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    disabled={loading}
                  >
                    🔍 Analyser le ticket ({images.length} photo{images.length > 1 ? 's' : ''})
                  </button>
                  {onCancel && (
                    <button
                      onClick={onCancel}
                      className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      ← Retour au mode simple
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* Processing indicator */}
      {loading && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-700 font-medium">
              Analyse en cours... {progress}%
            </p>
            <p className="text-sm text-gray-500">
              Traitement de {images.length} photo{images.length > 1 ? 's' : ''}
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Technical note */}
      <div className="mt-6 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p>
          <strong>Note technique :</strong> OCR local avec Tesseract.js.
          <br />
          Aucun cloud, aucun serveur externe. Détection automatique de fin de ticket.
        </p>
      </div>
    </div>
  );
};
