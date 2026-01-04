// src/pages/Inscription.tsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, firebaseError } from "@/lib/firebase";

const DEFAULT_USER_PLAN = "freemium";

export default function Inscription() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check if Firebase is available
    if (firebaseError || !auth) {
      setError("Service d'authentification non disponible. Veuillez contacter l'administrateur.");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Optionnel: Sauvegarder dans Firestore si disponible
      if (db) {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          plan: DEFAULT_USER_PLAN,
          createdAt: new Date(),
        }, { merge: true });
      }
      
      navigate("/mon-compte");
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // Helper pour traduire les erreurs Firebase
  const getErrorMessage = (err: any): string => {
    const code = err?.code || '';
    
    switch (code) {
      case 'auth/email-already-in-use':
        return "Cet email est déjà utilisé.";
      case 'auth/invalid-email':
        return "Email invalide.";
      case 'auth/weak-password':
        return "Mot de passe trop faible. Minimum 6 caractères.";
      case 'auth/too-many-requests':
        return "Trop de tentatives. Réessayez plus tard.";
      default:
        return err?.message || "Une erreur est survenue. Réessayez.";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl p-6 shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-white text-center">Créer un compte</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-200 text-sm">
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0">❌</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Adresse e-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="votre@email.com"
              required
              className="w-full p-3 rounded-lg bg-slate-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="Minimum 6 caractères"
              required
              minLength={6}
              className="w-full p-3 rounded-lg bg-slate-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed text-white"
            disabled={loading}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Déjà un compte ?{" "}
            <button
              type="button"
              onClick={() => navigate("/mon-compte")}
              className="text-blue-400 hover:text-blue-300 hover:underline font-medium cursor-pointer bg-transparent border-0 p-0"
            >
              Se connecter
            </button>
          </p>
        </div>

        <div className="mt-6 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-blue-200 text-xs text-center">
            🔒 Service citoyen gratuit et sécurisé
          </p>
        </div>
      </div>
    </div>
  );
}
