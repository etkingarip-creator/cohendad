import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';

type RouteParams = {
  Paywall: {
    trigger?: string;
  };
};

const PaywallScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'Paywall'>>();
  const { trigger } = route.params || {};

  const getTriggerMessage = (): string => {
    switch (trigger) {
      case 'daily_limit':
        return 'Günlük ücretsiz okuma limitine ulaştın 😊';
      case 'ai_chat':
        return 'AI Chat sadece Premium üyeler için';
      case 'advanced_spreads':
        return 'Gelişmiş yayılımlar Premium özelliğidir';
      case 'home_banner':
        return 'Sınırsız mistik deneyim seni bekliyor';
      default:
        return 'Premium\'la Sınırları Aş 👑';
    }
  };

  const handleUpgrade = () => {
    navigation.navigate('SubscriptionPlans' as never);
  };

  const handleDismiss = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>👑</Text>
          <Text style={styles.title}>{getTriggerMessage()}</Text>
          <Text style={styles.subtitle}>
            Premium'a geç, mistik dünyayı sınırsız keşfet
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <FeatureItem
            emoji="🔮"
            title="Sınırsız Tarot Okuması"
            description="Günlük limit yok, dilediğin kadar kart çek"
          />
          <FeatureItem
            emoji="🤖"
            title="AI Chat - CohenDad"
            description="Mistik rehberle birebir sohbet et"
          />
          <FeatureItem
            emoji="✨"
            title="Tüm Yayılımlar"
            description="Celtic Cross, İlişki, Kariyer ve daha fazlası"
          />
          <FeatureItem
            emoji="⭐"
            title="Detaylı Astroloji"
            description="Natal chart, transits, progressions"
          />
          <FeatureItem
            emoji="💭"
            title="AI Rüya Analizi"
            description="Rüyalarını derin bir şekilde çöz"
          />
          <FeatureItem
            emoji="📊"
            title="Haftalık Raporlar"
            description="Kişiselleştirilmiş deep dive insights"
          />
          <FeatureItem
            emoji="🚫"
            title="Reklamsız Deneyim"
            description="Hiç kesinti olmadan keşfet"
          />
          <FeatureItem
            emoji="🎁"
            title="Erken Erişim"
            description="Yeni özelliklere ilk sen ulaş"
          />
        </View>

        {/* Social Proof */}
        <View style={styles.socialProof}>
          <Text style={styles.socialProofEmoji}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.socialProofText}>
            "CohenDad hayatımı değiştirdi. Premium'a geçmek en iyi kararımdı!"
          </Text>
          <Text style={styles.socialProofAuthor}>— Zeynep, Premium Üye</Text>
        </View>

        {/* Pricing Preview */}
        <View style={styles.pricingPreview}>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Aylık</Text>
            <Text style={styles.pricingValue}>$9.99/ay</Text>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Yıllık</Text>
            <Text style={styles.pricingValue}>$59.99/yıl</Text>
            <View style={styles.savingsBadge}>
              <Text style={styles.savingsText}>%50 tasarruf</Text>
            </View>
          </View>
          <View style={styles.pricingRow}>
            <Text style={styles.pricingLabel}>Lifetime</Text>
            <Text style={styles.pricingValue}>$199.99</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaButton} onPress={handleUpgrade}>
          <Text style={styles.ctaButtonText}>Premium'a Geç 🚀</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>7 gün ücretsiz dene, istediğin zaman iptal et</Text>
      </View>
    </View>
  );
};

interface FeatureItemProps {
  emoji: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ emoji, title, description }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <View style={styles.featureContent}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
    <Text style={styles.featureCheck}>✓</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 140,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  closeText: {
    ...typography.h3,
    color: colors.text.muted,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    fontSize: 26,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
  },
  featuresSection: {
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.sm,
  },
  featureEmoji: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...typography.h3,
    fontSize: 15,
    color: colors.text.primary,
    marginBottom: 2,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 12,
  },
  featureCheck: {
    fontSize: 20,
    color: colors.primary.purple,
    marginLeft: spacing.sm,
  },
  socialProof: {
    backgroundColor: colors.primary.purple + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple + '30',
    marginBottom: spacing.xl,
  },
  socialProofEmoji: {
    fontSize: 20,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  socialProofText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    lineHeight: 22,
  },
  socialProofAuthor: {
    ...typography.caption,
    color: colors.text.accent,
    textAlign: 'center',
  },
  pricingPreview: {
    backgroundColor: colors.background.modal,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  pricingLabel: {
    ...typography.body,
    color: colors.text.secondary,
  },
  pricingValue: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.accent,
  },
  savingsBadge: {
    backgroundColor: colors.accent.ethereal + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  savingsText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.accent.ethereal,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.background.dark,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  ctaButton: {
    backgroundColor: colors.primary.purple,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ctaButtonText: {
    ...typography.button,
    fontSize: 18,
    color: colors.text.primary,
  },
  footerNote: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
  },
});

export default PaywallScreen;
