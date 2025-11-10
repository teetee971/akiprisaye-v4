import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const DEBOUNCE = 250;
const HISTORY_KEY = 'akiprisaye_search_history';
const MAX_HISTORY = 5;

// Get search history from localStorage
function getSearchHistory() {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error('Error reading search history:', err);
    return [];
  }
}

// Save to search history
function saveToHistory(product) {
  try {
    const history = getSearchHistory();
    // Remove if already exists to avoid duplicates
    const filtered = history.filter(p => p.ean !== product.ean);
    // Add to beginning
    const updated = [product, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error saving to history:', err);
  }
}

// Clear search history
function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (err) {
    console.error('Error clearing history:', err);
  }
}

export default function ProductSearch({ territory, onPickEAN }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trending, setTrending] = useState([]);
  const [history, setHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  // Load trending products on mount and when territory changes
  useEffect(() => {
    async function loadTrending() {
      try {
        const res = await fetch(`/api/products/trending?territory=${encodeURIComponent(territory || 'Guadeloupe')}`);
        const data = await res.json();
        setTrending(data);
      } catch (err) {
        console.error('Error loading trending products:', err);
      }
    }
    loadTrending();
  }, [territory]);

  // Load search history on mount
  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  // Search products when query changes
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}&territory=${encodeURIComponent(territory || 'Guadeloupe')}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Erreur recherche produit :', err);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE);

    return () => clearTimeout(timer);
  }, [query, territory]);

  // Determine if we should show suggestions
  useEffect(() => {
    setShowSuggestions(focused && query.length < 3);
  }, [focused, query]);

  const handlePickProduct = (product) => {
    onPickEAN(product.ean);
    saveToHistory(product);
    setHistory(getSearchHistory()); // Refresh history
    setQuery('');
    setResults([]);
    setShowSuggestions(false);
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        placeholder="🔍 Rechercher un produit (ex : riz basmati, lait, pâtes...)"
        className="w-full p-3 rounded-xl bg-slate-800 text-white outline-none placeholder-gray-400"
      />
      {loading && <div className="absolute right-3 top-3 text-xs text-gray-400">Chargement…</div>}
      
      {/* Search Results */}
      {results.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl max-h-80 overflow-auto">
          {results.map((p) => (
            <li
              key={p.ean}
              onClick={() => handlePickProduct(p)}
              className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer"
            >
              {p.image && (
                <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
              )}
              <div>
                <div className="text-gray-100 text-sm">{p.name}</div>
                <div className="text-gray-400 text-xs">{p.brand}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {/* Suggestions (History + Trending) when focused and query < 3 chars */}
      {showSuggestions && (
        <div className="absolute z-20 mt-2 w-full bg-slate-900/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl max-h-80 overflow-auto">
          {/* Search History */}
          {history.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
                <div className="text-xs font-semibold text-gray-400 uppercase">
                  🕒 Recherches récentes
                </div>
                <button
                  onClick={handleClearHistory}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Effacer
                </button>
              </div>
              {history.map((p) => (
                <div
                  key={p.ean}
                  onClick={() => handlePickProduct(p)}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer"
                >
                  {p.image && (
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                  )}
                  <div>
                    <div className="text-gray-100 text-sm">{p.name}</div>
                    <div className="text-gray-400 text-xs">{p.brand}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Trending Products */}
          {trending.length > 0 && (
            <div>
              <div className="px-3 py-2 border-b border-white/10">
                <div className="text-xs font-semibold text-gray-400 uppercase">
                  🔥 Produits populaires
                </div>
              </div>
              {trending.map((p) => (
                <div
                  key={p.ean}
                  onClick={() => handlePickProduct(p)}
                  className="flex items-center gap-3 p-3 hover:bg-white/5 cursor-pointer"
                >
                  {p.image && (
                    <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                  )}
                  <div>
                    <div className="text-gray-100 text-sm">{p.name}</div>
                    <div className="text-gray-400 text-xs">{p.brand}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

ProductSearch.propTypes = {
  territory: PropTypes.string,
  onPickEAN: PropTypes.func.isRequired,
};
