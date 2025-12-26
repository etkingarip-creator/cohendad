import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useUser } from '../../contexts/UserContext';
import {
  calculateLifePathNumber,
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  getLifePathMeaning,
} from '../../services/numerology/numerologyCalc';

const NumerologyScreen: React.FC = () => {
  const { userData } = useUser();

  const [lifePathNumber, setLifePathNumber] = useState<number | null>(null);
  const [expressionNumber, setExpressionNumber] = useState<number | null>(null);
  const [soulUrgeNumber, setSoulUrgeNumber] = useState<number | null>(null);
  const [personalityNumber, setPersonalityNumber] = useState<number | null>(null);

  useEffect(() => {
    if (userData?.birthData?.date) {
      const birthDate = new Date(userData.birthData.date);
      setLifePathNumber(calculateLifePathNumber(birthDate));
    }

    if (userData?.name) {
      setExpressionNumber(calculateExpressionNumber(userData.name));
      setSoulUrgeNumber(calculateSoulUrgeNumber(userData.name));
      setPersonalityNumber(calculatePersonalityNumber(userData.name));
    }
  }, [userData]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Numeroloji Analizin 🔢</Text>
          <Text style={styles.subtitle}>
            Sayılar senin hakkında ne diyor?
          </Text>
        </View>

        {/* Life Path Number */}
        {lifePathNumber && (
          <View style={styles.numberCard}>
            <View style={styles.numberHeader}>
              <Text style={styles.numberLabel}>Yaşam Yolu Sayısı</Text>
              <View style={styles.numberCircle}>
                <Text style={styles.numberValue}>{lifePathNumber}</Text>
              </View>
            </View>
            <Text style={styles.numberMeaning}>
              {getLifePathMeaning(lifePathNumber).tr}
            </Text>
          </View>
        )}

        {/* Expression Number */}
        {expressionNumber && (
          <View style={styles.numberCard}>
            <View style={styles.numberHeader}>
              <Text style={styles.numberLabel}>İfade Sayısı</Text>
              <View style={[styles.numberCircle, styles.secondaryCircle]}>
                <Text style={styles.numberValue}>{expressionNumber}</Text>
              </View>
            </View>
            <Text style={styles.numberDescription}>
              İsminden türetilen bu sayı, doğal yeteneklerini ve potansiyelini gösterir.
            </Text>
          </View>
        )}

        {/* Soul Urge Number */}
        {soulUrgeNumber && (
          <View style={styles.numberCard}>
            <View style={styles.numberHeader}>
              <Text style={styles.numberLabel}>Ruh Arzusu Sayısı</Text>
              <View style={[styles.numberCircle, styles.tertiaryCircle]}>
                <Text style={styles.numberValue}>{soulUrgeNumber}</Text>
              </View>
            </View>
            <Text style={styles.numberDescription}>
              İç motivasyonunu ve en derin arzularını temsil eder.
            </Text>
          </View>
        )}

        {/* Personality Number */}
        {personalityNumber && (
          <View style={styles.numberCard}>
            <View style={styles.numberHeader}>
              <Text style={styles.numberLabel}>Kişilik Sayısı</Text>
              <View style={[styles.numberCircle, styles.quaternaryCircle]}>
                <Text style={styles.numberValue}>{personalityNumber}</Text>
              </View>
            </View>
            <Text style={styles.numberDescription}>
              Dış dünyaya nasıl göründüğünü, ilk izlenimini yansıtır.
            </Text>
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={styles.infoText}>
            Numeroloji, sayıların evrensel dilini kullanarak senin benzersiz
            enerjini ve yaşam yolunu ortaya çıkarır.
          </Text>
        </View>

        {!userData?.birthData && (
          <View style={styles.missingDataBox}>
            <Text style={styles.missingDataEmoji}>⚠️</Text>
            <Text style={styles.missingDataText}>
              Daha detaylı analiz için doğum bilgilerini ekle
            </Text>
            <TouchableOpacity style={styles.addDataButton}>
              <Text style={styles.addDataButtonText}>Bilgileri Ekle</Text>
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
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.text.muted,
  },
  numberCard: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.medium,
    marginBottom: spacing.md,
  },
  numberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  numberLabel: {
    ...typography.h3,
    fontSize: 18,
    color: colors.text.primary,
  },
  numberCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryCircle: {
    backgroundColor: colors.primary.gold,
  },
  tertiaryCircle: {
    backgroundColor: colors.accent.cosmic,
  },
  quaternaryCircle: {
    backgroundColor: colors.accent.mystic,
  },
  numberValue: {
    ...typography.h1,
    fontSize: 28,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  numberMeaning: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  numberDescription: {
    ...typography.caption,
    color: colors.text.muted,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: colors.primary.purple + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple + '30',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.lg,
  },
  infoEmoji: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  missingDataBox: {
    backgroundColor: colors.accent.warning + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent.warning + '30',
    alignItems: 'center',
    marginTop: spacing.lg,
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
});

export default NumerologyScreen;
