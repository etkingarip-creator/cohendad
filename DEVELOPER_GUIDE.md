# 🚀 CohenDad - Developer Guide

## 📦 Project Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Firebase account
- OpenAI API key
- RevenueCat account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cohendad

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
# FIREBASE_API_KEY, OPENAI_API_KEY, REVENUECAT_API_KEY_IOS, etc.

# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

---

## 🏗️ Architecture Overview

### Tech Stack
- **Frontend**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State**: React Context API
- **Backend**: Firebase (Auth, Firestore, Cloud Functions)
- **Payments**: RevenueCat
- **AI**: OpenAI GPT-4
- **Push Notifications**: Firebase Cloud Messaging

### Folder Structure

```
src/
├── screens/          # All app screens (22 total)
├── components/       # Reusable UI components
├── navigation/       # App navigation setup
├── contexts/         # Global state management
├── services/         # Business logic & API calls
├── hooks/            # Custom React hooks
├── utils/            # Helper functions & constants
├── data/             # Static data (tarot cards, zodiac, etc.)
├── theme/            # Design system (colors, typography, spacing)
├── types/            # TypeScript type definitions
└── assets/           # Images, fonts, animations
```

---

## 🎯 Current Implementation Status

### ✅ Completed
- [x] Project structure and configuration
- [x] Theme system (colors, typography, spacing)
- [x] Type definitions
- [x] Utility functions and validators
- [x] Constants and configuration
- [x] Context providers (Auth, User, Premium)
- [x] Navigation structure (App Navigator, Tab Navigator)
- [x] **Phase 1: Onboarding** (Splash, Hook, Intentions)
- [x] Tarot cards data (Major Arcana - 9 cards implemented)

### 🚧 In Progress
- [ ] **Phase 2: User Registration** (Auth, Birth Data)

### 📋 TODO
- [ ] **Phase 3: Core App Features**
  - [ ] Home Screen (Daily Energy Card)
  - [ ] Tarot Reading Screen
  - [ ] Reading Result Screen
  - [ ] Astrology Screen
  - [ ] Numerology Screen
  - [ ] Dream Journal Screen
  - [ ] History Screen
  - [ ] Profile Screen

- [ ] **Phase 4: Premium Features**
  - [ ] Paywall Screen
  - [ ] Subscription Plans Screen
  - [ ] AI Chat Screen
  - [ ] Deep Dive Reports Screen

- [ ] **Services**
  - [ ] Firebase service layer
  - [ ] Tarot engine
  - [ ] Astrology calculations
  - [ ] Numerology calculations
  - [ ] AI service (OpenAI integration)
  - [ ] RevenueCat integration
  - [ ] Push notifications service

- [ ] **Analytics & Monitoring**
  - [ ] Firebase Analytics setup
  - [ ] Event tracking
  - [ ] Crash reporting (Crashlytics)

---

## 🔑 Key Features

### Freemium Model
- **Free Tier**: 1 daily tarot reading, basic numerology, dream journal
- **Premium** ($9.99/mo): Unlimited readings, AI chat, full astrology, advanced spreads
- **Lifetime** ($199.99): All premium features forever

### User Journey
1. **Onboarding**: Splash → Hook → Intentions → Auth → Birth Data
2. **Daily Ritual**: Pull daily card (9 AM push notification)
3. **Engagement**: Streaks, weekly insights, dream journal
4. **Conversion**: 7-day magic moment → Paywall → Premium

### Monetization Triggers
- Daily reading limit reached (1/day for free users)
- Advanced spread selection (Celtic Cross, etc.)
- AI Chat attempt
- Astrology transit view
- Dream analysis with AI

---

## 🎨 Design System

### Colors
```typescript
colors.primary.purple    // #7C3AED - Primary brand color
colors.primary.gold      // #F59E0B - Accent/CTA
colors.background.dark   // #0F0A1E - Main background
colors.background.card   // #1A1332 - Card background
colors.text.primary      // #FFFFFF - Primary text
colors.text.secondary    // #A78BFA - Secondary text
```

### Typography
```typescript
typography.h1            // 32px bold - Main headings
typography.h2            // 24px semibold - Section headings
typography.body          // 16px - Body text
typography.caption       // 14px - Small text
typography.button        // 16px semibold - Buttons
```

### Spacing
```typescript
spacing.xs    // 4px
spacing.sm    // 8px
spacing.md    // 16px
spacing.lg    // 24px
spacing.xl    // 32px
spacing.xxl   // 48px
```

---

## 🔥 Firebase Setup

### Collections Structure

```
users/
  {userId}/
    - email: string
    - name: string
    - birthData: object
    - isPremium: boolean
    - signupDate: timestamp
    - streak: number
    - intentions: array

readings/
  {readingId}/
    - userId: string
    - date: timestamp
    - spreadType: string
    - cards: array
    - interpretation: string
    - isFavorite: boolean

dreams/
  {dreamId}/
    - userId: string
    - date: timestamp
    - title: string
    - content: string
    - analysis: string

subscriptions/
  {userId}/
    - type: 'monthly' | 'yearly' | 'lifetime'
    - status: 'active' | 'canceled' | 'trial'
    - startDate: timestamp
    - expiresAt: timestamp
```

### Security Rules
```javascript
// Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /readings/{readingId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

---

## 🤖 AI Integration (OpenAI)

### Cloud Function: Generate Reading
```typescript
// functions/src/ai/generateReading.ts
import { OpenAI } from 'openai';

export const generateTarotReading = async (
  cards: TarotCard[],
  question?: string
): Promise<string> => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are CohenDad, a mystical tarot reader with a dark, poetic touch.

  Cards drawn: ${cards.map(c => c.name.en).join(', ')}
  Question: ${question || 'General reading'}

  Provide a deep, insightful interpretation that connects the cards to the querent's life.
  Be poetic, mysterious, and direct. Maximum 200 words.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 300,
    temperature: 0.8,
  });

  return completion.choices[0].message.content || 'The cards remain silent...';
};
```

---

## 💳 RevenueCat Integration

### Setup
```typescript
// src/services/subscription/revenueCat.ts
import Purchases from 'react-native-purchases';

export const initializeRevenueCat = async () => {
  const apiKey = Platform.OS === 'ios'
    ? process.env.REVENUECAT_API_KEY_IOS
    : process.env.REVENUECAT_API_KEY_ANDROID;

  await Purchases.configure({ apiKey });
};

export const getOfferings = async () => {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
};

export const purchasePackage = async (packageToPurchase: any) => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
    return customerInfo.entitlements.active['premium'] !== undefined;
  } catch (error) {
    if (error.userCancelled) {
      return false;
    }
    throw error;
  }
};
```

---

## 📊 Analytics Events

### Key Events to Track
```typescript
// Onboarding
SPLASH_VIEWED
HOOK_VIEWED
INTENTIONS_SELECTED
SIGNUP_COMPLETED

// Engagement
DAILY_CARD_PULLED
READING_STARTED
READING_COMPLETED
STREAK_ACHIEVED

// Monetization
PAYWALL_VIEWED
PAYWALL_DISMISSED
TRIAL_STARTED
SUBSCRIPTION_PURCHASED

// Retention
NOTIFICATION_CLICKED
DREAM_JOURNAL_ENTRY
AI_CHAT_MESSAGE_SENT
```

---

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### E2E Tests (Future)
```bash
# Install Detox
npm install -g detox-cli
detox test
```

---

## 🚀 Deployment

### iOS (App Store)
```bash
# Build with EAS (Expo Application Services)
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android (Google Play)
```bash
# Build APK/AAB
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

---

## 📈 Success Metrics

### Week 1 (MVP)
- 100 downloads
- 40% D1 retention
- 1% free-to-premium conversion

### Month 1
- 1,000 MAU
- 30% D7 retention
- 2% conversion rate

### Month 3
- 10,000 MAU
- $5,000 MRR
- 3% conversion rate

---

## 🛠️ Development Tips

### Hot Reload
Expo provides instant hot reload. Save any file and see changes immediately.

### Debugging
- Use React Native Debugger
- Enable Flipper for advanced debugging
- Check Firebase console for backend issues

### Performance
- Use `React.memo()` for expensive components
- Implement virtualization for long lists (FlatList)
- Lazy load images with FastImage
- Profile with React DevTools Profiler

### Security
- Never commit `.env` file
- Use Firebase Security Rules
- Validate all user input
- Sanitize AI-generated content

---

## 🐛 Common Issues

### Issue: Firebase not initialized
**Solution**: Check `FIREBASE_API_KEY` in `.env`

### Issue: Navigation not working
**Solution**: Ensure all screens are imported in `AppNavigator.tsx`

### Issue: Context errors
**Solution**: Wrap `App.tsx` with all providers (Auth, User, Premium)

### Issue: RevenueCat crashes
**Solution**: Initialize RevenueCat before any purchase calls

---

## 📞 Support

- **GitHub Issues**: Report bugs
- **Documentation**: See `ARCHITECTURE.md`
- **Firebase Console**: Monitor backend
- **RevenueCat Dashboard**: Track subscriptions

---

**Last Updated**: 2025-12-26
**Version**: 1.0.0-beta
**Status**: Phase 1 Complete ✅
