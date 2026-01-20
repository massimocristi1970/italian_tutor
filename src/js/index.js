/**
 * Main Application Entry Point
 * Initializes all modules and starts the app
 */

// Configuration
export { getFirebaseConfig, DEFAULTS, isLocalDevelopment } from './config.js';

// Firebase
export { initializeFirebase, authenticateUser, getUserId, signOut } from './firebase/init.js';
export { saveProgressState, loadProgressState, subscribeToProgress } from './firebase/progress.js';
export { saveChatMessage, loadChatHistory, subscribeToChatHistory } from './firebase/chat.js';

// API
export { callGemini, checkSentence, generateDynamicPhrase, sendChatMessage } from './api/gemini.js';

// UI
export { showModal, hideModal, showToast, confirm, initModal } from './ui/modal.js';
export { setDarkMode, isDarkMode, toggleDarkMode, initTheme } from './ui/theme.js';

// Speech
export { speakText, recognizeSpeech, isSpeechRecognitionAvailable, stopSpeaking } from './speech.js';

// Utilities
export { escapeHtml, createElement, safeHtml, setTextContent } from './utils/sanitize.js';
export { $, $$, $$$, on, show, hide, toggle, clearChildren, debounce, throttle } from './utils/dom.js';

// Data
export { loadContexts, loadAlternativeExpressions, loadGrammarMilestones, loadAllEnhancementData } from './data/loader.js';

/**
 * Initialize the application
 * @returns {Promise<boolean>}
 */
export async function initApp() {
  console.log('🚀 Initializing Italian Tutor App...');

  try {
    // Initialize theme first (no async)
    const { initTheme } = await import('./ui/theme.js');
    initTheme();

    // Initialize modal
    const { initModal } = await import('./ui/modal.js');
    initModal();

    // Initialize Firebase
    const { initializeFirebase, authenticateUser } = await import('./firebase/init.js');
    const firebaseReady = await initializeFirebase();

    if (!firebaseReady) {
      console.error('❌ Firebase initialization failed');
      return false;
    }

    // Authenticate user
    const userId = await authenticateUser();
    if (!userId) {
      console.error('❌ Authentication failed');
      return false;
    }

    console.log('✅ App initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ App initialization failed:', error);
    return false;
  }
}
