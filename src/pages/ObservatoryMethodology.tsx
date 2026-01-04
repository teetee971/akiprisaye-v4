/**
 * Methodology and Transparency Page
 * 
 * Page de transparence et méthodologie de l'observatoire
 * Explique les sources, calculs et limites
 */

import React from 'react';

export const ObservatoryMethodology: React.FC = () => {
  return (
    <div className="methodology-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
      <h1>📚 Méthodologie de l'Observatoire</h1>
      
      <section style={{ marginBottom: '3rem' }}>
        <h2>🎯 Objectif</h2>
        <p>
          L'observatoire des prix d'A ki pri sa yé vise à fournir des données <strong>transparentes, 
          traçables et vérifiables</strong> sur les prix réels pratiqués dans les territoires ultramarins 
          et en Hexagone.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>🔍 Sources de Données</h2>
        <h3>1. Relevés Citoyens</h3>
        <p>
          Observations directes par les utilisateurs de la plateforme. Chaque relevé citoyen est horodaté 
          et géolocalisé (avec consentement).
        </p>
        
        <h3>2. Scan de Tickets</h3>
        <p>
          Tickets de caisse numérisés via OCR. Fournit une preuve photographique de l'achat réel.
        </p>
        
        <h3>3. Données Ouvertes</h3>
        <p>
          Données publiques issues de l'INSEE, IEDOM, observatoires locaux et bases gouvernementales.
        </p>
        
        <h3>4. Relevés Terrain</h3>
        <p>
          Observations structurées effectuées directement en magasin dans le cadre d'enquêtes terrain.
        </p>
        
        <h3>5. APIs Publiques</h3>
        <p>
          Données provenant d'APIs publiques comme Open Food Facts pour l'enrichissement des informations produit.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>📊 Indicateurs Calculés</h2>
        
        <h3>Prix Moyen par Produit et Territoire</h3>
        <p>
          <strong>Formule:</strong> Moyenne arithmétique simple de toutes les observations valides sur la période.
        </p>
        <p>
          <strong>Filtre qualité:</strong> Seules les observations avec un score de qualité ≥ 0.5 sont incluses.
        </p>
        
        <h3>Écart DOM vs Hexagone</h3>
        <p>
          <strong>Formule:</strong> Écart % = ((Prix DOM - Prix Hexagone) / Prix Hexagone) × 100
        </p>
        <p>
          <strong>Interprétation:</strong>
        </p>
        <ul>
          <li>Écart &gt; +5% : Prix plus cher en DOM</li>
          <li>Écart entre -5% et +5% : Prix équivalent</li>
          <li>Écart &lt; -5% : Prix moins cher en DOM</li>
        </ul>
        
        <h3>Indice de Vie Chère (IVC)</h3>
        <p>
          <strong>Base 100 = Hexagone</strong>
        </p>
        <p>
          <strong>Formule:</strong> IVC = (Prix moyen territoire / Prix moyen Hexagone) × 100
        </p>
        <p>
          L'indice est calculé par catégorie puis agrégé avec une pondération égale pour simplifier.
        </p>
        <p>
          <strong>Exemple:</strong> Un IVC de 110 signifie que les prix sont en moyenne 10% plus élevés 
          qu'en Hexagone.
        </p>
        
        <h3>Évolution Temporelle</h3>
        <p>
          Compare le prix actuel (7 derniers jours) aux prix historiques sur 3 périodes:
        </p>
        <ul>
          <li><strong>J-30:</strong> Il y a 30 jours (±7 jours)</li>
          <li><strong>J-90:</strong> Il y a 90 jours (±7 jours)</li>
          <li><strong>J-365:</strong> Il y a 1 an (±7 jours)</li>
        </ul>
        <p>
          <strong>Tendance:</strong>
        </p>
        <ul>
          <li>Hausse: Variation moyenne &gt; +2%</li>
          <li>Baisse: Variation moyenne &lt; -2%</li>
          <li>Stable: Variation entre -2% et +2%</li>
        </ul>
        
        <h3>Dispersion par Enseigne</h3>
        <p>
          Pour chaque produit, calcule:
        </p>
        <ul>
          <li><strong>Prix minimum:</strong> Prix le plus bas observé</li>
          <li><strong>Prix médiane:</strong> Prix au milieu de la distribution</li>
          <li><strong>Prix maximum:</strong> Prix le plus haut observé</li>
          <li><strong>Écart-type:</strong> Mesure de dispersion des prix</li>
        </ul>
        <p>
          <strong>Important:</strong> Aucun classement "punitif" n'est publié. Les enseignes sont présentées 
          de manière factuelle sans jugement de valeur.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>✅ Qualité des Données</h2>
        
        <h3>Niveaux de Qualité</h3>
        <ul>
          <li>
            <strong>Vérifié (score ≥ 0.8):</strong> Observation avec preuve photographique ou source officielle
          </li>
          <li>
            <strong>Probable (score 0.5-0.8):</strong> Observation cohérente avec d'autres données
          </li>
          <li>
            <strong>À vérifier (score &lt; 0.5):</strong> Observation à confirmer, non utilisée dans les calculs
          </li>
        </ul>
        
        <h3>Critères de Validation</h3>
        <ul>
          <li>Code EAN valide (si fourni)</li>
          <li>Prix dans une plage raisonnable (0.01€ - 10,000€)</li>
          <li>Date d'observation récente (max 2 ans)</li>
          <li>Territoire valide (DOM-ROM-COM ou Hexagone)</li>
          <li>Catégorie de produit valide</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>🔐 Gouvernance et Protection</h2>
        
        <h3>Données Observées, pas Déclaratives</h3>
        <p>
          Toutes les données proviennent d'observations réelles. Aucune donnée déclarative d'enseigne 
          n'est utilisée sans vérification indépendante.
        </p>
        
        <h3>Aucune Donnée Commerciale Interne</h3>
        <p>
          L'observatoire n'a pas accès aux systèmes internes des enseignes. Toutes les données sont 
          publiques ou collectées de manière transparente.
        </p>
        
        <h3>Anonymisation Stricte</h3>
        <p>
          Les contributeurs sont anonymisés. Seul un identifiant haché est conservé pour détecter 
          les fraudes potentielles.
        </p>
        
        <h3>Pas de Classement Punitif</h3>
        <p>
          L'observatoire présente des <strong>comparaisons factuelles</strong>, pas des jugements. 
          Aucun palmarès "meilleur/pire" n'est publié. Les variations de prix reflètent des réalités 
          économiques complexes (approvisionnement, logistique, taxes, etc.).
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>⚠️ Limites et Avertissements</h2>
        
        <h3>Caractère Informatif</h3>
        <p>
          Cet observatoire présente des données agrégées <strong>à titre informatif uniquement</strong>. 
          Il ne constitue pas une source officielle au sens réglementaire.
        </p>
        
        <h3>Variabilité des Prix</h3>
        <p>
          Les prix peuvent varier selon:
        </p>
        <ul>
          <li>L'enseigne et le point de vente</li>
          <li>La période (promotions, saisonnalité)</li>
          <li>La zone géographique précise</li>
          <li>Les conditions d'approvisionnement</li>
        </ul>
        
        <h3>Couverture Territoriale</h3>
        <p>
          La qualité et densité des observations varient selon les territoires. Les zones moins peuplées 
          peuvent avoir moins d'observations, affectant la représentativité.
        </p>
        
        <h3>Pas de Garantie d'Exactitude Absolue</h3>
        <p>
          Malgré tous les contrôles de qualité, des erreurs peuvent subsister. Les utilisateurs sont 
          invités à signaler toute anomalie.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>🔄 Mises à Jour</h2>
        <ul>
          <li><strong>Fréquence:</strong> Les données sont ajoutées en continu</li>
          <li><strong>Recalcul:</strong> Les indicateurs sont recalculés quotidiennement</li>
          <li><strong>Snapshots:</strong> Des snapshots horodatés sont générés et archivés</li>
          <li><strong>Historique:</strong> Les versions précédentes restent accessibles</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>📖 Schéma Canonique</h2>
        <p>
          Toutes les données sont normalisées selon un <strong>schéma canonique unique</strong> 
          défini dans le format JSON suivant:
        </p>
        <pre style={{ 
          background: '#f8fafc', 
          padding: '1rem', 
          borderRadius: '8px', 
          overflow: 'auto',
          fontSize: '0.9rem'
        }}>
{`{
  "territoire": "Guadeloupe",
  "commune": "Les Abymes",
  "enseigne": "Carrefour",
  "produit": {
    "nom": "Lait demi-écrémé",
    "ean": "3560070123456",
    "categorie": "Produits laitiers",
    "unite": "1L"
  },
  "prix": 1.42,
  "date_releve": "2026-01-03",
  "source": "releve_citoyen",
  "qualite": {
    "niveau": "verifie",
    "preuve": true
  }
}`}
        </pre>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>📄 Licence</h2>
        <p>
          Les données de l'observatoire sont publiées sous licence{' '}
          <strong>Open Data Commons Open Database License (ODbL) v1.0</strong>.
        </p>
        <p>
          Vous êtes libre de copier, distribuer et utiliser les données, à condition de:
        </p>
        <ul>
          <li><strong>Attribution:</strong> Mentionner la source (A ki pri sa yé)</li>
          <li><strong>Partage à l'identique:</strong> Publier les œuvres dérivées sous la même licence</li>
          <li><strong>Ouverture:</strong> Garder les bases dérivées ouvertes</li>
        </ul>
      </section>

      <section>
        <h2>📞 Contact</h2>
        <p>
          Pour toute question sur la méthodologie:
        </p>
        <ul>
          <li><strong>Email:</strong> contact@akiprisaye.fr</li>
          <li><strong>GitHub:</strong> https://github.com/teetee971/akiprisaye-web</li>
        </ul>
        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
          <strong>Version de la méthodologie:</strong> 3.0.0<br />
          <strong>Dernière mise à jour:</strong> {new Date().toLocaleDateString('fr-FR')}
        </p>
      </section>
    </div>
  );
};

export default ObservatoryMethodology;
