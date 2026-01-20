/**
 * Gemini API Module
 * Handles communication with Google Gemini AI
 */

import { API, DEFAULTS, GEMINI_API_KEY } from '../config.js';
import { showModal } from '../ui/modal.js';

/**
 * Determines whether to use the proxy or direct API
 * @returns {boolean}
 */
function shouldUseProxy() {
  return !GEMINI_API_KEY;
}

/**
 * Makes a request to Gemini API with retry logic
 * @param {Object} options - Request options
 * @returns {Promise<string>} - Response text
 */
export async function callGemini({
  userPrompt,
  systemPrompt,
  useSearch = false,
  modelName = DEFAULTS.GEMINI_MODEL,
  maxRetries = DEFAULTS.MAX_RETRIES,
  responseType = 'text', // 'text' or 'json'
}) {
  const useProxy = shouldUseProxy();
  let apiUrl;
  let payload;

  if (useProxy) {
    // Use Firebase Cloud Function proxy
    apiUrl = API.GEMINI_PROXY;
    payload = {
      userPrompt,
      systemPrompt,
      useSearch,
      modelName,
    };
  } else {
    // Direct API call (local development only)
    apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
    payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    if (useSearch) {
      payload.tools = [{ google_search: {} }];
    }

    if (responseType === 'json') {
      payload.generationConfig = {
        responseMimeType: 'application/json',
      };
    }
  }

  let delay = DEFAULTS.INITIAL_RETRY_DELAY;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle rate limiting with exponential backoff
        if (response.status === 429 && attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2;
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text ||
                   "The tutor didn't provide a complete response.";

      return text;
    } catch (error) {
      console.error(`Gemini API call failed (attempt ${attempt + 1}):`, error);

      if (attempt === maxRetries - 1) {
        throw error;
      }

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }

  throw new Error('Max retries exceeded');
}

/**
 * Checks a sentence for grammatical correctness
 * @param {string} userSentence - User's sentence attempt
 * @param {string} targetLanguage - Target language
 * @param {string} englishGoal - English goal sentence
 * @returns {Promise<{isCorrect: boolean, feedback: string}>}
 */
export async function checkSentence(userSentence, targetLanguage, englishGoal) {
  const systemPrompt = `You are a strict ${targetLanguage} grammar checker. The user is trying to translate an English sentence into ${targetLanguage}.
Check if their translation is grammatically correct and conveys the same meaning.
If correct, start your response with "Correct!".
If incorrect, start with "Not quite." and explain the error briefly.`;

  const userPrompt = `English goal: "${englishGoal}"
User's ${targetLanguage} attempt: "${userSentence}"

Is this translation correct?`;

  try {
    const response = await callGemini({
      userPrompt,
      systemPrompt,
      useSearch: false,
    });

    const isCorrect = response.toLowerCase().trim().startsWith('correct');
    return { isCorrect, feedback: response };
  } catch (error) {
    console.error('Sentence check failed:', error);
    return {
      isCorrect: false,
      feedback: 'Error: Could not check sentence. Please try again.',
    };
  }
}

/**
 * Generates a dynamic phrase for practice
 * @param {string} targetLanguage - 'Italian' or 'Sicilian'
 * @param {string} level - 'level1', 'level2', or 'level3'
 * @returns {Promise<Object|null>} - Generated phrase object or null on error
 */
export async function generateDynamicPhrase(targetLanguage, level) {
  const levelDescriptions = {
    level1: 'beginner (A1-A2) using only present tense and basic vocabulary',
    level2: 'intermediate (B1-B2) using past/future tenses and expanded vocabulary',
    level3: 'advanced (C1-C2) using all tenses including subjunctive/conditional and complex structures',
  };

  const langDisplay = targetLanguage === 'Sicilian' ? 'Sicilian (Sicilianu)' : 'Italian (Italiano)';
  const levelDesc = levelDescriptions[level] || levelDescriptions.level1;

  const systemPrompt = `You are a phrase generator. Respond STRICTLY in JSON format with the following schema:
{"english": "English translation", "${targetLanguage.toLowerCase()}": "Target language sentence"}.
Do not include any other text or explanation.`;

  const userPrompt = `Generate a new, unique sentence for a ${levelDesc} student in ${langDisplay}. The sentence must be 5-10 words long. Provide the sentence in the requested language and its exact English translation.`;

  try {
    const response = await callGemini({
      userPrompt,
      systemPrompt,
      useSearch: false,
      responseType: 'json',
    });

    // Parse JSON response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      id: 'D' + Date.now(),
      english: parsed.english,
      [targetLanguage.toLowerCase()]: parsed[targetLanguage.toLowerCase()],
    };
  } catch (error) {
    console.error('Error generating dynamic phrase:', error);
    showModal('AI Generation Error', 'Could not generate new lesson phrase.', true);
    return null;
  }
}

/**
 * Sends a chat message to the tutor
 * @param {string} message - User's message
 * @param {string} targetLanguage - Target language
 * @param {string} level - Current level
 * @returns {Promise<string>} - Tutor's response
 */
export async function sendChatMessage(message, targetLanguage, level) {
  const systemPrompt = `You are a supportive, knowledgeable ${targetLanguage} language tutor.
You help students learn ${targetLanguage} through conversation, grammar explanations, and cultural insights.
Keep responses concise but helpful. Use simple ${targetLanguage} words occasionally with translations.
The student is at the ${level} level.`;

  try {
    const response = await callGemini({
      userPrompt: message,
      systemPrompt,
      useSearch: true, // Enable search for cultural questions
    });

    return response;
  } catch (error) {
    console.error('Chat message failed:', error);
    throw new Error("Sorry, I can't connect to the tutor right now.");
  }
}
