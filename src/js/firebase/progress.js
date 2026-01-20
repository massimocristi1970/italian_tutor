/**
 * Progress Tracking Module
 * Handles saving and loading user progress from Firebase
 */

import { getDb, getUserId, getAppId, getFirestoreFunctions } from './init.js';

/**
 * Gets the user document path
 * @returns {string}
 */
function getUserPath() {
  return `artifacts/${getAppId()}/users/${getUserId()}`;
}

/**
 * Saves progress state to Firebase
 * @param {Object} state - Progress state to save
 */
export async function saveProgressState(state) {
  const db = getDb();
  const userId = getUserId();

  if (!db || !userId) {
    console.warn('⚠️ Cannot save progress: not authenticated');
    return;
  }

  try {
    const { doc, setDoc, serverTimestamp } = getFirestoreFunctions();
    const progressRef = doc(db, getUserPath(), 'progress', 'user_state');

    await setDoc(progressRef, {
      ...state,
      updatedAt: serverTimestamp(),
    }, { merge: true });

    console.log('✅ Progress saved');
  } catch (error) {
    console.error('❌ Error saving progress:', error);
  }
}

/**
 * Loads progress state from Firebase
 * @returns {Promise<Object|null>}
 */
export async function loadProgressState() {
  const db = getDb();
  const userId = getUserId();

  if (!db || !userId) {
    console.warn('⚠️ Cannot load progress: not authenticated');
    return null;
  }

  try {
    const { doc, getDoc } = getFirestoreFunctions();
    const progressRef = doc(db, getUserPath(), 'progress', 'user_state');
    const snapshot = await getDoc(progressRef);

    if (snapshot.exists()) {
      return snapshot.data();
    }

    return null;
  } catch (error) {
    console.error('❌ Error loading progress:', error);
    return null;
  }
}

/**
 * Listens for progress state changes
 * @param {Function} callback - Called with progress state on changes
 * @returns {Function} - Unsubscribe function
 */
export function subscribeToProgress(callback) {
  const db = getDb();
  const userId = getUserId();

  if (!db || !userId) {
    console.warn('⚠️ Cannot subscribe to progress: not authenticated');
    return () => {};
  }

  const { doc, onSnapshot } = getFirestoreFunctions();
  const progressRef = doc(db, getUserPath(), 'progress', 'user_state');

  return onSnapshot(progressRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.data());
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('❌ Progress subscription error:', error);
  });
}

/**
 * Saves a mastered phrase
 * @param {string} phraseId - ID of the mastered phrase
 */
export async function saveMasteredPhrase(phraseId) {
  const db = getDb();
  const userId = getUserId();

  if (!db || !userId) return;

  try {
    const { doc, updateDoc, serverTimestamp } = getFirestoreFunctions();
    const progressRef = doc(db, getUserPath(), 'progress', 'user_state');

    // Use array union to add the phrase ID
    await updateDoc(progressRef, {
      [`masteredIds`]: phraseId,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('❌ Error saving mastered phrase:', error);
  }
}

/**
 * Saves a dynamically generated phrase
 * @param {Object} phrase - The phrase object
 */
export async function saveDynamicPhrase(phrase) {
  const db = getDb();
  const userId = getUserId();

  if (!db || !userId) return;

  try {
    const { doc, setDoc, serverTimestamp } = getFirestoreFunctions();
    const phraseRef = doc(db, getUserPath(), 'dynamic_phrases', phrase.id);

    await setDoc(phraseRef, {
      ...phrase,
      createdAt: serverTimestamp(),
    });

    console.log('✅ Dynamic phrase saved:', phrase.id);
  } catch (error) {
    console.error('❌ Error saving dynamic phrase:', error);
  }
}

/**
 * Updates practice statistics
 * @param {Object} stats - Stats to update
 */
export async function updateStats(stats) {
  const db = getDb();
  const userId = getUserId();

  if (!db || !userId) return;

  try {
    const { doc, updateDoc, increment, serverTimestamp } = getFirestoreFunctions();
    const progressRef = doc(db, getUserPath(), 'progress', 'user_state');

    const updates = {};
    for (const [key, value] of Object.entries(stats)) {
      if (typeof value === 'number') {
        updates[`stats.${key}`] = increment(value);
      } else {
        updates[`stats.${key}`] = value;
      }
    }

    updates.updatedAt = serverTimestamp();

    await updateDoc(progressRef, updates);
  } catch (error) {
    console.error('❌ Error updating stats:', error);
  }
}
