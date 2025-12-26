/**
 * Google Ads Integration
 * For freemium users - shown during oracle loading
 */

// NOTE: This requires expo-ads-admob or react-native-google-mobile-ads
// For now, placeholder structure

export interface AdConfig {
  unitId: string;
  type: 'banner' | 'interstitial' | 'rewarded';
}

export const AD_UNITS = {
  ORACLE_LOADING: {
    ios: 'ca-app-pub-xxxxx/banner-oracle-ios',
    android: 'ca-app-pub-xxxxx/banner-oracle-android',
  },
  READING_RESULT: {
    ios: 'ca-app-pub-xxxxx/interstitial-result-ios',
    android: 'ca-app-pub-xxxxx/interstitial-result-android',
  },
  HISTORY_BANNER: {
    ios: 'ca-app-pub-xxxxx/banner-history-ios',
    android: 'ca-app-pub-xxxxx/banner-history-android',
  },
} as const;

export const shouldShowAd = (isPremium: boolean, featureAccess: string): boolean => {
  // Premium users never see ads
  if (isPremium) return false;

  // Freemium users see ads in certain contexts
  const adEnabledFeatures = [
    'oracle_loading',
    'reading_result',
    'history_list',
  ];

  return adEnabledFeatures.includes(featureAccess);
};

export const loadBannerAd = async (adUnit: string): Promise<boolean> => {
  // Placeholder - real implementation with expo-ads-admob
  /*
  import { AdMobBanner } from 'expo-ads-admob';

  return new Promise((resolve) => {
    try {
      // Banner ad setup
      resolve(true);
    } catch (error) {
      console.error('Ad load error:', error);
      resolve(false);
    }
  });
  */

  console.log('Loading banner ad:', adUnit);
  return true;
};

export const loadInterstitialAd = async (adUnit: string): Promise<boolean> => {
  // Placeholder - real implementation
  /*
  import { AdMobInterstitial } from 'expo-ads-admob';

  await AdMobInterstitial.setAdUnitID(adUnit);
  await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
  await AdMobInterstitial.showAdAsync();
  */

  console.log('Loading interstitial ad:', adUnit);
  return true;
};

export const getAdCopy = (): string => {
  const copies = [
    'Daha fazla içeriğe ulaşmak için geliştirme çalışmalarına katkıda bulunuyorsun 🌟',
    'Bu reklam sayesinde CohenDad\'i geliştirmeye devam ediyoruz 💜',
    'Freemium kullanıcılarımız sayesinde uygulamayı daha iyi yapıyoruz ✨',
    'Premium\'a geçerek reklamsız deneyim yaşayabilirsin 👑',
  ];

  return copies[Math.floor(Math.random() * copies.length)];
};

/**
 * Ad Display Strategy:
 *
 * 1. ORACLE LOADING - Banner ad while cards are being drawn
 *    - Position: Bottom of screen
 *    - Duration: 3-5 seconds (oracle loading time)
 *    - Copy: "Daha fazla içeriğe ulaşmak için..."
 *
 * 2. READING RESULT - Interstitial after viewing result
 *    - Frequency: After every 3rd reading
 *    - Skippable: After 5 seconds
 *    - Copy: "Premium'a geç, reklamsız deneyim"
 *
 * 3. HISTORY LIST - Banner at bottom
 *    - Position: Fixed bottom
 *    - Non-intrusive
 *    - Copy: Rotating motivational messages
 */

export const AD_FREQUENCY = {
  INTERSTITIAL_AFTER_READINGS: 3, // Show after every 3 readings
  BANNER_REFRESH_SECONDS: 60, // Refresh banner every 60 seconds
} as const;
