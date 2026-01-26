import React, { useState } from "react";
import Tesseract from "tesseract.js";

export default function OcrPage() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setText("");
    setError(null);
  };

  const runOcr = async () => {
    if (!image) return;

    setLoading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await Tesseract.recognize(image, "fra", {
        logger: (m) => {
          if (m.status === "recognizing text" && m.progress) {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      setText(result.data.text || "");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l’analyse OCR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>Analyse de ticket / facture</h1>
      <p style={styles.subtitle}>
        Prenez une photo ou importez un ticket pour extraire le texte.
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
          alt="Ticket"
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
        <p style={styles.progress}>Analyse : {progress}%</p>
      )}

      {error && (
        <p style={styles.error}>{error}</p>
      )}

      {text && (
        <section style={styles.result}>
          <h2>Texte extrait</h2>
          <pre style={styles.pre}>{text}</pre>
        </section>
      )}
    </main>
  );
}

/* ===================== */
/* Styles inline sûrs    */
/* ===================== */

const styles = {
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
