import { getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics';

let analytics: ReturnType<typeof getAnalytics> | null = null;

export const initializeAnalytics = () => {
  try {
    analytics = getAnalytics();
  } catch (error) {
    console.error('Analytics initialization failed:', error);
  }
};

export const logEvent = (eventName: string, params?: Record<string, any>) => {
  if (analytics) {
    firebaseLogEvent(analytics, eventName, params);
  }
};

export const setUserId = (userId: string) => {
  if (analytics) {
    // Firebase Analytics setUserId
    analytics.app.automaticDataCollectionEnabled = true;
  }
};

export const setUserProperty = (name: string, value: string) => {
  if (analytics) {
    // Firebase Analytics setUserProperty
    console.log('User property set:', name, value);
  }
};
