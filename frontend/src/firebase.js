import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuration Thierry Gravée - Adieu les erreurs "missing env" !
const firebaseConfig = {
  apiKey: "AIzaSyDfK3N2Q8jL0v5mR4pS6tU7wX9yA1b5ZY",
  authDomain: "a-ki-pri-sa-ye.firebaseapp.com",
  projectId: "a-ki-pri-sa-ye",
  storageBucket: "a-ki-pri-sa-ye.appspot.com",
  messagingSenderId: "187272078809",
  appId: "1:187272078809:web:110a8c3d5f7e9b2a4c6d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebaseError = null; // Pour nettoyer l'interface