import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../styles/shared-nav.css'; // Nous allons déplacer ce fichier juste après

const Layout = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  const toggleMobileNav = () => setMobileNavOpen(!isMobileNavOpen);
  const closeMobileNav = () => setMobileNavOpen(false);

  useEffect(() => {
    closeMobileNav();
  }, [location.pathname]);
  
  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? 'hidden' : '';
  }, [isMobileNavOpen]);

  const navLinks = [
    { to: '/', icon: '🏠', label: 'Accueil' },
    { to: '/comparateur', icon: '🔍', label: 'Comparateur' },
    { to: '/scan', icon: '📷', label: 'Scanner' },
    { to: '/contact', icon: '📧', label: 'Contact' },
    // Les autres liens seront ajoutés au fur et à mesure de la migration
  ];

  return (
    <>
      <div 
        className={`nav-overlay ${isMobileNavOpen ? 'active' : ''}`}
        onClick={closeMobileNav}
      ></div>

      <nav className={`mobile-nav ${isMobileNavOpen ? 'active' : ''}`} role="navigation">
        <div className="mobile-nav-header">
          <span className="mobile-nav-title">Menu</span>
          <button className="close-nav" onClick={closeMobileNav} aria-label="Fermer le menu">&times;</button>
        </div>
        <ul className="mobile-nav-list">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link to={link.to} onClick={closeMobileNav}>
                <span className="mobile-nav-icon">{link.icon}</span>{link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <header className="shared-header">
        <div className="shared-header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className={`burger-menu ${isMobileNavOpen ? 'active' : ''}`}
              onClick={toggleMobileNav} 
              aria-label="Menu" 
              aria-expanded={isMobileNavOpen}
            >
              <div className="burger-line"></div>
              <div className="burger-line"></div>
              <div className="burger-line"></div>
            </button>
            <Link to="/" className="shared-logo" aria-label="A KI PRI SA YÉ - Accueil">A KI PRI SA YÉ</Link>
          </div>
          <nav className="header-nav" role="navigation">
            <Link to="/comparateur">Comparateur</Link>
            <Link to="/scan">Scanner</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </header>
      
      <div className="main-content">
        <Outlet /> {/* Le contenu de la page sera injecté ici */}
      </div>

      <footer className="footer" role="contentinfo">
        <nav className="footer-links">
          {/* Mettre à jour avec <Link> */}
          <Link to="/mentions-legales">Mentions légales</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        <p className="footer-copy">© {new Date().getFullYear()} A KI PRI SA YÉ - Tous droits réservés</p>
      </footer>
    </>
  );
};

export default Layout;
