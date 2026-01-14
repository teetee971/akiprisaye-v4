/**
 * Home Page v4.0 - Modern & Minimalist
 * 
 * Complete redesign following Apple/Airbnb minimalist principles
 * - Clean hero with single CTA
 * - 3 simple steps
 * - Generous spacing
 * - Smooth animations
 * - Mobile-first responsive
 */

import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function HomeV4() {
  const [stats, setStats] = useState({
    scans: 0,
    products: 0,
    territories: 12
  });

  useEffect(() => {
    // Load real stats from localStorage
    const savedStats = localStorage.getItem('platform_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  return (
    <div className="home-v4">
      
      {/* 🏆 HERO SECTION */}
      <section className="hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-content"
        >
          <h1 className="hero-title">
            Comprendre et comparer les prix<br />
            des territoires d'outre-mer
          </h1>
          
          <p className="hero-subtitle">
            Données publiques • Sans publicité • Indépendant
          </p>
          
          {/* CTA UNIQUE ET CLAIR */}
          <Link 
            to="/comparateur" 
            className="cta-primary"
          >
            🔍 Rechercher un produit
          </Link>
          
          <Link 
            to="/scan" 
            className="cta-secondary"
          >
            ou scanner un ticket
          </Link>
        </motion.div>
      </section>

      {/* 📊 3 ÉTAPES SIMPLES */}
      <section className="steps">
        <div className="steps-grid">
          {[
            { icon: '🧾', title: 'Scanner', desc: 'Ticket ou code-barres', link: '/scan' },
            { icon: '💡', title: 'Comprendre', desc: 'Infos et équivalences', link: '/comprendre-prix' },
            { icon: '⚖️', title: 'Comparer', desc: 'Entre enseignes', link: '/comparateur' }
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link to={step.link} className="step-card">
                <div className="step-icon">{step.icon}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🌍 TERRITOIRES */}
      <section className="territories">
        <h2 className="section-title">12 territoires d'outre-mer</h2>
        <div className="territories-grid">
          {[
            { code: 'GP', name: 'Guadeloupe', flag: '🇬🇵' },
            { code: 'MQ', name: 'Martinique', flag: '🇲🇶' },
            { code: 'GF', name: 'Guyane', flag: '🇬🇫' },
            { code: 'RE', name: 'Réunion', flag: '🇷🇪' },
            { code: 'YT', name: 'Mayotte', flag: '🇾🇹' },
            { code: 'NC', name: 'Nouvelle-Calédonie', flag: '🇳🇨' },
            { code: 'PF', name: 'Polynésie française', flag: '🇵🇫' },
            { code: 'WF', name: 'Wallis-et-Futuna', flag: '🇼🇫' },
            { code: 'PM', name: 'Saint-Pierre-et-Miquelon', flag: '🇵🇲' },
            { code: 'BL', name: 'Saint-Barthélemy', flag: '🇧🇱' },
            { code: 'MF', name: 'Saint-Martin', flag: '🇲🇫' },
            { code: 'TF', name: 'TAAF', flag: '🇹🇫' }
          ].map(t => (
            <div key={t.code} className="territory-item" title={t.name}>
              <span className="territory-flag">{t.flag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 🎯 FONCTIONNALITÉS CLÉS */}
      <section className="features">
        <h2 className="section-title">Ce que vous pouvez faire</h2>
        <ul className="features-list">
          <li>✓ Comparer les prix entre enseignes</li>
          <li>✓ Suivre l'évolution des prix</li>
          <li>✓ Localiser les magasins sur carte</li>
          <li>✓ Exporter les données ouvertes</li>
        </ul>
      </section>

      {/* 📈 COMPTEURS PUBLICS */}
      {(stats.scans > 0 || stats.products > 0) && (
        <section className="stats">
          <h2 className="section-title">Plateforme citoyenne</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.scans.toLocaleString()}</div>
              <div className="stat-label">Scans</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.products.toLocaleString()}</div>
              <div className="stat-label">Produits</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.territories}</div>
              <div className="stat-label">Territoires</div>
            </div>
          </div>
        </section>
      )}

      {/* 🏛️ OBSERVATOIRE */}
      <section className="observatory">
        <div className="observatory-content">
          <span className="observatory-icon">🏛️</span>
          <h3 className="observatory-title">Observatoire citoyen indépendant</h3>
          <p className="observatory-desc">
            Toutes nos données sont ouvertes et vérifiables<br />
            Licence Etalab 2.0
          </p>
          <div className="observatory-actions">
            <Link to="/observatoire" className="btn-observatory">
              Accéder à l'observatoire
            </Link>
            <Link to="/methodologie" className="btn-docs">
              Documentation
            </Link>
          </div>
        </div>
      </section>

      {/* 📞 FOOTER MINIMAL */}
      <footer className="footer-minimal">
        <Link to="/faq">FAQ</Link>
        <span>•</span>
        <Link to="/methodologie">Méthodologie</Link>
        <span>•</span>
        <Link to="/contact">Contact</Link>
        <span>•</span>
        <Link to="/mentions-legales">Mentions légales</Link>
      </footer>

    </div>
  );
}
