import React, { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';

type ReceiptScannerProps = {
  onScanComplete: (extractedText: string, imageData: string) => void;
  territory: string;
};

export const ReceiptScanner: React.FC<ReceiptScannerProps> = ({
  onScanComplete,
  territory,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
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
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
        stopCamera();
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
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async () => {
    if (!capturedImage) return;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      const worker = await createWorker('fra', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const {
        data: { text },
      } = await worker.recognize(capturedImage);
      await worker.terminate();

      onScanComplete(text, capturedImage);
      setIsProcessing(false);
    } catch (err) {
      setError('Erreur lors de l\'analyse du ticket. Veuillez réessayer.');
      console.error('OCR error:', err);
      setIsProcessing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📷 Scanner un ticket de caisse
        </h2>
        <p className="text-sm text-gray-600">
          Territoire : <span className="font-semibold">{territory}</span>
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
        <p className="text-sm text-blue-900">
          <strong>ℹ️ Information importante :</strong>
          <br />
          L'analyse OCR est effectuée localement sur votre appareil.
          <br />
          Aucune image n'est envoyée automatiquement à un serveur.
          <br />
          Vous devrez valider manuellement chaque ligne détectée.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-sm text-red-900">{error}</p>
        </div>
      )}

      {!capturedImage && !isCameraActive && (
        <div className="space-y-4">
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

      {isCameraActive && (
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
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              📸 Capturer
            </button>
            <button
              onClick={stopCamera}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              ✖️ Annuler
            </button>
          </div>
        </div>
      )}

      {capturedImage && !isProcessing && (
        <div className="space-y-4">
          <img
            src={capturedImage}
            alt="Ticket capturé"
            className="w-full rounded-lg border-2 border-gray-300"
          />
          <div className="flex gap-2">
            <button
              onClick={processImage}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              🔍 Analyser le ticket
            </button>
            <button
              onClick={retakePhoto}
              className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              🔄 Reprendre
            </button>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-700 font-medium">
              Analyse en cours... {progress}%
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
          Aucun cloud, aucun serveur externe.
        </p>
      </div>
    </div>
  );
};
