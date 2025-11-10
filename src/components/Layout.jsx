import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import '../styles/shared-nav.css'; // Nous allons déplacer ce fichier juste après

const Layout = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();
  const burgerMenuRef = useRef(null);
  const closeButtonRef = useRef(null);

  const toggleMobileNav = () => setMobileNavOpen(!isMobileNavOpen);
  const closeMobileNav = () => setMobileNavOpen(false);

  useEffect(() => {
    closeMobileNav();
  }, [location.pathname]);
  
  useEffect(() => {
    document.body.style.overflow = isMobileNavOpen ? 'hidden' : '';
    
    // Focus management
    if (isMobileNavOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    } else if (!isMobileNavOpen && burgerMenuRef.current) {
      burgerMenuRef.current.focus();
    }
  }, [isMobileNavOpen]);

  // Keyboard navigation - close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileNavOpen) {
        closeMobileNav();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Aller au contenu principal
      </a>

      <div 
        className={`nav-overlay ${isMobileNavOpen ? 'active' : ''}`}
        onClick={closeMobileNav}
        aria-hidden="true"
      ></div>

      <nav className={`mobile-nav ${isMobileNavOpen ? 'active' : ''}`} role="navigation" aria-label="Menu principal mobile">
        <div className="mobile-nav-header">
          <span className="mobile-nav-title">Menu</span>
          <button 
            ref={closeButtonRef}
            className="close-nav" 
            onClick={closeMobileNav} 
            aria-label="Fermer le menu"
          >
            &times;
          </button>
        </div>
        <ul className="mobile-nav-list">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink 
                to={link.to} 
                onClick={closeMobileNav}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                <span className="mobile-nav-icon">{link.icon}</span>{link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <header className="shared-header">
        <div className="shared-header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              ref={burgerMenuRef}
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
          <nav className="header-nav" role="navigation" aria-label="Menu principal">
            <NavLink to="/comparateur" className={({ isActive }) => isActive ? 'active' : ''}>
              Comparateur
            </NavLink>
            <NavLink to="/scan" className={({ isActive }) => isActive ? 'active' : ''}>
              Scanner
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''}>
              Contact
            </NavLink>
          </nav>
        </div>
      </header>
      
      <main id="main-content" className="main-content">
        <Outlet /> {/* Le contenu de la page sera injecté ici */}
      </main>

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
