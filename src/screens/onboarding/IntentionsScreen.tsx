import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { Intention } from '../../types';
import { useUser } from '../../contexts/UserContext';

interface IntentionOption {
  id: Intention;
  emoji: string;
  title: string;
  description: string;
}

const INTENTION_OPTIONS: IntentionOption[] = [
  {
    id: 'tarot',
    emoji: '🔮',
    title: 'Tarot Rehberliği',
    description: 'Günlük kartlar ve detaylı okumalar',
  },
  {
    id: 'astrology',
    emoji: '⭐',
    title: 'Astroloji',
    description: 'Doğum haritası ve transit analizleri',
  },
  {
    id: 'numerology',
    emoji: '🔢',
    title: 'Numeroloji',
    description: 'Yaşam yolu ve kişisel sayılar',
  },
  {
    id: 'dreams',
    emoji: '💭',
    title: 'Rüya Yorumu',
    description: 'Rüyalarını kaydet ve analiz et',
  },
];

const IntentionsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { setIntentions } = useUser();
  const [selected, setSelected] = useState<Intention[]>([]);

  const toggleIntention = (intention: Intention) => {
    setSelected((prev) =>
      prev.includes(intention)
        ? prev.filter((i) => i !== intention)
        : [...prev, intention]
    );
  };

  const handleContinue = async () => {
    if (selected.length === 0) return;

    try {
      await setIntentions(selected);
      navigation.navigate('Auth' as never);
    } catch (error) {
      console.error('Error saving intentions:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Neler İlgini Çekiyor?</Text>
          <Text style={styles.subtitle}>
            En az bir alan seç, deneyimini kişiselleştirelim
          </Text>
        </View>

        {/* Intention Cards */}
        <View style={styles.optionsContainer}>
          {INTENTION_OPTIONS.map((option) => {
            const isSelected = selected.includes(option.id);

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => toggleIntention(option.id)}
                activeOpacity={0.7}
              >
                <View style={styles.optionHeader}>
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Text style={styles.checkmarkText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionDescription}>{option.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Endişelenme, daha sonra tüm özelliklere erişebilirsin
          </Text>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueButton, selected.length === 0 && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={selected.length === 0}
        >
          <Text style={styles.continueButtonText}>
            Devam Et ({selected.length} seçildi)
          </Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 120,
  },
  header: {
    marginTop: spacing.xl,
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
    lineHeight: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  optionCard: {
    width: '47%',
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: colors.primary.purple,
    backgroundColor: colors.primary.purple + '15',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  optionEmoji: {
    fontSize: 40,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  optionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    fontSize: 16,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    ...typography.caption,
    color: colors.text.muted,
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: colors.primary.gold + '15',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary.gold + '30',
  },
  infoText: {
    ...typography.caption,
    color: colors.text.accent,
    textAlign: 'center',
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
  continueButton: {
    backgroundColor: colors.primary.purple,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: colors.text.muted,
    opacity: 0.5,
  },
  continueButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
});

export default IntentionsScreen;
