import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <>
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Menu */}
      <nav
        className={`fixed top-0 left-0 h-full w-80 bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navigation mobile"
      >
        <div className="flex items-center justify-between p-4 bg-blue-700" style={{ paddingTop: 'max(1rem, var(--safe-top))' }}>
          <div className="flex items-center gap-3">
            <img src="/logo-akpsy.svg" alt="A KI PRI SA YÉ" className="h-8" />
          </div>
          <button
            onClick={closeMobileMenu}
            className="text-white text-3xl leading-none hover:text-gray-300"
            aria-label="Fermer le menu"
          >
            &times;
          </button>
        </div>
        
        <ul className="py-4">
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 px-6 py-3 text-white hover:bg-blue-700/20 transition-colors border-l-4 border-transparent hover:border-blue-400"
              onClick={closeMobileMenu}
            >
              <span className="text-xl">🏠</span>
              <span>Accueil</span>
            </Link>
          </li>
          <li>
            <Link
              to="/comparateur"
              className="flex items-center gap-3 px-6 py-3 text-white hover:bg-blue-700/20 transition-colors border-l-4 border-transparent hover:border-blue-400"
              onClick={closeMobileMenu}
            >
              <span className="text-xl">🔍</span>
              <span>Comparateur</span>
            </Link>
          </li>
          <li>
            <Link
              to="/scan"
              className="flex items-center gap-3 px-6 py-3 text-white hover:bg-blue-700/20 transition-colors border-l-4 border-transparent hover:border-blue-400"
              onClick={closeMobileMenu}
            >
              <span className="text-xl">📷</span>
              <span>Scanner</span>
            </Link>
          </li>
          <li>
            <Link
              to="/carte"
              className="flex items-center gap-3 px-6 py-3 text-white hover:bg-blue-700/20 transition-colors border-l-4 border-transparent hover:border-blue-400"
              onClick={closeMobileMenu}
            >
              <span className="text-xl">🗺️</span>
              <span>Carte</span>
            </Link>
          </li>
          <li>
            <Link
              to="/pricing"
              className="flex items-center gap-3 px-6 py-3 text-white hover:bg-blue-700/20 transition-colors border-l-4 border-transparent hover:border-blue-400"
              onClick={closeMobileMenu}
            >
              <span className="text-xl">💰</span>
              <span>Tarifs</span>
            </Link>
          </li>
          <li>
            <Link
              to="/mon-compte"
              className="flex items-center gap-3 px-6 py-3 text-white hover:bg-blue-700/20 transition-colors border-l-4 border-transparent hover:border-blue-400"
              onClick={closeMobileMenu}
            >
              <span className="text-xl">👤</span>
              <span>Mon Compte</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Header */}
      <header
        className="sticky top-0 z-30 bg-blue-700 backdrop-blur-sm border-b border-blue-600/50 max-w-[100vw]"
        style={{ paddingTop: 'max(0.75rem, var(--safe-top))' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and burger menu */}
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-blue-600/50 transition-colors"
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
              >
                <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-6 h-0.5 bg-white my-1 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg hover:opacity-90 transition-opacity">
                <img src="/logo-akpsy.svg" alt="A KI PRI SA YÉ" className="h-10" />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6" aria-label="Navigation principale">
              <Link
                to="/comparateur"
                className="text-white/90 hover:text-white hover:bg-blue-600/30 px-3 py-2 rounded-lg transition-all"
              >
                Comparateur
              </Link>
              <Link
                to="/scan"
                className="text-white/90 hover:text-white hover:bg-blue-600/30 px-3 py-2 rounded-lg transition-all"
              >
                Scanner
              </Link>
              <Link
                to="/carte"
                className="text-white/90 hover:text-white hover:bg-blue-600/30 px-3 py-2 rounded-lg transition-all"
              >
                Carte
              </Link>
              <Link
                to="/pricing"
                className="text-white/90 hover:text-white hover:bg-blue-600/30 px-3 py-2 rounded-lg transition-all"
              >
                Tarifs
              </Link>
              <Link
                to="/mon-compte"
                className="text-white/90 hover:text-white hover:bg-blue-600/30 px-3 py-2 rounded-lg transition-all"
              >
                Mon Compte
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
