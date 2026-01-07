/**
 * Receipt Scanner Component - v1.0.0
 * 
 * Composant de scan et d'analyse de tickets de caisse
 * pour l'observatoire citoyen A KI PRI SA YÉ
 * 
 * CONFORMITÉ INSTITUTIONNELLE:
 * - Traitement 100% local (pas d'upload serveur)
 * - Disclaimer RGPD explicite
 * - Aucune recommandation d'achat
 * - Transparence totale sur méthodologie
 * - Données non exhaustives (disclaimer visible)
 */

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { scanReceipt, type ReceiptAnalysisResult, type ReceiptLine } from '../services/receiptScanService';

/**
 * Constants
 */
const MAX_DISPLAYED_UNRECOGNIZED_LINES = 5;

interface ReceiptScannerProps {
  /**
   * Callback when receipt analysis is complete
   */
  onAnalysisComplete?: (result: ReceiptAnalysisResult) => void;
  
  /**
   * Callback to close the scanner
   */
  onClose?: () => void;
}

type ScanStep = 'capture' | 'processing' | 'validation' | 'comparison';

export default function ReceiptScanner({ onAnalysisComplete, onClose }: ReceiptScannerProps) {
  const [step, setStep] = useState<ScanStep>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ReceiptAnalysisResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userConsent, setUserConsent] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!userConsent) {
      setError('Veuillez accepter les conditions de traitement des données');
      return;
    }
    
    // Valider type fichier
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide (JPG, PNG, etc.)');
      return;
    }
    
    // Créer URL blob pour affichage
    const imageUrl = URL.createObjectURL(file);
    setCapturedImage(imageUrl);
    
    // Lancer analyse OCR
    await processReceipt(imageUrl);
    
    // Nettoyer le blob URL après traitement pour éviter les fuites mémoire
    URL.revokeObjectURL(imageUrl);
  };

  const processReceipt = async (imageUrl: string) => {
    setProcessing(true);
    setError(null);
    setStep('processing');
    
    try {
      const result = await scanReceipt(imageUrl, {
        timeout: 30000,
        language: 'fra',
      });
      
      if (!result.success || !result.analysis) {
        setError(result.error || 'Échec de l\'analyse du ticket. Veuillez réessayer avec une image plus nette.');
        setStep('capture');
        return;
      }
      
      setAnalysisResult(result.analysis);
      setStep('validation');
      
    } catch (err) {
      console.error('Receipt processing failed:', err);
      setError('Une erreur est survenue lors de l\'analyse. Veuillez réessayer.');
      setStep('capture');
    } finally {
      setProcessing(false);
    }
  };

  const handleValidateAndCompare = () => {
    if (analysisResult && onAnalysisComplete) {
      onAnalysisComplete(analysisResult);
    }
    setStep('comparison');
  };

  const handleReset = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    setStep('capture');
    setUserConsent(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          Scanner un ticket de caisse
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        )}
      </div>

      {/* GDPR Disclaimer - OBLIGATOIRE */}
      {step === 'capture' && (
        <div className="glass-card p-6 mb-6 border border-blue-500/30">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-white font-semibold mb-2">
                Traitement local et confidentiel
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Le ticket est analysé <strong>localement sur votre appareil</strong> pour identifier les produits.
                Aucune donnée personnelle n'est transmise à des serveurs externes.
                L'image n'est pas conservée sans votre consentement explicite.
              </p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userConsent}
                  onChange={(e) => setUserConsent(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 bg-slate-800"
                />
                <span className="text-sm text-gray-300">
                  J'accepte le traitement local de mon ticket à des fins d'observation des prix
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="glass-card p-4 mb-6 border border-red-500/30 bg-red-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Capture */}
      {step === 'capture' && (
        <div className="space-y-4">
          
          {/* Camera Capture */}
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={!userConsent}
            className="w-full glass-card p-8 hover:bg-slate-800/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Camera className="w-12 h-12 text-blue-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold text-lg mb-2">
              Prendre une photo
            </h3>
            <p className="text-sm text-gray-400">
              Utiliser l'appareil photo
            </p>
          </button>
          
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Capture photo avec caméra"
          />

          {/* File Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!userConsent}
            className="w-full glass-card p-8 hover:bg-slate-800/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Upload className="w-12 h-12 text-green-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold text-lg mb-2">
              Importer une image
            </h3>
            <p className="text-sm text-gray-400">
              Sélectionner depuis la galerie
            </p>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            aria-label="Import image depuis galerie"
          />

        </div>
      )}

      {/* Step 2: Processing */}
      {step === 'processing' && (
        <div className="glass-card p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-6"></div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Analyse en cours...
          </h3>
          <p className="text-gray-400">
            Extraction du texte et identification des produits
          </p>
          {capturedImage && (
            <div className="mt-6">
              <img 
                src={capturedImage} 
                alt="Ticket scanné" 
                className="max-w-sm mx-auto rounded-lg border border-slate-700"
              />
            </div>
          )}
        </div>
      )}

      {/* Step 3: Validation */}
      {step === 'validation' && analysisResult && (
        <div className="space-y-6">
          
          {/* Summary Card */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Résumé du ticket
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Enseigne</p>
                <p className="text-white font-semibold">
                  {analysisResult.storeName || 'Non détectée'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Date</p>
                <p className="text-white font-semibold">
                  {analysisResult.date ? (() => {
                    try {
                      return new Date(analysisResult.date).toLocaleDateString('fr-FR');
                    } catch {
                      return analysisResult.date; // Fallback to raw date string if parsing fails
                    }
                  })() : 'Non détectée'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Produits</p>
                <p className="text-white font-semibold">
                  {analysisResult.totalProductsRecognized}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total analysé</p>
                <p className="text-white font-semibold">
                  {analysisResult.totalAmount.toFixed(2)} €
                </p>
              </div>
            </div>
            
            {/* Recognition Rate */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Taux de reconnaissance</span>
                <span className="text-sm font-semibold text-white">
                  {analysisResult.recognitionRate}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${analysisResult.recognitionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Product Lines */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Produits détectés ({analysisResult.productLines.length})
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {analysisResult.productLines.map((line, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between p-3 bg-slate-800/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-white font-medium mb-1">
                      {line.normalizedLabel}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Confiance: {line.confidence}%</span>
                      {line.quantity && <span>Qté: {line.quantity}</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">
                      {line.price?.toFixed(2) || '?'} €
                    </p>
                    {line.needsValidation && (
                      <p className="text-xs text-yellow-400 mt-1">
                        À vérifier
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unrecognized Lines */}
          {analysisResult.unrecognizedLines.length > 0 && (
            <div className="glass-card p-6 border border-yellow-500/30">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-white font-semibold mb-2">
                    Lignes non reconnues ({analysisResult.unrecognizedLines.length})
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Ces lignes n'ont pas pu être identifiées automatiquement.
                  </p>
                  <div className="space-y-1">
                    {analysisResult.unrecognizedLines.slice(0, MAX_DISPLAYED_UNRECOGNIZED_LINES).map((line, idx) => (
                      <p key={idx} className="text-xs text-gray-500 font-mono">
                        {line}
                      </p>
                    ))}
                    {analysisResult.unrecognizedLines.length > MAX_DISPLAYED_UNRECOGNIZED_LINES && (
                      <p className="text-xs text-gray-500">
                        ... et {analysisResult.unrecognizedLines.length - MAX_DISPLAYED_UNRECOGNIZED_LINES} autres
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transparency Disclaimer - OBLIGATOIRE */}
          <div className="glass-card p-6 border border-blue-500/30">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="mb-2">
                  <strong>Comparaison indicative</strong> – Données non exhaustives – Outil d'information citoyenne.
                </p>
                <p className="text-xs text-gray-400">
                  Les prix affichés proviennent d'observations publiques et de contributions volontaires.
                  Nous ne donnons aucun conseil d'achat, aucune recommandation commerciale.
                  La comparaison est à titre informatif uniquement.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-medium transition-colors"
            >
              Scanner un autre ticket
            </button>
            <button
              onClick={handleValidateAndCompare}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Comparer les prix
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
