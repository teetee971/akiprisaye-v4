import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { LanguageSelector } from './i18n/LanguageSelector';

export default function Header() {
  const location = useLocation();
  const auth = useAuth();
  const user = auth?.user ?? null;
  const isAuthenticated = Boolean(user);
  const signOutAction = auth?.signOutUser ?? null;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <header className="w-full h-14 bg-transparent" aria-hidden="true" />;
  }

  const isActive = (path) =>
    location?.pathname === path ? 'text-blue-500' : 'text-gray-300';

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur">
      <Link to="/" className="text-white font-bold text-lg">
        A KI PRI SA YÉ
      </Link>

      <nav className="flex items-center gap-4">
        <Link to="/" className={isActive('/')}>
          Accueil
        </Link>

        <Link to="/comparateur" className={isActive('/comparateur')}>
          Comparateur
        </Link>

        <Link to="/parametres" className={isActive('/parametres')}>
          Paramètres
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              Bonjour {user?.displayName ?? 'Utilisateur'}
            </span>
            {signOutAction ? (
              <button
                type="button"
                onClick={() => signOutAction()}
                className="text-sm text-gray-300 hover:text-white"
              >
                Se déconnecter
              </button>
            ) : null}
          </div>
        ) : (
          <span className="text-sm text-gray-500">Invité</span>
        )}

        <ThemeToggle />
        <LanguageSelector variant="compact" />
      </nav>
    </header>
  );
}
