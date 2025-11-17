import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBfQGoLoqFqNFMy2uv2JvIPepLtLeBSYU", // CLEF INVALIDE - À CORRIGER
  authDomain: "a-ki-pri-sa-ye.firebaseapp.com",
  projectId: "a-ki-pri-sa-ye",
  storageBucket: "a-ki-pri-sa-ye.appspot.com",
  messagingSenderId: "187270278809",
  appId: "1:187270278809:android:ad2191f46c07530e5e5e68"
};

// Désactiver Firebase temporairement pour que le site fonctionne
let app, db;
try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization failed - running without backend:', error.message);
  // Mock db object pour éviter les erreurs
  db = null;
}

export { db };
