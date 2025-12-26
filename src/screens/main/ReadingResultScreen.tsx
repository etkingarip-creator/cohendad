import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { getReading, toggleFavorite } from '../../services/firebase/firestore';
import { generateQuickInterpretation, calculateReadingEnergy } from '../../services/tarot/tarotEngine';
import { TarotReading } from '../../types';
import ShareQuoteModal from '../../components/share/ShareQuoteModal';

type RouteParams = {
  ReadingResult: {
    readingId: string;
  };
};

const ReadingResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RouteParams, 'ReadingResult'>>();
  const { readingId } = route.params;

  const [reading, setReading] = useState<TarotReading | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareModalVisible, setShareModalVisible] = useState(false);

  useEffect(() => {
    loadReading();
  }, [readingId]);

  const loadReading = async () => {
    try {
      const data = await getReading(readingId);
      if (data) {
        setReading(data as TarotReading);
      }
    } catch (error) {
      console.error('Error loading reading:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!reading) return;

    const newFavoriteStatus = !reading.isFavorite;
    await toggleFavorite(readingId, newFavoriteStatus);
    setReading({ ...reading, isFavorite: newFavoriteStatus });
  };

  const handleShare = () => {
    if (!reading) return;
    setShareModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Kartlar yorumlanıyor... 🔮</Text>
      </View>
    );
  }

  if (!reading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Okuma bulunamadı</Text>
      </View>
    );
  }

  const energy = calculateReadingEnergy(reading.cards);
  const interpretation = generateQuickInterpretation(reading.cards, reading.spreadType);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Senin İçin Yorumladım 🌙</Text>
          <Text style={styles.date}>
            {new Date(reading.date).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>

        {/* Energy Bars */}
        <View style={styles.energySection}>
          <Text style={styles.sectionTitle}>Okuma Enerjisi</Text>
          <View style={styles.energyBars}>
            <EnergyBar label="Pozitif" percentage={energy.positive} color={colors.accent.ethereal} />
            <EnergyBar label="Nötr" percentage={energy.neutral} color={colors.text.secondary} />
            <EnergyBar label="Zorlayıcı" percentage={energy.negative} color={colors.accent.danger} />
          </View>
        </View>

        {/* Cards Display */}
        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>Çekilen Kartlar</Text>
          {reading.cards.map((drawnCard, index) => (
            <View key={index} style={styles.cardItem}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardPosition}>Kart {index + 1}</Text>
                {drawnCard.isReversed && (
                  <View style={styles.reversedBadge}>
                    <Text style={styles.reversedText}>Ters</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardName}>{drawnCard.card.name.tr}</Text>
              <Text style={styles.cardKeywords}>
                {drawnCard.card.keywords.tr.join(' • ')}
              </Text>
            </View>
          ))}
        </View>

        {/* Interpretation */}
        <View style={styles.interpretationSection}>
          <Text style={styles.sectionTitle}>Yorum</Text>
          <Text style={styles.interpretationText}>{interpretation}</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleToggleFavorite}>
            <Text style={styles.actionEmoji}>{reading.isFavorite ? '❤️' : '🤍'}</Text>
            <Text style={styles.actionText}>Favorilere Ekle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionEmoji}>📤</Text>
            <Text style={styles.actionText}>Paylaş</Text>
          </TouchableOpacity>
        </View>

        {/* Done Button */}
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.doneButtonText}>Ana Sayfaya Dön</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Share Quote Modal */}
      <ShareQuoteModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        card={reading.cards[0]}
        interpretation={interpretation}
        type="daily"
      />
    </View>
  );
};

interface EnergyBarProps {
  label: string;
  percentage: number;
  color: string;
}

const EnergyBar: React.FC<EnergyBarProps> = ({ label, percentage, color }) => (
  <View style={styles.energyBar}>
    <View style={styles.energyBarHeader}>
      <Text style={styles.energyLabel}>{label}</Text>
      <Text style={styles.energyPercentage}>{percentage}%</Text>
    </View>
    <View style={styles.energyBarTrack}>
      <View style={[styles.energyBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
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
  date: {
    ...typography.caption,
    color: colors.text.muted,
  },
  energySection: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  energyBars: {
    gap: spacing.md,
  },
  energyBar: {},
  energyBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  energyLabel: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  energyPercentage: {
    ...typography.caption,
    color: colors.text.accent,
    fontWeight: '600',
  },
  energyBarTrack: {
    height: 8,
    backgroundColor: colors.background.dark,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  energyBarFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  cardsSection: {
    marginBottom: spacing.lg,
  },
  cardItem: {
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  cardPosition: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 12,
  },
  reversedBadge: {
    backgroundColor: colors.accent.warning + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  reversedText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.accent.warning,
    fontWeight: '600',
  },
  cardName: {
    ...typography.h3,
    fontSize: 18,
    color: colors.text.accent,
    marginBottom: spacing.xs,
  },
  cardKeywords: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  interpretationSection: {
    backgroundColor: colors.background.modal,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
    marginBottom: spacing.lg,
  },
  interpretationText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  actionText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  doneButton: {
    backgroundColor: colors.primary.purple,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  doneButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
});

export default ReadingResultScreen;
