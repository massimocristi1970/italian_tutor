// ========================================
// PHASE 1 ENHANCEMENT FUNCTIONS
// Add these functions to your index.html <script> block
// ========================================

// Load contexts data
let contextsData = null;
let alternativeExpressionsData = null;

async function loadEnhancementData() {
  try {
    // Load contexts
    const contextsResponse = await fetch('contexts.json');
    contextsData = await contextsResponse.json();
    
    // Load alternative expressions
    const altExpResponse = await fetch('alternativeExpressions.json');
    alternativeExpressionsData = await altExpResponse.json();
    
    console.log('✅ Enhancement data loaded successfully');
    return true;
  } catch (error) {
    console.warn('Could not load enhancement data:', error);
    return false;
  }
}

// Create a context badge element
function createContextBadge(contextId, size = 'medium') {
  if (!contextsData || !contextId) return null;
  
  const context = contextsData.contexts.find(c => c.id === contextId);
  if (!context) return null;
  
  const badge = document.createElement('span');
  badge.className = 'context-badge';
  badge.style.borderColor = context.color;
  badge.title = context.description;
  
  const icon = document.createElement('span');
  icon.className = 'context-icon';
  icon.textContent = context.icon;
  
  const name = document.createElement('span');
  name.textContent = context.name;
  
  badge.appendChild(icon);
  
  // Only show name on larger sizes
  if (size !== 'small') {
    badge.appendChild(name);
  }
  
  return badge;
}

// Show alternative expressions for a phrase
function showAlternativeExpressions(phraseText) {
  if (!alternativeExpressionsData) return null;
  
  const alternatives = alternativeExpressionsData.alternativeExpressions[phraseText];
  if (!alternatives || alternatives.length === 0) return null;
  
  // Create the panel
  const panel = document.createElement('div');
  panel.className = 'alternatives-panel';
  
  // Header
  const header = document.createElement('div');
  header.className = 'alternatives-header';
  
  const title = document.createElement('h4');
  title.className = 'alternatives-title';
  title.textContent = '✨ Native speakers also say:';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'alternatives-close';
  closeBtn.textContent = '×';
  closeBtn.onclick = () => panel.remove();
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  panel.appendChild(header);
  
  // Original phrase
  const original = document.createElement('div');
  original.className = 'alternatives-original';
  original.innerHTML = `<strong>You said:</strong> ${phraseText}`;
  panel.appendChild(original);
  
  // Separate Italian and Sicilian alternatives
  const italianAlts = alternatives.filter(alt => alt.region === 'standard');
  const sicilianAlts = alternatives.filter(alt => alt.region === 'sicilian');
  
  // Italian alternatives
  if (italianAlts.length > 0) {
    const section = document.createElement('div');
    section.className = 'alternatives-section';
    
    const sectionTitle = document.createElement('h5');
    sectionTitle.className = 'alternatives-section-title';
    sectionTitle.textContent = '🇮🇹 Italian Variations';
    section.appendChild(sectionTitle);
    
    const list = document.createElement('div');
    list.className = 'alternatives-list';
    
    italianAlts.forEach(alt => {
      const item = createAlternativeItem(alt);
      list.appendChild(item);
    });
    
    section.appendChild(list);
    panel.appendChild(section);
  }
  
  // Sicilian alternatives
  if (sicilianAlts.length > 0) {
    const section = document.createElement('div');
    section.className = 'alternatives-section';
    
    const sectionTitle = document.createElement('h5');
    sectionTitle.className = 'alternatives-section-title';
    sectionTitle.textContent = '🏝️ Sicilian Says...';
    section.appendChild(sectionTitle);
    
    const list = document.createElement('div');
    list.className = 'alternatives-list';
    
    sicilianAlts.forEach(alt => {
      const item = createAlternativeItem(alt, true);
      list.appendChild(item);
    });
    
    section.appendChild(list);
    panel.appendChild(section);
  }
  
  // Tip
  const tip = document.createElement('div');
  tip.className = 'alternatives-tip';
  tip.innerHTML = '💡 <strong>Tip:</strong> Understanding these variations helps you sound more natural and recognize different ways native speakers express themselves!';
  panel.appendChild(tip);
  
  return panel;
}

// Create an alternative expression item
function createAlternativeItem(alt, isSicilian = false) {
  const item = document.createElement('div');
  item.className = 'alternative-item' + (isSicilian ? ' sicilian' : '');
  
  const header = document.createElement('div');
  header.className = 'alternative-header';
  
  const icon = document.createElement('span');
  icon.textContent = isSicilian ? '🌊' : (alt.type === 'formal' ? '🎩' : '😊');
  
  const text = document.createElement('span');
  text.className = 'alternative-text';
  text.textContent = alt.text;
  
  header.appendChild(icon);
  header.appendChild(text);
  
  if (!isSicilian) {
    const badge = document.createElement('span');
    badge.className = `alternative-badge ${alt.type}`;
    badge.textContent = alt.type;
    header.appendChild(badge);
  }
  
  const note = document.createElement('p');
  note.className = 'alternative-note';
  note.textContent = alt.note;
  
  item.appendChild(header);
  item.appendChild(note);
  
  return item;
}

// Filter phrases by context
function filterPhrasesByContext(phrases, contextId) {
  if (!contextId || contextId === 'all') {
    return phrases;
  }
  return phrases.filter(phrase => phrase.context === contextId);
}

// Create context filter UI
function createContextFilter(onFilterChange) {
  if (!contextsData) return null;
  
  const filterContainer = document.createElement('div');
  filterContainer.className = 'context-filter';
  
  // "All" button
  const allBtn = document.createElement('button');
  allBtn.className = 'context-filter-btn active';
  allBtn.style.borderColor = '#6366f1';
  allBtn.style.backgroundColor = '#6366f1';
  allBtn.style.color = 'white';
  allBtn.textContent = '🌍 All Scenarios';
  allBtn.onclick = () => {
    // Reset all buttons
    filterContainer.querySelectorAll('.context-filter-btn').forEach(btn => {
      btn.classList.remove('active');
      btn.style.backgroundColor = 'white';
      btn.style.color = '#374151';
    });
    allBtn.classList.add('active');
    allBtn.style.backgroundColor = '#6366f1';
    allBtn.style.color = 'white';
    onFilterChange('all');
  };
  filterContainer.appendChild(allBtn);
  
  // Context buttons
  contextsData.contexts.forEach(context => {
    const btn = document.createElement('button');
    btn.className = 'context-filter-btn';
    btn.style.borderColor = context.color;
    btn.title = context.description;
    
    const icon = document.createElement('span');
    icon.textContent = context.icon;
    
    const name = document.createElement('span');
    name.textContent = context.name;
    
    btn.appendChild(icon);
    btn.appendChild(name);
    
    btn.onclick = () => {
      // Reset all buttons
      filterContainer.querySelectorAll('.context-filter-btn').forEach(b => {
        b.classList.remove('active');
        b.style.backgroundColor = 'white';
        b.style.color = '#374151';
      });
      btn.classList.add('active');
      btn.style.backgroundColor = context.color;
      btn.style.color = 'white';
      onFilterChange(context.id);
    };
    
    filterContainer.appendChild(btn);
  });
  
  return filterContainer;
}

// Enhanced phrase display with context badge
function createEnhancedPhraseElement(phrase, onPhraseClick) {
  const phraseDiv = document.createElement('div');
  phraseDiv.className = 'p-3 rounded-lg border border-gray-200 hover:bg-indigo-50 transition duration-150 cursor-pointer flex flex-col gap-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-500';
  
  // Top row: text and listen button
  const topRow = document.createElement('div');
  topRow.className = 'flex items-center justify-between';
  
  const textContainer = document.createElement('div');
  textContainer.className = 'flex-1';
  
  const text = document.createElement('p');
  text.className = 'font-semibold';
  text.textContent = phrase.text;
  
  const english = document.createElement('p');
  english.className = 'text-sm text-gray-500 dark:text-gray-400 italic';
  english.textContent = phrase.english;
  
  textContainer.appendChild(text);
  textContainer.appendChild(english);
  
  const listenBtn = document.createElement('button');
  listenBtn.className = 'audio-btn text-pink-600 dark:text-pink-400';
  listenBtn.title = `Listen to ${phrase.language}`;
  listenBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
  listenBtn.onclick = (e) => {
    e.stopPropagation();
    speakText(phrase.text, phrase.language);
  };
  
  topRow.appendChild(textContainer);
  topRow.appendChild(listenBtn);
  phraseDiv.appendChild(topRow);
  
  // Bottom row: context badge
  if (phrase.context) {
    const badge = createContextBadge(phrase.context, 'small');
    if (badge) {
      phraseDiv.appendChild(badge);
    }
  }
  
  phraseDiv.onclick = () => onPhraseClick(phrase);
  
  return phraseDiv;
}

// Initialize Phase 1 enhancements
async function initializePhase1() {
  console.log('🚀 Initializing Phase 1 enhancements...');
  
  const loaded = await loadEnhancementData();
  
  if (loaded) {
    console.log('✅ Phase 1 ready!');
    return true;
  } else {
    console.warn('⚠️ Phase 1 data not loaded, features will be limited');
    return false;
  }
}
