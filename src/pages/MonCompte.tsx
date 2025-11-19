// src/pages/MonCompte.tsx
import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { getUserPlan, setUserPlan } from "@/lib/firestore/plan";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";

export default function MonCompte() {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<string>("freemium");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userPlan = await getUserPlan(currentUser.uid);
        setPlan(userPlan);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      alert("Erreur lors de la déconnexion : " + err);
    }
  };

  const handleChoosePlan = async (newPlan: "freemium" | "premium" | "pro") => {
    if (!user) {
      alert("Veuillez d'abord vous connecter.");
      return;
    }
    
    try {
      await setUserPlan(user.uid, newPlan);
      setPlan(newPlan);
      alert(`Plan ${newPlan.toUpperCase()} activé ✅`);
    } catch (err) {
      alert("Erreur lors du changement de plan : " + err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg mb-6">
          <h1 className="text-3xl font-bold text-white mb-6">👤 Mon Compte</h1>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Informations du compte</h2>
            <div className="space-y-2 text-gray-300">
              <p><strong>Email:</strong> {user.email || "Non renseigné"}</p>
              <p><strong>Nom:</strong> {user.displayName || "Non renseigné"}</p>
              <p><strong>Plan actuel:</strong> <span className="text-blue-400 font-bold uppercase">{plan}</span></p>
            </div>
          </div>

          <Button 
            onClick={handleSignOut} 
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Se déconnecter
          </Button>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">📦 Plans disponibles</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            {/* Freemium */}
            <div className={`bg-slate-800 rounded-xl p-6 border-2 ${plan === "freemium" ? "border-blue-500" : "border-slate-700"}`}>
              <h3 className="text-xl font-bold text-white mb-2">Freemium</h3>
              <p className="text-gray-400 mb-4">Fonctionnalités de base</p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>✓ Comparaison de prix</li>
                <li>✓ Scanner de produits</li>
                <li>✓ Historique limité</li>
              </ul>
              <Button 
                onClick={() => handleChoosePlan("freemium")}
                disabled={plan === "freemium"}
                className={`w-full ${plan === "freemium" ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"} text-white`}
              >
                {plan === "freemium" ? "Plan actuel" : "Passer à Freemium"}
              </Button>
            </div>

            {/* Premium */}
            <div className={`bg-slate-800 rounded-xl p-6 border-2 ${plan === "premium" ? "border-blue-500" : "border-slate-700"}`}>
              <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
              <p className="text-gray-400 mb-4">Plus de fonctionnalités</p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>✓ Tout Freemium</li>
                <li>✓ Historique illimité</li>
                <li>✓ Alertes de prix</li>
                <li>✓ Analyses avancées</li>
              </ul>
              <Button 
                onClick={() => handleChoosePlan("premium")}
                disabled={plan === "premium"}
                className={`w-full ${plan === "premium" ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"} text-white`}
              >
                {plan === "premium" ? "Plan actuel" : "Passer à Premium"}
              </Button>
            </div>

            {/* Pro */}
            <div className={`bg-slate-800 rounded-xl p-6 border-2 ${plan === "pro" ? "border-blue-500" : "border-slate-700"}`}>
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <p className="text-gray-400 mb-4">Toutes les fonctionnalités</p>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>✓ Tout Premium</li>
                <li>✓ API access</li>
                <li>✓ Support prioritaire</li>
                <li>✓ Exports de données</li>
              </ul>
              <Button 
                onClick={() => handleChoosePlan("pro")}
                disabled={plan === "pro"}
                className={`w-full ${plan === "pro" ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"} text-white`}
              >
                {plan === "pro" ? "Plan actuel" : "Passer à Pro"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
