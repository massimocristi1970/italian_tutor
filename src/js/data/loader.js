/**
 * Data Loader Module
 * Handles loading JSON data files
 */

// Cache for loaded data
const dataCache = new Map();

/**
 * Loads a JSON data file
 * @param {string} filename - Name of the file (without path)
 * @returns {Promise<Object|null>}
 */
async function loadJsonFile(filename) {
  // Check cache first
  if (dataCache.has(filename)) {
    return dataCache.get(filename);
  }

  try {
    const response = await fetch(`/src/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.status}`);
    }
    const data = await response.json();
    dataCache.set(filename, data);
    return data;
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
}

/**
 * Loads contexts data
 * @returns {Promise<Object|null>}
 */
export async function loadContexts() {
  return loadJsonFile('contexts.json');
}

/**
 * Loads alternative expressions data
 * @returns {Promise<Object|null>}
 */
export async function loadAlternativeExpressions() {
  return loadJsonFile('alternativeExpressions.json');
}

/**
 * Loads grammar milestones data
 * @returns {Promise<Object|null>}
 */
export async function loadGrammarMilestones() {
  return loadJsonFile('grammarMilestones.json');
}

/**
 * Loads conversation scenarios data
 * @returns {Promise<Object|null>}
 */
export async function loadConversationScenarios() {
  return loadJsonFile('conversationScenarios.json');
}

/**
 * Loads conversation topics data
 * @returns {Promise<Object|null>}
 */
export async function loadConversationTopics() {
  return loadJsonFile('conversationTopics.json');
}

/**
 * Loads fluency challenges data
 * @returns {Promise<Object|null>}
 */
export async function loadFluencyChallenges() {
  return loadJsonFile('fluencyChallenges.json');
}

/**
 * Loads SRS cards data
 * @returns {Promise<Object|null>}
 */
export async function loadSrsCards() {
  return loadJsonFile('srsCards.json');
}

/**
 * Loads pronunciation targets data
 * @returns {Promise<Object|null>}
 */
export async function loadPronunciationTargets() {
  return loadJsonFile('pronunciationTargets.json');
}

/**
 * Loads exam preparation data
 * @returns {Promise<Object|null>}
 */
export async function loadExamPreparation() {
  return loadJsonFile('examPreparation.json');
}

/**
 * Loads all enhancement data
 * @returns {Promise<Object>}
 */
export async function loadAllEnhancementData() {
  const [contexts, alternativeExpressions, grammarMilestones] = await Promise.all([
    loadContexts(),
    loadAlternativeExpressions(),
    loadGrammarMilestones(),
  ]);

  return {
    contexts,
    alternativeExpressions,
    grammarMilestones,
  };
}

/**
 * Clears the data cache
 */
export function clearDataCache() {
  dataCache.clear();
}
