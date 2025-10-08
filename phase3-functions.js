// ========================================
// PHASE 3: CONVERSATION SCENARIOS
// Add these functions to your index.html <script> block
// ========================================

// Global state for Phase 3
let conversationScenariosData = null;
let activeScenario = null;
let currentTurn = 0;
let scenarioDialogue = [];
let completedScenarios = new Set();

// Load conversation scenarios data
async function loadConversationScenarios() {
  try {
    const response = await fetch('conversationScenarios.json');
    conversationScenariosData = await response.json();
    console.log('✅ Conversation scenarios loaded');
    return true;
  } catch (error) {
    console.warn('⚠️ Could not load conversation scenarios:', error);
    return false;
  }
}

// Load completed scenarios from Firebase
async function loadCompletedScenarios() {
  if (!db || !userId || !auth.currentUser) return;
  
  try {
    const progressDocRef = doc(
      db,
      getPrivateCollectionPath('progress'),
      'scenarios'
    );
    
    const docSnap = await getDoc(progressDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      completedScenarios = new Set(data.completed || []);
      console.log('✅ Loaded completed scenarios:', completedScenarios.size);
    }
  } catch (error) {
    console.warn('Could not load completed scenarios:', error);
  }
}

// Save completed scenario
async function saveCompletedScenario(scenarioId) {
  if (!db || !userId || !auth.currentUser) return;
  
  completedScenarios.add(scenarioId);
  
  try {
    const progressDocRef = doc(
      db,
      getPrivateCollectionPath('progress'),
      'scenarios'
    );
    
    await setDoc(progressDocRef, {
      completed: Array.from(completedScenarios),
      lastCompleted: serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Saved scenario completion:', scenarioId);
  } catch (error) {
    console.warn('Could not save scenario completion:', error);
  }
}

// Check if scenario is unlocked
function isScenarioUnlocked(scenario) {
  if (scenario.unlocked_by_default) return true;
  
  if (scenario.unlocks_after) {
    return completedScenarios.has(scenario.unlocks_after);
  }
  
  return false;
}

// Open scenarios modal
function openScenariosModal() {
  if (!conversationScenariosData) {
    showModal('Scenarios Not Available', 'Conversation scenarios data is not loaded.', true);
    return;
  }
  
  const modal = createScenariosModal();
  document.body.appendChild(modal);
}

// Create scenarios modal
function createScenariosModal() {
  const modal = document.createElement('div');
  modal.className = 'scenarios-modal';
  modal.id = 'scenarios-modal';
  
  const panel = document.createElement('div');
  panel.className = 'scenarios-panel';
  
  // Header
  panel.innerHTML = `
    <div class="scenarios-header">
      <h2 class="scenarios-title">🎭 Conversation Scenarios</h2>
      <button class="scenarios-close-btn" onclick="closeScenariosModal()">×</button>
    </div>
  `;
  
  // Category tabs
  const categoryTabs = document.createElement('div');
  categoryTabs.className = 'category-tabs';
  
  const allTab = document.createElement('button');
  allTab.className = 'category-tab active';
  allTab.innerHTML = '🌟 All Scenarios';
  allTab.onclick = () => filterScenarios('all', allTab);
  categoryTabs.appendChild(allTab);
  
  conversationScenariosData.categories.forEach(category => {
    const tab = document.createElement('button');
    tab.className = 'category-tab';
    tab.innerHTML = `${category.icon} ${category.name}`;
    tab.onclick = () => filterScenarios(category.id, tab);
    categoryTabs.appendChild(tab);
  });
  
  panel.appendChild(categoryTabs);
  
  // Scenarios grid
  const grid = document.createElement('div');
  grid.className = 'scenarios-grid';
  grid.id = 'scenarios-grid';
  
  renderScenarios(grid, 'all');
  
  panel.appendChild(grid);
  modal.appendChild(panel);
  
  // Close on backdrop click
  modal.onclick = (e) => {
    if (e.target === modal) {
      closeScenariosModal();
    }
  };
  
  return modal;
}

// Filter scenarios by category
function filterScenarios(categoryId, activeTab) {
  // Update active tab
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  activeTab.classList.add('active');
  
  // Re-render grid
  const grid = document.getElementById('scenarios-grid');
  if (grid) {
    renderScenarios(grid, categoryId);
  }
}

// Render scenarios grid
function renderScenarios(grid, categoryFilter) {
  grid.innerHTML = '';
  
  const scenarios = conversationScenariosData.scenarios.filter(scenario => {
    if (categoryFilter === 'all') return true;
    return scenario.category === categoryFilter;
  });
  
  scenarios.forEach(scenario => {
    const card = createScenarioCard(scenario);
    grid.appendChild(card);
  });
}

// Create scenario card
function createScenarioCard(scenario) {
  const card = document.createElement('div');
  const isCompleted = completedScenarios.has(scenario.id);
  const isUnlocked = isScenarioUnlocked(scenario);
  
  card.className = `scenario-card ${isCompleted ? 'completed' : ''} ${!isUnlocked ? 'locked' : ''}`;
  
  card.innerHTML = `
    <div class="scenario-card-header">
      <span class="scenario-icon">${scenario.icon}</span>
      <div class="scenario-info">
        <h3 class="scenario-name">${scenario.name}</h3>
        <span class="scenario-difficulty ${scenario.difficulty}">${scenario.difficulty}</span>
      </div>
    </div>
    <p class="scenario-description">${scenario.description}</p>
    <div class="scenario-meta">
      <span class="scenario-turns">💬 ${scenario.estimated_turns} turns</span>
      ${isCompleted ? '<span style="color: #10B981;">✓ Completed</span>' : ''}
    </div>
    ${isCompleted ? '<span class="scenario-badge">✓ Done</span>' : ''}
    ${!isUnlocked ? '<span class="scenario-badge locked">🔒 Locked</span>' : ''}
  `;
  
  if (isUnlocked) {
    card.onclick = () => startScenario(scenario);
  }
  
  return card;
}

// Close scenarios modal
function closeScenariosModal() {
  const modal = document.getElementById('scenarios-modal');
  if (modal) {
    modal.remove();
  }
}

// Start a scenario
function startScenario(scenario) {
  activeScenario = scenario;
  currentTurn = 0;
  scenarioDialogue = [];
  
  closeScenariosModal();
  renderActiveScenario();
  
  // Start with first turn (usually NPC speaking)
  processNextTurn();
}

// Render active scenario interface
function renderActiveScenario() {
  // Hide the sentence builder and phrases sections temporarily
  const leftColumn = document.querySelector('.md\\:w-1\\/2.flex.flex-col.gap-6');
  if (!leftColumn) return;
  
  // Create scenario container
  const scenarioContainer = document.createElement('div');
  scenarioContainer.id = 'active-scenario-container';
  scenarioContainer.className = 'scenario-active';
  
  scenarioContainer.innerHTML = `
    <div class="scenario-active-header">
      <div class="scenario-active-title">
        <span class="scenario-active-icon">${activeScenario.icon}</span>
        <div class="scenario-active-info">
          <h3>${activeScenario.name}</h3>
          <p class="scenario-active-meta">${activeScenario.description}</p>
        </div>
      </div>
      <button class="scenario-exit-btn" onclick="exitScenario()">Exit Scenario</button>
    </div>
    
    <div class="cultural-note">
      <span class="cultural-note-icon">💡</span>
      <p><strong>Cultural Tip:</strong> ${activeScenario.cultural_note}</p>
    </div>
    
    <div class="scenario-progress" id="scenario-progress"></div>
    
    <div class="dialogue-container" id="dialogue-container"></div>
    
    <div class="player-input-section" id="player-input-section" style="display: none;">
      <div class="input-hints" id="input-hints"></div>
      <div class="scenario-input-container">
        <input 
          type="text" 
          class="scenario-input" 
          id="scenario-input" 
          placeholder="Type your response in Italian..."
        />
        <button class="scenario-submit-btn" onclick="submitScenarioResponse()">Send</button>
      </div>
    </div>
  `;
  
  // Insert at top of left column
  leftColumn.insertBefore(scenarioContainer, leftColumn.firstChild);
  
  // Update progress dots
  updateProgressDots();
}

// Process next turn in dialogue
function processNextTurn() {
  if (currentTurn >= activeScenario.dialogue_flow.length) {
    // Scenario complete!
    completeScenario();
    return;
  }
  
  const turn = activeScenario.dialogue_flow[currentTurn];
  
  if (turn.speaker === 'customer' || turn.speaker === 'tourist' || 
      turn.speaker === 'guest' || turn.speaker === 'caller' || 
      turn.speaker === 'diner') {
    // Player's turn
    showPlayerInput(turn);
  } else {
    // NPC's turn
    displayNPCMessage(turn);
    currentTurn++;
    
    // After NPC speaks, show player input if next turn is player's
    setTimeout(() => {
      processNextTurn();
    }, 1000);
  }
  
  updateProgressDots();
}

// Display NPC message
function displayNPCMessage(turn) {
  const container = document.getElementById('dialogue-container');
  if (!container) return;
  
  const message = document.createElement('div');
  message.className = 'dialogue-message npc';
  
  message.innerHTML = `
    <div class="dialogue-bubble npc">
      <div class="dialogue-speaker">${turn.speaker}</div>
      <div class="dialogue-text">${turn.text_italian}</div>
      <div class="dialogue-translation">${turn.text_english}</div>
      ${turn.audio_hint ? `<div class="dialogue-audio-hint">🔊 ${turn.audio_hint}</div>` : ''}
      <button class="dialogue-listen-btn" onclick="speakText('${turn.text_italian}', '${currentLanguage}')">
        <i class="fas fa-volume-up"></i> Listen
      </button>
    </div>
  `;
  
  container.appendChild(message);
  scenarioDialogue.push({ speaker: turn.speaker, text: turn.text_italian });
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// Show player input section
function showPlayerInput(turn) {
  const inputSection = document.getElementById('player-input-section');
  const hintsContainer = document.getElementById('input-hints');
  
  if (!inputSection || !hintsContainer) return;
  
  // Show hints
  hintsContainer.innerHTML = `
    <div class="input-hints-title">💡 Hints for this response:</div>
  `;
  
  turn.hints.forEach(hint => {
    const hintItem = document.createElement('div');
    hintItem.className = 'hint-item';
    hintItem.innerHTML = `<span>💬</span> ${hint}`;
    hintsContainer.appendChild(hintItem);
  });
  
  // Show vocabulary chips
  if (turn.vocabulary && turn.vocabulary.length > 0) {
    const vocabContainer = document.createElement('div');
    vocabContainer.className = 'vocabulary-chips';
    
    turn.vocabulary.forEach(word => {
      const chip = document.createElement('span');
      chip.className = 'vocab-chip';
      chip.textContent = word;
      chip.onclick = () => {
        const input = document.getElementById('scenario-input');
        if (input) {
          input.value += (input.value ? ' ' : '') + word;
          input.focus();
        }
      };
      vocabContainer.appendChild(chip);
    });
    
    hintsContainer.appendChild(vocabContainer);
  }
  
  inputSection.style.display = 'block';
  
  // Focus input
  const input = document.getElementById('scenario-input');
  if (input) {
    input.focus();
    input.value = '';
    
    // Handle Enter key
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        submitScenarioResponse();
      }
    };
  }
}

// Submit player response
async function submitScenarioResponse() {
  const input = document.getElementById('scenario-input');
  if (!input || !input.value.trim()) return;
  
  const playerResponse = input.value.trim();
  const turn = activeScenario.dialogue_flow[currentTurn];
  
  // Display player message
  displayPlayerMessage(playerResponse);
  
  // Hide input section
  document.getElementById('player-input-section').style.display = 'none';
  
  // Check response with AI
  await checkScenarioResponse(playerResponse, turn);
}

// Display player message
function displayPlayerMessage(text) {
  const container = document.getElementById('dialogue-container');
  if (!container) return;
  
  const message = document.createElement('div');
  message.className = 'dialogue-message player';
  
  message.innerHTML = `
    <div class="dialogue-bubble player">
      <div class="dialogue-speaker">You</div>
      <div class="dialogue-text">${text}</div>
    </div>
  `;
  
  container.appendChild(message);
  scenarioDialogue.push({ speaker: 'player', text: text });
  
  container.scrollTop = container.scrollHeight;
}

// Check scenario response with AI
async function checkScenarioResponse(playerResponse, turn) {
  const expectedPatterns = turn.expected_patterns.join(', ');
  
  const userPrompt = `In a conversation scenario, the user said: "${playerResponse}". 
Expected patterns were: ${expectedPatterns}. 
Context: ${activeScenario.description}. 
Is this response appropriate and correct? If yes, respond with "CORRECT" and brief encouragement. 
If no, respond with "INCORRECT" and provide a gentle correction with one of the expected patterns.`;
  
  const systemPrompt = `You are a supportive Italian language tutor evaluating conversational responses. Be encouraging but accurate.`;
  
  try {
    // Use simple approach - just check if response is reasonable
    const isGoodEnough = turn.expected_patterns.some(pattern => {
      const patternWords = pattern.toLowerCase().split(' ');
      const responseWords = playerResponse.toLowerCase().split(' ');
      return patternWords.some(word => responseWords.includes(word));
    });
    
    if (isGoodEnough) {
      // Correct - move to next turn
      currentTurn++;
      setTimeout(() => {
        processNextTurn();
      }, 500);
    } else {
      // Show hint
      showModal('Try Again', `Try using: "${turn.expected_patterns[0]}"`, false);
      
      // Allow retry
      showPlayerInput(turn);
    }
    
  } catch (error) {
    console.error('Error checking response:', error);
    // On error, just accept and continue
    currentTurn++;
    processNextTurn();
  }
}

// Complete scenario
function completeScenario() {
  saveCompletedScenario(activeScenario.id);
  
  const container = document.getElementById('dialogue-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="scenario-completion">
      <div class="completion-icon">🎉</div>
      <h2 class="completion-title">Scenario Complete!</h2>
      <p class="completion-message">Great job! You successfully completed "${activeScenario.name}"</p>
      
      <div class="completion-stats">
        <div class="completion-stat">
          <div class="completion-stat-value">${scenarioDialogue.length}</div>
          <div class="completion-stat-label">Turns</div>
        </div>
        <div class="completion-stat">
          <div class="completion-stat-value">${activeScenario.estimated_turns}</div>
          <div class="completion-stat-label">Expected</div>
        </div>
      </div>
      
      <div class="completion-actions">
        <button class="completion-btn completion-btn-primary" onclick="openScenariosModal()">
          Try Another Scenario
        </button>
        <button class="completion-btn completion-btn-secondary" onclick="exitScenario()">
          Back to Lessons
        </button>
      </div>
    </div>
  `;
}

// Exit scenario
function exitScenario() {
  const container = document.getElementById('active-scenario-container');
  if (container) {
    container.remove();
  }
  
  activeScenario = null;
  currentTurn = 0;
  scenarioDialogue = [];
}

// Update progress dots
function updateProgressDots() {
  const progressContainer = document.getElementById('scenario-progress');
  if (!progressContainer || !activeScenario) return;
  
  progressContainer.innerHTML = '';
  
  for (let i = 0; i < activeScenario.dialogue_flow.length; i++) {
    const dot = document.createElement('div');
    dot.className = 'progress-dot';
    
    if (i < currentTurn) {
      dot.classList.add('completed');
    } else if (i === currentTurn) {
      dot.classList.add('current');
    }
    
    progressContainer.appendChild(dot);
  }
}

// Add "Practice Conversations" button to UI
function addConversationButton() {
  // Find the chat section header
  const chatHeader = document.querySelector('#chat-history').previousElementSibling;
  
  if (chatHeader) {
    const button = document.createElement('button');
    button.className = 'py-2 px-4 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition duration-150';
    button.innerHTML = '🎭 Practice Conversations';
    button.onclick = openScenariosModal;
    button.style.marginLeft = 'auto';
    
    chatHeader.appendChild(button);
  }
}

// Initialize Phase 3
async function initializePhase3() {
  console.log('🚀 Initializing Phase 3: Conversation Scenarios...');
  
  const loaded = await loadConversationScenarios();
  
  if (loaded && auth.currentUser) {
    await loadCompletedScenarios();
    addConversationButton();
    console.log('✅ Phase 3 ready!');
    return true;
  } else {
    console.warn('⚠️ Phase 3 data not fully loaded');
    return false;
  }
}
