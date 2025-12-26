import { format, addDays, differenceInDays } from 'date-fns';

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Get random elements from array
 */
export const getRandomElements = <T>(array: T[], count: number): T[] => {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
};

/**
 * Format date for display
 */
export const formatDate = (date: Date, formatStr: string = 'MMM dd, yyyy'): string => {
  return format(date, formatStr);
};

/**
 * Calculate days since signup
 */
export const daysSinceSignup = (signupDate: Date): number => {
  return differenceInDays(new Date(), signupDate);
};

/**
 * Calculate user's current streak
 */
export const calculateStreak = (lastActivityDates: Date[]): number => {
  if (lastActivityDates.length === 0) return 0;

  const sortedDates = lastActivityDates.sort((a, b) => b.getTime() - a.getTime());
  let streak = 1;
  let currentDate = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const daysDiff = differenceInDays(currentDate, sortedDates[i]);
    if (daysDiff === 1) {
      streak++;
      currentDate = sortedDates[i];
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Delay execution
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if user is in trial period (first 7 days)
 */
export const isInTrialPeriod = (signupDate: Date): boolean => {
  return daysSinceSignup(signupDate) <= 7;
};

/**
 * Get onboarding day for notifications
 */
export const getOnboardingDay = (signupDate: Date): number => {
  return daysSinceSignup(signupDate) + 1;
};
