/**
 * React progressive loader
 * - Ne bloque jamais le rendu statique
 * - Échoue silencieusement
 * - Compatible Cloudflare Pages
 */

(function () {
  const log = (...args) => console.log("[AKIPRISAYE][React]", ...args);
  const warn = (...args) => console.warn("[AKIPRISAYE][React]", ...args);

  // Vérification du point d’ancrage
  const root = document.getElementById("react-root");
  if (!root) {
    warn("Aucun #react-root trouvé. React non chargé.");
    return;
  }

  // Timeout de sécurité (anti écran noir)
  const FAILSAFE_TIMEOUT = 4000;
  let mounted = false;

  const failSafe = setTimeout(() => {
    if (!mounted) {
      warn("Timeout React — fallback statique conservé.");
      root.innerHTML = "";
    }
  }, FAILSAFE_TIMEOUT);

  // Chargement dynamique de React + ReactDOM depuis CDN fiable
  Promise.all([
    import("https://esm.sh/react@18"),
    import("https://esm.sh/react-dom@18/client")
  ])
    .then(([React, ReactDOM]) => {
      log("React chargé");

      const App = () =>
        React.createElement(
          "div",
          {
            style: {
              marginTop: "24px",
              padding: "16px",
              borderRadius: "12px",
              background: "#151922",
              border: "1px solid rgba(255,255,255,0.08)"
            }
          },
          React.createElement("h2", { style: { marginBottom: "8px" } }, "React actif"),
          React.createElement(
            "p",
            { style: { opacity: 0.85, lineHeight: 1.5 } },
            "Le chargement progressif fonctionne correctement."
          )
        );

      const reactRoot = ReactDOM.createRoot(root);
      reactRoot.render(React.createElement(App));

      mounted = true;
      clearTimeout(failSafe);
    })
    .catch((err) => {
      warn("Échec chargement React :", err);
      clearTimeout(failSafe);
    });
})();