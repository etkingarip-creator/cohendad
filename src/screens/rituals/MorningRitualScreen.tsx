import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { drawCards } from '../../services/tarot/tarotEngine';
import { DrawnCard } from '../../types';
import { getDailyCadencePrompt } from '../../services/ai/cohenDadPrompts';
import { useUser } from '../../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShareQuoteModal from '../../components/share/ShareQuoteModal';

const MorningRitualScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, userData, incrementStreak } = useUser();

  const [card, setCard] = useState<DrawnCard | null>(null);
  const [interpretation, setInterpretation] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    checkIfDrawnToday();
  }, []);

  useEffect(() => {
    if (card) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [card]);

  const checkIfDrawnToday = async () => {
    const today = new Date().toISOString().split('T')[0];
    const lastDrawn = await AsyncStorage.getItem('morning_ritual_last_drawn');

    if (lastDrawn === today) {
      const savedCard = await AsyncStorage.getItem('morning_ritual_card');
      const savedInterpretation = await AsyncStorage.getItem('morning_ritual_interpretation');

      if (savedCard && savedInterpretation) {
        setCard(JSON.parse(savedCard));
        setInterpretation(savedInterpretation);
        setHasDrawnToday(true);
      }
    }
  };

  const handleDrawCard = async () => {
    setLoading(true);

    // Draw card
    const drawnCards = drawCards(1);
    const morningCard = drawnCards[0];
    setCard(morningCard);

    // Generate CohenDad interpretation
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI generation
    const prompt = getDailyCadencePrompt('morning', morningCard);

    // In production, this would call OpenAI via Cloud Function
    const mockInterpretation = generateMorningInterpretation(morningCard);
    setInterpretation(mockInterpretation);

    // Save to AsyncStorage
    const today = new Date().toISOString().split('T')[0];
    await AsyncStorage.setItem('morning_ritual_last_drawn', today);
    await AsyncStorage.setItem('morning_ritual_card', JSON.stringify(morningCard));
    await AsyncStorage.setItem('morning_ritual_interpretation', mockInterpretation);

    setHasDrawnToday(true);
    incrementStreak();
    setLoading(false);
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    const name = userData?.name || 'Ruh Gezgini';

    if (hour < 6) return `Erken kalkmışsın, ${name} 🌙`;
    if (hour < 12) return `Günaydın, ${name} ☀️`;
    return `İyi günler, ${name} 🌤️`;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.subtitle}>
            {hasDrawnToday ? 'Bugünün enerjisi sana hazır' : 'Sabah ritüeline hoş geldin'}
          </Text>
        </View>

        {/* Ritual Info */}
        {!hasDrawnToday && (
          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>🌅</Text>
            <Text style={styles.infoText}>
              Her sabah CohenDad, Jung arketipleri perspektifinden senin için bir kart
              çekiyor. Bu kart, bugünün enerjisini ve içsel fırsatlarını gösterecek.
            </Text>
          </View>
        )}

        {/* Card Display or Draw Button */}
        {!card ? (
          <TouchableOpacity
            style={styles.drawButton}
            onPress={handleDrawCard}
            disabled={loading}
          >
            {loading ? (
              <>
                <ActivityIndicator size="large" color={colors.background.dark} />
                <Text style={[styles.drawButtonText, { marginTop: spacing.md }]}>
                  CohenDad hazırlıyor...
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.drawButtonEmoji}>🔮</Text>
                <Text style={styles.drawButtonText}>Bugünün Kartını Çek</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <Animated.View
            style={[
              styles.cardContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.cardDisplay}>
              <Text style={styles.cardEmoji}>🃏</Text>
              <Text style={styles.cardName}>
                {card.card.name.tr}
                {card.isReversed && <Text style={styles.reversed}> (Ters)</Text>}
              </Text>
              <View style={styles.keywordsContainer}>
                {card.card.keywords.tr.slice(0, 3).map((keyword, index) => (
                  <View key={index} style={styles.keywordBadge}>
                    <Text style={styles.keywordText}>{keyword}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* CohenDad Interpretation */}
            {interpretation && (
              <View style={styles.interpretationCard}>
                <View style={styles.interpretationHeader}>
                  <Text style={styles.interpretationEmoji}>🔮</Text>
                  <Text style={styles.interpretationTitle}>CohenDad'dan Sabah Mesajı</Text>
                </View>
                <Text style={styles.interpretationText}>{interpretation}</Text>
              </View>
            )}

            {/* Daily Intention */}
            <View style={styles.intentionCard}>
              <Text style={styles.intentionTitle}>💫 Bugünün Niyeti</Text>
              <Text style={styles.intentionText}>
                {generateDailyIntention(card)}
              </Text>
              <Text style={styles.intentionPrompt}>
                (Bu niyeti bugün boyunca hatırla)
              </Text>
            </View>

            {/* Practical Action */}
            <View style={styles.actionCard}>
              <Text style={styles.actionTitle}>🌱 Bugün Dene</Text>
              <Text style={styles.actionText}>
                {generatePracticalAction(card)}
              </Text>
            </View>
          </Animated.View>
        )}

        {/* Footer */}
        {hasDrawnToday && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Akşam, bugünü birlikte değerlendireceğiz 🌙
            </Text>
            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() => setShareModalVisible(true)}
              >
                <Text style={styles.footerButtonText}>📤 Paylaş</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.footerButton, styles.footerButtonPrimary]}
                onPress={() => navigation.navigate('Home' as never)}
              >
                <Text style={[styles.footerButtonText, styles.footerButtonTextPrimary]}>
                  Ana Sayfa
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Share Quote Modal */}
      {card && (
        <ShareQuoteModal
          visible={shareModalVisible}
          onClose={() => setShareModalVisible(false)}
          card={card}
          interpretation={interpretation}
          type="daily"
        />
      )}
    </View>
  );
};

// Helper: Generate morning interpretation
const generateMorningInterpretation = (card: DrawnCard): string => {
  const cardName = card.card.name.tr;
  const isReversed = card.isReversed;

  const archetypes = [
    `${cardName}, Jung'un "Gölge" arketipini uyandırıyor. Bugün içindeki karanlık yönlerle yüzleşme şansı var. Korkma, gölge aydınlanmanın kapısıdır.`,
    `Bu sabah "Kahraman Yolculuğu"na çıkıyorsun. ${cardName} sana cesaret veriyor. Eski benliğin ölüyor, yeni benlik doğuyor.`,
    `"Bilge" arketipi bugün seni çağırıyor. ${cardName} ile içsel bilgeliğini dinle. Her şey zaten içinde, sadece dinlemen gerek.`,
    `"Anima/Animus" enerjisi aktif. ${cardName} ile içindeki dişil ve eril dengeyi kur. Bütünleşme zamanı.`,
    `Kolektif bilinçaltından bir mesaj: ${cardName}. Atalarının bilgeliği bugün seninle.`,
  ];

  const selected = archetypes[Math.floor(Math.random() * archetypes.length)];

  const extra = isReversed
    ? '\n\nKartın ters pozisyonda - bu, içsel direncini gösteriyor. Neye karşı koyuyorsun? Bu direnç aslında bir öğretmen.'
    : '\n\nBu enerjiyi bugün kullan. Evren sana bir hediye sunuyor.';

  return selected + extra + '\n\n— CohenDad ☀️';
};

// Helper: Generate daily intention
const generateDailyIntention = (card: DrawnCard): string => {
  const intentions = [
    'Bugün bilinçaltımı dinleyeceğim, yargılamadan kabul edeceğim.',
    'İçimdeki gölgeyi sevgiyle kucaklayacağım.',
    'Kendime karşı şefkatli olacağım, mükemmel olmama izin vereceğim.',
    'Bugün kendimi authentically ifade edeceğim.',
    'İçsel bilgeliğime güveneceğim ve ona göre hareket edeceğim.',
  ];
  return intentions[Math.floor(Math.random() * intentions.length)];
};

// Helper: Generate practical action
const generatePracticalAction = (card: DrawnCard): string => {
  const actions = [
    'Sabah 5 dakika journaling yap. Bugünkü kartın sana ne hatırlatıyor?',
    '3 derin nefes al. Her nefeste, kartın enerjisini içine çek.',
    'Aynaya bak ve kendine şunu söyle: "Ben yeterince iyiyim, olduğum gibi."',
    'Bugün bir an kendini gözlemle - hangi duygu öne çıkıyor? Sadece gözlemle, yargılama.',
    'Akşam yatmadan önce, bugünün bir "gölge momenti"ni yaz. Kendini kabul et.',
  ];
  return actions[Math.floor(Math.random() * actions.length)];
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
  infoCard: {
    backgroundColor: colors.primary.purple + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple + '30',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  infoEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  drawButton: {
    backgroundColor: colors.primary.purple,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  drawButtonEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  drawButtonText: {
    ...typography.h2,
    color: colors.background.dark,
  },
  cardContainer: {
    marginBottom: spacing.xl,
  },
  cardDisplay: {
    backgroundColor: colors.background.modal,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary.gold,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardEmoji: {
    fontSize: 80,
    marginBottom: spacing.md,
  },
  cardName: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  reversed: {
    color: colors.text.muted,
    fontSize: 18,
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  keywordBadge: {
    backgroundColor: colors.primary.purple + '30',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  keywordText: {
    ...typography.caption,
    color: colors.primary.purple,
    fontWeight: '600',
  },
  interpretationCard: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.lg,
  },
  interpretationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  interpretationEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  interpretationTitle: {
    ...typography.h3,
    color: colors.text.primary,
  },
  interpretationText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  intentionCard: {
    backgroundColor: colors.accent.ethereal + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent.ethereal + '30',
    marginBottom: spacing.lg,
  },
  intentionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  intentionText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  intentionPrompt: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 11,
    textAlign: 'center',
  },
  actionCard: {
    backgroundColor: colors.primary.gold + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.gold + '30',
  },
  actionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  actionText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  footerText: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  footerButton: {
    flex: 1,
    backgroundColor: colors.background.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  footerButtonPrimary: {
    backgroundColor: colors.primary.purple,
    borderColor: colors.primary.purple,
  },
  footerButtonText: {
    ...typography.button,
    color: colors.primary.purple,
  },
  footerButtonTextPrimary: {
    color: colors.background.dark,
  },
});

export default MorningRitualScreen;
