import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { isValidEmail, isValidPassword, getPasswordStrength } from '../../utils/validators';

const AuthScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!isValidEmail(email)) {
      Alert.alert('Hata', 'Geçerli bir email adresi girin');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        Alert.alert('Hata', 'İsminizi girin');
        return;
      }
      if (!isValidPassword(password)) {
        Alert.alert('Hata', 'Şifre en az 8 karakter, 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      navigation.navigate('BirthData' as never);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      navigation.navigate('BirthData' as never);
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Google ile giriş yapılamadı');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🌙</Text>
          <Text style={styles.title}>
            {mode === 'signin' ? 'Hoş Geldin' : 'Aramıza Katıl'}
          </Text>
          <Text style={styles.subtitle}>
            {mode === 'signin'
              ? 'Mistik yolculuğuna kaldığın yerden devam et'
              : 'Yeni bir başlangıç seni bekliyor'
            }
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {mode === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>İsim</Text>
              <TextInput
                style={styles.input}
                placeholder="Adın nedir?"
                placeholderTextColor={colors.text.muted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor={colors.text.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.text.muted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            {mode === 'signup' && password.length > 0 && (
              <View style={styles.passwordStrength}>
                <View style={[styles.strengthBar, { width: `${(passwordStrength / 4) * 100}%` }]} />
              </View>
            )}
          </View>

          {/* Email Auth Button */}
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleEmailAuth}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Yükleniyor...' : mode === 'signin' ? 'Giriş Yap' : 'Hesap Oluştur'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Auth Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleAuth}
            disabled={loading}
          >
            <Text style={styles.googleButtonEmoji}>G</Text>
            <Text style={styles.googleButtonText}>Google ile devam et</Text>
          </TouchableOpacity>

          {/* Switch Mode */}
          <TouchableOpacity
            style={styles.switchMode}
            onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          >
            <Text style={styles.switchModeText}>
              {mode === 'signin' ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
              <Text style={styles.switchModeLink}>
                {mode === 'signin' ? 'Kayıt Ol' : 'Giriş Yap'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            Devam ederek Kullanım Koşulları ve Gizlilik Politikası'nı kabul etmiş olursunuz
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
  },
  subtitle: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
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
  passwordStrength: {
    height: 4,
    backgroundColor: colors.background.card,
    borderRadius: 2,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    backgroundColor: colors.primary.purple,
  },
  primaryButton: {
    backgroundColor: colors.primary.purple,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    ...typography.caption,
    color: colors.text.muted,
    marginHorizontal: spacing.md,
  },
  googleButton: {
    backgroundColor: colors.background.card,
    borderWidth: 1,
    borderColor: colors.border.medium,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonEmoji: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  googleButtonText: {
    ...typography.button,
    color: colors.text.primary,
  },
  switchMode: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  switchModeText: {
    ...typography.body,
    color: colors.text.muted,
  },
  switchModeLink: {
    color: colors.primary.purple,
    fontWeight: '600',
  },
  privacyNote: {
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
    lineHeight: 18,
  },
});

export default AuthScreen;
