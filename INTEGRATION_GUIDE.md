# 🚀 Phase 1 Integration Guide - Context System & Alternative Expressions

## 📋 Files You Have

1. ✅ `contexts.json` - Scenario definitions
2. ✅ `alternativeExpressions.json` - Native variations data
3. ✅ `staticPhrasesEnhanced.js` - Updated phrases with context tags
4. ✅ `phase1-styles.css` - New CSS for features
5. ✅ `phase1-functions.js` - JavaScript helper functions

---

## 🔧 Integration Steps

### **Step 1: Add the JSON Files** (2 minutes)

Place these files in your project root (same folder as `index.html`):
- `contexts.json`
- `alternativeExpressions.json`

```
C:\Dev\GitHub\italian_tutor\
  ├── index.html
  ├── contexts.json          ← ADD HERE
  ├── alternativeExpressions.json  ← ADD HERE
  └── ... other files
```

---

### **Step 2: Add the CSS** (1 minute)

Open `index.html` and find the `<style>` block in the `<head>` section.

**Add this at the END of your existing `<style>` block** (before the closing `</style>` tag):

```html
<style>
  /* ... your existing styles ... */

  /* PHASE 1 ENHANCEMENTS - ADD BELOW */
  
  /* Context Indicator Badges */
  .context-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    border: 2px solid;
    background-color: rgba(255, 255, 255, 0.95);
    transition: all 0.2s ease;
    cursor: help;
  }
  
  .context-badge:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  /* Copy the rest from phase1-styles.css */
  /* ... (copy all remaining CSS) ... */
  
</style>
```

**OR** simply copy the ENTIRE contents of `phase1-styles.css` and paste at the end of your `<style>` block.

---

### **Step 3: Update Static Phrases** (2 minutes)

In `index.html`, find this line (around line 500):

```javascript
const staticPhraseData = [
  {
    id: "S01",
    english: "I speak Italian.",
    italian: "Io parlo italiano.",
  },
  // ... rest of phrases
];
```

**Replace it with the content from `staticPhrasesEnhanced.js`:**

```javascript
const staticPhraseData = [
  {
    id: "S01",
    english: "I speak Italian.",
    italian: "Io parlo italiano.",
    context: "greeting"  // ← ADDED
  },
  {
    id: "S02",
    english: "You eat the bread.",
    italian: "Tu mangi il pane.",
    context: "cafe"  // ← ADDED
  },
  // ... copy all 20 phrases from staticPhrasesEnhanced.js
];
```

---

### **Step 4: Add Phase 1 Functions** (2 minutes)

In `index.html`, find the `<script type="module">` section (around line 700).

**Add this code RIGHT AFTER the line `let allPhrases = [];`** (around line 730):

```javascript
let allPhrases = []; // Existing line

// PHASE 1: Add enhancement data loading
let contextsData = null;
let alternativeExpressionsData = null;

async function loadEnhancementData() {
  try {
    const contextsResponse = await fetch('contexts.json');
    contextsData = await contextsResponse.json();
    
    const altExpResponse = await fetch('alternativeExpressions.json');
    alternativeExpressionsData = await altExpResponse.json();
    
    console.log('✅ Enhancement data loaded successfully');
    return true;
  } catch (error) {
    console.warn('Could not load enhancement data:', error);
    return false;
  }
}

// Copy ALL remaining functions from phase1-functions.js
// (createContextBadge, showAlternativeExpressions, etc.)
```

**OR** copy the ENTIRE contents of `phase1-functions.js` and paste after `let allPhrases = [];`.

---

### **Step 5: Initialize on Page Load** (1 minute)

Find the `window.onload` function (near the very end of your script, around line 1400).

**Add this line at the START of the `window.onload` function:**

```javascript
window.onload = function () {
  initializePhase1(); // ← ADD THIS LINE
  
  initializeTheme();
  setupFirebase();
  populateWordBank(null);
  
  // ... rest of existing code
};
```

---

### **Step 6: Enhance Phrase Display** (5 minutes)

Find the `populatePhrases()` function (around line 850).

**Replace the phrase rendering code** with this enhanced version:

```javascript
function populatePhrases() {
  const phrases = commonPhrases[currentLanguage] || [];
  phraseListContainer.innerHTML = '';

  phrases.forEach((phrase) => {
    // Enhanced phrase element with context badge
    const phraseDiv = document.createElement('div');
    phraseDiv.className = 'p-3 rounded-lg border border-gray-200 hover:bg-indigo-50 transition duration-150 cursor-pointer flex flex-col gap-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-500';
    
    // Top row
    const topRow = document.createElement('div');
    topRow.className = 'flex items-center justify-between';
    
    const textContainer = document.createElement('div');
    textContainer.innerHTML = `
      <p class="font-semibold">${phrase.text}</p>
      <p class="text-sm text-gray-500 dark:text-gray-400 italic">${phrase.english}</p>
    `;
    
    const listenBtn = document.createElement('button');
    listenBtn.className = 'audio-btn text-pink-600 dark:text-pink-400';
    listenBtn.title = `Listen to ${currentLanguage}`;
    listenBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    listenBtn.onclick = (e) => {
      e.stopPropagation();
      speakText(phrase.text, currentLanguage);
    };
    
    topRow.appendChild(textContainer);
    topRow.appendChild(listenBtn);
    phraseDiv.appendChild(topRow);
    
    // Add context badge if data is loaded
    if (phrase.context && contextsData) {
      const badge = createContextBadge(phrase.context, 'small');
      if (badge) phraseDiv.appendChild(badge);
    }
    
    phraseDiv.onclick = () => {
      chatInput.value = phrase.text;
      chatInput.focus();
      
      // SHOW ALTERNATIVES when phrase is clicked
      const existingPanel = document.querySelector('.alternatives-panel');
      if (existingPanel) existingPanel.remove();
      
      const altPanel = showAlternativeExpressions(phrase.text);
      if (altPanel) {
        phraseDiv.parentElement.insertBefore(altPanel, phraseDiv.nextSibling);
      }
    };
    
    phraseListContainer.appendChild(phraseDiv);
  });
}
```

---

### **Step 7: Test It!** (2 minutes)

1. Save all changes to `index.html`
2. Open `index.html` in your browser (or refresh if already open)
3. Open the browser console (F12) and look for:
   ```
   🚀 Initializing Phase 1 enhancements...
   ✅ Enhancement data loaded successfully
   ✅ Phase 1 ready!
   ```

4. Click on the **"Common Phrases"** section
5. Click any phrase → You should see:
   - **Context badge** at the bottom (e.g., ☕ At the Café)
   - **Alternative expressions panel** appears below with variations

---

## 🎯 What You'll See

### **Context Badges:**
- Each phrase shows a colored badge with an icon and scenario name
- Hover to see the description
- Examples: 
  - 👋 Greetings & Introductions
  - ☕ At the Café
  - 🍝 At the Restaurant

### **Alternative Expressions:**
When you click a phrase, a purple panel slides in showing:
- **Your phrase** at the top
- **Italian variations** (formal/informal)
- **Sicilian alternatives** (if available)
- **Tips** about usage

---

## 🐛 Troubleshooting

### **"Enhancement data not loaded"**
- Check that `contexts.json` and `alternativeExpressions.json` are in the same folder as `index.html`
- Check browser console for fetch errors
- Make sure files are valid JSON (no syntax errors)

### **Context badges don't show**
- Verify `contextsData` is loaded (check console)
- Make sure your phrases have `context` properties
- Check that CSS was added properly

### **Alternative expressions don't appear**
- Verify the phrase text matches exactly (including punctuation)
- Check that `alternativeExpressionsData` loaded successfully
- Look for JavaScript errors in console

---

## ✅ Success Checklist

- [ ] JSON files in project root
- [ ] CSS added to `<style>` block
- [ ] Static phrases updated with `context` tags
- [ ] Phase 1 functions added to script
- [ ] `initializePhase1()` called in `window.onload`
- [ ] `populatePhrases()` enhanced
- [ ] Tested in browser
- [ ] Context badges visible
- [ ] Alternative expressions panel appears when clicking phrases

---

## 🚀 Next Steps (Future Phases)

Once Phase 1 is working:
- **Phase 2:** Grammar mini-lessons and progress tracking
- **Phase 3:** Guided conversation scenarios
- **Phase 4:** Advanced features (pronunciation, fluency challenges)

---

## 💾 Commit Your Changes

Once everything works:

```cmd
cd C:\Dev\GitHub\italian_tutor
git add .
git commit -m "Added Phase 1: Context system and alternative expressions"
git push origin feature/enhanced-learning
```

---

**Need help with any step? Let me know!** 🎓
