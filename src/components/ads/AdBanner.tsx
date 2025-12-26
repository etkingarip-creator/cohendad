import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { usePremium } from '../../contexts/PremiumContext';
import { getAdCopy } from '../../services/ads/googleAds';

interface AdBannerProps {
  position?: 'top' | 'bottom';
}

const AdBanner: React.FC<AdBannerProps> = ({ position = 'bottom' }) => {
  const { isPremium } = usePremium();

  // Don't show ads to premium users
  if (isPremium) return null;

  return (
    <View style={[
      styles.container,
      position === 'top' ? styles.containerTop : styles.containerBottom
    ]}>
      {/* Ad Placeholder - Will be replaced with real AdMob banner */}
      <View style={styles.adPlaceholder}>
        <Text style={styles.adLabel}>REKLAM</Text>
        <Text style={styles.adCopy}>{getAdCopy()}</Text>
      </View>

      {/* Real implementation with expo-ads-admob:
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID={Platform.OS === 'ios' ? AD_UNITS.ORACLE_LOADING.ios : AD_UNITS.ORACLE_LOADING.android}
        servePersonalizedAds={true}
        onDidFailToReceiveAdWithError={(error) => console.error('Ad error:', error)}
      />
      */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.background.dark,
    borderColor: colors.border.light,
  },
  containerTop: {
    borderBottomWidth: 1,
  },
  containerBottom: {
    borderTopWidth: 1,
  },
  adPlaceholder: {
    height: 60,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.sm,
  },
  adLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.text.muted,
    marginBottom: 4,
  },
  adCopy: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});

export default AdBanner;
