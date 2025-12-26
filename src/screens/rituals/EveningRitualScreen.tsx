import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useUser } from '../../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface JournalPrompt {
  emoji: string;
  question: string;
  placeholder: string;
  category: 'emotion' | 'shadow' | 'archetype' | 'intention';
}

const JOURNAL_PROMPTS: JournalPrompt[] = [
  {
    emoji: '💭',
    question: 'Bugün hangi duygu en çok öne çıktı?',
    placeholder: 'Örn: Huzursuzluk, sevinç, öfke...',
    category: 'emotion',
  },
  {
    emoji: '🌑',
    question: 'Gölge yanın (shadow) bugün neyi gösterdi?',
    placeholder: 'Hangi bastırılmış yönün ortaya çıktı?',
    category: 'shadow',
  },
  {
    emoji: '🎭',
    question: 'Hangi arketip bugün aktif oldu?',
    placeholder: 'Kahraman, Kurban, Bilge, Gölge...',
    category: 'archetype',
  },
  {
    emoji: '✨',
    question: 'Yarın için içsel niyetin ne?',
    placeholder: 'Kendime şu konuda daha nazik olacağım...',
    category: 'intention',
  },
];

const EveningRitualScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userData } = useUser();

  const [morningCard, setMorningCard] = useState<any>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    loadMorningCard();
    checkIfCompletedToday();
  }, []);

  const loadMorningCard = async () => {
    const savedCard = await AsyncStorage.getItem('morning_ritual_card');
    if (savedCard) {
      setMorningCard(JSON.parse(savedCard));
    }
  };

  const checkIfCompletedToday = async () => {
    const today = new Date().toISOString().split('T')[0];
    const lastCompleted = await AsyncStorage.getItem('evening_ritual_last_completed');

    if (lastCompleted === today) {
      const savedResponses = await AsyncStorage.getItem('evening_ritual_responses');
      if (savedResponses) {
        setResponses(JSON.parse(savedResponses));
        setCompleted(true);
      }
    }
  };

  const handleResponseChange = (promptIndex: number, text: string) => {
    setResponses(prev => ({
      ...prev,
      [promptIndex]: text,
    }));
  };

  const handleNext = () => {
    if (currentPromptIndex < JOURNAL_PROMPTS.length - 1) {
      setCurrentPromptIndex(currentPromptIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPromptIndex > 0) {
      setCurrentPromptIndex(currentPromptIndex - 1);
    }
  };

  const handleComplete = async () => {
    // Save responses
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem('evening_ritual_last_completed', today);
    await AsyncStorage.setItem('evening_ritual_responses', JSON.stringify(responses));

    setCompleted(true);

    Alert.alert(
      '🌙 Tamamlandı!',
      'Bugünü yansıttın, bilinçaltınla iletişim kurdun. CohenDad seninle gurur duyuyor.',
      [{ text: 'Tamam' }]
    );
  };

  const getCohenDadReflection = (): string => {
    const reflections = [
      `${userData?.name || 'Sevgili dostum'}, bugünü yansıtmak için zaman ayırdın. Bu kendine verdiğin en değerli hediye. Yargılamadan kabul ediyorsun - bu Fromm'un dediği "self-love" (öz sevgi) işte.`,
      'Her akşam bilinçaltınla bu şekilde iletişim kurmak, Jung\'un dediği "bireyselleşme" yolunda büyük bir adım. Kendini tanıyorsun, kendini kabul ediyorsun.',
      'Gölge çalışması yapmak cesaret ister. Sen bugün o cesareti gösterdin. Karanlık yönünü kabul etmek, aydınlanmanın ilk adımı.',
      'Freud der ki: "Bilinçaltını bilinçli hale getirmeyen insan, ona kader der." Sen bugün kaderini yazmaya başladın.',
    ];
    return reflections[Math.floor(Math.random() * reflections.length)];
  };

  if (completed) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.completedEmoji}>🌙✨</Text>
            <Text style={styles.completedTitle}>Akşam Ritüeli Tamamlandı</Text>
            <Text style={styles.completedSubtitle}>
              Bugünü yansıttın, kendini dinledin
            </Text>
          </View>

          {/* CohenDad Reflection */}
          <View style={styles.cohenDadCard}>
            <Text style={styles.cohenDadEmoji}>🔮</Text>
            <Text style={styles.cohenDadText}>{getCohenDadReflection()}</Text>
            <Text style={styles.cohenDadSignature}>— CohenDad</Text>
          </View>

          {/* Summary */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Bugünün Özeti</Text>
            {JOURNAL_PROMPTS.map((prompt, index) => {
              const response = responses[index];
              if (!response || response.trim() === '') return null;

              return (
                <View key={index} style={styles.summaryItem}>
                  <Text style={styles.summaryEmoji}>{prompt.emoji}</Text>
                  <View style={styles.summaryContent}>
                    <Text style={styles.summaryQuestion}>{prompt.question}</Text>
                    <Text style={styles.summaryAnswer}>{response}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home' as never)}
          >
            <Text style={styles.homeButtonText}>Ana Sayfaya Dön</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  const currentPrompt = JOURNAL_PROMPTS[currentPromptIndex];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>İyi akşamlar, {userData?.name || 'Ruh Gezgini'} 🌙</Text>
          <Text style={styles.subtitle}>Gün değerlendirmesi zamanı</Text>
        </View>

        {/* Morning Card Reminder */}
        {morningCard && (
          <View style={styles.morningCardReminder}>
            <Text style={styles.reminderTitle}>Sabahki kartın: {morningCard.card.name.tr}</Text>
            <Text style={styles.reminderText}>
              Bu kart bugün nasıl yansıdı? Neyi hatırlattı?
            </Text>
          </View>
        )}

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Soru {currentPromptIndex + 1} / {JOURNAL_PROMPTS.length}
          </Text>
          <View style={styles.progressBar}>
            {JOURNAL_PROMPTS.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentPromptIndex && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Current Question */}
        <View style={styles.questionCard}>
          <Text style={styles.questionEmoji}>{currentPrompt.emoji}</Text>
          <Text style={styles.questionText}>{currentPrompt.question}</Text>

          <TextInput
            style={styles.responseInput}
            placeholder={currentPrompt.placeholder}
            placeholderTextColor={colors.text.muted}
            value={responses[currentPromptIndex] || ''}
            onChangeText={(text) => handleResponseChange(currentPromptIndex, text)}
            multiline
            numberOfLines={4}
            autoFocus
          />

          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{getCategoryLabel(currentPrompt.category)}</Text>
          </View>
        </View>

        {/* Shadow Work Tip */}
        {currentPrompt.category === 'shadow' && (
          <View style={styles.tipCard}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>
              Jung'un dediği gibi: "Gölge, kendimize kabul etmediğimiz yönlerimizdir.
              Onu kabul etmek, onu dönüştürmektir."
            </Text>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentPromptIndex > 0 && (
            <TouchableOpacity style={styles.navButton} onPress={handlePrevious}>
              <Text style={styles.navButtonText}>← Önceki</Text>
            </TouchableOpacity>
          )}

          <View style={{ flex: 1 }} />

          {currentPromptIndex < JOURNAL_PROMPTS.length - 1 ? (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonPrimary]}
              onPress={handleNext}
            >
              <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>
                Sonraki →
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.navButtonPrimary]}
              onPress={handleComplete}
            >
              <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>
                Tamamla ✓
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const getCategoryLabel = (category: JournalPrompt['category']): string => {
  const labels: Record<JournalPrompt['category'], string> = {
    emotion: 'Duygu Farkındalığı',
    shadow: 'Gölge Çalışması',
    archetype: 'Arketipsel Analiz',
    intention: 'Niyet Belirleme',
  };
  return labels[category];
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
  greeting: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.muted,
  },
  morningCardReminder: {
    backgroundColor: colors.primary.gold + '15',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.gold + '30',
    marginBottom: spacing.lg,
  },
  reminderTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  reminderText: {
    ...typography.caption,
    color: colors.text.muted,
    lineHeight: 18,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressText: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border.light,
  },
  progressDotActive: {
    backgroundColor: colors.primary.purple,
  },
  questionCard: {
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.lg,
  },
  questionEmoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  questionText: {
    ...typography.h2,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  responseInput: {
    backgroundColor: colors.background.dark,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
    color: colors.text.primary,
    ...typography.body,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  categoryBadge: {
    backgroundColor: colors.primary.purple + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'center',
  },
  categoryText: {
    ...typography.caption,
    color: colors.primary.purple,
    fontSize: 11,
  },
  tipCard: {
    backgroundColor: colors.accent.ethereal + '15',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent.ethereal + '30',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  tipText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  navButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.card,
  },
  navButtonPrimary: {
    backgroundColor: colors.primary.purple,
    borderColor: colors.primary.purple,
  },
  navButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
  navButtonTextPrimary: {
    color: colors.background.dark,
  },
  completedEmoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  completedTitle: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  completedSubtitle: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
  },
  cohenDadCard: {
    backgroundColor: colors.primary.purple + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple + '30',
    marginBottom: spacing.xl,
  },
  cohenDadEmoji: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  cohenDadText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  cohenDadSignature: {
    ...typography.caption,
    color: colors.primary.purple,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  summarySection: {
    marginBottom: spacing.xl,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.md,
  },
  summaryEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  summaryContent: {
    flex: 1,
  },
  summaryQuestion: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  summaryAnswer: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  homeButton: {
    backgroundColor: colors.background.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignSelf: 'center',
  },
  homeButtonText: {
    ...typography.button,
    color: colors.primary.purple,
  },
});

export default EveningRitualScreen;
