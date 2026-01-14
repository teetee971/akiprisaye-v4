/**
 * OCR Routes Test
 * 
 * Validates that OCR Hub and OCR History routes are properly configured
 * and accessible in the application.
 */

import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

// Helper to wrap components with necessary providers
const _renderWithProviders = (component, _initialEntries = ['/']) => {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={initialEntries}>
        {component}
      </MemoryRouter>
    </HelmetProvider>
  );
};

describe('OCR Routes', () => {
  it('should render OCRHub component when navigating to /ocr', () => {
    renderWithProviders(
      <Routes>
        <Route path="/ocr" element={<OCRHub />} />
      </Routes>,
      ['/ocr']
    );
    
    // Check that the OCR Hub title is rendered
    expect(screen.getByText('🔎 OCR & Scan')).toBeInTheDocument();
    expect(screen.getByText('Extraction locale, transparente et vérifiable')).toBeInTheDocument();
  });

  it('should render OCRHub with all scan mode cards', () => {
    renderWithProviders(
      <Routes>
        <Route path="/ocr" element={<OCRHub />} />
      </Routes>,
      ['/ocr']
    );
    
    // Check that all OCR modes are present
    expect(screen.getByText('Scanner texte & tickets')).toBeInTheDocument();
    expect(screen.getByText('Scanner code-barres')).toBeInTheDocument();
    expect(screen.getByText('Scanner produit complet')).toBeInTheDocument();
    expect(screen.getByText('Analyse photo produit')).toBeInTheDocument();
  });

  it('should render OCRHistory component when navigating to /ocr/history', () => {
    renderWithProviders(
      <Routes>
        <Route path="/ocr/history" element={<OCRHistory />} />
      </Routes>,
      ['/ocr/history']
    );
    
    // Check that the OCR History title is rendered
    expect(screen.getByText('📜 Historique OCR')).toBeInTheDocument();
    expect(screen.getByText('Vos scans OCR sont stockés localement sur cet appareil uniquement')).toBeInTheDocument();
  });

  it('should render RGPD compliance information in OCRHub', () => {
    renderWithProviders(
      <Routes>
        <Route path="/ocr" element={<OCRHub />} />
      </Routes>,
      ['/ocr']
    );
    
    // Check for governance principles
    expect(screen.getByText('OCR 100% local')).toBeInTheDocument();
    expect(screen.getByText('Pas de recommandation automatique')).toBeInTheDocument();
    expect(screen.getByText('Validation utilisateur obligatoire')).toBeInTheDocument();
    expect(screen.getByText('Compatible RGPD / AI Act')).toBeInTheDocument();
  });

  it('should render consent toggle in OCRHistory', () => {
    renderWithProviders(
      <Routes>
        <Route path="/ocr/history" element={<OCRHistory />} />
      </Routes>,
      ['/ocr/history']
    );
    
    // Check for consent section
    expect(screen.getByText('Conserver l\'historique OCR')).toBeInTheDocument();
    expect(screen.getByText(/Aucune donnée n'est envoyée à un serveur/)).toBeInTheDocument();
  });
});
