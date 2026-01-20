/**
 * Chat History Module
 * Handles saving and loading chat messages from Firebase
 */

import { getDb, getUserId, getAppId, getFirestoreFunctions } from './init.js';

/**
 * Gets the chat collection path
 * @returns {string}
 */
function getChatPath() {
  return `artifacts/${getAppId()}/users/${getUserId()}/chat_history`;
}

/**
 * Saves a chat message to Firebase
 * @param {string} message - Message content
 * @param {string} role - 'user' or 'tutor'
 */
export async function saveChatMessage(message, role) {
  const db = getDb();
  const userId = getUserId();

  if (!db || !userId) {
    console.warn('⚠️ Cannot save chat: not authenticated');
    return;
  }

  try {
    const { collection, addDoc, serverTimestamp } = getFirestoreFunctions();
    const chatRef = collection(db, getChatPath());

    await addDoc(chatRef, {
      message,
      role,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('❌ Error saving chat message:', error);
  }
}

/**
 * Loads recent chat history
 * @param {number} maxMessages - Maximum messages to load
 * @returns {Promise<Array>}
 */
export async function loadChatHistory(maxMessages = 50) {
  const db = getDb();
  const userId = getUserId();

  if (!db || !userId) {
    console.warn('⚠️ Cannot load chat: not authenticated');
    return [];
  }

  try {
    const { collection, query, limit, getDocs, orderBy } = getFirestoreFunctions();
    const chatRef = collection(db, getChatPath());
    const q = query(chatRef, orderBy('timestamp', 'desc'), limit(maxMessages));

    const snapshot = await getDocs(q);
    const messages = [];

    snapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Return in chronological order
    return messages.reverse();
  } catch (error) {
    console.error('❌ Error loading chat history:', error);
    return [];
  }
}

/**
 * Subscribes to chat history updates
 * @param {Function} callback - Called with messages array on updates
 * @param {number} maxMessages - Maximum messages to listen for
 * @returns {Function} - Unsubscribe function
 */
export function subscribeToChatHistory(callback, maxMessages = 50) {
  const db = getDb();
  const userId = getUserId();

  if (!db || !userId) {
    console.warn('⚠️ Cannot subscribe to chat: not authenticated');
    return () => {};
  }

  const { collection, query, limit, onSnapshot, orderBy } = getFirestoreFunctions();
  const chatRef = collection(db, getChatPath());
  const q = query(chatRef, orderBy('timestamp', 'desc'), limit(maxMessages));

  return onSnapshot(q, (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    // Return in chronological order
    callback(messages.reverse());
  }, (error) => {
    console.error('❌ Chat subscription error:', error);
  });
}

/**
 * Clears all chat history
 * @returns {Promise<void>}
 */
export async function clearChatHistory() {
  const db = getDb();
  const userId = getUserId();

  if (!db || !userId) return;

  try {
    const { collection, getDocs, deleteDoc } = getFirestoreFunctions();
    const chatRef = collection(db, getChatPath());
    const snapshot = await getDocs(chatRef);

    const deletePromises = [];
    snapshot.forEach((doc) => {
      deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);
    console.log('✅ Chat history cleared');
  } catch (error) {
    console.error('❌ Error clearing chat history:', error);
  }
}
