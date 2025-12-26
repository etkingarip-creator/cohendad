import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useUser } from '../../contexts/UserContext';
import { usePremium } from '../../contexts/PremiumContext';

const AstrologyScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userData } = useUser();
  const { isPremium } = usePremium();

  const zodiacSign = userData?.birthData?.zodiacSign;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Astroloji ⭐</Text>
          <Text style={styles.subtitle}>
            Kozmik enerjinin haritası
          </Text>
        </View>

        {/* Zodiac Sign */}
        {zodiacSign && (
          <View style={styles.zodiacCard}>
            <Text style={styles.zodiacEmoji}>♈</Text>
            <Text style={styles.zodiacSign}>{zodiacSign}</Text>
            <Text style={styles.zodiacDescription}>
              {getZodiacDescription(zodiacSign)}
            </Text>
          </View>
        )}

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          <FeatureCard
            emoji="🌟"
            title="Natal Chart"
            description="Doğum haritanı keşfet"
            isPremium={!isPremium}
            onPress={() => {
              if (!isPremium) {
                navigation.navigate('Paywall' as never, { trigger: 'natal_chart' } as never);
              }
            }}
          />
          <FeatureCard
            emoji="🔄"
            title="Transits"
            description="Güncel gezegen hareketleri"
            isPremium={!isPremium}
            onPress={() => {
              if (!isPremium) {
                navigation.navigate('Paywall' as never, { trigger: 'transits' } as never);
              }
            }}
          />
          <FeatureCard
            emoji="🌙"
            title="Ay Evresi"
            description="Bugünkü ay enerjisi"
            isPremium={false}
            onPress={() => {}}
          />
          <FeatureCard
            emoji="💫"
            title="Retrolar"
            description="Retro gezegen uyarıları"
            isPremium={!isPremium}
            onPress={() => {
              if (!isPremium) {
                navigation.navigate('Paywall' as never, { trigger: 'retrogrades' } as never);
              }
            }}
          />
        </View>

        {/* Info Box */}
        {!userData?.birthData && (
          <View style={styles.missingDataBox}>
            <Text style={styles.missingDataEmoji}>⚠️</Text>
            <Text style={styles.missingDataText}>
              Astroloji özellikleri için doğum bilgilerini ekle
            </Text>
            <TouchableOpacity style={styles.addDataButton}>
              <Text style={styles.addDataButtonText}>Bilgileri Ekle</Text>
            </TouchableOpacity>
          </View>
        )}

        {!isPremium && (
          <View style={styles.premiumBox}>
            <Text style={styles.premiumEmoji}>👑</Text>
            <Text style={styles.premiumTitle}>Premium'la Derinleş</Text>
            <Text style={styles.premiumDescription}>
              Natal chart, transit analizi ve detaylı astroloji raporlarına erişim kazan
            </Text>
            <TouchableOpacity
              style={styles.premiumButton}
              onPress={() => navigation.navigate('Paywall' as never, { trigger: 'astrology' } as never)}
            >
              <Text style={styles.premiumButtonText}>Premium'a Geç</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const getZodiacDescription = (sign: string): string => {
  const descriptions: Record<string, string> = {
    'Koç': 'Ateşli, cesur ve öncü. Liderlik yeteneğin güçlü.',
    'Boğa': 'Kararlı, güvenilir ve pratik. Güzelliğe değer verirsin.',
    'İkizler': 'Meraklı, sosyal ve çok yönlü. İletişim ustas ısın.',
    'Yengeç': 'Duygusal, koruyucu ve sezgisel. Aile odaklısın.',
    'Aslan': 'Yaratıcı, cömert ve lider. Sahnede olmayı seversin.',
    'Başak': 'Analitik, detaycı ve hizmet odaklı. Mükemmeliyetçisin.',
    'Terazi': 'Dengeli, diplomatik ve uyumlu. Adaletten yanasın.',
    'Akrep': 'Tutkulu, derin ve dönüşümcü. Gizemli bir ruha sahipsin.',
    'Yay': 'Özgür ruhlu, iyimser ve maceracı. Filozof ruhlusun.',
    'Oğlak': 'Disiplinli, hırslı ve sorumlu. Başarı odaklısın.',
    'Kova': 'Bağımsız, yenilikçi ve insancıl. Gelecek vizyonun var.',
    'Balık': 'Empatik, yaratıcı ve manevi. Sezgilerin güçlü.',
  };
  return descriptions[sign] || 'Burç bilgisi bulunamadı';
};

interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  isPremium: boolean;
  onPress: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ emoji, title, description, isPremium, onPress }) => (
  <TouchableOpacity style={styles.featureCard} onPress={onPress}>
    {isPremium && (
      <View style={styles.premiumLock}>
        <Text style={styles.lockIcon}>🔒</Text>
      </View>
    )}
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
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
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.muted,
  },
  zodiacCard: {
    backgroundColor: colors.background.modal,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.medium,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  zodiacEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  zodiacSign: {
    ...typography.h1,
    fontSize: 32,
    color: colors.text.accent,
    marginBottom: spacing.sm,
  },
  zodiacDescription: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  featureCard: {
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
  lockIcon: {
    fontSize: 16,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  featureTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  featureDescription: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 12,
  },
  missingDataBox: {
    backgroundColor: colors.accent.warning + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent.warning + '30',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  missingDataEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  missingDataText: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  addDataButton: {
    backgroundColor: colors.primary.purple,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  addDataButtonText: {
    ...typography.button,
    color: colors.text.primary,
    fontSize: 14,
  },
  premiumBox: {
    backgroundColor: colors.primary.purple + '15',
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary.purple + '30',
    alignItems: 'center',
  },
  premiumEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  premiumTitle: {
    ...typography.h2,
    fontSize: 22,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  premiumDescription: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  premiumButton: {
    backgroundColor: colors.primary.purple,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  premiumButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
});

export default AstrologyScreen;
