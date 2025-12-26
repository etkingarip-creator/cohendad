import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { ANALYTICS_EVENTS } from '../../utils/constants';

const HookScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleContinue = () => {
    // Track analytics event (will implement analytics service later)
    // trackEvent(ANALYTICS_EVENTS.HOOK_VIEWED);
    navigation.navigate('Intentions' as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>✨</Text>
          <Text style={styles.title}>Hoş Geldin, Ruh Gezgini</Text>
        </View>

        {/* Philosophy */}
        <View style={styles.philosophyCard}>
          <Text style={styles.philosophyText}>
            "Evren sana mesajlar gönderir.{'\n'}
            Kartlar sadece bir araçtır.{'\n'}
            Asıl güç, senin içinde."
          </Text>
          <Text style={styles.philosophyAuthor}>— CohenDad</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <FeatureItem
            emoji="🔮"
            title="Tarot Rehberliği"
            description="Günlük kartlarla enerjini keşfet, gelecek hakkında içgörüler kazan"
          />
          <FeatureItem
            emoji="⭐"
            title="Astroloji Haritası"
            description="Doğum haritanla kozmik yolculuğunu anla"
          />
          <FeatureItem
            emoji="🔢"
            title="Numeroloji Analizi"
            description="Yaşam yolu sayınla kaderine göz at"
          />
          <FeatureItem
            emoji="💭"
            title="Rüya Günlüğü"
            description="Rüyalarını kaydet, bilinçaltını çöz"
          />
        </View>

        {/* Mystical Touch */}
        <View style={styles.mysticalBox}>
          <Text style={styles.mysticalText}>
            CohenDad, geleneksel mistisizmi modern AI ile birleştirerek sana özel
            bir rehberlik deneyimi sunar.
          </Text>
        </View>
      </ScrollView>

      {/* CTA Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaButton} onPress={handleContinue}>
          <Text style={styles.ctaButtonText}>Yolculuğa Başla</Text>
          <Text style={styles.ctaButtonEmoji}>→</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          İlk 7 gün tamamen ücretsiz ✨
        </Text>
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
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    fontSize: 28,
  },
  philosophyCard: {
    backgroundColor: colors.background.modal,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.medium,
    marginBottom: spacing.xl,
  },
  philosophyText: {
    ...typography.bodyLarge,
    color: colors.text.primary,
    textAlign: 'center',
    lineHeight: 28,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  philosophyAuthor: {
    ...typography.caption,
    color: colors.text.accent,
    textAlign: 'center',
    fontWeight: '600',
  },
  featuresSection: {
    marginBottom: spacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.text.muted,
    lineHeight: 20,
  },
  mysticalBox: {
    backgroundColor: colors.primary.purple + '20',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple + '40',
  },
  mysticalText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ctaButtonText: {
    ...typography.button,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  ctaButtonEmoji: {
    fontSize: 18,
    color: colors.text.primary,
  },
  footerNote: {
    ...typography.caption,
    color: colors.text.accent,
    textAlign: 'center',
  },
});

export default HookScreen;
