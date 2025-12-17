import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import PWAInstallToast from '../components/PWAInstallToast';
import StructuredData from '../components/StructuredData';

export default function Home() {
  const [lang, setLang] = useState('fr');

  const content = {
    fr: {
      title: 'Gérez votre budget facilement',
      subtitle: 'Comparez les prix et luttez contre la vie chère en Outre-mer',
      chat: 'Chat IA Local',
      chatDesc: 'Posez vos questions en créole, français ou espagnol',
      ocr: 'Scanner un ticket (OCR)',
      ocrDesc: 'Reconnaissance automatique des prix sur ticket',
      budget: 'Comparateur de prix',
      budgetDesc: 'Comparez les prix locaux en un clic',
      carte: 'Carte interactive',
      carteDesc: 'Localisez les magasins et comparez les prix géographiquement',
    },
    gp: {
      title: 'Jéré bidjé-w fasil',
      subtitle: 'Konparé pri-yo é palé kont lavi chè an péyi nou',
      chat: 'Chat IA Lokal',
      chatDesc: 'Pozé kèsyon-w an kréyol, fransé oben èspanyol',
      ocr: 'Skannyé on tiké (OCR)',
      ocrDesc: 'Rékonesans otomatik pri asi tiké',
      budget: 'Konparatè pri',
      budgetDesc: 'Konparé pri lokal-la an on klik',
      carte: 'Kat entyéraktif',
      carteDesc: 'Chwazi magazen-yo é konparé pri jeyografikman',
    },
    es: {
      title: 'Gestione su presupuesto fácilmente',
      subtitle: 'Compare precios y luche contra el alto costo de vida en Ultramar',
      chat: 'Chat IA Local',
      chatDesc: 'Haga preguntas en criollo, francés o español',
      ocr: 'Escanear un ticket (OCR)',
      ocrDesc: 'Reconocimiento automático de precios en tickets',
      budget: 'Comparador de precios',
      budgetDesc: 'Compare precios locales con un clic',
      carte: 'Mapa interactivo',
      carteDesc: 'Localice tiendas y compare precios geográficamente',
    },
  };

  const t = content[lang];

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 max-w-[100vw] overflow-x-hidden">
      {/* SEO Structured Data */}
      <StructuredData />
      
      {/* Skip to main content link for screen readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Aller au contenu principal
      </a>
      
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border-b border-blue-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="flex justify-end mb-4">
            <select
              className="bg-slate-800 text-white border border-slate-700 px-3 py-2 rounded-lg text-sm hover:bg-slate-700 transition-colors"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Sélectionner la langue"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="gp">🇬🇵 Kréyol</option>
              <option value="es">🇪🇸 Español</option>
            </select>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {t.title}
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/comparateur"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-blue-600/50 hover:-translate-y-0.5 motion-reduce:transform-none"
            >
              🔍 Découvrir l'application
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <main id="main-content" className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">
            🎯 Fonctionnalités
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/comparateur"
              className="group bg-slate-900 hover:bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 motion-reduce:transform-none hover:scale-105 motion-reduce:hover:scale-100"
            >
              <div className="text-4xl mb-4 transition-transform group-hover:scale-110 motion-reduce:transform-none">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t.budget}</h3>
              <p className="text-sm text-slate-400">{t.budgetDesc}</p>
            </Link>

            <Link
              to="/scan"
              className="group bg-slate-900 hover:bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 motion-reduce:transform-none hover:scale-105 motion-reduce:hover:scale-100"
            >
              <div className="text-4xl mb-4 transition-transform group-hover:scale-110 motion-reduce:transform-none">📷</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t.ocr}</h3>
              <p className="text-sm text-slate-400">{t.ocrDesc}</p>
            </Link>

            <Link
              to="/carte"
              className="group bg-slate-900 hover:bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 motion-reduce:transform-none hover:scale-105 motion-reduce:hover:scale-100"
            >
              <div className="text-4xl mb-4 transition-transform group-hover:scale-110 motion-reduce:transform-none">🗺️</div>
              <h3 className="text-xl font-semibold text-white mb-2">{t.carte}</h3>
              <p className="text-sm text-slate-400">{t.carteDesc}</p>
            </Link>

            <Link
              to="/alertes"
              className="group bg-slate-900 hover:bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 motion-reduce:transform-none hover:scale-105 motion-reduce:hover:scale-100"
            >
              <div className="text-4xl mb-4 transition-transform group-hover:scale-110 motion-reduce:transform-none">🔔</div>
              <h3 className="text-xl font-semibold text-white mb-2">Alertes</h3>
              <p className="text-sm text-slate-400">Prix anormaux, pénuries et variations</p>
            </Link>
          </div>
        </div>
      </main>

      {/* Mission Section */}
      <section className="bg-slate-900 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">🎗️ Notre Mission</h2>
          <p className="text-lg text-slate-300 mb-4">
            <strong className="text-blue-400">A KI PRI SA YÉ</strong> est une plateforme citoyenne dédiée à la transparence des prix en Outre-mer.
          </p>
          <p className="text-slate-400 mb-6">
            Comparez facilement les prix, consultez les alertes et gérez votre budget plus efficacement.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/a-propos"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              En savoir plus
            </Link>
            <Link
              to="/methodologie"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Notre méthodologie
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* PWA Install Toast */}
      <PWAInstallToast />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
