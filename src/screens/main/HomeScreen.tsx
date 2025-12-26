import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useUser } from '../../contexts/UserContext';
import { usePremium } from '../../contexts/PremiumContext';
import { drawCards } from '../../services/tarot/tarotEngine';
import { DrawnCard } from '../../types';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userData, incrementStreak } = useUser();
  const { isPremium, dailyReadingsRemaining } = usePremium();

  const [dailyCard, setDailyCard] = useState<DrawnCard | null>(null);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDrawDailyCard = () => {
    const cards = drawCards(1);
    setDailyCard(cards[0]);
    setHasDrawnToday(true);
    incrementStreak();
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi günler';
    return 'İyi akşamlar';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.greeting}>{getGreeting()}, {userData?.name || 'Ruh Gezgini'} 🌙</Text>
          {userData?.streak ? (
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>🔥 {userData.streak} gün streak</Text>
            </View>
          ) : null}
        </Animated.View>

        {/* Daily Card Section */}
        <View style={styles.dailyCardSection}>
          <Text style={styles.sectionTitle}>Günlük Enerji Kartın</Text>

          {!hasDrawnToday ? (
            <TouchableOpacity style={styles.drawCardButton} onPress={handleDrawDailyCard}>
              <Text style={styles.drawCardEmoji}>🔮</Text>
              <Text style={styles.drawCardText}>Bugünün Kartını Çek</Text>
              <Text style={styles.drawCardSubtext}>
                {dailyReadingsRemaining > 0
                  ? `${dailyReadingsRemaining} okuma hakkın kaldı`
                  : 'Premium ile sınırsız erişim'
                }
              </Text>
            </TouchableOpacity>
          ) : dailyCard ? (
            <View style={styles.cardDisplay}>
              <Text style={styles.cardEmoji}>🃏</Text>
              <Text style={styles.cardName}>
                {dailyCard.card.name.tr} {dailyCard.isReversed ? '(Ters)' : ''}
              </Text>
              <Text style={styles.cardMeaning}>
                {dailyCard.isReversed
                  ? dailyCard.card.meanings.reversed.tr
                  : dailyCard.card.meanings.upright.tr
                }
              </Text>
            </View>
          ) : null}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Hızlı Erişim</Text>

          <View style={styles.actionGrid}>
            <ActionCard
              emoji="🔮"
              title="Tarot Okuması"
              subtitle="Kartlardan mesaj al"
              onPress={() => navigation.navigate('TarotReading' as never)}
            />
            <ActionCard
              emoji="⭐"
              title="Astroloji"
              subtitle="Natal chart'ın"
              onPress={() => navigation.navigate('Astrology' as never)}
              isPremium={!isPremium}
            />
            <ActionCard
              emoji="🔢"
              title="Numeroloji"
              subtitle="Sayıların gücü"
              onPress={() => navigation.navigate('Numerology' as never)}
            />
            <ActionCard
              emoji="💭"
              title="Rüya Günlüğü"
              subtitle="Rüyalarını kaydet"
              onPress={() => navigation.navigate('DreamJournal' as never)}
            />
            <ActionCard
              emoji="📊"
              title="Özel Raporlar"
              subtitle="Detaylı analizler"
              onPress={() => navigation.navigate('ProductStore' as never)}
            />
          </View>
        </View>

        {/* Daily Rituals */}
        <View style={styles.ritualsSection}>
          <Text style={styles.sectionTitle}>Günlük Ritüeller 🌙</Text>
          <View style={styles.ritualCards}>
            <TouchableOpacity
              style={styles.ritualCard}
              onPress={() => navigation.navigate('MorningRitual' as never)}
            >
              <Text style={styles.ritualEmoji}>🌅</Text>
              <Text style={styles.ritualTitle}>Sabah Ritüeli</Text>
              <Text style={styles.ritualSubtitle}>Bugünün enerjisi</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.ritualCard}
              onPress={() => navigation.navigate('EveningRitual' as never)}
            >
              <Text style={styles.ritualEmoji}>🌙</Text>
              <Text style={styles.ritualTitle}>Akşam Ritüeli</Text>
              <Text style={styles.ritualSubtitle}>Gün değerlendirmesi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Insights */}
        {!isPremium && (
          <TouchableOpacity
            style={styles.premiumBanner}
            onPress={() => navigation.navigate('Paywall' as never, { trigger: 'home_banner' } as never)}
          >
            <Text style={styles.premiumEmoji}>👑</Text>
            <View style={styles.premiumContent}>
              <Text style={styles.premiumTitle}>Premium'a Geç</Text>
              <Text style={styles.premiumSubtitle}>
                Sınırsız okuma, AI chat ve daha fazlası
              </Text>
            </View>
            <Text style={styles.premiumArrow}>→</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

interface ActionCardProps {
  emoji: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  isPremium?: boolean;
}

const ActionCard: React.FC<ActionCardProps> = ({ emoji, title, subtitle, onPress, isPremium }) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress}>
    {isPremium && <View style={styles.premiumLock}><Text>🔒</Text></View>}
    <Text style={styles.actionEmoji}>{emoji}</Text>
    <Text style={styles.actionTitle}>{title}</Text>
    <Text style={styles.actionSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  greeting: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  streakBadge: {
    backgroundColor: colors.primary.gold + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.primary.gold + '40',
  },
  streakText: {
    ...typography.caption,
    color: colors.primary.gold,
    fontWeight: '600',
  },
  dailyCardSection: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  drawCardButton: {
    backgroundColor: colors.background.modal,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary.purple,
    alignItems: 'center',
  },
  drawCardEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  drawCardText: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  drawCardSubtext: {
    ...typography.caption,
    color: colors.text.muted,
  },
  cardDisplay: {
    backgroundColor: colors.background.modal,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  cardName: {
    ...typography.h2,
    color: colors.text.accent,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  cardMeaning: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  quickActions: {
    marginBottom: spacing.xl,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    position: 'relative',
  },
  premiumLock: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  actionTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.text.muted,
  },
  premiumBanner: {
    backgroundColor: colors.primary.purple + '20',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  premiumContent: {
    flex: 1,
  },
  premiumTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  premiumSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  premiumArrow: {
    ...typography.h2,
    color: colors.primary.purple,
  },
  ritualsSection: {
    marginBottom: spacing.xl,
  },
  ritualCards: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  ritualCard: {
    flex: 1,
    backgroundColor: colors.background.modal,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple + '40',
    alignItems: 'center',
  },
  ritualEmoji: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  ritualTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  ritualSubtitle: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 11,
    textAlign: 'center',
  },
});

export default HomeScreen;
