import { useState } from 'react';
import { extractTextFromImage } from '../services/ocrService';
import OCRResultView from '../components/OCRResultView';

export default function ScanOCR() {
  const [image, setImage] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setLoading(true);
    setError(null);
    setOcrResult(null);

    try {
      const result = await extractTextFromImage(file);
      
      if (result.success) {
        setOcrResult(result);
      } else {
        setError(result.error || 'Erreur lors de l\'extraction du texte');
      }
    } catch (err) {
      console.error('OCR error:', err);
      setError('Une erreur s\'est produite lors de l\'analyse de l\'image');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setImage(null);
    setOcrResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold text-white mb-6">📸 Scanner Ingrédients (OCR)</h1>
          
          {/* Information Banner */}
          <div className="mb-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <p className="text-blue-200 text-sm">
              ℹ️ <strong>Extraction de texte uniquement</strong> - Cette fonctionnalité extrait le texte 
              visible sur les étiquettes produits (ingrédients, allergènes, mentions légales). 
              Aucune interprétation ou recommandation n'est fournie.
            </p>
          </div>

          {/* Initial State - Upload */}
          {!loading && !ocrResult && !error && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-white font-semibold mb-2">Sélectionnez une photo</p>
                <p className="text-gray-400 text-sm mb-4">Format: JPG, PNG, WEBP</p>
                <label className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer transition-colors">
                  📷 Choisir une image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {/* Instructions */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">💡 Conseils pour une meilleure lecture</h3>
                <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
                  <li>Privilégiez un bon éclairage</li>
                  <li>Cadrez bien la zone de texte</li>
                  <li>Évitez les reflets et ombres</li>
                  <li>Tenez le téléphone stable</li>
                </ul>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mb-4"></div>
              <p className="text-white text-lg font-semibold">Analyse en cours...</p>
              <p className="text-gray-400 text-sm mt-2">Extraction du texte de l'image</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="space-y-4">
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
                <svg className="w-12 h-12 mx-auto mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-200 font-semibold mb-2">Erreur lors de l'analyse</p>
                <p className="text-red-300 text-sm">{error}</p>
              </div>
              <button
                onClick={handleRetry}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* Success State - Show Results */}
          {ocrResult && (
            <div className="space-y-4">
              <OCRResultView 
                result={ocrResult} 
                onRetry={handleRetry}
              />
            </div>
          )}

          {/* Image Preview */}
          {image && !ocrResult && (
            <div className="mt-6">
              <h3 className="text-white font-semibold mb-2">Aperçu de l'image</h3>
              <img 
                src={image} 
                alt="Image sélectionnée" 
                className="w-full rounded-lg border border-slate-700"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
