import {
  GoogleAuthProvider,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
  type UserCredential,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

const googleProvider = new GoogleAuthProvider();

function ensureAuth() {
  if (!auth) {
    throw new Error("Service d'authentification non disponible.");
  }
  return auth;
}

export async function ensureSessionPersistence(): Promise<void> {
  const authInstance = ensureAuth();
  await setPersistence(authInstance, browserLocalPersistence);
}

export async function signUpEmailPassword(email: string, password: string): Promise<UserCredential> {
  const authInstance = ensureAuth();
  await ensureSessionPersistence();
  return createUserWithEmailAndPassword(authInstance, email, password);
}

export async function signInEmailPassword(email: string, password: string): Promise<UserCredential> {
  const authInstance = ensureAuth();
  await ensureSessionPersistence();
  return signInWithEmailAndPassword(authInstance, email, password);
}

export async function signInGooglePopup(): Promise<UserCredential> {
  const authInstance = ensureAuth();
  await ensureSessionPersistence();
  return signInWithPopup(authInstance, googleProvider);
}

export async function signOutUser(): Promise<void> {
  const authInstance = ensureAuth();
  await signOut(authInstance);
}

export function subscribeToAuthState(handler: (user: User | null) => void): () => void {
  const authInstance = ensureAuth();
  return onAuthStateChanged(authInstance, handler);
}
