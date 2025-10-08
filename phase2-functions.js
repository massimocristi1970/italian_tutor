// ========================================
// PHASE 2: PROGRESS TRACKING & MILESTONES
// Add these functions to your index.html <script> block
// ========================================

// Global state for Phase 2
let grammarMilestonesData = null;
let userProgress = null;

// Load grammar milestones data
async function loadGrammarMilestones() {
  try {
    const response = await fetch('grammarMilestones.json');
    grammarMilestonesData = await response.json();
    console.log('✅ Grammar milestones data loaded');
    return true;
  } catch (error) {
    console.warn('⚠️ Could not load grammar milestones:', error);
    return false;
  }
}

// Initialize user progress structure
function initializeUserProgress() {
  return {
    verb_mastery: {},
    grammar_usage: {
      articles: { attempts: 0, correct: 0 },
      pronouns: { attempts: 0, correct: 0 },
      prepositions: { attempts: 0, correct: 0 },
      agreement: { attempts: 0, correct: 0 }
    },
    sentences: {
      simple: 0,
      compound: 0,
      complex: 0,
      total: 0
    },
    vocabulary: {
      unique_words: [],
      words_by_category: {
        nouns: [],
        verbs: [],
        adjectives: [],
        adverbs: []
      }
    },
    milestones_completed: {},
    practice_days: {
      streak: 0,
      longest_streak: 0,
      total_days: 0,
      last_practice_date: null,
      practice_calendar: {}
    },
    common_mistakes: {},
    stats: {
      total_sentences_built: 0,
      total_sentences_correct: 0,
      total_chat_messages: 0,
      total_practice_time_minutes: 0,
      level_progress: {
        level1: 0,
        level2: 0,
        level3: 0
      }
    },
    achievements: {}
  };
}

// Update practice streak
function updatePracticeStreak() {
  if (!userProgress) return;
  
  const today = new Date().toISOString().split('T')[0];
  const lastPractice = userProgress.practice_days.last_practice_date;
  
  if (!lastPractice) {
    userProgress.practice_days.streak = 1;
    userProgress.practice_days.total_days = 1;
    userProgress.practice_days.last_practice_date = today;
    userProgress.practice_days.practice_calendar[today] = true;
    
    saveUserProgressToFirebase();
    return;
  }
  
  if (lastPractice === today) {
    return; // Already practiced today
  }
  
  const lastDate = new Date(lastPractice);
  const todayDate = new Date(today);
  const dayDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
  
  if (dayDiff === 1) {
    // Consecutive day
    userProgress.practice_days.streak += 1;
    userProgress.practice_days.total_days += 1;
    
    if (userProgress.practice_days.streak > userProgress.practice_days.longest_streak) {
      userProgress.practice_days.longest_streak = userProgress.practice_days.streak;
    }
    
    // Check for streak milestones
    checkStreakMilestones();
  } else {
    // Streak broken
    userProgress.practice_days.streak = 1;
    userProgress.practice_days.total_days += 1;
  }
  
  userProgress.practice_days.last_practice_date = today;
  userProgress.practice_days.practice_calendar[today] = true;
  
  saveUserProgressToFirebase();
}

// Track verb practice
function trackVerbPractice(verb, tense, isCorrect) {
  if (!userProgress) return;
  
  const key = `${verb}_${tense}`;
  
  if (!userProgress.verb_mastery[key]) {
    userProgress.verb_mastery[key] = {
      attempts: 0,
      correct: 0,
      lastPracticed: Date.now()
    };
  }
  
  userProgress.verb_mastery[key].attempts += 1;
  if (isCorrect) {
    userProgress.verb_mastery[key].correct += 1;
  }
  userProgress.verb_mastery[key].lastPracticed = Date.now();
  
  // Check for mastery (80% accuracy over 5+ attempts)
  const accuracy = userProgress.verb_mastery[key].correct / userProgress.verb_mastery[key].attempts;
  const isMastered = userProgress.verb_mastery[key].attempts >= 5 && accuracy >= 0.8;
  
  if (isMastered) {
    checkVerbMilestones(verb, tense);
  }
  
  saveUserProgressToFirebase();
  
  return { mastered: isMastered, accuracy: accuracy };
}

// Track vocabulary usage
function trackVocabularyUsage(words) {
  if (!userProgress) return;
  
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    if (!userProgress.vocabulary.unique_words.includes(lowerWord)) {
      userProgress.vocabulary.unique_words.push(lowerWord);
    }
  });
  
  checkVocabularyMilestones();
  saveUserProgressToFirebase();
}

// Track sentence building
function trackSentenceBuilt(isCorrect, complexity = 'simple') {
  if (!userProgress) return;
  
  userProgress.sentences.total += 1;
  userProgress.sentences[complexity] += 1;
  userProgress.stats.total_sentences_built += 1;
  
  if (isCorrect) {
    userProgress.stats.total_sentences_correct += 1;
  }
  
  checkSentenceMilestones();
  saveUserProgressToFirebase();
}

// Check verb conjugation milestones
function checkVerbMilestones(verb, tense) {
  if (!grammarMilestonesData) return;
  
  const verbMilestones = grammarMilestonesData.milestones.verb_conjugations;
  
  // Check present tense milestone
  if (tense === 'presente') {
    const milestone = verbMilestones.present;
    const progress = calculateVerbMilestoneProgress(milestone);
    
    if (isVerbMilestoneComplete(progress, milestone)) {
      unlockMilestone('present_tense', milestone);
    }
  }
}

// Calculate verb milestone progress
function calculateVerbMilestoneProgress(milestone) {
  const progress = {};
  const requirements = milestone.requirements;
  
  Object.keys(requirements).forEach(verbType => {
    const required = requirements[verbType];
    const mastered = countMasteredVerbsByType(verbType);
    
    progress[verbType] = {
      current: mastered,
      required: required,
      percentage: Math.min(100, (mastered / required) * 100)
    };
  });
  
  return progress;
}

// Count mastered verbs by type
function countMasteredVerbsByType(verbType) {
  if (!userProgress || !userProgress.verb_mastery) return 0;
  
  let count = 0;
  
  Object.keys(userProgress.verb_mastery).forEach(key => {
    const [verb, tense] = key.split('_');
    const data = userProgress.verb_mastery[key];
    
    if (tense === 'presente' && data.attempts >= 5) {
      const accuracy = data.correct / data.attempts;
      if (accuracy >= 0.8) {
        // Check if verb matches type
        // This would need verb type database
        count++;
      }
    }
  });
  
  return count;
}

// Check if verb milestone is complete
function isVerbMilestoneComplete(progress, milestone) {
  return Object.values(progress).every(p => p.percentage >= 100);
}

// Check streak milestones
function checkStreakMilestones() {
  if (!grammarMilestonesData || !userProgress) return;
  
  const consistencyMilestones = grammarMilestonesData.milestones.consistency;
  const streak = userProgress.practice_days.streak;
  const totalDays = userProgress.practice_days.total_days;
  
  // Check daily learner (7 days)
  if (streak >= 7 && !userProgress.milestones_completed['daily_learner']) {
    unlockMilestone('daily_learner', consistencyMilestones.daily_practice);
  }
  
  // Check weekly warrior (30 days)
  if (streak >= 30 && !userProgress.milestones_completed['weekly_warrior']) {
    unlockMilestone('weekly_warrior', consistencyMilestones.weekly_warrior);
  }
  
  // Check dedicated student (100 total days)
  if (totalDays >= 100 && !userProgress.milestones_completed['dedicated_student']) {
    unlockMilestone('dedicated_student', consistencyMilestones.dedication);
  }
}

// Check vocabulary milestones
function checkVocabularyMilestones() {
  if (!grammarMilestonesData || !userProgress) return;
  
  const vocabMilestones = grammarMilestonesData.milestones.vocabulary;
  const wordCount = userProgress.vocabulary.unique_words.length;
  
  if (wordCount >= 100 && !userProgress.milestones_completed['vocab_100']) {
    unlockMilestone('vocab_100', vocabMilestones.beginner);
  }
  
  if (wordCount >= 300 && !userProgress.milestones_completed['vocab_300']) {
    unlockMilestone('vocab_300', vocabMilestones.intermediate);
  }
  
  if (wordCount >= 500 && !userProgress.milestones_completed['vocab_500']) {
    unlockMilestone('vocab_500', vocabMilestones.advanced);
  }
}

// Check sentence complexity milestones
function checkSentenceMilestones() {
  if (!grammarMilestonesData || !userProgress) return;
  
  const sentenceMilestones = grammarMilestonesData.milestones.sentence_complexity;
  const sentences = userProgress.sentences;
  
  if (sentences.total >= 10 && !userProgress.milestones_completed['simple_sentences']) {
    unlockMilestone('simple_sentences', sentenceMilestones.simple);
  }
  
  if (sentences.total >= 30 && !userProgress.milestones_completed['compound_sentences']) {
    unlockMilestone('compound_sentences', sentenceMilestones.compound);
  }
  
  if (sentences.total >= 60 && !userProgress.milestones_completed['complex_sentences']) {
    unlockMilestone('complex_sentences', sentenceMilestones.complex);
  }
}

// Unlock a milestone
function unlockMilestone(milestoneId, milestoneData) {
  if (!userProgress) return;
  
  userProgress.milestones_completed[milestoneId] = {
    completedAt: Date.now(),
    celebrated: false
  };
  
  saveUserProgressToFirebase();
  showAchievementPopup(milestoneData);
}

// Show achievement popup
function showAchievementPopup(milestoneData) {
  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.innerHTML = `
    <button class="achievement-close" onclick="this.parentElement.remove()">×</button>
    <div class="achievement-header">
      <span class="achievement-icon">${milestoneData.icon}</span>
      <div>
        <h3 class="achievement-title">${milestoneData.name}</h3>
      </div>
    </div>
    <p class="achievement-message">${milestoneData.description}</p>
  `;
  
  document.body.appendChild(popup);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    popup.style.opacity = '0';
    popup.style.transform = 'translateX(400px)';
    setTimeout(() => popup.remove(), 300);
  }, 5000);
  
  // Mark as celebrated
  if (userProgress && userProgress.milestones_completed[milestoneData.id]) {
    userProgress.milestones_completed[milestoneData.id].celebrated = true;
    saveUserProgressToFirebase();
  }
}

// Save user progress to Firebase
async function saveUserProgressToFirebase() {
  if (!db || !userId || !auth.currentUser || !userProgress) return;
  
  try {
    const progressDocRef = doc(
      db,
      getPrivateCollectionPath('progress'),
      'user_progress'
    );
    
    await setDoc(progressDocRef, {
      ...userProgress,
      lastUpdated: serverTimestamp()
    }, { merge: true });
    
  } catch (error) {
    console.warn('Could not save user progress:', error);
  }
}

// Load user progress from Firebase
async function loadUserProgressFromFirebase() {
  if (!db || !userId || !auth.currentUser) return;
  
  try {
    const progressDocRef = doc(
      db,
      getPrivateCollectionPath('progress'),
      'user_progress'
    );
    
    const docSnap = await getDoc(progressDocRef);
    
    if (docSnap.exists()) {
      userProgress = docSnap.data();
      console.log('✅ User progress loaded from Firebase');
    } else {
      userProgress = initializeUserProgress();
      console.log('✅ Initialized new user progress');
    }
    
    // Update practice streak on load
    updatePracticeStreak();
    
  } catch (error) {
    console.error('Error loading user progress:', error);
    userProgress = initializeUserProgress();
  }
}

// Create progress dashboard UI
function createProgressDashboard() {
  if (!grammarMilestonesData) return null;
  
  const dashboard = document.createElement('div');
  dashboard.className = 'progress-dashboard';
  dashboard.id = 'progress-dashboard';
  
  // Header
  dashboard.innerHTML = `
    <div class="dashboard-header">
      <div>
        <h2 class="dashboard-title">📊 Your Progress</h2>
        <p class="dashboard-subtitle">Track your learning journey</p>
      </div>
    </div>
  `;
  
  // Skill areas
  const skillAreas = document.createElement('div');
  skillAreas.className = 'skill-areas';
  
  grammarMilestonesData.skill_areas.forEach(skill => {
    const card = createSkillCard(skill);
    skillAreas.appendChild(card);
  });
  
  dashboard.appendChild(skillAreas);
  
  // Stats
  const statsGrid = createStatsGrid();
  dashboard.appendChild(statsGrid);
  
  return dashboard;
}

// Create skill card
function createSkillCard(skill) {
  const card = document.createElement('div');
  card.className = 'skill-card';
  card.onclick = () => showSkillDetails(skill.id);
  
  const progress = calculateSkillProgress(skill.id);
  
  card.innerHTML = `
    <span class="skill-icon">${skill.icon}</span>
    <div class="skill-name">${skill.name}</div>
    <div class="skill-description">${skill.description}</div>
    <div class="skill-progress">${progress}%</div>
    <div class="progress-bar-container">
      <div class="progress-bar-fill" style="width: ${progress}%; background-color: ${skill.color};"></div>
    </div>
  `;
  
  return card;
}

// Calculate skill progress
function calculateSkillProgress(skillId) {
  if (!userProgress) return 0;
  
  // Placeholder calculation - will be enhanced
  switch(skillId) {
    case 'verbs':
      return Math.min(100, Object.keys(userProgress.verb_mastery).length * 2);
    case 'vocabulary':
      return Math.min(100, Math.floor((userProgress.vocabulary.unique_words.length / 500) * 100));
    case 'sentences':
      return Math.min(100, Math.floor((userProgress.sentences.total / 60) * 100));
    case 'consistency':
      return Math.min(100, userProgress.practice_days.total_days);
    default:
      return 0;
  }
}

// Create stats grid
function createStatsGrid() {
  if (!userProgress) return document.createElement('div');
  
  const grid = document.createElement('div');
  grid.className = 'stats-grid';
  
  const stats = [
    { label: 'Streak', value: `${userProgress.practice_days.streak}🔥` },
    { label: 'Sentences', value: userProgress.sentences.total },
    { label: 'Words', value: userProgress.vocabulary.unique_words.length },
    { label: 'Accuracy', value: userProgress.stats.total_sentences_built > 0 
      ? `${Math.round((userProgress.stats.total_sentences_correct / userProgress.stats.total_sentences_built) * 100)}%`
      : '0%' }
  ];
  
  stats.forEach(stat => {
    const statCard = document.createElement('div');
    statCard.className = 'stat-card';
    statCard.innerHTML = `
      <div class="stat-value">${stat.value}</div>
      <div class="stat-label">${stat.label}</div>
    `;
    grid.appendChild(statCard);
  });
  
  return grid;
}

// Show skill details (placeholder for future expansion)
function showSkillDetails(skillId) {
  console.log('Show details for skill:', skillId);
  // This will open a detailed view of milestones for this skill
}

// Initialize Phase 2
async function initializePhase2() {
  console.log('🚀 Initializing Phase 2 enhancements...');
  
  const loaded = await loadGrammarMilestones();
  
  if (loaded && auth.currentUser) {
    await loadUserProgressFromFirebase();
    console.log('✅ Phase 2 ready!');
    return true;
  } else {
    console.warn('⚠️ Phase 2 data not fully loaded');
    return false;
  }
}
