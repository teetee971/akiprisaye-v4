// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Auth, Firestore } from "firebase/auth";

// Validate Firebase configuration
function validateFirebaseConfig() {
  const requiredVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
  ];
  
  const missing = requiredVars.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Firebase configuration incomplete. Missing variables:', missing.join(', '));
    return false;
  }
  
  return true;
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase services as null by default
let app: any = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let firebaseError: string | null = null;

// Only attempt initialization if config is valid
if (validateFirebaseConfig()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    if (import.meta.env.DEV) {
      console.log('✅ Firebase initialized successfully');
    }
  } catch (error: any) {
    firebaseError = error?.message || 'Unknown Firebase initialization error';
    console.error('⚠️ Firebase initialization failed:', firebaseError);
    // Services remain null - app will continue to function
  }
} else {
  firebaseError = 'Firebase configuration incomplete. Please check environment variables in Cloudflare Pages settings.';
  console.warn('⚠️ Firebase disabled - missing configuration');
}

export { auth, db, firebaseError };
