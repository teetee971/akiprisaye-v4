// src/pages/Pricing.tsx
import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getUserPlan, setUserPlan } from "@/lib/firestore/plan";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("freemium");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const plan = await getUserPlan(currentUser.uid);
        setCurrentPlan(plan);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChoosePlan = async (plan: "freemium" | "premium" | "pro") => {
    if (!user) {
      alert("Veuillez d'abord vous connecter.");
      window.location.href = "/mon-compte";
      return;
    }
    
    try {
      await setUserPlan(user.uid, plan);
      setCurrentPlan(plan);
      alert(`Plan ${plan.toUpperCase()} activé ✅`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-6xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-gray-300">
            Sélectionnez le plan qui correspond le mieux à vos besoins
          </p>
          {user && (
            <p className="mt-4 text-blue-400">
              Plan actuel: <span className="font-bold uppercase">{currentPlan}</span>
            </p>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-3 mb-8">
          {/* Freemium Plan */}
          <div className={`bg-slate-800 rounded-2xl p-8 border-2 ${
            currentPlan === "freemium" ? "border-blue-500 shadow-xl shadow-blue-500/20" : "border-slate-700"
          } transition-all hover:scale-105`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Freemium</h2>
              <div className="text-4xl font-bold text-blue-400 mb-2">Gratuit</div>
              <p className="text-gray-400">Pour commencer</p>
            </div>

            <ul className="space-y-4 mb-8 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Comparaison de prix entre enseignes</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Scanner de produits</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Historique limité (30 jours)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Carte des enseignes</span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-500 mr-2">✗</span>
                <span className="text-gray-500">Alertes de prix</span>
              </li>
            </ul>

            <Button
              onClick={() => handleChoosePlan("freemium")}
              disabled={currentPlan === "freemium"}
              className={`w-full ${
                currentPlan === "freemium"
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3`}
            >
              {currentPlan === "freemium" ? "Plan actuel" : "Choisir Freemium"}
            </Button>
          </div>

          {/* Premium Plan */}
          <div className={`bg-slate-800 rounded-2xl p-8 border-2 ${
            currentPlan === "premium" ? "border-blue-500 shadow-xl shadow-blue-500/20" : "border-blue-500"
          } relative transition-all hover:scale-105`}>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              POPULAIRE
            </div>

            <div className="text-center mb-6 mt-2">
              <h2 className="text-2xl font-bold text-white mb-2">Premium</h2>
              <div className="text-4xl font-bold text-blue-400 mb-2">9.99€</div>
              <p className="text-gray-400">Par mois</p>
            </div>

            <ul className="space-y-4 mb-8 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Toutes les fonctionnalités Freemium</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Historique illimité</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Alertes de prix personnalisées</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Analyses et statistiques avancées</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Synchronisation multi-appareils</span>
              </li>
            </ul>

            <Button
              onClick={() => handleChoosePlan("premium")}
              disabled={currentPlan === "premium"}
              className={`w-full ${
                currentPlan === "premium"
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3`}
            >
              {currentPlan === "premium" ? "Plan actuel" : "Passer à Premium"}
            </Button>
          </div>

          {/* Pro Plan */}
          <div className={`bg-slate-800 rounded-2xl p-8 border-2 ${
            currentPlan === "pro" ? "border-blue-500 shadow-xl shadow-blue-500/20" : "border-slate-700"
          } transition-all hover:scale-105`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Pro</h2>
              <div className="text-4xl font-bold text-blue-400 mb-2">29.99€</div>
              <p className="text-gray-400">Par mois</p>
            </div>

            <ul className="space-y-4 mb-8 text-gray-300">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Toutes les fonctionnalités Premium</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Accès API pour intégrations</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Support prioritaire 24/7</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Exports de données illimités</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span>Tableaux de bord personnalisés</span>
              </li>
            </ul>

            <Button
              onClick={() => handleChoosePlan("pro")}
              disabled={currentPlan === "pro"}
              className={`w-full ${
                currentPlan === "pro"
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white py-3`}
            >
              {currentPlan === "pro" ? "Plan actuel" : "Passer à Pro"}
            </Button>
          </div>
        </div>

        {!user && (
          <div className="text-center">
            <p className="text-gray-400 mb-4">
              Vous devez être connecté pour changer de plan
            </p>
            <Button
              onClick={() => window.location.href = "/mon-compte"}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            >
              Se connecter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
