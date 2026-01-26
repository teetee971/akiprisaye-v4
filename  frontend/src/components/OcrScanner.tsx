import React, { useState } from "react";
import Tesseract from "tesseract.js";

const OcrScanner: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />

      {image && (
        <img src={image} alt="Ticket" style={styles.preview} />
      )}

      {image && (
        <button onClick={runOcr} disabled={loading} style={styles.button}>
          {loading ? "Analyse en cours…" : "Lancer l’OCR"}
        </button>
      )}

      {loading && <p>Analyse : {progress}%</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {text && (
        <pre style={styles.pre}>{text}</pre>
      )}
    </main>
  );
};

export default OcrScanner;

const styles = {
  main: { padding: 24, color: "#f1f5f9" },
  title: { marginBottom: 16 },
  preview: { width: "100%", maxHeight: 300, marginTop: 16 },
  button: { marginTop: 12, padding: "8px 14px" },
  pre: { marginTop: 16, whiteSpace: "pre-wrap" },
};