# Italian/Sicilian Language Tutor 🇮🇹

An interactive, AI-powered language learning application for mastering Italian and Sicilian through sentence construction, conversational practice, and adaptive learning.

## 🌟 Overview

This web-based language tutor combines traditional sentence-building exercises with modern AI conversation capabilities to provide an immersive learning experience. Users progress through three difficulty levels (beginner, intermediate, advanced) while mastering foundational phrases and building fluency through interactive practice.

## ✨ Key Features

### 📝 Interactive Sentence Builder
- **Word Bank System**: Drag-and-drop interface with categorized vocabulary (pronouns, verbs, nouns, adjectives, etc.)
- **Three Difficulty Levels**:
  - **Level 1 (A1-A2)**: Basic present tense, simple vocabulary
  - **Level 2 (B1-B2)**: Past/future tenses, expanded vocabulary
  - **Level 3 (C1-C2)**: Complex grammar including subjunctive, conditional, idiomatic expressions
- **Real-time Feedback**: AI-powered grammar checking and corrections
- **Audio Support**: Text-to-speech for pronunciation practice

### 💬 AI Language Tutor Chat
- **Powered by Google Gemini AI**: Natural conversational practice
- **Contextual Learning**: Ask grammar questions, request translations, and get cultural insights
- **Persistent Chat History**: Conversations saved to Firebase for review
- **Voice Input**: Speech recognition for hands-free practice

### 🎯 Progress Tracking & Mastery System
- **20 Foundational Phrases**: Core expressions for practical communication
- **Mastery Milestones**: Track completed phrases and unlock dynamic content
- **AI-Generated Phrases**: Once 50% mastery is achieved, receive personalized practice sentences
- **Spaced Repetition**: Previously mastered phrases resurface for reinforcement

### 🌍 Dual Language Support
- **Italian (Italiano)**: Standard Italian with comprehensive grammar rules
- **Sicilian (Sicilianu)**: Regional dialect with authentic phrases and expressions
- **Instant Switching**: Toggle between languages without losing progress

### 🔊 Audio Features
- **Text-to-Speech**: Hear correct pronunciation of target language sentences
- **Voice Input**: Speak your answers using browser speech recognition
- **Audio Playback Controls**: Listen to goal sentences and vocabulary

## 🛠️ Technical Stack

### Frontend
- **HTML5 & CSS3**: Responsive, mobile-friendly design
- **Vanilla JavaScript**: No framework dependencies, lightweight and fast
- **TailwindCSS**: Modern utility-first styling with dark mode support
- **Font Awesome**: Icon library for UI elements

### Backend & Infrastructure
- **Firebase Authentication**: Anonymous and custom token sign-in
- **Cloud Firestore**: Real-time database for user progress and chat history
- **Firebase Cloud Functions**: Secure API proxy for Gemini AI
- **Firebase Hosting**: Static site hosting with global CDN

### AI Integration
- **Google Gemini 2.5 Flash**: Advanced language model for tutoring
- **Custom Prompts**: Specialized system instructions for language education
- **JSON Response Parsing**: Structured data handling for dynamic phrase generation

## 📦 Project Structure

```
italian-tutor/
├── index.html              # Main application UI
├── config.js               # App configuration and initialization
├── firebase.json           # Firebase hosting configuration
├── .firebaserc            # Firebase project settings
├── functions/
│   ├── index.js           # Cloud Functions (Gemini proxy, config endpoint)
│   ├── package.json       # Function dependencies
│   └── .env              # Environment variables (API keys)
└── .gitignore            # Git ignore rules
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project
- Google Gemini API key

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd italian-tutor

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 2. Firebase Configuration

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already configured)
firebase init

# Select: Hosting, Functions, Firestore
# Choose existing project or create new one
```

### 3. Environment Variables

Create `functions/.env` file:

```env
# Firebase Configuration
FB_API_KEY=your_firebase_api_key
FB_AUTH_DOMAIN=your-project.firebaseapp.com
FB_PROJECT_ID=your-project-id
FB_STORAGE_BUCKET=your-project.appspot.com
FB_MESSAGING_SENDER_ID=your_sender_id
FB_APP_ID=your_app_id

# Google Gemini API Key
GEMINI_KEY=your_gemini_api_key
```

### 4. Firestore Security Rules

Configure Firestore rules to restrict access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 5. Deploy

```bash
# Deploy everything
firebase deploy

# Or deploy individually
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
```

### 6. Configure App ID

In `config.js`, set your app identifier:

```javascript
const __app_id = 'italian-tutor-default';
```

## 🎮 Usage Guide

### Getting Started
1. Open the app in your browser
2. Anonymous authentication happens automatically
3. Select your target language (Italian or Sicilian)
4. Choose difficulty level (Level 1, 2, or 3)

### Sentence Building
1. Read the English goal sentence
2. Click words from the word bank to construct the translation
3. Press "Submit" to check your answer
4. Receive immediate feedback with corrections
5. Click "Listen" to hear proper pronunciation

### Chat with Tutor
1. Type questions in the chat box (e.g., "How do I conjugate 'essere'?")
2. Or use the microphone button for voice input
3. Receive detailed explanations from the AI tutor
4. Chat history is saved automatically

### Mastery Progress
- Complete foundational phrases to track progress (0/20 → 20/20)
- Reach 50% mastery to unlock AI-generated dynamic phrases
- Mastered phrases may reappear for spaced repetition review

## 🔧 Customization

### Adding New Phrases

Edit the `staticPhraseData` array in `index.html`:

```javascript
{
    id: 'S21',
    italian: 'Andiamo al mercato',
    sicilian: 'Jamu a lu miarcatu',
    english: 'Let\'s go to the market',
    language: 'Both'
}
```

### Modifying Word Banks

Update `wordBankData` object by level:

```javascript
wordBankData.level1.verbs_present.push('leggere', 'scrivere');
```

### Adjusting AI Behavior

Modify system prompts in the Gemini API calls:

```javascript
const systemPrompt = `You are a supportive, knowledgeable ${currentLanguage} language tutor...`;
```

## 📊 Data Architecture

### Firestore Collections

```
/artifacts/{appId}/users/{userId}/
  ├── chat_history/          # User chat messages
  │   └── {messageId}
  │       ├── message: string
  │       ├── role: 'user' | 'tutor'
  │       └── timestamp: serverTimestamp
  │
  └── progress/              # User learning progress
      └── user_state
          ├── currentGoal: string
          ├── currentGoalId: string
          ├── language: string
          ├── level: string
          ├── masteredIds: string[]
          ├── dynamicPhrases: object[]
          └── selectedWords: string[]
```

### Progress State Management

User progress persists across sessions:
- Current exercise state (goal, selected words)
- Mastery tracking (completed phrase IDs)
- Language and difficulty preferences
- AI-generated dynamic phrases

## 🔐 Security Features

- **Anonymous Authentication**: No personal data required
- **User Isolation**: Firestore rules ensure users only access their own data
- **API Key Protection**: Sensitive keys stored in Cloud Functions environment
- **CORS Configuration**: Restricted API access from authorized origins
- **XSS Prevention**: Input sanitization and content security policies

## 🌐 Browser Compatibility

- **Recommended**: Chrome, Edge, Safari (latest versions)
- **Speech Recognition**: Chrome/Edge only (WebKit Speech API)
- **Text-to-Speech**: All modern browsers
- **Mobile**: Fully responsive on iOS and Android

## 🐛 Troubleshooting

### Firebase Connection Issues
```javascript
// Check browser console for errors
// Verify .env variables are set correctly
// Ensure Firestore rules allow access
```

### Speech Recognition Not Working
- Only available in Chrome/Edge browsers
- Requires HTTPS (or localhost for testing)
- Check microphone permissions in browser settings

### AI Responses Failing
- Verify GEMINI_KEY is valid and has quota
- Check Cloud Functions logs: `firebase functions:log`
- Ensure `/api/gemini-proxy` endpoint is deployed

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:
- Additional language support (Spanish, French, German)
- Gamification features (points, badges, leaderboards)
- Vocabulary flash cards
- Grammar explanations library
- Community phrase sharing

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for natural language processing
- Firebase for backend infrastructure
- TailwindCSS for styling framework
- Font Awesome for icons
- The Sicilian language community for cultural preservation

## 📧 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check Firebase console for deployment status
- Review browser console for client-side errors

---

**Built with ❤️ for language learners worldwide**

*Buono studio! (Happy studying!)* 🎓