// ========================================
// PHASE 4 - JAVASCRIPT IMPLEMENTATION
// ========================================

// Global state for Phase 4
let fluencyChallengesData = null;
let srsCardsData = null;
let conversationTopicsData = null;

let activeFluencyChallenge = null;
let challengeTimer = null;
let challengeStartTime = null;
let challengeCorrectCount = 0;
let challengeAttempts = 0;

let srsCardQueue = [];
let currentSRSCard = null;
let srsUserData = {};
let cardFlipped = false;

let conversationMode = 'normal';
let conversationHistory = [];
let conversationCorrections = [];

// ===== LOAD PHASE 4 DATA =====

async function loadPhase4Data() {
  try {
    // Load Fluency Challenges
    const fluencyResponse = await fetch('fluencyChallenges.json');
    fluencyChallengesData = await fluencyResponse.json();
    console.log('✅ Fluency challenges loaded');

    // Load SRS Cards
    const srsResponse = await fetch('srsCards.json');
    srsCardsData = await srsResponse.json();
    console.log('✅ SRS cards loaded');

    // Load Conversation Topics
    const convResponse = await fetch('conversationTopics.json');
    conversationTopicsData = await convResponse.json();
    console.log('✅ Conversation topics loaded');

    return true;
  } catch (error) {
    console.warn('⚠️ Could not load Phase 4 data:', error);
    return false;
  }
}

// ===== FLUENCY CHALLENGES =====

function openFluencyModal() {
  if (!fluencyChallengesData) {
    showModal('Feature Unavailable', 'Fluency challenges data is not loaded.', true);
    return;
  }

  const modal = document.getElementById('fluency-modal');
  modal.classList.add('active');

  renderFluencyChallenges();
}

function closeFluencyModal() {
  const modal = document.getElementById('fluency-modal');
  modal.classList.remove('active');

  if (challengeTimer) {
    clearInterval(challengeTimer);
  }

  // Reset UI
  document.getElementById('fluency-challenges-list').style.display = 'grid';
  document.getElementById('fluency-challenge-active').style.display = 'none';
  document.getElementById('fluency-results').style.display = 'none';
}

function renderFluencyChallenges() {
  const container = document.getElementById('fluency-challenges-list');
  container.innerHTML = '';

  fluencyChallengesData.challenges.forEach(challenge => {
    const card = document.createElement('div');
    card.className = 'challenge-card';
    card.innerHTML = `
      <span class="challenge-icon">${challenge.icon}</span>
      <div class="challenge-name">${challenge.name}</div>
      <div class="challenge-description">${challenge.description}</div>
      <div class="challenge-meta">
        <span>⏱️ ${Math.floor(challenge.time_limit / 60)}:${(challenge.time_limit % 60).toString().padStart(2, '0')}</span>
        <span style="text-transform: capitalize;">${challenge.difficulty}</span>
      </div>
    `;

    card.onclick = () => startFluencyChallenge(challenge);
    container.appendChild(card);
  });
}

function startFluencyChallenge(challenge) {
  activeFluencyChallenge = challenge;
  challengeStartTime = Date.now();
  challengeCorrectCount = 0;
  challengeAttempts = 0;

  // Switch UI
  document.getElementById('fluency-challenges-list').style.display = 'none';
  document.getElementById('fluency-challenge-active').style.display = 'block';

  // Set up timer
  let timeRemaining = challenge.time_limit;
  updateChallengeTimer(timeRemaining);

  challengeTimer = setInterval(() => {
    timeRemaining--;
    updateChallengeTimer(timeRemaining);

    if (timeRemaining <= 0) {
      endFluencyChallenge('timeout');
    }
  }, 1000);

  // Update UI
  document.getElementById('challenge-completed').textContent = '0';
  document.getElementById('challenge-target').textContent = challenge.target_count;

  // Start first item
  selectNewPhraseOrGoal(true);
}

function updateChallengeTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timerEl = document.getElementById('challenge-timer');
  
  timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  if (seconds <= 30) {
    timerEl.classList.add('warning');
  }
}

function pauseChallenge() {
  if (challengeTimer) {
    clearInterval(challengeTimer);
    challengeTimer = null;
    document.querySelector('[onclick="pauseChallenge()"]').innerHTML = '<i class="fas fa-play"></i> Resume';
  } else {
    // Resume logic would go here
  }
}

function exitChallenge() {
  if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
    clearInterval(challengeTimer);
    closeFluencyModal();
  }
}

function checkChallengeProgress(isCorrect) {
  challengeAttempts++;

  if (isCorrect) {
    challengeCorrectCount++;
    document.getElementById('challenge-completed').textContent = challengeCorrectCount;

    if (challengeCorrectCount >= activeFluencyChallenge.target_count) {
      endFluencyChallenge('complete');
    } else {
      // Next item
      selectNewPhraseOrGoal(true);
    }
  }
}

function endFluencyChallenge(reason) {
  clearInterval(challengeTimer);

  const timeElapsed = (Date.now() - challengeStartTime) / 1000;
  const accuracy = challengeAttempts > 0 ? (challengeCorrectCount / challengeAttempts) * 100 : 0;

  // Calculate score
  const timeScore = Math.max(0, 100 - (timeElapsed / activeFluencyChallenge.time_limit) * 50);
  const accuracyScore = accuracy;
  const finalScore = Math.round((timeScore * 0.4 + accuracyScore * 0.6));

  // Show results
  document.getElementById('fluency-challenge-active').style.display = 'none';
  document.getElementById('fluency-results').style.display = 'block';

  document.getElementById('final-score').textContent = finalScore;
  document.getElementById('result-time').textContent = formatTime(timeElapsed);
  document.getElementById('result-accuracy').textContent = Math.round(accuracy) + '%';
  document.getElementById('result-streak').textContent = finalScore >= 80 ? '+20%' : '+0%';

  if (finalScore >= 90) {
    document.getElementById('result-icon').textContent = '🏆';
    document.getElementById('result-title').textContent = 'Excellent!';
  } else if (finalScore >= 70) {
    document.getElementById('result-icon').textContent = '🌟';
    document.getElementById('result-title').textContent = 'Great Job!';
  } else {
    document.getElementById('result-icon').textContent = '✓';
    document.getElementById('result-title').textContent = 'Challenge Complete!';
  }

  // Save to Firebase
  saveFluencyChallenge Result(finalScore, timeElapsed, accuracy);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function retryChallenge() {
  if (activeFluencyChallenge) {
    startFluencyChallenge(activeFluencyChallenge);
    document.getElementById('fluency-results').style.display = 'none';
  }
}

async function saveFluencyChallengeResult(score, time, accuracy) {
  if (!db || !userId || !auth.currentUser) return;

  try {
    const challengesRef = doc(db, getPrivateCollectionPath('progress'), 'fluency_challenges');
    
    await setDoc(challengesRef, {
      lastChallenge: {
        id: activeFluencyChallenge.id,
        score: score,
        time: time,
        accuracy: accuracy,
        completedAt: serverTimestamp()
      },
      totalChallenges: increment(1),
      totalScore: increment(score)
    }, { merge: true });

    console.log('✅ Fluency challenge result saved');
  } catch (error) {
    console.warn('Could not save fluency challenge result:', error);
  }
}

// ===== SPACED REPETITION SYSTEM (SRS) =====

async function initializeSRS() {
  if (!srsCardsData) return;

  // Load user's SRS data from Firebase
  await loadSRSData();

  // Initialize queue
  updateSRSQueue();

  // Show SRS section if there are due cards
  const srsContainer = document.getElementById('srs-daily-review');
  if (srsCardQueue.length > 0) {
    srsContainer.style.display = 'block';
    loadNextSRSCard();
  }
}

async function loadSRSData() {
  if (!db || !userId || !auth.currentUser) return;

  try {
    const srsRef = doc(db, getPrivateCollectionPath('progress'), 'srs_data');
    const docSnap = await getDoc(srsRef);

    if (docSnap.exists()) {
      srsUserData = docSnap.data();
    } else {
      // Initialize new user data
      srsUserData = {
        cards: {},
        stats: {
          new: 0,
          learning: 0,
          review: 0,
          mastered: 0
        },
        lastReview: null
      };

      // Add initial cards as "new"
      srsCardsData.initial_deck.forEach(card => {
        srsUserData.cards[card.id] = {
          state: 'new',
          interval: 0,
          easiness: 2.5,
          repetitions: 0,
          lastReview: null,
          nextReview: Date.now()
        };
      });
    }

    console.log('✅ SRS data loaded');
  } catch (error) {
    console.error('Error loading SRS data:', error);
  }
}

function updateSRSQueue() {
  srsCardQueue = [];
  const now = Date.now();

  // Find all due cards
  Object.keys(srsUserData.cards).forEach(cardId => {
    const cardData = srsUserData.cards[cardId];
    if (cardData.nextReview <= now && cardData.state !== 'suspended') {
      srsCardQueue.push(cardId);
    }
  });

  // Update counts
  updateSRSStats();

  document.getElementById('srs-due-count').textContent = srsCardQueue.length;
}

function updateSRSStats() {
  const stats = { new: 0, learning: 0, review: 0, mastered: 0 };

  Object.values(srsUserData.cards).forEach(card => {
    if (card.state in stats) {
      stats[card.state]++;
    }
  });

  document.getElementById('srs-new-count').textContent = stats.new;
  document.getElementById('srs-learning-count').textContent = stats.learning;
  document.getElementById('srs-review-count').textContent = stats.review;
  document.getElementById('srs-mastered-count').textContent = stats.mastered || 0;

  srsUserData.stats = stats;
}

function loadNextSRSCard() {
  if (srsCardQueue.length === 0) {
    document.getElementById('srs-daily-review').innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 4rem; margin-bottom: 16px;">🎉</div>
        <h3 style="font-size: 1.5rem; font-weight: 700;">All Done!</h3>
        <p style="color: var(--text-secondary); margin-top: 8px;">You've reviewed all cards for today. Great job!</p>
      </div>
    `;
    return;
  }

  const cardId = srsCardQueue[0];
  const cardTemplate = srsCardsData.initial_deck.find(c => c.id === cardId);
  
  if (!cardTemplate) return;

  currentSRSCard = cardTemplate;
  cardFlipped = false;

  // Update UI
  document.getElementById('card-front-text').textContent = cardTemplate.front;
  document.getElementById('card-pronunciation').textContent = cardTemplate.pronunciation || '';
  document.getElementById('card-back-text').textContent = cardTemplate.back;
  document.getElementById('card-example').innerHTML = `
    ${cardTemplate.example_sentence}<br>
    <span style="font-size: 0.85rem; opacity: 0.8;">${cardTemplate.example_translation}</span>
  `;

  // Reset flip state
  document.getElementById('srs-flashcard').classList.remove('flipped');
  document.getElementById('srs-response-buttons').style.display = 'none';

  // Update interval displays
  const userData = srsUserData.cards[cardId];
  updateIntervalDisplays(userData);
}

function flipCard() {
  const flashcard = document.getElementById('srs-flashcard');
  flashcard.classList.toggle('flipped');
  cardFlipped = !cardFlipped;

  if (cardFlipped) {
    document.getElementById('srs-response-buttons').style.display = 'flex';
  }
}

function updateIntervalDisplays(userData) {
  const goodInterval = calculateNextInterval(userData, 4);
  const easyInterval = calculateNextInterval(userData, 5);

  document.getElementById('good-interval').textContent = formatInterval(goodInterval);
  document.getElementById('easy-interval').textContent = formatInterval(easyInterval);
}

function calculateNextInterval(userData, grade) {
  const settings = srsCardsData.difficulty_adjustments[`grade_${grade}`];
  let interval = userData.interval * settings.interval_mult;

  if (interval < 1) interval = 1;
  if (interval > srsCardsData.review_schedule.maximum_interval) {
    interval = srsCardsData.review_schedule.maximum_interval;
  }

  return interval;
}

function formatInterval(days) {
  if (days < 1) return '<1d';
  if (days < 30) return `${Math.round(days)}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days / 365)}y`;
}

function rateCard(grade) {
  if (!currentSRSCard || !cardFlipped) return;

  const cardId = currentSRSCard.id;
  const userData = srsUserData.cards[cardId];
  
  // Apply SM-2 algorithm
  const adjustment = srsCardsData.difficulty_adjustments[`grade_${grade}`];
  
  // Update easiness
  userData.easiness = Math.max(
    1.3,
    userData.easiness + adjustment.ease_change
  );

  // Update interval
  if (grade < 3) {
    // Failed - reset
    userData.interval = 0;
    userData.repetitions = 0;
    userData.state = 'learning';
  } else {
    // Passed
    userData.repetitions++;
    
    if (userData.repetitions === 1) {
      userData.interval = 1;
      userData.state = 'learning';
    } else if (userData.repetitions === 2) {
      userData.interval = 6;
      userData.state = 'review';
    } else {
      userData.interval = Math.round(userData.interval * userData.easiness);
      userData.state = 'review';
    }
  }

  // Set next review date
  userData.lastReview = Date.now();
  userData.nextReview = Date.now() + (userData.interval * 24 * 60 * 60 * 1000);

  // Remove from queue
  srsCardQueue.shift();

  // Save to Firebase
  saveSRSData();

  // Load next card
  loadNextSRSCard();
  updateSRSStats();
}

async function saveSRSData() {
  if (!db || !userId || !auth.currentUser) return;

  try {
    const srsRef = doc(db, getPrivateCollectionPath('progress'), 'srs_data');
    
    await setDoc(srsRef, {
      cards: srsUserData.cards,
      stats: srsUserData.stats,
      lastReview: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.warn('Could not save SRS data:', error);
  }
}

// ===== FREE-FORM AI CONVERSATIONS =====

function initializeConversationMode() {
  const toggleContainer = document.getElementById('conversation-mode-toggle');
  if (conversationTopicsData) {
    toggleContainer.style.display = 'flex';
  }
}

function setConversationMode(mode) {
  conversationMode = mode;

  // Update active button
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

  // Clear correction history for new mode
  conversationCorrections = [];

  // Show mode-specific guidance
  if (mode === 'immersive') {
    appendChatMessage('Ora parleremo solo in italiano! 🇮🇹', false);
  } else if (mode === 'freeform') {
    appendChatMessage('Feel free to talk about anything! I\'ll gently correct mistakes at the end.', false);
  }
}

async function handleChatSendWithMode() {
  const message = chatInput.value.trim();
  if (message === '') return;

  appendChatMessage(message, true);
  saveChatMessage(message, 'user');

  chatInput.value = '';
  chatSendButton.disabled = true;
  chatLoadingIndicator.textContent = 'Tutor is thinking...';
  chatLoadingIndicator.classList.remove('hidden');

  // Construct system prompt based on mode
  let systemPrompt = '';

  if (conversationMode === 'immersive') {
    systemPrompt = `You are an Italian language tutor. Respond ONLY in Italian. Keep responses natural and conversational. If the user makes a mistake, gently model the correct form in your response without explicitly pointing it out.`;
  } else if (conversationMode === 'freeform') {
    systemPrompt = `You are a friendly Italian language tutor. Have a natural conversation with the learner. Track any grammar or vocabulary mistakes, but don't interrupt - save corrections for the end of the conversation. Be encouraging and supportive.`;
  } else {
    systemPrompt = `You are a supportive Italian language tutor. Provide helpful responses with cultural context and gentle corrections when needed.`;
  }

  await postToGemini(message, systemPrompt, true, true);

  // If in freeform mode, analyze for corrections (without interrupting)
  if (conversationMode === 'freeform') {
    analyzeForCorrections(message);
  }

  chatSendButton.disabled = false;
  chatLoadingIndicator.classList.add('hidden');
}

function analyzeForCorrections(userMessage) {
  // This would use AI to detect errors
  // For now, we'll just track messages
  conversationHistory.push({
    message: userMessage,
    timestamp: Date.now()
  });

  // After 5 messages in freeform mode, offer corrections
  if (conversationHistory.length % 5 === 0) {
    offerCorrections();
  }
}

function offerCorrections() {
  if (conversationMode !== 'freeform') return;

  const correctionDiv = document.createElement('div');
  correctionDiv.className = 'correction-indicator';
  correctionDiv.innerHTML = `
    Would you like me to review your recent messages and suggest improvements?
    <button onclick="showDetailedCorrections()" style="margin-left: 8px; padding: 4px 12px; background: #6366f1; color: white; border: none; border-radius: 6px; cursor: pointer;">
      Yes, please!
    </button>
  `;

  chatHistoryContainer.appendChild(correctionDiv);
  chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
}

async function showDetailedCorrections() {
  // Generate correction summary using AI
  const recentMessages = conversationHistory.slice(-5).map(m => m.message).join(' | ');
  
  const prompt = `Review these Italian language learner messages and provide gentle, encouraging corrections: ${recentMessages}. Format as: "Great effort! Here are some tips: 1) ... 2) ..."`;
  
  await postToGemini(prompt, 'You are a supportive language tutor providing corrections.', false, true);
}

// ===== WEEKLY PROGRESS REPORTS =====

function openProgressReport() {
  const modal = document.getElementById('progress-report-modal');
  modal.classList.add('active');

  generateProgressReport();
}

function closeProgressReport() {
  const modal = document.getElementById('progress-report-modal');
  modal.classList.remove('active');
}

async function generateProgressReport() {
  if (!userProgress) {
    document.getElementById('report-main-stat').textContent = '--';
    return;
  }

  // Calculate date range
  const now = new Date();
  const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  
  document.getElementById('report-date-range').textContent = 
    `${weekAgo.toLocaleDateString()} - ${now.toLocaleDateString()}`;

  // Practice time (estimated)
  const practiceMinutes = userProgress.stats.total_sentences_built * 2; // Rough estimate
  document.getElementById('report-main-stat').textContent = practiceMinutes;

  // Sentences
  document.getElementById('report-sentences').textContent = userProgress.stats.total_sentences_built;

  // Accuracy
  const accuracy = userProgress.stats.total_sentences_built > 0
    ? Math.round((userProgress.stats.total_sentences_correct / userProgress.stats.total_sentences_built) * 100)
    : 0;
  document.getElementById('report-accuracy').textContent = accuracy + '%';

  // Streak
  document.getElementById('report-streak').textContent = userProgress.practice_days.streak;

  // Vocabulary
  document.getElementById('report-vocab').textContent = userProgress.vocabulary.unique_words.length;

  // Generate insights
  generateInsights();
  generateRecommendations();
}

function generateInsights() {
  const container = document.getElementById('report-insights-container');
  container.innerHTML = '';

  // Find strongest area
  const verbAccuracy = calculateVerbAccuracy();
  
  if (verbAccuracy > 85) {
    const insight = document.createElement('div');
    insight.className = 'report-insight';
    insight.innerHTML = `
      <div class="report-insight-title">🎯 Strongest Area</div>
      <div class="report-insight-text">You're excelling at verb conjugations! Your accuracy is ${Math.round(verbAccuracy)}%.</div>
    `;
    container.appendChild(insight);
  }

  // Most practiced
  if (userProgress.sentences.total > 20) {
    const insight = document.createElement('div');
    insight.className = 'report-insight';
    insight.innerHTML = `
      <div class="report-insight-title">📚 Dedicated Learner</div>
      <div class="report-insight-text">You've built ${userProgress.sentences.total} sentences this week. Your consistency is impressive!</div>
    `;
    container.appendChild(insight);
  }
}

function generateRecommendations() {
  const container = document.getElementById('report-recommendations-container');
  container.innerHTML = '';

  // Check for areas needing improvement
  const vocabCount = userProgress.vocabulary.unique_words.length;

  if (vocabCount < 50) {
    const rec = document.createElement('div');
    rec.className = 'report-recommendation';
    rec.innerHTML = `
      <div class="report-recommendation-title">
        <i class="fas fa-star"></i> Next Milestone
      </div>
      <div class="report-recommendation-text">
        You're ${50 - vocabCount} words away from the Vocabulary Explorer milestone! Try the SRS card review to learn new words efficiently.
      </div>
    `;
    container.appendChild(rec);
  }

  // Streak recommendation
  if (userProgress.practice_days.streak >= 7) {
    const rec = document.createElement('div');
    rec.className = 'report-recommendation';
    rec.innerHTML = `
      <div class="report-recommendation-title">
        <i class="fas fa-fire"></i> Streak Master
      </div>
      <div class="report-recommendation-text">
        Amazing ${userProgress.practice_days.streak}-day streak! Keep it up to unlock the Weekly Warrior achievement.
      </div>
    `;
    container.appendChild(rec);
  }
}

function calculateVerbAccuracy() {
  if (!userProgress || !userProgress.verb_mastery) return 0;

  const verbs = Object.values(userProgress.verb_mastery);
  if (verbs.length === 0) return 0;

  const totalCorrect = verbs.reduce((sum, v) => sum + v.correct, 0);
  const totalAttempts = verbs.reduce((sum, v) => sum + v.attempts, 0);

  return totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;
}

function generateNewReport() {
  // Refresh the report
  generateProgressReport();
}

// ===== PHASE 4 INITIALIZATION =====

async function initializePhase4() {
  console.log('🚀 Initializing Phase 4: Advanced Learning Features...');

  const loaded = await loadPhase4Data();

  if (loaded && auth.currentUser) {
    // Add UI buttons
    addPhase4Buttons();

    // Initialize SRS
    await initializeSRS();

    // Initialize conversation mode
    initializeConversationMode();

    console.log('✅ Phase 4 ready!');
    return true;
  } else {
    console.warn('⚠️ Phase 4 data not fully loaded');
    return false;
  }
}

function addPhase4Buttons() {
  // Find the pronunciation button location
  const pronButton = document.getElementById('pronunciation-practice-btn');
  
  if (pronButton && pronButton.parentElement) {
    // Fluency Challenge button
    const fluencyBtn = document.createElement('button');
    fluencyBtn.className = 'py-2 px-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600 transition duration-150';
    fluencyBtn.innerHTML = '⚡ Fluency';
    fluencyBtn.onclick = openFluencyModal;
    fluencyBtn.style.marginLeft = '8px';
    pronButton.parentElement.appendChild(fluencyBtn);

    // Progress Report button
    const reportBtn = document.createElement('button');
    reportBtn.className = 'py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-150';
    reportBtn.innerHTML = '📊 Report';
    reportBtn.onclick = openProgressReport;
    reportBtn.style.marginLeft = '8px';
    pronButton.parentElement.appendChild(reportBtn);
  }

  // Add conversation mode toggle to chat section
  const chatHistory = document.getElementById('chat-history');
  if (chatHistory) {
    const modeToggle = document.getElementById('conversation-mode-toggle');
    chatHistory.parentElement.insertBefore(modeToggle, chatHistory);
  }
}

// Expose global functions
window.closeFluencyModal = closeFluencyModal;
window.pauseChallenge = pauseChallenge;
window.exitChallenge = exitChallenge;
window.retryChallenge = retryChallenge;
window.flipCard = flipCard;
window.rateCard = rateCard;
window.setConversationMode = setConversationMode;
window.showDetailedCorrections = showDetailedCorrections;
window.openProgressReport = openProgressReport;
window.closeProgressReport = closeProgressReport;
window.generateNewReport = generateNewReport;
