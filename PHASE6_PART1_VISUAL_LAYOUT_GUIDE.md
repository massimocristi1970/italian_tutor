# 📱 Phase 6 Part 1 - Visual Layout Guide

## Mobile Layout (< 768px)

```
┌─────────────────────────────────────┐
│ 🇮🇹 Italian Tutor  [Lang] [Lvl] ☰  │  ← Header (compact)
├─────────────────────────────────────┤
│                                     │
│  📝 Sentence Builder                │
│  ┌─────────────────────────────┐   │
│  │ Goal: [English sentence]     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Selected words area]        │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Word] [Word] [Word]               │
│  [Word] [Word] [Word]               │  ← 3 columns
│  [Word] [Word] [Word]               │
│                                     │
│  [Check Sentence]  [Clear]          │  ← Large buttons
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│                                     │
│  📚 Common Phrases / Verb Trainer   │
│  ┌─────────────────────────────┐   │
│  │ Phrase 1                     │   │
│  │ Phrase 2                     │   │  ← Full width cards
│  │ Phrase 3                     │   │
│  └─────────────────────────────┘   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│                                     │
│  📊 Progress Dashboard              │
│  ┌────────┬────────┐               │
│  │ Streak │Phrases │               │  ← 2 columns
│  │   🔥7  │  142   │               │
│  ├────────┼────────┤               │
│  │ Words  │Accuracy│               │
│  │  523   │  87%   │               │
│  └────────┴────────┘               │
│                                     │
│  Skills (stacked vertically):       │
│  ┌─────────────────────────────┐   │
│  │ Verbs ████████░░ 80%         │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Grammar ██████░░░ 60%        │   │
│  └─────────────────────────────┘   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│                                     │
│  💬 AI Chat Tutor                   │
│  ┌─────────────────────────────┐   │
│  │ Tutor: Ciao! Come stai?     │   │
│  │        You: Bene, grazie!   │   │
│  └─────────────────────────────┘   │
│  [Type message...] [Send]          │  ← Bottom anchored
│                                     │
│ ▼ Scroll ▼                          │
├─────────────────────────────────────┤
│ [📖 Practice] [📊 Progress]         │  ← Bottom Nav
│ [💬 Scenarios] [🤖 Tutor]           │     (Fixed)
└─────────────────────────────────────┘
```

---

## Mobile with Hamburger Menu Open

```
┌─────────────────────────────────────┐
│ 🇮🇹 Italian Tutor  [Lang] [Lvl] ☰  │
├─────────────────────┬───────────────┤
│ [Dimmed content]    │  Menu      [✕]│
│                     │ ─────────────  │
│ (Background overlay)│ 🌙 Dark Mode   │
│                     │ 📊 Weekly Rprt │
│                     │ 🎤 Pronunciatn │
│                     │ ⏱️  Fluency    │
│                     │ 📇 Flashcards  │
│                     │ ⚙️  Settings   │
│                     │                │
│                     │                │
│                     │                │
├─────────────────────┴───────────────┤
│ [📖 Practice] [📊 Progress]         │
│ [💬 Scenarios] [🤖 Tutor]           │
└─────────────────────────────────────┘
```

---

## Tablet Layout (768px - 1024px)

```
┌──────────────────────────────────────────────────────────────┐
│ 🇮🇹 Italian Tutor  [Language Sel] [Level Sel] [Logout] [☀️]  │
├──────────────────────────────────────────────────────────────┤
│                              │                                │
│  📝 Sentence Builder         │  📊 Progress Dashboard         │
│  ┌────────────────────────┐ │  ┌──────┬──────┬──────┬─────┐ │
│  │ Goal: [English]        │ │  │Streak│Phras │Words │ Acc │ │
│  └────────────────────────┘ │  │  🔥7 │  142 │ 523  │ 87% │ │
│                              │  └──────┴──────┴──────┴─────┘ │
│  ┌────────────────────────┐ │                                │
│  │ [Selected words]       │ │  Skills (2 columns):           │
│  └────────────────────────┘ │  ┌──────────┬──────────┐      │
│                              │  │Verbs 80% │Grammar   │      │
│  [Word] [Word] [Word] [Word]│  │██████████│60% ██████│      │
│  [Word] [Word] [Word] [Word]│  └──────────┴──────────┘      │
│  [Word] [Word] [Word] [Word]│  ━━━━━━━━━━━━━━━━━━━━━       │
│                              │                                │
│  [Check Sentence]  [Clear]  │  💬 AI Chat Tutor              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━ │  ┌──────────────────────────┐ │
│                              │  │ Tutor: Ciao! Come stai?  │ │
│  📚 Common Phrases           │  │        You: Bene, grazie!│ │
│  [Phrases Tab] [Verbs Tab]  │  └──────────────────────────┘ │
│  ┌────────────────────────┐ │  [Type message...] [Send]    │
│  │ Phrase 1               │ │                                │
│  │ Phrase 2               │ │                                │
│  │ Phrase 3               │ │                                │
│  └────────────────────────┘ │                                │
│                              │                                │
└──────────────────────────────┴────────────────────────────────┘
         ↑ 2 Column Layout (Left: 50%, Right: 50%) ↑
```

---

## Desktop Layout (> 1024px)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 🇮🇹 Italian Tutor  [Language Selector] [Level Selector] [☀️] [Logout]│
├─────────────────────────────────────────────────────────────────────┤
│                                  │                                   │
│  📝 Sentence Builder             │  📊 Progress Dashboard            │
│  ┌──────────────────────────┐   │  ┌─────┬──────┬──────┬──────┐   │
│  │ Goal: Translate to Ital. │   │  │Strek│Phras.│Words │Accur.│   │
│  │ "Hello, how are you?"    │   │  │ 🔥7 │ 142  │ 523  │ 87%  │   │
│  └──────────────────────────┘   │  └─────┴──────┴──────┴──────┘   │
│                                  │                                   │
│  ┌──────────────────────────┐   │  Skills (3 columns):              │
│  │ [Selected words here]    │   │  ┌────────┬────────┬────────┐   │
│  └──────────────────────────┘   │  │Verbs   │Grammar │Vocabu. │   │
│                                  │  │80% ████│60% ████│75% ████│   │
│  Word Bank (5 columns):          │  └────────┴────────┴────────┘   │
│  [Word][Word][Word][Word][Word]  │  [View Full Report]              │
│  [Word][Word][Word][Word][Word]  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  [Word][Word][Word][Word][Word]  │                                   │
│                                  │  💬 AI Chat Tutor                 │
│  [Check Sentence]  [Clear]       │  ┌─────────────────────────────┐│
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  │ Tutor: Ciao! Come stai?     ││
│                                  │  │                             ││
│  📚 Common Phrases & Verb Trainer│  │ You: Bene, grazie! E tu?    ││
│  [Common Phrases][Verb Trainer]  │  │                             ││
│  ┌──────────────────────────┐   │  │ Tutor: Molto bene! Oggi...  ││
│  │ 👋 Ciao - Hello (Informal)│   │  └─────────────────────────────┘│
│  │ 🎉 Buongiorno - Good morn.│   │  [Type your message...] [Send]   │
│  │ ☕ Un caffè, per favore   │   │                                   │
│  │ 🍕 Vorrei una pizza       │   │  [🔊 Pronunciation] [⏱️ Fluency]  │
│  │ 🏠 Dov'è il bagno?        │   │  [📇 Flashcards] [💬 Scenarios]   │
│  │ ✅ Perfetto, grazie!      │   │                                   │
│  └──────────────────────────┘   │                                   │
│                                  │                                   │
└──────────────────────────────────┴───────────────────────────────────┘
            ↑ Balanced 2 Column (Left: ~45%, Right: ~55%) ↑
         Max Width: 1400px, Centered on larger screens
```

---

## Conversation Scenario - Mobile View

```
┌─────────────────────────────────────┐
│ Scenarios                        [✕]│  ← Full screen modal
├─────────────────────────────────────┤
│ ← Scroll Categories →               │
│ [🍽️ Restaurant][🏨 Hotel][🛒 Shop] │  ← Horizontal scroll
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🍕 At the Restaurant            │ │
│ │ Beginner • 5 turns              │ │  ← Scenario card
│ │ Practice ordering food!         │ │     (full width)
│ │ [Start] →                       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ☕ At the Café                  │ │
│ │ Beginner • 4 turns              │ │
│ │ Order your morning coffee       │ │
│ │ [Start] →                       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🛒 At the Market                │ │
│ │ Intermediate • 6 turns          │ │
│ │ Shop for fresh produce          │ │
│ │ [Start] →                       │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

---

## Conversation Scenario - Active (Mobile)

```
┌─────────────────────────────────────┐
│ 🍕 At the Restaurant         [✕][←]│
├─────────────────────────────────────┤
│ Turn 2 of 5                         │
│ ━━━━━━━━━━━━━━━━░░░░░░░░░░░        │
├─────────────────────────────────────┤
│                                     │
│  [Waiter icon]                      │
│  ┌───────────────────────────────┐ │
│  │ Waiter: "Buonasera! Cosa      │ │
│  │ desidera ordinare?"           │ │
│  └───────────────────────────────┘ │
│                                     │
│  Your responses:                    │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Vorrei una pizza margherita   │ │  ← Response options
│  │ I'd like a margherita pizza   │ │     (full width, large)
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Un tavolo per due, per favore │ │
│  │ A table for two, please       │ │
│  └───────────────────────────────┘ │
│                                     │
│  💡 Hint: "Vorrei" = "I would like"│
│                                     │
└─────────────────────────────────────┘
```

---

## SRS Flashcard - Mobile View

```
┌─────────────────────────────────────┐
│ Spaced Repetition            [✕][←]│
├─────────────────────────────────────┤
│ Card 3 of 12  •  Due: 5             │
│                                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │         Parlare             │   │  ← Large, centered
│  │                             │   │
│  │      [Tap to flip]          │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│                                     │
│  How well did you know this?        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 😣 Again (< 1 min)           │   │  ← Full width
│  └─────────────────────────────┘   │     buttons
│  ┌─────────────────────────────┐   │
│  │ 😐 Hard (< 10 min)           │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🙂 Good (4 days)             │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 😊 Easy (2 weeks)            │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## Key Responsive Features

### Mobile (< 768px):
✅ Single column layout
✅ Bottom navigation bar (fixed)
✅ Hamburger menu for advanced features
✅ 3-column word bank
✅ Touch targets ≥ 44px
✅ Full-screen modals
✅ Vertical stacking of all elements
✅ Compact padding (12px)

### Tablet (768px - 1024px):
✅ Two-column layout maintained
✅ 4-column word bank
✅ No mobile navigation
✅ Touch targets ≥ 42px
✅ Increased spacing (16px)
✅ 2-column grids for cards

### Desktop (> 1024px):
✅ Current design preserved
✅ 5-column word bank
✅ Standard mouse interactions
✅ Maximum width constraint (1400px)
✅ Optimal spacing (24px)
✅ Multi-column grids

---

## Touch Target Sizes

```
Mobile Buttons:
┌──────────────────┐
│  Submit Button   │  44px min height
└──────────────────┘  ← Apple HIG standard

Tablet Buttons:
┌──────────────────┐
│  Submit Button   │  42px min height
└──────────────────┘  ← Comfortable for tablets

Desktop Buttons:
┌──────────────────┐
│  Submit Button   │  40px (standard)
└──────────────────┘
```

---

## Navigation Comparison

```
Desktop:                  Mobile:
┌──────────────────┐     ┌──────────────────┐
│   TOP HEADER     │     │   TOP HEADER  ☰  │
│ [Nav items here] │     ├──────────────────┤
├──────────────────┤     │                  │
│                  │     │   Main Content   │
│  Main Content    │     │                  │
│                  │     │                  │
│                  │     ├──────────────────┤
│                  │     │ [📖][📊][💬][🤖] │
└──────────────────┘     └──────────────────┘
                              ↑ BOTTOM NAV
```

---

## Color & Spacing Scale

```
Padding:
Desktop:  24px  ████████████████████████
Tablet:   16px  ████████████████
Mobile:   12px  ████████████

Button Heights:
Desktop:  40px  ████████████████████
Tablet:   42px  █████████████████████
Mobile:   44px  ██████████████████████

Font Sizes:
Desktop:  1.0rem  ████████████
Tablet:   0.95rem ███████████
Mobile:   0.9rem  ██████████
```

---

## Breakpoint Reference

```
0px                768px           1024px           1920px+
│                   │                │                │
├───────────────────┼────────────────┼────────────────┤
   Mobile (Phone)      Tablet        Desktop         HD+
   Single Column     Two Column    Current Design   Max Width
   Bottom Nav        Touch Opt.    Mouse/Keyboard   Constrained
   3-col Word Bank   4-col Bank    5-col Bank       Centered
```

---

🎨 **Design Philosophy:**
- **Mobile First**: Optimized for phones, enhanced for larger screens
- **Touch Friendly**: All interactions designed for fingers
- **Progressive Enhancement**: Features scale up with screen size
- **Consistent Experience**: Same functionality across all devices
- **Performance Focused**: Minimal CSS, smooth animations

---

📱 This visual guide shows how your Italian Tutor app will adapt beautifully to any screen size!
