/**
 * Speech Module
 * Text-to-speech and speech recognition functionality
 */

import { showModal } from './ui/modal.js';

// Speech synthesis voices cache
let cachedVoices = [];

/**
 * Loads and caches available voices
 */
function loadVoices() {
  cachedVoices = speechSynthesis.getVoices();
}

// Load voices when available
if (typeof speechSynthesis !== 'undefined') {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

/**
 * Gets the best voice for a language
 * @param {string} language - 'Italian' or 'Sicilian'
 * @returns {SpeechSynthesisVoice|null}
 */
function getVoiceForLanguage(language) {
  if (cachedVoices.length === 0) {
    loadVoices();
  }

  // Language codes to try
  const langCodes = language === 'Sicilian'
    ? ['scn', 'it-IT', 'it'] // Sicilian, then Italian fallback
    : ['it-IT', 'it'];

  for (const code of langCodes) {
    const voice = cachedVoices.find((v) =>
      v.lang.toLowerCase().startsWith(code.toLowerCase())
    );
    if (voice) return voice;
  }

  return null;
}

/**
 * Speaks text using the Web Speech API
 * @param {string} text - Text to speak
 * @param {string} language - Language ('Italian' or 'Sicilian')
 */
export function speakText(text, language = 'Italian') {
  if (!text) return;

  if (typeof speechSynthesis === 'undefined') {
    showModal('Speech Not Supported', 'Text-to-speech is not supported in your browser.', true);
    return;
  }

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Set language
  utterance.lang = language === 'Sicilian' ? 'it-IT' : 'it-IT';

  // Try to get a native voice
  const voice = getVoiceForLanguage(language);
  if (voice) {
    utterance.voice = voice;
  }

  // Adjust speech parameters
  utterance.rate = 0.9; // Slightly slower for learning
  utterance.pitch = 1;
  utterance.volume = 1;

  speechSynthesis.speak(utterance);
}

/**
 * Checks if speech recognition is available
 * @returns {boolean}
 */
export function isSpeechRecognitionAvailable() {
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/**
 * Creates a speech recognition instance
 * @param {Object} options - Recognition options
 * @returns {SpeechRecognition|null}
 */
export function createSpeechRecognition(options = {}) {
  if (!isSpeechRecognitionAvailable()) {
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  // Default settings
  recognition.continuous = options.continuous ?? false;
  recognition.interimResults = options.interimResults ?? true;
  recognition.lang = options.lang ?? 'it-IT';
  recognition.maxAlternatives = options.maxAlternatives ?? 1;

  return recognition;
}

/**
 * Starts speech recognition and returns a promise with the result
 * @param {string} language - Language for recognition
 * @returns {Promise<string>} - Recognized text
 */
export function recognizeSpeech(language = 'Italian') {
  return new Promise((resolve, reject) => {
    if (!isSpeechRecognitionAvailable()) {
      reject(new Error('Speech recognition is not supported in your browser. Try Chrome or Edge.'));
      return;
    }

    const recognition = createSpeechRecognition({
      lang: language === 'Italian' ? 'it-IT' : 'it-IT', // Both use Italian for now
      continuous: false,
      interimResults: false,
    });

    if (!recognition) {
      reject(new Error('Could not create speech recognition instance'));
      return;
    }

    let finalTranscript = '';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
    };

    recognition.onerror = (event) => {
      recognition.stop();
      if (event.error === 'no-speech') {
        reject(new Error('No speech detected. Please try again.'));
      } else if (event.error === 'not-allowed') {
        reject(new Error('Microphone access denied. Please allow microphone access in your browser settings.'));
      } else {
        reject(new Error(`Speech recognition error: ${event.error}`));
      }
    };

    recognition.onend = () => {
      if (finalTranscript) {
        resolve(finalTranscript.trim());
      } else {
        reject(new Error('No speech recognized'));
      }
    };

    try {
      recognition.start();
    } catch (error) {
      reject(new Error('Could not start speech recognition'));
    }
  });
}

/**
 * Stops the speech synthesis
 */
export function stopSpeaking() {
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
}
