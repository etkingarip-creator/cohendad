import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useUser } from '../../contexts/UserContext';
import { getUserReadings } from '../../services/firebase/firestore';
import { TarotReading } from '../../types';

const HistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userData } = useUser();

  const [readings, setReadings] = useState<TarotReading[]>([]);
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReadings();
  }, []);

  const loadReadings = async () => {
    if (!userData) return;

    try {
      const data = await getUserReadings(userData.id);
      setReadings(data as TarotReading[]);
    } catch (error) {
      console.error('Error loading readings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReadings = filter === 'favorites'
    ? readings.filter(r => r.isFavorite)
    : readings;

  const handleReadingPress = (readingId: string) => {
    navigation.navigate('ReadingResult' as never, { readingId } as never);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Okuma Geçmişi 📖</Text>
        <Text style={styles.subtitle}>
          {readings.length} okuma yapıldı
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            Tümü
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'favorites' && styles.filterTabActive]}
          onPress={() => setFilter('favorites')}
        >
          <Text style={[styles.filterTabText, filter === 'favorites' && styles.filterTabTextActive]}>
            Favoriler ❤️
          </Text>
        </TouchableOpacity>
      </View>

      {/* Readings List */}
      {loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Yükleniyor... 🔮</Text>
        </View>
      ) : filteredReadings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🌙</Text>
          <Text style={styles.emptyText}>
            {filter === 'favorites' ? 'Henüz favori okuman yok' : 'Henüz okuma yapmadın'}
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('TarotReading' as never)}
          >
            <Text style={styles.emptyButtonText}>İlk Okumayı Yap</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredReadings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.readingCard}
              onPress={() => handleReadingPress(item.id)}
            >
              <View style={styles.readingHeader}>
                <Text style={styles.readingDate}>
                  {new Date(item.date).toLocaleDateString('tr-TR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </Text>
                {item.isFavorite && <Text style={styles.favoriteIcon}>❤️</Text>}
              </View>

              <Text style={styles.readingType}>
                {getSpreadName(item.spreadType)}
              </Text>

              <View style={styles.readingCards}>
                {item.cards.slice(0, 3).map((drawnCard, idx) => (
                  <Text key={idx} style={styles.miniCard}>
                    {drawnCard.card.name.tr.substring(0, 12)}...
                  </Text>
                ))}
                {item.cards.length > 3 && (
                  <Text style={styles.miniCard}>+{item.cards.length - 3}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const getSpreadName = (type: string): string => {
  const names: Record<string, string> = {
    daily: 'Günlük Enerji',
    three_card: 'Üçlü Kart',
    celtic_cross: 'Kelt Haçı',
    relationship: 'İlişki Yayılımı',
    career: 'Kariyer Yolu',
  };
  return names[type] || type;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    color: colors.text.muted,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  filterTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: colors.primary.purple,
    borderColor: colors.primary.purple,
  },
  filterTabText: {
    ...typography.caption,
    color: colors.text.muted,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: colors.text.primary,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  readingCard: {
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.sm,
  },
  readingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  readingDate: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 12,
  },
  favoriteIcon: {
    fontSize: 16,
  },
  readingType: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  readingCards: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  miniCard: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text.secondary,
    backgroundColor: colors.background.dark,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: colors.primary.purple,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  emptyButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
});

export default HistoryScreen;
