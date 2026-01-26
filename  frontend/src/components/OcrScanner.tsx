import React, { useEffect, useState } from "react";
import Tesseract from "tesseract.js";

/* ===================== */
/* Types                 */
/* ===================== */

type ExtractedData = {
  prices: number[];
  date: string | null;
  store: string | null;
};

/* ===================== */
/* Extraction déterministe */
/* ===================== */

function extractTicketData(rawText: string): ExtractedData {
  const normalized = rawText
    .replace(/\s+/g, " ")
    .replace(/€/g, "€ ")
    .toUpperCase();

  /* ---------- PRIX ---------- */
  const priceRegex =
    /(\d{1,3}(?:[.,]\d{3})*[.,]\d{2})\s?€/g;

  const prices: number[] = [];
  let match: RegExpExecArray | null;

  while ((match = priceRegex.exec(normalized)) !== null) {
    const value = parseFloat(
      match[1].replace(/\./g, "").replace(",", ".")
    );
    if (!isNaN(value)) prices.push(value);
  }

  /* ---------- DATE ---------- */
  const dateRegex =
    /(\d{2}[\/.-]\d{2}[\/.-]\d{2,4})/;
  const dateMatch = normalized.match(dateRegex);
  const date = dateMatch ? dateMatch[1] : null;

  /* ---------- MAGASIN ---------- */
  const lines = rawText
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 6);

  const blacklist = [
    "MERCI",
    "TOTAL",
    "FACTURE",
    "TICKET",
    "CARTE",
    "CB",
    "TVA",
  ];

  const store =
    lines.find(
      (line) =>
        line === line.toUpperCase() &&
        !blacklist.some((b) => line.includes(b))
    ) || null;

  return {
    prices,
    date,
    store,
  };
}

/* ===================== */
/* Composant principal   */
/* ===================== */

const OcrScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  /* Nettoyage mémoire URL blob */
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Format de fichier non supporté");
      return;
    }

    setImage(URL.createObjectURL(file));
    setText("");
    setExtracted(null);
    setProgress(0);
    setError(null);
  };

  const runOcr = async () => {
    if (!image || loading) return;

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await Tesseract.recognize(image, "fra", {
        logger: (m) => {
          if (
            m.status === "recognizing text" &&
            typeof m.progress === "number"
          ) {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const ocrText = result.data.text?.trim() || "";
      setText(ocrText);

      const data = extractTicketData(ocrText);
      setExtracted(data);

      console.info("[OCR] Extraction réussie", data);
    } catch (err) {
      console.error("[OCR]", err);
      setError("Erreur lors de l’analyse OCR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>Analyse de ticket / facture</h1>

      <p style={styles.subtitle}>
        Importez un ticket ou une facture pour extraire automatiquement
        les informations clés.
      </p>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={styles.input}
      />

      {image && (
        <img
          src={image}
          alt="Aperçu du ticket"
          style={styles.preview}
        />
      )}

      {image && (
        <button
          onClick={runOcr}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Analyse en cours…" : "Lancer l’OCR"}
        </button>
      )}

      {loading && (
        <p style={styles.progress}>
          Analyse : {progress} %
        </p>
      )}

      {error && <p style={styles.error}>{error}</p>}

      {extracted && (
        <section style={styles.result}>
          <h2>Données détectées</h2>

          <p>
            <strong>Magasin :</strong>{" "}
            {extracted.store || "Non détecté"}
          </p>

          <p>
            <strong>Date :</strong>{" "}
            {extracted.date || "Non détectée"}
          </p>

          <p>
            <strong>Prix détectés :</strong>
          </p>

          {extracted.prices.length > 0 ? (
            <ul>
              {extracted.prices.map((p, i) => (
                <li key={i}>{p.toFixed(2)} €</li>
              ))}
            </ul>
          ) : (
            <p>Aucun prix détecté</p>
          )}
        </section>
      )}

      {text && (
        <section style={styles.result}>
          <h2>Texte OCR brut</h2>
          <pre style={styles.pre}>{text}</pre>
        </section>
      )}
    </main>
  );
};

export default OcrScanner;

/* ===================== */
/* Styles inline sûrs    */
/* ===================== */

const styles: Record<string, React.CSSProperties> = {
  main: {
    padding: 24,
    maxWidth: 720,
    margin: "0 auto",
    color: "#f1f5f9",
  },
  title: {
    fontSize: "1.6rem",
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.85,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  preview: {
    width: "100%",
    maxHeight: 320,
    objectFit: "contain",
    borderRadius: 8,
    marginBottom: 16,
    background: "#020617",
  },
  button: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#22c55e",
    color: "#022c22",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 12,
  },
  progress: {
    fontSize: "0.9rem",
    opacity: 0.9,
  },
  error: {
    color: "#f87171",
    marginTop: 12,
  },
  result: {
    marginTop: 24,
    background: "#020617",
    padding: 16,
    borderRadius: 8,
  },
  pre: {
    whiteSpace: "pre-wrap",
    fontSize: "0.85rem",
    lineHeight: 1.4,
  },
};