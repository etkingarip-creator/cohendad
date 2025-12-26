import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useUser } from '../../contexts/UserContext';
import { isValidBirthDate, isValidTimeFormat, isValidPlace } from '../../utils/validators';
import { BirthData } from '../../types';

const BirthDataScreen: React.FC = () => {
  const navigation = useNavigation();
  const { setBirthData } = useUser();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [place, setPlace] = useState('');
  const [loading, setLoading] = useState(false);

  const calculateZodiacSign = (birthDate: Date): string => {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Koç';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Boğa';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'İkizler';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Yengeç';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Aslan';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Başak';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Terazi';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Akrep';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Yay';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Oğlak';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Kova';
    return 'Balık';
  };

  const handleContinue = async () => {
    // Validate date (DD/MM/YYYY format)
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const dateMatch = date.match(dateRegex);

    if (!dateMatch) {
      Alert.alert('Hata', 'Geçerli bir tarih girin (GG/AA/YYYY)');
      return;
    }

    const [_, day, month, year] = dateMatch;
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    if (!isValidBirthDate(birthDate)) {
      Alert.alert('Hata', 'Geçerli bir doğum tarihi girin (En az 13 yaşında olmalısınız)');
      return;
    }

    if (!isValidTimeFormat(time)) {
      Alert.alert('Hata', 'Geçerli bir saat girin (SS:DD formatında)');
      return;
    }

    if (!isValidPlace(place)) {
      Alert.alert('Hata', 'Doğum yerinizi girin');
      return;
    }

    setLoading(true);
    try {
      const zodiacSign = calculateZodiacSign(birthDate);

      const birthData: BirthData = {
        date: birthDate.toISOString(),
        time,
        place,
        zodiacSign,
      };

      await setBirthData(birthData);
      navigation.navigate('MainTabs' as never);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigation.navigate('MainTabs' as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>⭐</Text>
          <Text style={styles.title}>Kozmik Haritanı Oluştur</Text>
          <Text style={styles.subtitle}>
            Doğum bilgilerin, astrolojik analizler için gereklidir
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>🔮</Text>
          <Text style={styles.infoText}>
            Bu bilgiler ile natal chart'ını oluşturacak, transitleri analiz edecek ve
            kişiselleştirilmiş kehanetler sunacağız
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Tarihi</Text>
            <TextInput
              style={styles.input}
              placeholder="GG/AA/YYYY (örn: 15/03/1990)"
              placeholderTextColor={colors.text.muted}
              value={date}
              onChangeText={setDate}
              keyboardType="numeric"
            />
            <Text style={styles.hint}>Örnek: 15/03/1990</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Saati</Text>
            <TextInput
              style={styles.input}
              placeholder="SS:DD (örn: 14:30)"
              placeholderTextColor={colors.text.muted}
              value={time}
              onChangeText={setTime}
              keyboardType="numeric"
            />
            <Text style={styles.hint}>Örnek: 14:30 (Bilmiyorsan 12:00 yaz)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Yeri</Text>
            <TextInput
              style={styles.input}
              placeholder="Şehir, Ülke (örn: İstanbul, Türkiye)"
              placeholderTextColor={colors.text.muted}
              value={place}
              onChangeText={setPlace}
              autoCapitalize="words"
            />
            <Text style={styles.hint}>Örnek: İstanbul, Türkiye</Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[styles.continueButton, loading && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={loading}
          >
            <Text style={styles.continueButtonText}>
              {loading ? 'Kaydediliyor...' : 'Yolculuğa Başla'}
            </Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Şimdilik Atla</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy */}
        <View style={styles.privacyBox}>
          <Text style={styles.privacyText}>
            🔒 Bilgilerin güvenli şekilde saklanır ve asla paylaşılmaz
          </Text>
        </View>
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
    paddingTop: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.primary.purple + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple + '30',
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  infoEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  form: {
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.text.primary,
    fontSize: 16,
  },
  hint: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: spacing.xs,
    fontSize: 12,
  },
  continueButton: {
    backgroundColor: colors.primary.purple,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
  skipButton: {
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  skipButtonText: {
    ...typography.body,
    color: colors.text.muted,
    textDecorationLine: 'underline',
  },
  privacyBox: {
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  privacyText: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
  },
});

export default BirthDataScreen;
