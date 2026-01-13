/**
 * Scanner Hub - Unified entry point for all scanning functionalities
 * 
 * Combines all scan modes in one place:
 * - Barcode scanner (EAN-13, EAN-8, UPC)
 * - OCR text scanner (receipts, documents)
 * - Product scanner (complete product analysis)
 * - Photo analysis (identify product by image)
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Barcode, FileText, ShoppingBag, Camera, History, Info } from 'lucide-react';

interface ScanMode {
  id: string;
  title: string;
  description: string;
  icon: any;
  route: string;
  color: string;
  badge?: string;
}

const SCAN_MODES: ScanMode[] = [
  {
    id: 'barcode',
    title: 'Scanner Code-Barres',
    description: 'Lecture rapide de codes EAN-13, EAN-8, UPC pour identifier les produits',
    icon: Barcode,
    route: '/scan-ean',
    color: 'blue',
    badge: 'Rapide',
  },
  {
    id: 'ocr',
    title: 'Scanner Texte & Tickets',
    description: 'Extraction de texte depuis images, tickets de caisse, et documents',
    icon: FileText,
    route: '/scan',
    color: 'green',
    badge: 'OCR Local',
  },
  {
    id: 'product',
    title: 'Scanner Produit Complet',
    description: 'Analyse complète : code-barres, ingrédients, prix, et informations nutritionnelles',
    icon: ShoppingBag,
    route: '/scanner-produit',
    color: 'purple',
    badge: 'Complet',
  },
  {
    id: 'photo',
    title: 'Analyse Photo Produit',
    description: 'Identifiez un produit par sa photo et extrayez les informations clés',
    icon: Camera,
    route: '/analyse-photo-produit',
    color: 'orange',
    badge: 'IA',
  },
];

const FEATURES = [
  {
    icon: '🔒',
    title: 'Traitement 100% local',
    description: 'Toutes les analyses sont effectuées sur votre appareil, vos données restent privées',
  },
  {
    icon: '⚡',
    title: 'Ultra-rapide',
    description: 'Résultats instantanés grâce à notre technologie de scan optimisée',
  },
  {
    icon: '🎯',
    title: 'Haute précision',
    description: 'Algorithmes de pointe pour une reconnaissance fiable des codes et textes',
  },
  {
    icon: '📱',
    title: 'Compatible mobile',
    description: 'Fonctionne parfaitement sur smartphones et tablettes',
  },
];

export default function ScannerHub() {
  const getColorClasses = (color: string, type: 'bg' | 'text' | 'border' | 'hover') => {
    const colorMap: Record<string, Record<string, string>> = {
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', hover: 'hover:border-blue-500/50' },
      green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30', hover: 'hover:border-green-500/50' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30', hover: 'hover:border-purple-500/50' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30', hover: 'hover:border-orange-500/50' },
    };
    return colorMap[color]?.[type] || colorMap.blue[type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Helmet>
        <title>Scanner - A KI PRI SA YÉ</title>
        <meta name="description" content="Scannez vos produits par code-barres, texte, ou photo. Analyse locale et sécurisée." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            📷 Scanner
          </h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Scannez et analysez vos produits en toute simplicité. 
            Choisissez le mode adapté à vos besoins.
          </p>
        </div>

        {/* Scan Modes Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {SCAN_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <Link
                key={mode.id}
                to={mode.route}
                className={`
                  relative group
                  bg-slate-900/50 backdrop-blur-sm
                  border-2 ${getColorClasses(mode.color, 'border')} ${getColorClasses(mode.color, 'hover')}
                  rounded-xl p-8
                  transition-all duration-300
                  hover:scale-105 hover:shadow-2xl
                `}
              >
                {/* Badge */}
                {mode.badge && (
                  <div className={`absolute top-4 right-4 ${getColorClasses(mode.color, 'bg')} ${getColorClasses(mode.color, 'text')} text-xs px-3 py-1 rounded-full font-medium`}>
                    {mode.badge}
                  </div>
                )}

                {/* Icon */}
                <div className={`${getColorClasses(mode.color, 'bg')} ${getColorClasses(mode.color, 'text')} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={32} />
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-semibold mb-3 ${getColorClasses(mode.color, 'text')}`}>
                  {mode.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed mb-4">
                  {mode.description}
                </p>

                {/* CTA */}
                <div className={`${getColorClasses(mode.color, 'text')} flex items-center font-medium group-hover:translate-x-2 transition-transform`}>
                  Commencer <span className="ml-2">→</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* OCR Hub Link */}
        <div className="mb-12 text-center">
          <Link
            to="/ocr"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <History size={20} />
            Accéder au Hub OCR & Historique
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="font-semibold text-slate-100 mb-2">{feature.title}</h4>
              <p className="text-sm text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 text-slate-100 flex items-center gap-2">
            <Info size={24} />
            Comment ça marche ?
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">Choisissez votre mode de scan</h3>
                <p className="text-sm text-slate-400">Sélectionnez le type d'analyse adapté à votre besoin : code-barres, texte, produit complet, ou photo.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">Scannez ou téléchargez</h3>
                <p className="text-sm text-slate-400">Utilisez votre caméra pour scanner en direct ou téléchargez une image existante.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">Obtenez les résultats</h3>
                <p className="text-sm text-slate-400">L'analyse est effectuée localement sur votre appareil, vos données restent privées et sécurisées.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 mb-1">Comparez et économisez</h3>
                <p className="text-sm text-slate-400">Utilisez les informations obtenues pour comparer les prix et faire des économies.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">Vous préférez chercher directement ?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/comparateurs"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-300 text-sm transition"
            >
              📊 Comparateur de prix
            </Link>
            <Link
              to="/carte"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-300 text-sm transition"
            >
              🗺️ Carte des magasins
            </Link>
            <Link
              to="/liste-courses"
              className="px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-slate-300 text-sm transition"
            >
              📝 Liste de courses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
