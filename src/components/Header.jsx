import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) =>
    location.pathname === path
      ? 'text-white'
      : 'text-slate-300 hover:text-white';

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-white font-bold text-xl">
          A KI PRI SA YÉ
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={isActive('/')}>Accueil</Link>
          <Link to="/comparateur" className={isActive('/comparateur')}>Comparateur</Link>
          <Link to="/actualites" className={isActive('/actualites')}>Actualités</Link>
          <Link to="/contact" className={isActive('/contact')}>Contact</Link>

          {user && (
            <Link to="/parametres" className={isActive('/parametres')}>
              Paramètres
            </Link>
          )}

          <ThemeToggle />
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-200"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setOpen(false)} className="block text-slate-200">Accueil</Link>
          <Link to="/comparateur" onClick={() => setOpen(false)} className="block text-slate-200">Comparateur</Link>
          <Link to="/actualites" onClick={() => setOpen(false)} className="block text-slate-200">Actualités</Link>
          <Link to="/contact" onClick={() => setOpen(false)} className="block text-slate-200">Contact</Link>

          {user && (
            <Link to="/parametres" onClick={() => setOpen(false)} className="block text-slate-200">
              Paramètres
            </Link>
          )}

          <ThemeToggle />
        </div>
      )}
    </header>
  );
}