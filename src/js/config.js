/**
 * Application Configuration
 * Centralized configuration management
 */

// App identifier for Firebase paths
export const APP_ID = typeof window !== 'undefined' && window.__app_id
  ? window.__app_id
  : 'italian-tutor-default';

// Initial auth token (if provided by embedding platform)
export const INITIAL_AUTH_TOKEN = typeof window !== 'undefined' && window.__initial_auth_token
  ? window.__initial_auth_token
  : null;

// Gemini API key (for local development only)
export const GEMINI_API_KEY = typeof window !== 'undefined' && window.__gemini_api_key
  ? window.__gemini_api_key
  : null;

/**
 * Determines if running in local development mode
 * @returns {boolean}
 */
export function isLocalDevelopment() {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
}

/**
 * Gets Firebase configuration
 * In production, fetches from Cloud Function
 * In development, uses mock config
 * @returns {Promise<Object|null>} Firebase config object or null on error
 */
export async function getFirebaseConfig() {
  try {
    if (isLocalDevelopment()) {
      console.warn('⚠️ Running locally — using mock Firebase config');
      return {
        apiKey: 'test-key',
        authDomain: 'test.firebaseapp.com',
        projectId: 'test-project',
        storageBucket: 'test.appspot.com',
        messagingSenderId: '12345',
        appId: '1:12345:web:test',
      };
    }

    // Fetch from Cloud Function endpoint
    const response = await fetch('/api/get-config');

    if (!response.ok) {
      throw new Error(`Config fetch failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.firebaseConfig || !data.firebaseConfig.apiKey) {
      throw new Error('Invalid config response');
    }

    console.log('✅ Firebase config loaded from server');
    return data.firebaseConfig;
  } catch (error) {
    console.error('❌ Error loading Firebase config:', error.message);

    // Fallback to embedded config for production
    // This ensures the app works even if the config endpoint fails
    if (!isLocalDevelopment()) {
      console.warn('⚠️ Using fallback embedded config');
      return {
        apiKey: 'AIzaSyAMlShSEWBzHhKTL6lcFYVec1U6i_kNco0',
        authDomain: 'italiantutorapp.firebaseapp.com',
        projectId: 'italiantutorapp',
        storageBucket: 'italiantutorapp.firebasestorage.app',
        messagingSenderId: '915130971011',
        appId: '1:915130971011:web:171cfb69941fdf7997fcb6',
      };
    }

    return null;
  }
}

/**
 * API Endpoints
 */
export const API = {
  GEMINI_PROXY: '/api/gemini-proxy',
  GET_CONFIG: '/api/get-config',
};

/**
 * Default settings
 */
export const DEFAULTS = {
  LANGUAGE: 'Italian',
  LEVEL: 'level1',
  MAX_STATIC_PHRASES: 100,
  GEMINI_MODEL: 'gemini-2.5-flash',
  MAX_RETRIES: 5,
  INITIAL_RETRY_DELAY: 1000,
};

/**
 * Level descriptions for AI prompts
 */
export const LEVEL_DESCRIPTIONS = {
  level1: 'beginner (A1-A2) using only present tense and basic vocabulary',
  level2: 'intermediate (B1-B2) using past/future tenses and expanded vocabulary',
  level3: 'advanced (C1-C2) using all tenses including subjunctive/conditional and complex structures',
};

/**
 * CSS Classes for consistent styling
 */
export const CSS = {
  BUTTON: {
    PRIMARY: 'px-4 py-2 bg-verde-italiano text-white rounded-lg hover:bg-verde-hover transition',
    SECONDARY: 'px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition',
    DANGER: 'px-4 py-2 bg-rosso-classico text-white rounded-lg hover:bg-red-700 transition',
  },
  FEEDBACK: {
    SUCCESS: 'mt-4 p-3 rounded-lg text-sm bg-green-100 text-green-700 block dark:bg-green-900 dark:text-green-200',
    ERROR: 'mt-4 p-3 rounded-lg text-sm bg-red-100 text-red-700 block dark:bg-red-900 dark:text-red-200',
  },
};
