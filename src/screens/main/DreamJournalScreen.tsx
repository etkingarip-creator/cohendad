import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useUser } from '../../contexts/UserContext';
import { getUserDreams } from '../../services/firebase/firestore';
import { DreamEntry } from '../../types';

const DreamJournalScreen: React.FC = () => {
  const navigation = useNavigation();
  const { userData } = useUser();

  const [dreams, setDreams] = useState<DreamEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    if (!userData) return;

    try {
      const data = await getUserDreams(userData.id);
      setDreams(data as DreamEntry[]);
    } catch (error) {
      console.error('Error loading dreams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDream = () => {
    // Navigate to dream entry form
    Alert.alert('Yeni Rüya', 'Rüya ekleme formu yakında eklenecek');
  };

  const handleDreamPress = (dreamId: string) => {
    // Navigate to dream detail
    Alert.alert('Rüya Detayı', `Rüya ID: ${dreamId}`);
  };

  const getMoodEmoji = (mood?: string): string => {
    const emojis: Record<string, string> = {
      peaceful: '😌',
      anxious: '😰',
      exciting: '🤩',
      scary: '😱',
      confusing: '🤔',
    };
    return mood ? emojis[mood] || '💭' : '💭';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Rüya Günlüğü 💭</Text>
          <Text style={styles.subtitle}>
            {dreams.length} rüya kaydedildi
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddDream}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Dreams List */}
      {loading ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Yükleniyor... 💭</Text>
        </View>
      ) : dreams.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🌙</Text>
          <Text style={styles.emptyText}>Henüz rüya kaydetmedin</Text>
          <Text style={styles.emptyDescription}>
            Rüyalarını kaydet, sembollerini keşfet ve bilinçaltını çöz
          </Text>
          <TouchableOpacity style={styles.emptyButton} onPress={handleAddDream}>
            <Text style={styles.emptyButtonText}>İlk Rüyanı Kaydet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={dreams}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.dreamCard}
              onPress={() => handleDreamPress(item.id)}
            >
              <View style={styles.dreamHeader}>
                <View style={styles.dreamInfo}>
                  <Text style={styles.dreamDate}>
                    {new Date(item.date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                  {item.mood && (
                    <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
                  )}
                </View>
                {item.analysis && (
                  <View style={styles.analyzedBadge}>
                    <Text style={styles.analyzedText}>✓ Analiz Edildi</Text>
                  </View>
                )}
              </View>

              <Text style={styles.dreamTitle}>{item.title}</Text>
              <Text style={styles.dreamContent} numberOfLines={2}>
                {item.content}
              </Text>

              {item.symbols && item.symbols.length > 0 && (
                <View style={styles.symbols}>
                  {item.symbols.slice(0, 3).map((symbol, idx) => (
                    <View key={idx} style={styles.symbolTag}>
                      <Text style={styles.symbolText}>{symbol}</Text>
                    </View>
                  ))}
                  {item.symbols.length > 3 && (
                    <Text style={styles.symbolMore}>+{item.symbols.length - 3}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}

      {/* Info Box */}
      {dreams.length > 0 && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Premium ile rüyalarını AI ile analiz et, arketip bağlantılarını keşfet
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    ...typography.h1,
    fontSize: 28,
    color: colors.text.primary,
  },
  listContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  dreamCard: {
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.sm,
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dreamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dreamDate: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 12,
  },
  moodEmoji: {
    fontSize: 16,
  },
  analyzedBadge: {
    backgroundColor: colors.accent.ethereal + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  analyzedText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.accent.ethereal,
    fontWeight: '600',
  },
  dreamTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  dreamContent: {
    ...typography.caption,
    color: colors.text.muted,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  symbols: {
    flexDirection: 'row',
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  symbolTag: {
    backgroundColor: colors.background.dark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  symbolText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text.secondary,
  },
  symbolMore: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text.muted,
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
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
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
  infoBox: {
    margin: spacing.lg,
    backgroundColor: colors.primary.purple + '15',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary.purple + '30',
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    fontSize: 12,
  },
});

export default DreamJournalScreen;
