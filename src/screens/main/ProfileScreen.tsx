import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { usePremium } from '../../contexts/PremiumContext';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { userData } = useUser();
  const { isPremium, isTrialing } = usePremium();

  const handleSignOut = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinden emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData?.name?.charAt(0).toUpperCase() || '🌙'}
            </Text>
          </View>
          <Text style={styles.name}>{userData?.name || 'Ruh Gezgini'}</Text>
          <Text style={styles.email}>{userData?.email}</Text>

          {isPremium ? (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>👑 Premium Üye</Text>
            </View>
          ) : isTrialing ? (
            <View style={styles.trialBadge}>
              <Text style={styles.trialBadgeText}>✨ Deneme Sürümü</Text>
            </View>
          ) : null}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <StatCard emoji="🔥" value={userData?.streak || 0} label="Günlük Streak" />
          <StatCard emoji="🔮" value={userData?.intentions.length || 0} label="İlgi Alanı" />
        </View>

        {/* Birth Data */}
        {userData?.birthData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Doğum Bilgileri</Text>
            <View style={styles.infoCard}>
              <InfoRow label="Burç" value={userData.birthData.zodiacSign || '-'} />
              <InfoRow label="Doğum Tarihi" value={new Date(userData.birthData.date).toLocaleDateString('tr-TR')} />
              <InfoRow label="Doğum Yeri" value={userData.birthData.place} />
            </View>
          </View>
        )}

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayarlar</Text>

          {!isPremium && (
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => navigation.navigate('Paywall' as never, { trigger: 'profile' } as never)}
            >
              <Text style={styles.menuEmoji}>👑</Text>
              <Text style={styles.menuText}>Premium'a Geç</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuEmoji}>🔔</Text>
            <Text style={styles.menuText}>Bildirimler</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuEmoji}>🌍</Text>
            <Text style={styles.menuText}>Dil</Text>
            <Text style={styles.menuValue}>Türkçe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuEmoji}>📖</Text>
            <Text style={styles.menuText}>Yardım Merkezi</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuEmoji}>💬</Text>
            <Text style={styles.menuText}>Geri Bildirim</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuEmoji}>📜</Text>
            <Text style={styles.menuText}>Kullanım Koşulları</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuEmoji}>🔒</Text>
            <Text style={styles.menuText}>Gizlilik Politikası</Text>
            <Text style={styles.menuArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={styles.version}>CohenDad v1.0.0-beta</Text>
      </ScrollView>
    </View>
  );
};

interface StatCardProps {
  emoji: string;
  value: number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ emoji, value, label }) => (
  <View style={styles.statCard}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
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
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.h1,
    color: colors.text.primary,
  },
  name: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  premiumBadge: {
    backgroundColor: colors.primary.gold + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary.gold,
  },
  premiumBadgeText: {
    ...typography.caption,
    color: colors.primary.gold,
    fontWeight: '600',
  },
  trialBadge: {
    backgroundColor: colors.primary.purple + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary.purple,
  },
  trialBadgeText: {
    ...typography.caption,
    color: colors.primary.purple,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  statValue: {
    ...typography.h2,
    color: colors.text.accent,
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...typography.caption,
    color: colors.text.muted,
    fontSize: 11,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  infoCard: {
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.text.muted,
  },
  infoValue: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  menuItem: {
    backgroundColor: colors.background.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.sm,
  },
  menuEmoji: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  menuText: {
    ...typography.body,
    color: colors.text.primary,
    flex: 1,
  },
  menuValue: {
    ...typography.caption,
    color: colors.text.muted,
  },
  menuArrow: {
    ...typography.h3,
    color: colors.text.muted,
  },
  signOutButton: {
    backgroundColor: colors.accent.danger + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent.danger,
    alignItems: 'center',
  },
  signOutText: {
    ...typography.button,
    color: colors.accent.danger,
  },
  version: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});

export default ProfileScreen;
