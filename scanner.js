// Scanner de code-barres (production, sans build) — utilise @zxing/browser via CDN ESM
// HTTPS requis pour getUserMedia

const videoEl = document.getElementById('scan-video');
const startBtn = document.getElementById('btn-start');
const stopBtn = document.getElementById('btn-stop');
const fileInput = document.getElementById('file-input');
const statusEl = document.getElementById('status');
const flashBtn = document.getElementById('btn-flash');

// NOUVEAUX ÉLÉMENTS
const ocrResultsSection = document.getElementById('ocr-results-section');
const ocrResultsEl = document.getElementById('ocr-results');
const saveToBudgetBtn = document.getElementById('save-to-budget-btn');


let controls = null;
let currentStream = null;
let torchTrack = null;

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

function canUseMedia() {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
}

async function ensureZXing() {
  // Version épinglée pour stabilité
  return import('https://cdn.jsdelivr.net/npm/@zxing/browser@0.1.4/+esm');
}

async function startScanner() {
  if (!canUseMedia()) {
    setStatus("Caméra non supportée par ce navigateur.", true);
    return;
  }
  setStatus("Initialisation caméra…");
  startBtn.disabled = true;
  try {
    const { BrowserMultiFormatReader } = await ensureZXing();
    const reader = new BrowserMultiFormatReader();
    controls = await reader.decodeFromVideoDevice(
      undefined,
      videoEl,
      (result, err) => {
        if (result) {
          const text = result.getText();
          // EAN-13 ou EAN-8
          if (/^\d{13}$|^\d{8}$/.test(text)) {
            setStatus(`EAN détecté: ${text}`);
            stopScanner(false);
            window.location.href = `/comparateur.html?ean=${encodeURIComponent(text)}`;
          }
        } else if (err) {
          // Ignorer les erreurs courantes (NotFound/Checksum/Format) pour éviter le spam
        }
      }
    );
    currentStream = videoEl.srcObject;
    if (currentStream) {
      const tracks = currentStream.getVideoTracks();
      if (tracks.length && 'getCapabilities' in tracks[0]) {
        const caps = tracks[0].getCapabilities();
        if (caps.torch) {
          torchTrack = tracks[0];
          flashBtn.style.display = 'inline-flex';
          flashBtn.textContent = 'Activer flash';
        }
      }
    }
    stopBtn.disabled = false;
    setStatus("Caméra active. Cadrez le code-barres.");
  } catch (e) {
    setStatus(`Erreur: ${e?.message || 'Impossible d’accéder à la caméra'}`, true);
    startBtn.disabled = false;
  }
}

function stopScanner(resetStatus = true) {
  try { controls?.stop(); } catch {}
  controls = null;

  if (currentStream) {
    currentStream.getTracks().forEach(t => t.stop());
    currentStream = null;
  }
  torchTrack = null;
  flashBtn.style.display = 'none';
  stopBtn.disabled = true;
  startBtn.disabled = false;
  if (resetStatus) setStatus("Caméra inactive.");
}

async function toggleTorch() {
  if (!torchTrack) return;
  const current = torchTrack.getSettings().torch === true;
  try {
    await torchTrack.applyConstraints({ advanced: [{ torch: !current }] });
    flashBtn.textContent = !current ? "Désactiver flash" : "Activer flash";
  } catch {
    setStatus("Impossible d’activer le flash.", true);
  }
}

async function decodeImageFile(file) {
  setStatus("Décodage de l’image…");
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = async () => {
    try {
      const { BrowserMultiFormatReader } = await ensureZXing();
      const reader = new BrowserMultiFormatReader();
      const res = await reader.decodeFromImage(img);
      const text = res.getText();
      if (/^\d{13}$|^\d{8}$/.test(text)) {
        setStatus(`EAN détecté: ${text}`);
        window.location.href = `/comparateur.html?ean=${encodeURIComponent(text)}`;
      } else {
        setStatus("Aucun EAN valide détecté.", true);
      }
    } catch {
      setStatus("Code-barres introuvable sur l’image.", true);
    } finally {
      URL.revokeObjectURL(url);
    }
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    setStatus("Erreur de lecture de l’image.", true);
  };
  img.src = url;
}

// --- LOGIQUE D'INTÉGRATION DU BUDGET ---

/**
 * Sauvegarde une dépense dans le localStorage.
 * @param {object} expense - L'objet de la dépense à sauvegarder.
 */
function saveExpense(expense) {
  const allExpenses = JSON.parse(localStorage.getItem('budgetExpenses')) || [];
  allExpenses.push(expense);
  localStorage.setItem('budgetExpenses', JSON.stringify(allExpenses));
}

/**
 * Se déclenche à la fin d'un scan OCR (simulé pour l'instant).
 * Affiche les résultats et le bouton pour sauvegarder.
 * @param {Array<object>} scannedItems - Liste des articles scannés.
 */
function onScanComplete(scannedItems) {
  // Stocke les éléments pour une utilisation ultérieure
  currentScannedItems = scannedItems;
  
  // Affiche les résultats dans la zone dédiée
  ocrResultsEl.innerHTML = scannedItems.map(item => `
    <div class="flex justify-between">
      <span>${item.name}</span>
      <strong>${item.price.toFixed(2)} €</strong>
    </div>
  `).join('');

  // Affiche la section des résultats
  ocrResultsSection.classList.remove('hidden');
}

/**
 * Gère la sauvegarde des dépenses scannées
 * @param {Array<object>} scannedItems - Liste des articles scannés
 */
function handleSaveToBudget(scannedItems) {
  const newExpense = {
    id: Date.now(),
    date: new Date().toISOString(),
    store: 'Magasin (Scan)',
    items: scannedItems,
    total: scannedItems.reduce((sum, item) => sum + item.price, 0)
  };

  saveExpense(newExpense);
  
  alert('Dépense enregistrée dans votre budget !');
  ocrResultsSection.classList.add('hidden');
}


// --- FIN DE LA LOGIQUE D'INTÉGRATION ---

// Variables pour gérer les données scannées
let currentScannedItems = null;

startBtn.addEventListener('click', () => startScanner());
stopBtn.addEventListener('click', () => stopScanner());
flashBtn.addEventListener('click', () => toggleTorch());
fileInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (file) decodeImageFile(file);
});

// Gestionnaire unique pour le bouton de sauvegarde
saveToBudgetBtn.addEventListener('click', () => {
  if (currentScannedItems) {
    handleSaveToBudget(currentScannedItems);
  }
});

// Nettoyage si l’utilisateur quitte la page
window.addEventListener('beforeunload', () => stopScanner(false));

// Accessibilité: activation par clavier (Entrée/Espace)
[startBtn, stopBtn, flashBtn].forEach(btn => {
  btn.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

// Démarrage auto si permission déjà accordée (optionnel)
(async () => {
  try {
    const q = await navigator.permissions.query({ name: 'camera' });
    if (q.state === 'granted') startScanner();
  } catch {
    // Non supporté partout
  }
})();