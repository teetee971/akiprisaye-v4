
// Firebase configuration - using lazy loading pattern
// Services are imported dynamically when needed to reduce initial bundle size

const firebaseConfig = {
  apiKey: 'AIzaSyXXXXXXX',  // 🔐 À remplacer par ta clé réelle
  authDomain: 'a-ki-pri-sa-ye.firebaseapp.com',
  projectId: 'a-ki-pri-sa-ye',
  storageBucket: 'a-ki-pri-sa-ye.appspot.com',
  messagingSenderId: '123456789012',
  appId: '1:123456789012:web:abcdef123456',
  measurementId: 'G-XXXXXXXXXX',
};

let appInstance = null;
let dbInstance = null;
let authInstance = null;
let analyticsInstance = null;

/**
 * Initialize Firebase app (lazy initialization)
 * @returns {Promise<FirebaseApp>} Firebase app instance
 */
async function getApp() {
  if (!appInstance) {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js');
    appInstance = initializeApp(firebaseConfig);
  }
  return appInstance;
}

/**
 * Get Firestore instance (lazy loaded)
 * @returns {Promise<Firestore>} Firestore instance
 */
export async function getDb() {
  if (!dbInstance) {
    await getApp();
    const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    dbInstance = getFirestore(appInstance);
  }
  return dbInstance;
}

/**
 * Get Auth instance (lazy loaded)
 * @returns {Promise<Auth>} Auth instance
 */
export async function getAuth() {
  if (!authInstance) {
    await getApp();
    const { getAuth: getAuthFromFirebase } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js');
    authInstance = getAuthFromFirebase(appInstance);
  }
  return authInstance;
}

/**
 * Get Analytics instance (lazy loaded)
 * @returns {Promise<Analytics>} Analytics instance
 */
export async function getAnalytics() {
  if (!analyticsInstance) {
    await getApp();
    const { getAnalytics: getAnalyticsFromFirebase } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js');
    analyticsInstance = getAnalyticsFromFirebase(appInstance);
  }
  return analyticsInstance;
}

// For backward compatibility with synchronous usage patterns
// These will return promises instead of the actual instances
export const db = getDb();
export const auth = getAuth();
export const analytics = getAnalytics();
