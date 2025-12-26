import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';
import { FREE_LIMITS } from '../utils/constants';

interface PremiumContextType {
  isPremium: boolean;
  isTrialing: boolean;
  canAccessFeature: (feature: string) => boolean;
  dailyReadingsRemaining: number;
  checkUsageLimit: (feature: string) => Promise<boolean>;
  showPaywall: (trigger: string) => void;
  paywallTrigger: string | null;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

interface PremiumProviderProps {
  children: ReactNode;
}

export const PremiumProvider: React.FC<PremiumProviderProps> = ({ children }) => {
  const { userData } = useUser();
  const [dailyReadingsRemaining, setDailyReadingsRemaining] = useState(FREE_LIMITS.DAILY_READINGS);
  const [paywallTrigger, setPaywallTrigger] = useState<string | null>(null);

  const isPremium = userData?.isPremium || false;

  const isTrialing = userData?.trialEndsAt
    ? new Date() < userData.trialEndsAt
    : false;

  const canAccessFeature = (feature: string): boolean => {
    // Premium users can access everything
    if (isPremium || isTrialing) return true;

    // Free tier feature gates
    const freeFeatures = ['daily_card', 'basic_numerology', 'dream_journal'];
    return freeFeatures.includes(feature);
  };

  const checkUsageLimit = async (feature: string): Promise<boolean> => {
    // Premium/trial users have no limits
    if (isPremium || isTrialing) return true;

    // Check daily reading limit for free users
    if (feature === 'tarot_reading') {
      if (dailyReadingsRemaining > 0) {
        setDailyReadingsRemaining((prev) => prev - 1);
        return true;
      }
      return false;
    }

    // Premium-only features
    const premiumFeatures = [
      'ai_chat',
      'advanced_spreads',
      'full_astrology',
      'dream_analysis',
      'weekly_reports',
    ];

    return !premiumFeatures.includes(feature);
  };

  const showPaywall = (trigger: string) => {
    setPaywallTrigger(trigger);
  };

  useEffect(() => {
    // Reset daily readings at midnight
    const resetDailyLimits = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const timeUntilMidnight = tomorrow.getTime() - now.getTime();

      setTimeout(() => {
        setDailyReadingsRemaining(FREE_LIMITS.DAILY_READINGS);
        // Recursively reset every day
        resetDailyLimits();
      }, timeUntilMidnight);
    };

    if (!isPremium && !isTrialing) {
      resetDailyLimits();
    }
  }, [isPremium, isTrialing]);

  const value: PremiumContextType = {
    isPremium,
    isTrialing,
    canAccessFeature,
    dailyReadingsRemaining,
    checkUsageLimit,
    showPaywall,
    paywallTrigger,
  };

  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
};
