import { Link } from 'react-router-dom';
import styles from './RechercheHub.module.css';

const suggestedQueries = [
  'Produit du quotidien',
  'Enseigne locale',
  'Comparateur thématique',
];

const destinations = [
  {
    title: 'Comparer les prix',
    description: 'Accéder au comparateur principal pour une vue synthétique.',
    to: '/comparateur',
  },
  {
    title: 'Recherche produit',
    description: 'Accéder à la recherche produit existante.',
    to: '/comparateur-formats',
  },
  {
    title: 'Recherche enseigne',
    description: 'Comparer les enseignes avec une navigation dédiée.',
    to: '/comparaison-enseignes',
  },
];

export default function RechercheHub() {
  return (
    // ⚠️ A11y contract – do not alter without accessibility review.
    // Focus initial volontaire sur le champ de recherche; ordre de tabulation: champ → suggestions → destinations.
    // Choix sémantiques natifs (label/input, nav/ul/li, button/link) pour des noms accessibles sans ARIA superflu.
    // TODO(a11y): ajouter un test automatisé Lighthouse/axe en CI.
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.kicker}>Recherche & comparaison</p>
        <h1 className={styles.title}>Point d’entrée unique pour vos recherches</h1>
        <p className={styles.subtitle}>
          Un accès central, sobre et clair pour orienter vos recherches sans surcharge visuelle.
        </p>
      </header>

      <section className={styles.searchSection} aria-label="Recherche">
        <label className={styles.label} htmlFor="recherche-hub-input">
          Rechercher
        </label>
        <input
          id="recherche-hub-input"
          className={styles.input}
          type="search"
          placeholder="Produit, enseigne ou comparateur"
          autoComplete="off"
          autoFocus
        />
        <div className={styles.suggestions}>
          {suggestedQueries.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              className={styles.suggestion}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </section>

      <nav className={styles.destinations} aria-label="Recherche et comparaison">
        <ul className={styles.destinationList}>
          {destinations.map((destination) => (
            <li key={destination.title} className={styles.destinationItem}>
              <Link to={destination.to} className={styles.card}>
                <div>
                  <h2 className={styles.cardTitle}>{destination.title}</h2>
                  <p className={styles.cardDescription}>{destination.description}</p>
                </div>
                <span className={styles.cardAction}>Accéder</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className={styles.note} aria-label="Transparence">
        <p>
          Cette page ne réalise aucun calcul ni collecte de données. Elle sert uniquement
          à orienter vers les modules existants.
        </p>
      </section>
    </main>
  );
}
