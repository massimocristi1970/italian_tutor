/**
 * Firebase Initialization Module
 * Handles Firebase app initialization and authentication
 */

import { getFirebaseConfig, APP_ID, INITIAL_AUTH_TOKEN } from '../config.js';

// Firebase instances (will be set after initialization)
let app = null;
let db = null;
let auth = null;
let userId = null;

// Firebase module references (loaded dynamically)
let firebaseApp = null;
let firebaseAuth = null;
let firebaseFirestore = null;

/**
 * Dynamically imports Firebase modules
 */
async function loadFirebaseModules() {
  if (firebaseApp) return; // Already loaded

  firebaseApp = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js');
  firebaseAuth = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js');
  firebaseFirestore = await import('https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js');
}

/**
 * Initializes Firebase with configuration
 * @returns {Promise<boolean>} - True if successful
 */
export async function initializeFirebase() {
  try {
    await loadFirebaseModules();

    const config = await getFirebaseConfig();
    if (!config) {
      console.error('❌ Firebase config not available');
      return false;
    }

    app = firebaseApp.initializeApp(config);
    auth = firebaseAuth.getAuth(app);
    db = firebaseFirestore.getFirestore(app);

    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return false;
  }
}

/**
 * Authenticates the user
 * @returns {Promise<string|null>} - User ID or null on failure
 */
export async function authenticateUser() {
  if (!auth) {
    console.error('❌ Auth not initialized');
    return null;
  }

  try {
    // Try custom token first (for embedded scenarios)
    if (INITIAL_AUTH_TOKEN) {
      try {
        const credential = await firebaseAuth.signInWithCustomToken(auth, INITIAL_AUTH_TOKEN);
        userId = credential.user.uid;
        console.log('✅ Authenticated with custom token');
        return userId;
      } catch (tokenError) {
        console.warn('⚠️ Custom token auth failed, falling back to anonymous');
      }
    }

    // Fall back to anonymous auth
    const credential = await firebaseAuth.signInAnonymously(auth);
    userId = credential.user.uid;
    console.log('✅ Authenticated anonymously');
    return userId;
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    return null;
  }
}

/**
 * Gets the current user ID
 * @returns {string|null}
 */
export function getUserId() {
  return userId;
}

/**
 * Gets the Firestore database instance
 * @returns {Firestore|null}
 */
export function getDb() {
  return db;
}

/**
 * Gets the Auth instance
 * @returns {Auth|null}
 */
export function getAuth() {
  return auth;
}

/**
 * Gets the App ID for Firestore paths
 * @returns {string}
 */
export function getAppId() {
  return APP_ID;
}

/**
 * Signs out the current user
 * @returns {Promise<void>}
 */
export async function signOut() {
  if (auth) {
    await firebaseAuth.signOut(auth);
    userId = null;
  }
}

/**
 * Listens for auth state changes
 * @param {Function} callback - Called with (user) on auth state change
 * @returns {Function} - Unsubscribe function
 */
export function onAuthStateChange(callback) {
  if (!auth) {
    console.error('❌ Auth not initialized');
    return () => {};
  }

  return firebaseAuth.onAuthStateChanged(auth, callback);
}

/**
 * Gets Firestore module functions
 * @returns {Object} - Firestore functions
 */
export function getFirestoreFunctions() {
  return {
    doc: firebaseFirestore.doc,
    setDoc: firebaseFirestore.setDoc,
    getDoc: firebaseFirestore.getDoc,
    updateDoc: firebaseFirestore.updateDoc,
    collection: firebaseFirestore.collection,
    query: firebaseFirestore.query,
    addDoc: firebaseFirestore.addDoc,
    onSnapshot: firebaseFirestore.onSnapshot,
    serverTimestamp: firebaseFirestore.serverTimestamp,
    limit: firebaseFirestore.limit,
    increment: firebaseFirestore.increment,
  };
}
