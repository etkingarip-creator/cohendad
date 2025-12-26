# 🎯 COHENDAD APP - IMPLEMENTATION ARCHITECTURE

## 📋 EXECUTIVE SUMMARY

**Platform**: React Native (iOS & Android)
**Backend**: Firebase (Auth, Firestore, Cloud Functions)
**Payment**: RevenueCat
**State Management**: React Context + AsyncStorage
**Navigation**: React Navigation v6
**AI**: OpenAI GPT-4 (via Cloud Functions)
**Analytics**: Firebase Analytics + Mixpanel
**Push**: Firebase Cloud Messaging

---

## 🏗️ PROJECT STRUCTURE

```
cohendad/
├── src/
│   ├── screens/                  # 22 screens organized by phase
│   │   ├── onboarding/           # Phase 1 (3 screens)
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── HookScreen.tsx
│   │   │   └── IntentionsScreen.tsx
│   │   ├── auth/                 # Phase 2 (2 screens)
│   │   │   ├── AuthScreen.tsx
│   │   │   └── BirthDataScreen.tsx
│   │   ├── main/                 # Phase 3 (8 screens)
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── TarotReadingScreen.tsx
│   │   │   ├── ReadingResultScreen.tsx
│   │   │   ├── AstrologyScreen.tsx
│   │   │   ├── NumerologyScreen.tsx
│   │   │   ├── DreamJournalScreen.tsx
│   │   │   ├── HistoryScreen.tsx
│   │   │   └── ProfileScreen.tsx
│   │   ├── premium/              # Phase 4 (4 screens)
│   │   │   ├── PaywallScreen.tsx
│   │   │   ├── SubscriptionPlansScreen.tsx
│   │   │   ├── AIChatScreen.tsx
│   │   │   └── DeepDiveReportsScreen.tsx
│   │   ├── social/               # Phase 5 (3 screens)
│   │   │   ├── CommunityScreen.tsx
│   │   │   ├── FavoritesScreen.tsx
│   │   │   └── NotificationsScreen.tsx
│   │   └── support/              # Phase 6 (2 screens)
│   │       ├── HelpCenterScreen.tsx
│   │       └── FeedbackScreen.tsx
│   ├── components/               # Reusable components
│   │   ├── cards/
│   │   │   ├── TarotCard.tsx
│   │   │   ├── EnergyCard.tsx
│   │   │   └── CardDeck.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loading.tsx
│   │   └── premium/
│   │       ├── PaywallModal.tsx
│   │       └── PremiumBadge.tsx
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   └── OnboardingNavigator.tsx
│   ├── contexts/                 # State management
│   │   ├── AuthContext.tsx
│   │   ├── UserContext.tsx
│   │   ├── PremiumContext.tsx
│   │   └── NotificationContext.tsx
│   ├── services/                 # Business logic
│   │   ├── firebase/
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   └── analytics.ts
│   │   ├── tarot/
│   │   │   ├── tarotEngine.ts
│   │   │   ├── spreads.ts
│   │   │   └── interpretations.ts
│   │   ├── astrology/
│   │   │   ├── natalChart.ts
│   │   │   ├── transits.ts
│   │   │   └── zodiacEngine.ts
│   │   ├── numerology/
│   │   │   ├── lifePathCalc.ts
│   │   │   └── numberMeanings.ts
│   │   ├── ai/
│   │   │   ├── aiService.ts
│   │   │   └── prompts.ts
│   │   ├── subscription/
│   │   │   ├── revenueCat.ts
│   │   │   └── paywall.ts
│   │   └── notifications/
│   │       ├── pushService.ts
│   │       └── scheduleNotifications.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── usePremium.ts
│   │   ├── useTarot.ts
│   │   ├── useAnalytics.ts
│   │   └── useNotifications.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validators.ts
│   ├── data/
│   │   ├── tarotCards.ts         # 78 tarot cards data
│   │   ├── zodiacSigns.ts
│   │   ├── numerologyData.ts
│   │   └── translations.ts       # i18n
│   ├── assets/
│   │   ├── images/
│   │   │   ├── tarot/            # 78 card images
│   │   │   ├── zodiac/
│   │   │   └── icons/
│   │   ├── fonts/
│   │   └── animations/           # Lottie files
│   └── theme/
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
├── functions/                    # Firebase Cloud Functions
│   ├── src/
│   │   ├── ai/
│   │   │   ├── generateReading.ts
│   │   │   ├── chatCompletion.ts
│   │   │   └── dreamAnalysis.ts
│   │   ├── notifications/
│   │   │   └── scheduleDaily.ts
│   │   └── analytics/
│   │       └── trackEvents.ts
│   └── package.json
├── App.tsx                       # Root component
├── index.js                      # Entry point
├── package.json
├── tsconfig.json
├── metro.config.js
├── babel.config.js
└── .env                          # Environment variables
```

---

## 🎯 IMPLEMENTATION PHASES

### **MVP (Week 1-2)** - Core Experience
**Goal**: Ship working app with basic tarot functionality

#### Week 1: Foundation
- ✅ Set up React Native project (Expo)
- ✅ Configure Firebase (Auth, Firestore)
- ✅ Implement navigation structure
- ✅ Create base UI components
- ✅ Build Onboarding flow (3 screens)
- ✅ Implement Auth (email + Google OAuth)

#### Week 2: Core Features
- ✅ Daily Energy Card screen
- ✅ 3-card Tarot spread
- ✅ Reading history
- ✅ Basic AI interpretation (OpenAI)
- ✅ Profile screen
- ✅ Simple paywall modal

**MVP Success Metrics**:
- Users can sign up
- Users can pull daily card
- Users can do 3-card reading
- Basic free/premium gate works

---

### **V1.1 (Week 3)** - Monetization
**Goal**: Revenue infrastructure

- ✅ RevenueCat integration
- ✅ Subscription plans ($9.99/mo, $59.99/yr)
- ✅ 7-day free trial
- ✅ Usage limit enforcement (1 reading/day for free)
- ✅ Paywall triggers on premium features
- ✅ Receipt validation

**Success Metrics**:
- Subscription purchase flow works
- Trial converts to paid
- Paywall shows at right moments

---

### **V1.2 (Week 4-5)** - Engagement
**Goal**: Daily active usage

- ✅ Push notifications setup
- ✅ Daily rituals (9 AM morning card, 9 PM reflection)
- ✅ Streak system
- ✅ Numerology calculator
- ✅ Dream journal (CRUD)
- ✅ AI Chat (premium feature)
- ✅ Onboarding optimization (A/B test CTAs)

**Success Metrics**:
- 30% D1 retention
- 15% D7 retention
- 20% notification opt-in

---

### **V1.3 (Week 6-7)** - Depth
**Goal**: Premium value proposition

- ✅ Astrology: Natal chart generation
- ✅ Advanced tarot spreads (Celtic Cross, Relationship, Career)
- ✅ Weekly deep dive reports
- ✅ Favorites/bookmarks
- ✅ Reading export (PDF)
- ✅ Enhanced AI prompts (contextual readings)

**Success Metrics**:
- 2-3% free-to-premium conversion
- Premium users do 5+ readings/week

---

### **V2.0 (Week 8-12)** - Scale & Growth
**Goal**: Viral loops and community

- ✅ Referral program ("Invite friend, get 1 month free")
- ✅ Lifetime plan ($199.99)
- ✅ Community feed (optional)
- ✅ Share readings to social media
- ✅ Localization (Turkish + English)
- ✅ Analytics dashboard (Mixpanel)
- ✅ A/B testing framework

**Success Metrics**:
- 10k MAU
- 3% conversion rate
- 50% viral coefficient (K-factor)

---

## 💰 FREEMIUM GATING LOGIC

```typescript
// src/services/subscription/usageGate.ts

interface UsageLimits {
  dailyReadings: number;
  advancedSpreads: boolean;
  aiChat: boolean;
  astrology: 'basic' | 'full';
  dreamAnalysis: boolean;
  weeklyReports: boolean;
}

const FREE_LIMITS: UsageLimits = {
  dailyReadings: 1,
  advancedSpreads: false,
  aiChat: false,
  astrology: 'basic',
  dreamAnalysis: false,
  weeklyReports: false,
};

const PREMIUM_LIMITS: UsageLimits = {
  dailyReadings: Infinity,
  advancedSpreads: true,
  aiChat: true,
  astrology: 'full',
  dreamAnalysis: true,
  weeklyReports: true,
};

export const canAccessFeature = (
  feature: keyof UsageLimits,
  isPremium: boolean
): boolean => {
  const limits = isPremium ? PREMIUM_LIMITS : FREE_LIMITS;
  return limits[feature];
};

export const showPaywallIfNeeded = (
  feature: string,
  isPremium: boolean,
  navigation: any
) => {
  if (!isPremium) {
    navigation.navigate('Paywall', { trigger: feature });
    return true;
  }
  return false;
};
```

---

## 🪝 HOOK SYSTEM - 7-DAY ACTIVATION

```typescript
// src/services/notifications/onboardingCampaign.ts

export const scheduleOnboardingCampaign = async (userId: string, signUpDate: Date) => {
  // Day 1: Welcome
  await scheduleNotification({
    userId,
    date: addDays(signUpDate, 1),
    time: '09:00',
    title: 'Hoş geldin! Günlük kartın hazır 🌙',
    body: 'İlk kartını çek ve bugünün enerjisini keşfet',
    deepLink: '/daily-card',
  });

  // Day 2: Reflection
  await scheduleNotification({
    userId,
    date: addDays(signUpDate, 2),
    time: '21:00',
    title: 'Dünkü kartın nasıl yansıdı?',
    body: 'Enerjilerin doğru mu çıktı? Yansıt 💫',
    deepLink: '/history',
  });

  // Day 3: Numerology unlock
  await scheduleNotification({
    userId,
    date: addDays(signUpDate, 3),
    time: '10:00',
    title: 'Yaşam yolu sayını keşfet',
    body: 'Numeroloji analizi seni bekliyor 🔢',
    deepLink: '/numerology',
  });

  // Day 5: Premium preview
  await scheduleNotification({
    userId,
    date: addDays(signUpDate, 5),
    time: '11:00',
    title: 'Özel hediye: Celtic Cross spread 🎁',
    body: 'Bugün sınırsız erişim - şimdi dene!',
    deepLink: '/tarot-reading?spread=celtic',
  });

  // Day 7: Conversion push
  await scheduleNotification({
    userId,
    date: addDays(signUpDate, 7),
    time: '12:00',
    title: '🎉 Son 24 saat: %50 indirim!',
    body: 'Premium\'a geç, sınırsız okuma kazan',
    deepLink: '/paywall?promo=day7',
  });
};
```

---

## 📊 ANALYTICS TRACKING

```typescript
// src/services/analytics/events.ts

export enum AnalyticsEvent {
  // Onboarding
  SPLASH_VIEWED = 'splash_viewed',
  HOOK_VIEWED = 'hook_viewed',
  INTENTIONS_SELECTED = 'intentions_selected',
  SIGNUP_STARTED = 'signup_started',
  SIGNUP_COMPLETED = 'signup_completed',

  // Core actions
  DAILY_CARD_PULLED = 'daily_card_pulled',
  READING_STARTED = 'reading_started',
  READING_COMPLETED = 'reading_completed',

  // Monetization
  PAYWALL_VIEWED = 'paywall_viewed',
  PAYWALL_DISMISSED = 'paywall_dismissed',
  TRIAL_STARTED = 'trial_started',
  SUBSCRIPTION_PURCHASED = 'subscription_purchased',

  // Engagement
  NOTIFICATION_RECEIVED = 'notification_received',
  NOTIFICATION_CLICKED = 'notification_clicked',
  STREAK_ACHIEVED = 'streak_achieved',

  // Premium features
  AI_CHAT_MESSAGE_SENT = 'ai_chat_message_sent',
  DREAM_JOURNAL_ENTRY = 'dream_journal_entry',
  NATAL_CHART_VIEWED = 'natal_chart_viewed',
}

export const trackEvent = (
  event: AnalyticsEvent,
  properties?: Record<string, any>
) => {
  // Firebase Analytics
  analytics().logEvent(event, properties);

  // Mixpanel (for cohort analysis)
  if (mixpanel) {
    mixpanel.track(event, properties);
  }
};
```

---

## 🔒 PREMIUM FEATURE GATING

### Paywall Trigger Points:
1. **Daily Reading Limit**: After 1 free reading → Paywall
2. **Advanced Spreads**: Click Celtic Cross → Paywall
3. **AI Chat**: Tap chat icon → Paywall
4. **Astrology Transits**: View transits → Paywall
5. **Dream Analysis**: "Analyze with AI" → Paywall
6. **Weekly Report**: Auto-popup on Day 7

### Paywall Variants (A/B Test):
- **Variant A**: "$9.99/month - Unlimited readings"
- **Variant B**: "7-day free trial, then $9.99"
- **Variant C**: "Save 40% with yearly ($59.99)"

---

## 🎨 DESIGN SYSTEM

```typescript
// src/theme/colors.ts
export const colors = {
  primary: {
    purple: '#7C3AED',
    gold: '#F59E0B',
    midnight: '#1E1B4B',
  },
  background: {
    dark: '#0F0A1E',
    card: '#1A1332',
    modal: '#2D1B69',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#A78BFA',
    muted: '#6B7280',
  },
  accent: {
    mystic: '#EC4899',
    cosmic: '#3B82F6',
    ethereal: '#10B981',
  },
};

// src/theme/typography.ts
export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold', fontFamily: 'Cinzel' },
  h2: { fontSize: 24, fontWeight: '600', fontFamily: 'Cinzel' },
  body: { fontSize: 16, fontFamily: 'Inter' },
  caption: { fontSize: 14, color: colors.text.muted },
};
```

---

## 🚀 DEPLOYMENT CHECKLIST

### Pre-Launch (MVP):
- [ ] Firebase project configured (prod + staging)
- [ ] RevenueCat dashboard set up
- [ ] OpenAI API key secured
- [ ] App Store Connect account ready
- [ ] Google Play Console account ready
- [ ] Privacy policy + Terms of Service written
- [ ] App icons (iOS: 1024x1024, Android: adaptive)
- [ ] Screenshots (6.5" iPhone, 5.5" iPhone for App Store)

### Launch Day:
- [ ] App Store submission (review takes 1-3 days)
- [ ] Google Play submission (review takes 1-2 days)
- [ ] Enable Firebase Analytics
- [ ] Test purchase flow on TestFlight/Internal Testing
- [ ] Monitor Crashlytics

### Post-Launch (Week 1):
- [ ] Monitor conversion funnel
- [ ] A/B test paywall variants
- [ ] Respond to reviews
- [ ] Fix critical bugs within 24h

---

## 📈 SUCCESS METRICS (OKRs)

### Month 1:
- **Objective**: Validate product-market fit
- KR1: 1,000 downloads
- KR2: 40% D1 retention
- KR3: 1.5% free-to-premium conversion

### Month 3:
- **Objective**: Scale to profitability
- KR1: 10,000 MAU
- KR2: 3% conversion rate
- KR3: $5,000 MRR

### Month 6:
- **Objective**: Become category leader
- KR1: 50,000 MAU
- KR2: 4.5-star rating (iOS + Android)
- KR3: $25,000 MRR
- KR4: Featured on App Store

---

## 🛠️ TECH STACK FINALIZED

| Category | Technology | Why |
|----------|-----------|-----|
| **Frontend** | React Native (Expo) | Cross-platform, fast iteration |
| **Language** | TypeScript | Type safety, better DX |
| **Backend** | Firebase | Serverless, scalable |
| **Auth** | Firebase Auth | Google OAuth built-in |
| **Database** | Firestore | Real-time, NoSQL |
| **Payments** | RevenueCat | Cross-platform subscriptions |
| **AI** | OpenAI GPT-4o | Best reasoning for interpretations |
| **Push** | FCM (Firebase Cloud Messaging) | Free, reliable |
| **Analytics** | Firebase Analytics + Mixpanel | Event tracking + cohorts |
| **State** | React Context API | Simple, no Redux overhead |
| **Navigation** | React Navigation v6 | Industry standard |
| **Storage** | AsyncStorage | Local user data |
| **Images** | Cloudinary / Firebase Storage | CDN for tarot card images |

---

## 🎯 NEXT STEPS

1. **Set up React Native project** (Expo CLI)
2. **Configure Firebase + RevenueCat**
3. **Build navigation structure**
4. **Implement Onboarding (MVP Phase 1)**
5. **Create Tarot reading engine**
6. **Integrate OpenAI for interpretations**
7. **Launch MVP to TestFlight/Internal Testing**
8. **Iterate based on user feedback**

---

**Last Updated**: 2025-12-26
**Version**: 1.0 (Master Plan)
