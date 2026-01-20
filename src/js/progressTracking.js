// Progress Tracking Data Structure
// This defines what gets saved to Firebase for each user

const userProgressSchema = {
  // Verb conjugation tracking
  verb_mastery: {
    // Example: "parlare_presente": { attempts: 5, correct: 4, lastPracticed: timestamp }
    // Format: "{verb}_{tense}": { attempts, correct, lastPracticed }
  },

  // Grammar structure tracking
  grammar_usage: {
    articles: { attempts: 0, correct: 0 },
    pronouns: { attempts: 0, correct: 0 },
    prepositions: { attempts: 0, correct: 0 },
    agreement: { attempts: 0, correct: 0 }
  },

  // Sentence complexity tracking
  sentences: {
    simple: 0,
    compound: 0,
    complex: 0,
    total: 0
  },

  // Vocabulary tracking
  vocabulary: {
    unique_words: new Set(), // Will be stored as array in Firebase
    words_by_category: {
      nouns: new Set(),
      verbs: new Set(),
      adjectives: new Set(),
      adverbs: new Set()
    }
  },

  // Milestone completion
  milestones_completed: {
    // milestone_id: { completedAt: timestamp, progress: {} }
  },

  // Practice consistency
  practice_days: {
    streak: 0,
    longest_streak: 0,
    total_days: 0,
    last_practice_date: null,
    practice_calendar: {} // Format: "YYYY-MM-DD": true
  },

  // Common mistakes for personalized feedback
  common_mistakes: {
    // Pattern: { count, examples: [], lastSeen: timestamp }
  },

  // Overall statistics
  stats: {
    total_sentences_built: 0,
    total_sentences_correct: 0,
    total_chat_messages: 0,
    total_practice_time_minutes: 0,
    level_progress: {
      level1: 0, // Percentage 0-100
      level2: 0,
      level3: 0
    }
  },

  // Achievements unlocked
  achievements: {
    // achievement_id: { unlockedAt: timestamp, celebrated: boolean }
  }
};

// Helper functions for progress calculations

function calculateMilestoneProgress(userProgress, milestoneId, milestoneData) {
  // Returns percentage progress (0-100) towards a milestone
  const requirements = milestoneData.requirements;
  const progress = {};

  Object.keys(requirements).forEach(key => {
    const required = requirements[key];
    const current = getUserProgressForRequirement(userProgress, key);
    progress[key] = {
      current: current,
      required: required,
      percentage: Math.min(100, (current / required) * 100)
    };
  });

  return progress;
}

function getUserProgressForRequirement(userProgress, requirementKey) {
  // Maps requirement keys to actual user progress data
  // Example: "regular_are" -> count of mastered regular -are verbs

  // This will be implemented based on specific requirement types
  return 0;
}

function checkMilestoneCompletion(userProgress, milestoneId, milestoneData) {
  const progress = calculateMilestoneProgress(userProgress, milestoneId, milestoneData);

  // Check if all requirements are at 100%
  return Object.values(progress).every(req => req.percentage >= 100);
}

function updatePracticeStreak(userProgress) {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const lastPractice = userProgress.practice_days.last_practice_date;

  if (!lastPractice) {
    // First practice ever
    userProgress.practice_days.streak = 1;
    userProgress.practice_days.total_days = 1;
    userProgress.practice_days.last_practice_date = today;
    userProgress.practice_days.practice_calendar[today] = true;
    return;
  }

  const lastDate = new Date(lastPractice);
  const todayDate = new Date(today);
  const dayDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

  if (dayDiff === 0) {
    // Same day, no change
    return;
  } else if (dayDiff === 1) {
    // Consecutive day
    userProgress.practice_days.streak += 1;
    userProgress.practice_days.total_days += 1;

    if (userProgress.practice_days.streak > userProgress.practice_days.longest_streak) {
      userProgress.practice_days.longest_streak = userProgress.practice_days.streak;
    }
  } else {
    // Streak broken
    userProgress.practice_days.streak = 1;
    userProgress.practice_days.total_days += 1;
  }

  userProgress.practice_days.last_practice_date = today;
  userProgress.practice_days.practice_calendar[today] = true;
}

function trackVerbPractice(userProgress, verb, tense, isCorrect) {
  const key = `${verb}_${tense}`;

  if (!userProgress.verb_mastery[key]) {
    userProgress.verb_mastery[key] = {
      attempts: 0,
      correct: 0,
      lastPracticed: null
    };
  }

  userProgress.verb_mastery[key].attempts += 1;
  if (isCorrect) {
    userProgress.verb_mastery[key].correct += 1;
  }
  userProgress.verb_mastery[key].lastPracticed = Date.now();

  // Check for mastery (e.g., 80% accuracy over 5+ attempts)
  const accuracy = userProgress.verb_mastery[key].correct / userProgress.verb_mastery[key].attempts;
  if (userProgress.verb_mastery[key].attempts >= 5 && accuracy >= 0.8) {
    return { mastered: true, verb, tense };
  }

  return { mastered: false };
}

function trackVocabularyUsage(userProgress, words) {
  // Add unique words to vocabulary set
  words.forEach(word => {
    userProgress.vocabulary.unique_words.add(word.toLowerCase());
  });
}

function identifyCommonMistake(userProgress, mistakePattern, example) {
  if (!userProgress.common_mistakes[mistakePattern]) {
    userProgress.common_mistakes[mistakePattern] = {
      count: 0,
      examples: [],
      lastSeen: null
    };
  }

  userProgress.common_mistakes[mistakePattern].count += 1;
  userProgress.common_mistakes[mistakePattern].examples.push(example);
  userProgress.common_mistakes[mistakePattern].lastSeen = Date.now();

  // Keep only last 3 examples
  if (userProgress.common_mistakes[mistakePattern].examples.length > 3) {
    userProgress.common_mistakes[mistakePattern].examples.shift();
  }
}

// Export for use in main app
export {
  userProgressSchema,
  calculateMilestoneProgress,
  checkMilestoneCompletion,
  updatePracticeStreak,
  trackVerbPractice,
  trackVocabularyUsage,
  identifyCommonMistake
};
