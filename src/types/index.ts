// User types
export interface User {
  id: string;
  email: string;
  name: string;
  birthData?: BirthData;
  signupDate: Date;
  isPremium: boolean;
  subscriptionType?: 'monthly' | 'yearly' | 'lifetime';
  trialEndsAt?: Date;
  lastActivityDate?: Date;
  streak: number;
  intentions: Intention[];
}

export interface BirthData {
  date: string; // ISO format
  time: string; // HH:MM format
  place: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  zodiacSign?: string;
  risingSign?: string;
  moonSign?: string;
}

export type Intention = 'tarot' | 'astrology' | 'numerology' | 'dreams';

// Tarot types
export interface TarotCard {
  id: number;
  name: {
    en: string;
    tr: string;
  };
  suit: 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';
  arcana: 'major' | 'minor';
  number?: number;
  keywords: {
    en: string[];
    tr: string[];
  };
  meanings: {
    upright: {
      en: string;
      tr: string;
    };
    reversed: {
      en: string;
      tr: string;
    };
  };
  imageUrl: string;
  isCursed?: boolean; // Special property for CohenDad's dark twist
}

export interface TarotReading {
  id: string;
  userId: string;
  date: Date;
  spreadType: SpreadType;
  cards: DrawnCard[];
  question?: string;
  interpretation: string;
  aiGenerated: boolean;
  isFavorite: boolean;
}

export interface DrawnCard {
  card: TarotCard;
  position: number;
  isReversed: boolean;
  positionMeaning?: string;
}

export type SpreadType = 'daily' | 'three_card' | 'celtic_cross' | 'relationship' | 'career';

// Astrology types
export interface NatalChart {
  userId: string;
  birthData: BirthData;
  planets: PlanetPosition[];
  houses: House[];
  aspects: Aspect[];
  generatedAt: Date;
}

export interface PlanetPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  isRetrograde: boolean;
}

export interface House {
  number: number;
  sign: string;
  degree: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
  angle: number;
  isExact: boolean;
}

// Numerology types
export interface NumerologyProfile {
  userId: string;
  lifePathNumber: number;
  expressionNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthDayNumber: number;
  meanings: {
    lifePath: string;
    expression: string;
    soulUrge: string;
    personality: string;
  };
}

// Dream journal types
export interface DreamEntry {
  id: string;
  userId: string;
  date: Date;
  title: string;
  content: string;
  mood?: 'peaceful' | 'anxious' | 'exciting' | 'scary' | 'confusing';
  symbols?: string[];
  analysis?: string;
  aiGenerated: boolean;
  relatedCards?: TarotCard[];
}

// Subscription types
export interface Subscription {
  userId: string;
  type: 'monthly' | 'yearly' | 'lifetime';
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: Date;
  expiresAt?: Date;
  autoRenew: boolean;
  platform: 'ios' | 'android';
  productId: string;
}

// Usage tracking
export interface UsageStats {
  userId: string;
  date: string; // YYYY-MM-DD
  readingsCount: number;
  aiChatMessagesCount: number;
  dreamEntriesCount: number;
  lastResetAt: Date;
}

// Notification types
export interface ScheduledNotification {
  id: string;
  userId: string;
  type: 'daily_card' | 'evening_reflection' | 'weekly_insight' | 'onboarding';
  scheduledFor: Date;
  title: string;
  body: string;
  deepLink?: string;
  sent: boolean;
}

// Analytics event
export interface AnalyticsEvent {
  eventName: string;
  timestamp: Date;
  userId?: string;
  properties?: Record<string, any>;
}

// Navigation types
export type RootStackParamList = {
  // Onboarding
  Splash: undefined;
  Hook: undefined;
  Intentions: undefined;

  // Auth
  Auth: undefined;
  BirthData: undefined;

  // Main
  MainTabs: undefined;
  Home: undefined;
  TarotReading: { spreadType?: SpreadType };
  ReadingResult: { readingId: string };
  Astrology: undefined;
  Numerology: undefined;
  DreamJournal: undefined;
  DreamEntry: { entryId?: string };
  History: undefined;
  Profile: undefined;

  // Premium
  Paywall: { trigger?: string };
  SubscriptionPlans: undefined;
  AIChat: undefined;
  DeepDiveReports: undefined;

  // Social
  Community: undefined;
  Favorites: undefined;
  Notifications: undefined;

  // Support
  HelpCenter: undefined;
  Feedback: undefined;
};

export type Language = 'en' | 'tr';

export type AppState =
  | 'loading'
  | 'onboarding'
  | 'authenticated'
  | 'unauthenticated';
