import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useUser } from '../../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { drawCards } from '../../services/tarot/tarotEngine';
import { DrawnCard } from '../../types';

interface WeeklyReflection {
  week: string;
  theme: string;
  card: DrawnCard;
  archetypeAnalysis: string;
  subconsciousPattern: string;
  shadowOpportunity: string;
  nextWeekGuidance: string;
  generatedAt: Date;
}

const WeeklyReflectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userData } = useUser();

  const [reflection, setReflection] = useState<WeeklyReflection | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasGeneratedThisWeek, setHasGeneratedThisWeek] = useState(false);

  useEffect(() => {
    checkIfGeneratedThisWeek();
  }, []);

  const checkIfGeneratedThisWeek = async () => {
    const weekNumber = getWeekNumber(new Date());
    const savedWeek = await AsyncStorage.getItem('weekly_reflection_week');

    if (savedWeek === weekNumber.toString()) {
      const savedReflection = await AsyncStorage.getItem('weekly_reflection_data');
      if (savedReflection) {
        setReflection(JSON.parse(savedReflection));
        setHasGeneratedThisWeek(true);
      }
    }
  };

  const handleGenerateReflection = async () => {
    setLoading(true);

    // Draw weekly card
    const drawnCards = drawCards(1);
    const weeklyCard = drawnCards[0];

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2500));

    const newReflection: WeeklyReflection = {
      week: `${getWeekNumber(new Date())}. Hafta`,
      theme: generateWeeklyTheme(weeklyCard),
      card: weeklyCard,
      archetypeAnalysis: generateArchetypeAnalysis(weeklyCard),
      subconsciousPattern: generateSubconsciousPattern(weeklyCard),
      shadowOpportunity: generateShadowOpportunity(weeklyCard),
      nextWeekGuidance: generateNextWeekGuidance(weeklyCard),
      generatedAt: new Date(),
    };

    setReflection(newReflection);

    // Save to AsyncStorage
    const weekNumber = getWeekNumber(new Date());
    await AsyncStorage.setItem('weekly_reflection_week', weekNumber.toString());
    await AsyncStorage.setItem('weekly_reflection_data', JSON.stringify(newReflection));

    setHasGeneratedThisWeek(true);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingEmoji}>🔮</Text>
          <Text style={styles.loadingTitle}>CohenDad Analiz Ediyor...</Text>
          <Text style={styles.loadingText}>
            Bu haftanın arketipsel temasını ve bilinçaltı örüntülerini inceliyor
          </Text>
          <ActivityIndicator
            size="large"
            color={colors.primary.purple}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {hasGeneratedThisWeek ? 'Haftanın Dersi 📅' : 'Haftalık Derinleşme Zamanı'}
          </Text>
          <Text style={styles.subtitle}>
            {userData?.name || 'Ruh Gezgini'}, Jung-Adler-Freud perspektifinden haftalık analiz
          </Text>
        </View>

        {!reflection ? (
          <>
            {/* Info Card */}
            <View style={styles.infoCard}>
              <Text style={styles.infoEmoji}>🌟</Text>
              <Text style={styles.infoText}>
                Her Pazar, CohenDad haftanı analiz ediyor. Arketipsel temayı, bilinçaltı
                örüntülerini ve shadow work fırsatlarını ortaya çıkarıyor. Gelecek hafta
                için içgörüler sunuyor.
              </Text>
            </View>

            {/* Generate Button */}
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerateReflection}>
              <Text style={styles.generateButtonEmoji}>🔮</Text>
              <Text style={styles.generateButtonText}>Haftalık Analizi Oluştur</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Weekly Card */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionLabel}>Haftanın Kartı</Text>
              <View style={styles.cardDisplay}>
                <Text style={styles.cardEmoji}>🃏</Text>
                <Text style={styles.cardName}>
                  {reflection.card.card.name.tr}
                  {reflection.card.isReversed && (
                    <Text style={styles.reversed}> (Ters)</Text>
                  )}
                </Text>
                <Text style={styles.cardTheme}>{reflection.theme}</Text>
              </View>
            </View>

            {/* Archetype Analysis */}
            <ReflectionSection
              emoji="🎭"
              title="Haftanın Arketipsel Teması"
              subtitle="Jung Perspektifi"
              content={reflection.archetypeAnalysis}
            />

            {/* Subconscious Pattern */}
            <ReflectionSection
              emoji="💭"
              title="Bilinçaltı Örüntü"
              subtitle="Freud Perspektifi"
              content={reflection.subconsciousPattern}
            />

            {/* Shadow Work */}
            <ReflectionSection
              emoji="🌑"
              title="Shadow Work Fırsatı"
              subtitle="Jung + Freud"
              content={reflection.shadowOpportunity}
            />

            {/* Next Week Guidance */}
            <ReflectionSection
              emoji="🧭"
              title="Gelecek Hafta İçin İçgörü"
              subtitle="Adler + Fromm Perspektifi"
              content={reflection.nextWeekGuidance}
            />

            {/* CohenDad Closing */}
            <View style={styles.closingCard}>
              <Text style={styles.closingEmoji}>🔮</Text>
              <Text style={styles.closingText}>
                Bu hafta kendini gözlemle, yargılama. Her fark edilme bir hediye.
                Gelecek Pazar, yeni içgörülerle buluşacağız.
              </Text>
              <Text style={styles.closingSignature}>Sevgiyle, CohenDad 🌙</Text>
            </View>

            {/* Actions */}
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate('Home' as never)}
            >
              <Text style={styles.homeButtonText}>Ana Sayfaya Dön</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

interface ReflectionSectionProps {
  emoji: string;
  title: string;
  subtitle: string;
  content: string;
}

const ReflectionSection: React.FC<ReflectionSectionProps> = ({
  emoji,
  title,
  subtitle,
  content,
}) => (
  <View style={styles.reflectionSection}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionEmoji}>{emoji}</Text>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <Text style={styles.sectionContent}>{content}</Text>
  </View>
);

// Helper functions
const getWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

const generateWeeklyTheme = (card: DrawnCard): string => {
  const themes = [
    'İçsel Dönüşüm ve Kabul',
    'Gölge ile Yüzleşme',
    'Arketipsel Güç Dönüşümü',
    'Bilinçaltı Keşfi',
    'Özgürleşme ve Bireyselleşme',
  ];
  return themes[Math.floor(Math.random() * themes.length)];
};

const generateArchetypeAnalysis = (card: DrawnCard): string => {
  return `Bu hafta ${card.card.name.tr} üzerinden "Kahraman Yolculuğu"nun bir aşamasındasınız. Jung'un dediği gibi, bireyselleşme süreci doğrusal değil, spiral bir yolculuktur.\n\nBu hafta aktif olan arketip, sizden eski bir benlik imajını bırakıp, yeni bir özgünlüğe doğru adım atmanızı istiyor. ${card.isReversed ? 'Kartın ters pozisyonu, bu dönüşüme içsel bir direnci gösteriyor. Neye tutunuyorsunuz? Neyi bırakmaktan korkuyorsunuz?' : 'Enerji lehvinde - bu dönüşüm için evren sizi destekliyor.'}\n\nGölge yanınız, özellikle ${card.card.keywords.tr[0]} konusunda kendini gösterdi. Kabul edin, entegre edin.`;
};

const generateSubconsciousPattern = (card: DrawnCard): string => {
  return `Freud'un "repetition compulsion" (tekrar zorlantısı) kavramı bu hafta çok aktif. Aynı örüntüleri tekrarlıyorsunuz çünkü bilinçaltınız çözülmemiş çatışmaları yeniden yaşamak istiyor.\n\nBu hafta ${card.card.keywords.tr[1]} teması etrafında dönen bir savunma mekanizması fark ettiniz mi? Belki de "projection" (yansıtma) - kendi içinizdeki kabul etmediğiniz yönleri başkalarında görme. Ya da "rationalization" (akılcılaştırma) - duygularınızı mantıkla bastırma.\n\nBu örüntüyü fark etmek, onu değiştirmenin ilk adımı. Bilinçaltınız size bir mesaj gönderiyor: "${card.isReversed ? card.card.meanings.reversed.tr : card.card.meanings.upright.tr}"`;
};

const generateShadowOpportunity = (card: DrawnCard): string => {
  return `Jung: "Aydınlanma karanlığı hayal etmekten değil, onu bilinçli hale getirmekten gelir."\n\nBu hafta gölgeniz, ${card.card.keywords.tr[2]} alanında ortaya çıktı. Belki bir an kendinizi "kötü" hissettiniz, belki biriyle çatıştınız, belki de bastırdığınız bir duygu yüzeye çıktı.\n\nBu bir fırsat. Gölge çalışması yapmak için mükemmel bir hafta. Kendine şu soruları sor:\n\n1. Başkalarında en çok neyi eleştiriyorum? (Bu benim gölgemde ne var?)\n2. Hangi duyguyu ifade etmekten korkuyorum?\n3. "Ben asla böyle biri olamam" dediğim özellik ne?\n\nGölgeni kucakla, entegre et. O senin gücün.`;
};

const generateNextWeekGuidance = (card: DrawnCard): string => {
  return `Adler'in "sosyal ilgi" (social interest) kavramını hatırlayın: Gerçek büyüme, toplulukla bağlantıda gerçekleşir.\n\nGelecek hafta için önerim:\n\n1. **Aşağılık kompleksini dönüştür**: ${card.card.keywords.tr[0]} konusunda kendini "yeterli değil" hissediyorsan, bu bir büyüme fırsatı. Adler'in dediği gibi, aşağılık duygusu "üstünlük çabası"na dönüştürülebilir - ama ego-driven değil, authentic bir güç olarak.\n\n2. **Fromm'un "being" modunu uygula**: "Having" (sahip olma) yerine "being" (olma) moduna geç. Kendin ol, ispatlama. ${card.isReversed ? 'Özellikle içsel direncini gözlemle.' : 'Enerji seninle, özgürce ifade et.'}\n\n3. **Pratik eylem**: Her gün 5 dakika journaling yap, gölge çalışması devam ettir.\n\nSevgiyle kendine yaklaş. Sen zaten yeterlisin, olduğun gibi.`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.dark,
    padding: spacing.xl,
  },
  loadingCard: {
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  loadingTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
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
    lineHeight: 22,
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
  generateButton: {
    backgroundColor: colors.primary.purple,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  generateButtonEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  generateButtonText: {
    ...typography.h2,
    color: colors.background.dark,
  },
  cardSection: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  cardDisplay: {
    backgroundColor: colors.background.modal,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.primary.gold,
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  cardName: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  reversed: {
    color: colors.text.muted,
    fontSize: 18,
  },
  cardTheme: {
    ...typography.h4,
    color: colors.primary.gold,
    textAlign: 'center',
  },
  reflectionSection: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionEmoji: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 11,
  },
  sectionContent: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  closingCard: {
    backgroundColor: colors.accent.ethereal + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent.ethereal + '30',
    marginBottom: spacing.xl,
  },
  closingEmoji: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  closingText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  closingSignature: {
    ...typography.h4,
    color: colors.accent.ethereal,
    textAlign: 'center',
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

export default WeeklyReflectionScreen;
