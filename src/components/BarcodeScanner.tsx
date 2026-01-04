import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import type { ScanState, ScannerOptions, ScanStateTransition } from '../types/scan';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
  options?: ScannerOptions;
}

export default function BarcodeScanner({ onScan, onClose, options = {} }: BarcodeScannerProps) {
  // Scan state management
  const [scanState, setScanState] = useState<ScanState>('idle');
  
  // Legacy states (kept for backward compatibility)
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [torchSupported, setTorchSupported] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanStartTimeRef = useRef<number>(0);
  
  // Configuration with defaults
  const {
    timeout = 15000,
    enableDebugLogging = false,
  } = options;

  // State transition handler with logging
  const transitionState = (to: ScanState, reason?: string) => {
    const from = scanState;
    
    setScanState(to);
    
    if (enableDebugLogging) {
      console.log(`[SCAN] State transition: ${from} → ${to}`, reason || '');
    }
  };

  useEffect(() => {
    readerRef.current = new BrowserMultiFormatReader();
    transitionState('idle', 'Component mounted');
    
    return () => {
      stopScanning();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startScanning = async () => {
    setError(null);
    setIsScanning(true);
    setHasPermission(null); // Reset permission state
    scanStartTimeRef.current = Date.now();
    transitionState('scanning', 'User initiated scan');

    try {
      // Check if getUserMedia is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia non disponible sur ce navigateur');
      }

      if (enableDebugLogging) {
        console.log('[SCAN] 📷 Requesting camera access...');
      }
      
      // Request camera permission with proper constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
      
      if (enableDebugLogging) {
        console.log('[SCAN] ✅ Camera access granted');
      }
      streamRef.current = stream;
      setHasPermission(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              if (enableDebugLogging) {
                console.log('[SCAN] 📹 Video metadata loaded');
              }
              resolve();
            };
            videoRef.current.onerror = () => {
              console.error('[SCAN] ❌ Video error');
              reject(new Error('Erreur de chargement vidéo'));
            };
          } else {
            reject(new Error('Video ref not available'));
          }
        });
        
        await videoRef.current.play();
        if (enableDebugLogging) {
          console.log('[SCAN] ▶️ Video playing');
        }
      }

      // Check if torch is supported
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities() as any;
      if (enableDebugLogging) {
        console.log('[SCAN] 📱 Camera capabilities:', capabilities);
      }
      
      if ('torch' in capabilities) {
        setTorchSupported(true);
        if (enableDebugLogging) {
          console.log('[SCAN] 🔦 Torch supported');
        }
      }

      // Start decoding with timeout
      const timeoutId = setTimeout(() => {
        console.warn('[SCAN] ⏱️ Scan timeout');
        setError('⏱️ Timeout: Approchez le code-barres de la caméra (10-20 cm)');
        transitionState('error', `Timeout after ${timeout}ms`);
      }, timeout);

      if (enableDebugLogging) {
        console.log('[SCAN] 🔍 Starting barcode detection...');
      }
      
      if (readerRef.current && videoRef.current) {
        readerRef.current.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
          if (result) {
            clearTimeout(timeoutId);
            const code = result.getText();
            const duration = Date.now() - scanStartTimeRef.current;
            
            if (enableDebugLogging) {
              console.log(`[SCAN] ✅ Barcode detected in ${duration}ms:`, code);
            }
            
            transitionState('processing', `Barcode detected: ${code}`);
            stopScanning();
            onScan(code);
          }
          
          if (err && !(err instanceof NotFoundException)) {
            console.error('[SCAN] Scan error:', err);
          }
        });
      }

    } catch (err: any) {
      console.error('[SCAN] ❌ Camera error:', err);
      setHasPermission(false);
      setIsScanning(false);
      
      if (err.name === 'NotAllowedError') {
        transitionState('permission_denied', 'User denied camera access');
        setError('📷 Accès caméra refusé. Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.');
      } else if (err.name === 'NotFoundError') {
        transitionState('error', 'No camera found');
        setError('📷 Aucune caméra détectée sur cet appareil. Utilisez l\'import d\'image ou la saisie manuelle.');
      } else if (err.name === 'NotReadableError') {
        transitionState('error', 'Camera already in use');
        setError('📷 Caméra déjà utilisée par une autre application. Fermez les autres applications utilisant la caméra.');
      } else if (err.name === 'NotSupportedError' || err.message?.includes('getUserMedia')) {
        transitionState('error', 'Camera not supported');
        setError('📷 Caméra non supportée sur ce navigateur. Utilisez Chrome, Firefox ou Safari récent. Ou utilisez l\'import d\'image.');
      } else {
        transitionState('error', err.message);
        setError(`❌ Erreur: ${err.message || 'Impossible d\'accéder à la caméra'}. Essayez l\'import d\'image.`);
      }
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    
    if (readerRef.current) {
      readerRef.current.reset();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setTorchEnabled(false);
    
    if (scanState === 'scanning') {
      transitionState('idle', 'Scanning stopped by user');
    }
  };

  const toggleTorch = async () => {
    if (!streamRef.current || !torchSupported) return;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      await track.applyConstraints({
        advanced: [{ torch: !torchEnabled } as any],
      });
      setTorchEnabled(!torchEnabled);
    } catch (err) {
      console.error('[SCAN] Torch error:', err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsScanning(true);
    transitionState('processing', 'Processing uploaded image');

    try {
      if (readerRef.current) {
        const imageUrl = URL.createObjectURL(file);
        const result = await readerRef.current.decodeFromImageUrl(imageUrl);
        const code = result.getText();
        URL.revokeObjectURL(imageUrl);
        setIsScanning(false);
        
        if (enableDebugLogging) {
          console.log('[SCAN] ✅ Barcode detected from image:', code);
        }
        
        transitionState('processing', `Barcode from image: ${code}`);
        onScan(code);
      }
    } catch (err: any) {
      console.error('[SCAN] Image decode error:', err);
      setError('❌ Code-barres non détecté dans l\'image. Essayez la saisie manuelle.');
      setIsScanning(false);
      transitionState('error', 'Failed to decode image');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.length >= 8) {
      if (enableDebugLogging) {
        console.log('[SCAN] Manual input submitted:', manualInput);
      }
      transitionState('processing', `Manual input: ${manualInput}`);
      onScan(manualInput);
      setManualInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">📷 Scanner Code-Barres</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Scanning indicator with state */}
          {isScanning && scanState === 'scanning' && (
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 text-center">
              <div className="inline-flex items-center gap-2 text-blue-200 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span>Scan en cours... État: {scanState}</span>
              </div>
            </div>
          )}

          {/* Video Preview */}
          {isScanning && hasPermission && (
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-64 object-cover"
                playsInline
                muted
              />
              
              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="border-2 border-green-500 w-64 h-32 rounded-lg shadow-lg">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-lg"></div>
                </div>
              </div>

              {/* Torch button */}
              {torchSupported && (
                <button
                  onClick={toggleTorch}
                  className={`absolute bottom-4 right-4 p-3 rounded-full ${
                    torchEnabled ? 'bg-yellow-500' : 'bg-gray-700'
                  } text-white`}
                  aria-label="Lampe torche"
                >
                  {torchEnabled ? '🔦' : '💡'}
                </button>
              )}

              {/* Stop button */}
              <button
                onClick={stopScanning}
                className="absolute bottom-4 left-4 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
              >
                Arrêter
              </button>
            </div>
          )}

          {/* Instructions */}
          {!isScanning && !error && (
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 text-sm text-blue-200">
              <p className="font-semibold mb-2">📋 Instructions :</p>
              <ul className="space-y-1 ml-4 list-disc">
                <li>Cliquez sur "Scanner avec la caméra" pour activer la caméra</li>
                <li>Autorisez l'accès à la caméra quand le navigateur le demande</li>
                <li>Positionnez le code-barres à 10-20 cm de la caméra</li>
                <li>Assurez-vous d'avoir un bon éclairage</li>
                <li>Maintenez le téléphone stable pendant 1-2 secondes</li>
              </ul>
              
              <div className="mt-3 pt-3 border-t border-blue-700/30">
                <p className="text-xs text-blue-300">
                  <strong>⚠️ Important :</strong> La caméra nécessite HTTPS ou localhost. 
                  Si vous voyez "getUserMedia non disponible", utilisez l'import d'image.
                </p>
              </div>
            </div>
          )}

          {/* Permission denied help */}
          {hasPermission === false && (
            <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4 text-sm text-yellow-200">
              <p className="font-semibold mb-2">🔐 Comment autoriser l'accès à la caméra ?</p>
              <ul className="space-y-2 ml-4 list-disc">
                <li><strong>Chrome/Edge :</strong> Cliquez sur l'icône 🔒 ou ℹ️ dans la barre d'adresse → Paramètres du site → Caméra → Autoriser</li>
                <li><strong>Safari (iOS) :</strong> Réglages → Safari → Caméra → Autoriser</li>
                <li><strong>Firefox :</strong> Cliquez sur l'icône 🔒 → Autorisations → Caméra → Autoriser</li>
              </ul>
              <p className="mt-3 text-xs">Une fois l'autorisation donnée, rechargez la page et réessayez.</p>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}

          {/* Camera scan button */}
          {!isScanning && (
            <button
              onClick={startScanning}
              className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors"
            >
              📷 Scanner avec la caméra
            </button>
          )}

          {/* Image upload */}
          <div>
            <label className="block w-full">
              <div className="px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-center cursor-pointer transition-colors">
                🖼️ Importer une image
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Manual input */}
          <div className="border-t border-slate-700 pt-4">
            <p className="text-gray-400 text-sm mb-3">Ou saisir manuellement :</p>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Code EAN (8-13 chiffres)"
                className="flex-1 bg-slate-800 text-white border border-slate-600 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500"
                maxLength={13}
              />
              <button
                type="submit"
                disabled={manualInput.length < 8}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
              >
                ✓
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
