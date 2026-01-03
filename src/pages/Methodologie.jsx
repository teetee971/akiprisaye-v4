export default function Methodologie() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header - Style institutionnel */}
      <header className="bg-white dark:bg-slate-900 shadow-md border-b border-blue-100 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Méthodologie
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Transparence sur nos données et notre processus
                </p>
              </div>
            </div>
            <a 
              href="/" 
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
            >
              <span>←</span>
              <span>Accueil</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">{/* Introduction */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Transparence totale
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Notre engagement envers les citoyens
                </p>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                A KI PRI SA YÉ s'engage à une <strong>transparence totale</strong> sur la méthodologie de collecte,
                de calcul et d'affichage des prix. Cette page explique en détail comment nous
                travaillons pour vous fournir des informations fiables et vérifiables.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded-lg">
                <p className="text-yellow-900 dark:text-yellow-300 font-semibold">
                  ⚠️ Principe fondamental : Tout ce qui est affiché sur notre plateforme est soit réel, soit clairement
                  identifié comme étant en développement ou en phase de test.
                </p>
              </div>
            </div>
          </section>

          {/* Data Collection */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔍</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Collecte des données
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Sources et méthodes de collecte
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400">📋</span>
                  Sources de données officielles
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1.</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">INSEE</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Indices de prix à la consommation et données macro-économiques
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">2.</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">OPMR (Observatoire des Prix et des Marges des produits alimentaires)</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Données sur les marges et prix en Outre-mer
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">3.</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">data.gouv.fr</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Open data public français
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">4.</span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">DGCCRF</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="text-purple-600 dark:text-purple-400">👥</span>
                  Données citoyennes
                </h3>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-3">
                  <p className="text-slate-700 dark:text-slate-300">
                    Les citoyens peuvent contribuer en :
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <span className="text-purple-600 dark:text-purple-400">•</span>
                      <span><strong>Scannant leurs tickets de caisse</strong> (données anonymisées et agrégées)</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <span className="text-purple-600 dark:text-purple-400">•</span>
                      <span><strong>Signalant des prix</strong> via le formulaire dédié</span>
                    </li>
                    <li className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                      <span className="text-purple-600 dark:text-purple-400">•</span>
                      <span><strong>Validant ou contestant</strong> des prix affichés</span>
                    </li>
                  </ul>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-3 rounded mt-4">
                    <p className="text-sm text-blue-900 dark:text-blue-300">
                      <strong>🔒 Confidentialité :</strong> Aucune donnée personnelle n'est collectée. 
                      Les tickets sont anonymisés automatiquement et seules les informations de prix sont conservées.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Fréquence de mise à jour */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⏱️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Fréquence de mise à jour
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Actualisation des données
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📊</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Données officielles</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Mises à jour selon calendrier INSEE/OPMR
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Généralement mensuel ou trimestriel
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">👥</span>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Données citoyennes</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Temps réel (après validation)
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Sous réserve de vérifications anti-spam
                </p>
              </div>
            </div>

            <div className="mt-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg">
              <p className="text-sm text-green-900 dark:text-green-300">
                <strong>💡 Astuce :</strong> La date de dernière mise à jour est affichée sur chaque prix
                pour garantir la transparence.
              </p>
            </div>
          </section>

          {/* Data Verification */}
          <section className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Vérification des données
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Processus de validation et de contrôle qualité
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-slate-700 dark:text-slate-300">
                Chaque prix collecté passe par un processus de vérification avant affichage :
              </p>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">1</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">Validation du format</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Code EAN valide, prix cohérent, date récente</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">2</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">Détection d'anomalies</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Comparaison avec les prix moyens du territoire</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">3</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">Vérification croisée</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Si possible, confirmation par plusieurs sources</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold flex-shrink-0">4</span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">Horodatage</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Date et heure de collecte systématiquement enregistrées</p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Calculations */}
          <section className="bg-[#1e1e1e] rounded-xl border border-gray-700 p-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">🧮 Calculs et moyennes</h2>
            <div className="text-gray-300 space-y-3">
              <div>
                <h3 className="font-semibold mb-2">Prix moyen par territoire</h3>
                <p className="text-sm text-gray-400">
                  Moyenne arithmétique simple des prix collectés pour un même produit (EAN identique)
                  dans un territoire donné au cours des 7 derniers jours.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Comparaison avec la France hexagonale</h3>
                <p className="text-sm text-gray-400">
                  Écart calculé en pourcentage : ((Prix DROM - Prix France) / Prix France) × 100
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Alertes prix anormaux</h3>
                <p className="text-sm text-gray-400">
                  Un prix est considéré comme anormalement élevé s'il dépasse de +20% la moyenne
                  territoriale du produit.
                </p>
              </div>
            </div>
          </section>

          {/* Update Frequency */}
          <section className="bg-[#1e1e1e] rounded-xl border border-gray-700 p-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">🔄 Fréquence de mise à jour</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                La fraîcheur des données est essentielle pour un comparateur de prix pertinent :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Tickets citoyens :</strong> Traités dans les 24h suivant le partage</li>
                <li><strong>Collecte manuelle :</strong> Hebdomadaire pour les produits de base</li>
                <li><strong>Données partenaires (à venir) :</strong> Quotidienne, voire temps réel</li>
                <li><strong>Open Data INSEE :</strong> Mensuelle (selon publication officielle)</li>
              </ul>
              <p className="text-sm text-gray-400 mt-4">
                <strong>Important :</strong> La date de dernière mise à jour est toujours affichée
                pour chaque prix.
              </p>
            </div>
          </section>

          {/* Limitations */}
          <section className="bg-red-900/20 border border-red-700 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-red-400">⚠️ Limites du service</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                A KI PRI SA YÉ reconnaît honnêtement ses limites actuelles :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>Couverture incomplète :</strong> Tous les magasins et produits ne sont
                  pas encore référencés
                </li>
                <li>
                  <strong>Données non temps réel :</strong> Les prix peuvent avoir changé depuis
                  la dernière collecte
                </li>
                <li>
                  <strong>Promotions temporaires :</strong> Difficiles à capturer et peuvent fausser
                  les moyennes
                </li>
                <li>
                  <strong>Variations de format :</strong> Un même produit peut exister en plusieurs
                  formats (500g, 1kg, etc.)
                </li>
              </ul>
              <p className="text-yellow-400 font-semibold mt-4">
                Nous travaillons activement à améliorer la couverture et la précision des données.
              </p>
            </div>
          </section>

          {/* Data Sources */}
          <section className="bg-[#1e1e1e] rounded-xl border border-gray-700 p-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-400">📚 Sources publiques utilisées</h2>
            <div className="text-gray-300 space-y-2">
              <p className="mb-3">Pour le contexte et l'analyse :</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>
                  <strong>INSEE :</strong> Indices des prix à la consommation dans les DOM
                  <br />
                  <a 
                    href="https://www.insee.fr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    www.insee.fr
                  </a>
                </li>
                <li>
                  <strong>DGCCRF :</strong> Direction générale de la concurrence, de la consommation
                  et de la répression des fraudes
                  <br />
                  <a 
                    href="https://www.economie.gouv.fr/dgccrf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    www.economie.gouv.fr/dgccrf
                  </a>
                </li>
                <li>
                  <strong>Open Food Facts :</strong> Base de données collaborative de produits alimentaires
                  <br />
                  <a 
                    href="https://fr.openfoodfacts.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    fr.openfoodfacts.org
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* How to contribute */}
          <section className="bg-green-900/20 border border-green-700 rounded-xl p-8">
            <h2 className="text-2xl font-semibold mb-4 text-green-400">🤝 Comment contribuer</h2>
            <div className="text-gray-300 space-y-3">
              <p>
                A KI PRI SA YÉ est un projet citoyen. Vous pouvez contribuer de plusieurs manières :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Partager vos tickets de caisse</strong> (fonction scanner à venir)</li>
                <li><strong>Signaler des prix anormaux</strong> ou des erreurs</li>
                <li><strong>Proposer de nouveaux magasins</strong> à référencer</li>
                <li><strong>Contribuer au code source</strong> (projet open-source à venir)</li>
              </ul>
              <p className="mt-4">
                <a 
                  href="/contact" 
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
                >
                  Contribuer au projet
                </a>
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
