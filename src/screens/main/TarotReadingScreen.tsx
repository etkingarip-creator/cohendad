import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { usePremium } from '../../contexts/PremiumContext';
import { useUser } from '../../contexts/UserContext';
import { TAROT_SPREADS, Spread } from '../../services/tarot/spreads';
import { drawCards } from '../../services/tarot/tarotEngine';
import { saveReading } from '../../services/firebase/firestore';

const TarotReadingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { isPremium, checkUsageLimit, showPaywall } = usePremium();
  const { userData } = useUser();

  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelectSpread = (spread: Spread) => {
    if (spread.isPremium && !isPremium) {
      showPaywall(`spread_${spread.id}`);
      navigation.navigate('Paywall' as never, { trigger: `spread_${spread.id}` } as never);
      return;
    }

    setSelectedSpread(spread);
  };

  const handleStartReading = async () => {
    if (!selectedSpread) {
      Alert.alert('Hata', 'Lütfen bir yayılım seç');
      return;
    }

    // Check usage limit
    const canRead = await checkUsageLimit('tarot_reading');
    if (!canRead) {
      navigation.navigate('Paywall' as never, { trigger: 'daily_limit' } as never);
      return;
    }

    setLoading(true);
    try {
      // Draw cards
      const drawnCards = drawCards(selectedSpread.cardCount);

      // Save reading to Firestore
      const readingId = await saveReading(userData!.id, {
        spreadType: selectedSpread.id,
        cards: drawnCards,
        question: question || null,
        date: new Date(),
        isFavorite: false,
        aiGenerated: false,
      });

      // Navigate to result
      navigation.navigate('ReadingResult' as never, { readingId } as never);
    } catch (error) {
      Alert.alert('Hata', 'Okuma yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Bir Yayılım Seç 🔮</Text>
          <Text style={styles.subtitle}>
            Her yayılım farklı bir perspektif sunar
          </Text>
        </View>

        {/* Spreads Grid */}
        <View style={styles.spreadsGrid}>
          {TAROT_SPREADS.map((spread) => (
            <TouchableOpacity
              key={spread.id}
              style={[
                styles.spreadCard,
                selectedSpread?.id === spread.id && styles.spreadCardSelected,
              ]}
              onPress={() => handleSelectSpread(spread)}
            >
              {spread.isPremium && !isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>PRO</Text>
                </View>
              )}

              <Text style={styles.spreadEmoji}>{spread.emoji}</Text>
              <Text style={styles.spreadName}>{spread.name.tr}</Text>
              <Text style={styles.spreadDescription}>{spread.description.tr}</Text>

              <View style={styles.spreadMeta}>
                <Text style={styles.spreadMetaText}>{spread.cardCount} kart</Text>
                <Text style={styles.spreadMetaText}>•</Text>
                <Text style={styles.spreadMetaText}>{spread.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Spread Actions */}
        {selectedSpread && (
          <View style={styles.selectedSection}>
            <Text style={styles.sectionTitle}>Sormak istediğin bir soru var mı?</Text>
            <Text style={styles.questionHint}>(İsteğe bağlı - boş bırakabilirsin)</Text>

            {/* Question Input - simplified for now */}
            <View style={styles.questionInput}>
              <Text style={styles.questionPlaceholder}>
                Örn: "Kariyer hayatım nasıl gelişecek?"
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.startButton, loading && styles.buttonDisabled]}
              onPress={handleStartReading}
              disabled={loading}
            >
              <Text style={styles.startButtonText}>
                {loading ? 'Kartlar Çekiliyor...' : 'Kartları Çek'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

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
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.muted,
  },
  spreadsGrid: {
    marginBottom: spacing.xl,
  },
  spreadCard: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: spacing.md,
    position: 'relative',
  },
  spreadCardSelected: {
    borderColor: colors.primary.purple,
    backgroundColor: colors.primary.purple + '10',
  },
  premiumBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.primary.gold,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  premiumBadgeText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.background.dark,
    fontWeight: 'bold',
  },
  spreadEmoji: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  spreadName: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  spreadDescription: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  spreadMeta: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  spreadMetaText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontSize: 12,
  },
  selectedSection: {
    backgroundColor: colors.background.modal,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  questionHint: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.md,
  },
  questionInput: {
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.lg,
    minHeight: 80,
  },
  questionPlaceholder: {
    ...typography.body,
    color: colors.text.muted,
    fontStyle: 'italic',
  },
  startButton: {
    backgroundColor: colors.primary.purple,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  startButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
});

export default TarotReadingScreen;
