import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/glass.css';
import Home from './pages/Home';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';

// Lazy load other pages for better performance
const ChatIALocal = lazy(() => import('./components/ChatIALocal'));
const ScanOCR = lazy(() => import('./pages/ScanOCR'));
const Comparateur = lazy(() => import('./pages/Comparateur'));
const Carte = lazy(() => import('./pages/Carte'));
const Actualites = lazy(() => import('./pages/Actualites'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const MonCompte = lazy(() => import('./pages/MonCompte'));
const Pricing = lazy(() => import('./pages/Pricing'));

// Loading component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-white text-lg">Chargement...</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/chat' element={<ChatIALocal />} />
              <Route path='/scan' element={<ScanOCR />} />
              <Route path='/comparateur' element={<Comparateur />} />
              <Route path='/carte' element={<Carte />} />
              <Route path='/actualites' element={<Actualites />} />
              <Route path='/mentions-legales' element={<MentionsLegales />} />
              <Route path='/mon-compte' element={<MonCompte />} />
              <Route path='/pricing' element={<Pricing />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);