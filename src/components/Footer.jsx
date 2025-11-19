import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      className="bg-slate-900 border-t border-slate-800 mt-auto"
      style={{ paddingBottom: 'max(1.5rem, var(--safe-bottom))' }}
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Links */}
        <nav
          className="flex flex-wrap justify-center gap-6 mb-6 text-sm"
          aria-label="Navigation du pied de page"
        >
          <Link
            to="/actualites"
            className="text-slate-300 hover:text-blue-400 transition-colors"
          >
            À propos
          </Link>
          <Link
            to="/pricing"
            className="text-slate-300 hover:text-blue-400 transition-colors"
          >
            Tarifs
          </Link>
          <a
            href="/faq.html"
            className="text-slate-300 hover:text-blue-400 transition-colors"
          >
            FAQ
          </a>
          <a
            href="/contact.html"
            className="text-slate-300 hover:text-blue-400 transition-colors"
          >
            Contact
          </a>
          <Link
            to="/mentions-legales"
            className="text-slate-300 hover:text-blue-400 transition-colors"
          >
            Mentions légales
          </Link>
        </nav>

        {/* Copyright */}
        <div className="text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} A KI PRI SA YÉ - Tous droits réservés</p>
          <p className="mt-2 text-xs text-slate-500">
            Plateforme citoyenne de transparence des prix en Outre-mer
          </p>
        </div>
      </div>
    </footer>
  );
}
