import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

// Si tu as déjà ces pages, laisse-les, sinon supprime-les plus tard
import Comparateur from "./pages/Comparateur";
import Carte from "./pages/Carte";
import Scanner from "./pages/ScanOCR";
import ListeCourses from "./pages/ListeCourses";

export default function App() {
  return (
    <BrowserRouter>
      {/* 🔴 BANNIÈRE DE TEST – DOIT ÊTRE VISIBLE */}
      <div
        style={{
          background: "red",
          color: "white",
          padding: "12px",
          fontWeight: "bold",
          textAlign: "center",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 99999
        }}
      >
        ROUTER ROOT – HOME CONNECTÉ – 31/12/2025
      </div>

      {/* Décalage pour ne pas cacher le contenu */}
      <div style={{ paddingTop: "60px" }}>
        <Routes>
          {/* ✅ PAGE D’ACCUEIL FORCÉE */}
          <Route path="/" element={<Home />} />

          {/* Routes secondaires */}
          <Route path="/comparateur" element={<Comparateur />} />
          <Route path="/carte" element={<Carte />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/liste-courses" element={<ListeCourses />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
