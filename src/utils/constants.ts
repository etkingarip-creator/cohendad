// Free tier limits
export const FREE_LIMITS = {
  DAILY_READINGS: 1,
  AI_CHAT_MESSAGES: 0,
  ADVANCED_SPREADS: 0,
  DREAM_ANALYSIS: 0,
} as const;

// Premium features
export const PREMIUM_FEATURES = {
  UNLIMITED_READINGS: true,
  ALL_SPREADS: true,
  AI_CHAT: true,
  FULL_ASTROLOGY: true,
  DREAM_ANALYSIS: true,
  WEEKLY_REPORTS: true,
  AD_FREE: true,
} as const;

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  MONTHLY: {
    id: 'premium_monthly',
    price: 9.99,
    currency: 'USD',
    period: 'month',
  },
  YEARLY: {
    id: 'premium_yearly',
    price: 59.99,
    currency: 'USD',
    period: 'year',
    savings: 0.5, // 50% savings
  },
  LIFETIME: {
    id: 'premium_lifetime',
    price: 199.99,
    currency: 'USD',
    period: 'lifetime',
  },
} as const;

// Notification times
export const NOTIFICATION_SCHEDULE = {
  MORNING_CARD: { hour: 9, minute: 0 }, // 9:00 AM
  EVENING_REFLECTION: { hour: 21, minute: 0 }, // 9:00 PM
  WEEKLY_INSIGHT: { day: 0, hour: 10, minute: 0 }, // Sunday 10:00 AM
} as const;

// Onboarding campaign
export const ONBOARDING_DAYS = {
  WELCOME: 1,
  REFLECTION: 2,
  NUMEROLOGY_UNLOCK: 3,
  DREAM_PROMPT: 4,
  PREMIUM_PREVIEW: 5,
  AI_CHAT_TEASER: 6,
  CONVERSION_OFFER: 7,
} as const;

// Tarot spreads
export const TAROT_SPREADS = {
  DAILY: {
    id: 'daily',
    name: 'Daily Energy',
    cards: 1,
    free: true,
  },
  THREE_CARD: {
    id: 'three_card',
    name: 'Past-Present-Future',
    cards: 3,
    free: true,
  },
  CELTIC_CROSS: {
    id: 'celtic_cross',
    name: 'Celtic Cross',
    cards: 10,
    free: false,
  },
  RELATIONSHIP: {
    id: 'relationship',
    name: 'Relationship',
    cards: 7,
    free: false,
  },
  CAREER: {
    id: 'career',
    name: 'Career Path',
    cards: 5,
    free: false,
  },
} as const;

// Analytics events
export const ANALYTICS_EVENTS = {
  // Onboarding
  SPLASH_VIEWED: 'splash_viewed',
  HOOK_VIEWED: 'hook_viewed',
  INTENTIONS_SELECTED: 'intentions_selected',
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',

  // Core actions
  DAILY_CARD_PULLED: 'daily_card_pulled',
  READING_STARTED: 'reading_started',
  READING_COMPLETED: 'reading_completed',

  // Monetization
  PAYWALL_VIEWED: 'paywall_viewed',
  PAYWALL_DISMISSED: 'paywall_dismissed',
  TRIAL_STARTED: 'trial_started',
  SUBSCRIPTION_PURCHASED: 'subscription_purchased',

  // Engagement
  NOTIFICATION_RECEIVED: 'notification_received',
  NOTIFICATION_CLICKED: 'notification_clicked',
  STREAK_ACHIEVED: 'streak_achieved',

  // Premium features
  AI_CHAT_MESSAGE_SENT: 'ai_chat_message_sent',
  DREAM_JOURNAL_ENTRY: 'dream_journal_entry',
  NATAL_CHART_VIEWED: 'natal_chart_viewed',
} as const;
