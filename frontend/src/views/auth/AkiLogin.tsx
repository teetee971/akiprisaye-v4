import { useMemo, useState } from 'react';
import {
  GithubAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithRedirect,
} from 'firebase/auth';

import { auth, firebaseError } from '@/lib/firebase';

/**
 * AkiLogin (mobile-first):
 * - Uses Firebase redirect mode only (no popup) to avoid mobile popup blocking.
 * - Keeps imports explicit from firebase/auth for Rollup/Vite tree-shaking.
 */
export default function AkiLogin() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(firebaseError);

  const githubProvider = useMemo(() => {
    const provider = new GithubAuthProvider();
    provider.addScope('read:user');
    provider.addScope('user:email');
    return provider;
  }, []);

  const handleGitHubRedirect = async () => {
    if (!auth) {
      setError("Service d'authentification indisponible.");
      return;
    }

    try {
      setBusy(true);
      setError(null);
      await setPersistence(auth, browserLocalPersistence);
      await signInWithRedirect(auth, githubProvider);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion GitHub.';
      setError(message);
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-blue-400">AKI HORIZON V33</h1>
        <p className="mt-2 text-sm text-slate-300">
          Connexion mobile en mode redirection (Firebase signInWithRedirect).
        </p>

        {error && (
          <div className="mt-4 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleGitHubRedirect}
          disabled={busy}
          className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold transition hover:bg-blue-500 disabled:opacity-60"
        >
          {busy ? 'Redirection en cours…' : 'Entrer via GitHub (mobile redirect)'}
        </button>
      </section>
    </main>
  );
}
