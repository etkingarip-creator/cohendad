import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { SUBSCRIPTION_PLANS } from '../../utils/constants';

type PlanType = 'monthly' | 'yearly' | 'lifetime';

const SubscriptionPlansScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with RevenueCat
      // const success = await purchaseSubscription(selectedPlan);
      // if (success) {
      //   Alert.alert('Başarılı!', 'Premium üyeliğin aktif edildi 🎉');
      //   navigation.goBack();
      // }

      // For now, just show alert
      Alert.alert(
        'RevenueCat Entegrasyonu',
        'RevenueCat entegrasyonu yapıldığında satın alma işlemi burada gerçekleşecek',
        [{ text: 'Tamam' }]
      );
    } catch (error: any) {
      Alert.alert('Hata', error.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    Alert.alert(
      'Satın Alımları Geri Yükle',
      'Önceki satın alımların geri yüklenecek',
      [{ text: 'Tamam' }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Planını Seç 👑</Text>
          <Text style={styles.subtitle}>
            7 gün ücretsiz dene, istediğin zaman iptal et
          </Text>
        </View>

        {/* Plans */}
        <View style={styles.plansSection}>
          {/* Monthly Plan */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Aylık</Text>
              {selectedPlan === 'monthly' && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.planPrice}>$9.99<Text style={styles.planPeriod}>/ay</Text></Text>
            <Text style={styles.planNote}>Aylık faturalandırma</Text>
          </TouchableOpacity>

          {/* Yearly Plan (Popular) */}
          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === 'yearly' && styles.planCardSelected,
              styles.popularPlan,
            ]}
            onPress={() => setSelectedPlan('yearly')}
          >
            <View style={styles.popularBadge}>
              <Text style={styles.popularBadgeText}>EN POPÜLERr</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Yıllık</Text>
              {selectedPlan === 'yearly' && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.planPrice}>$59.99<Text style={styles.planPeriod}>/yıl</Text></Text>
            <View style={styles.savingsRow}>
              <Text style={styles.originalPrice}>$119.88</Text>
              <View style={styles.savingsBadge}>
                <Text style={styles.savingsText}>%50 tasarruf</Text>
              </View>
            </View>
            <Text style={styles.planNote}>Ayda sadece $4.99</Text>
          </TouchableOpacity>

          {/* Lifetime Plan */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'lifetime' && styles.planCardSelected]}
            onPress={() => setSelectedPlan('lifetime')}
          >
            <View style={styles.lifetimeBadge}>
              <Text style={styles.lifetimeBadgeText}>🔥 EN İYİ DEĞER</Text>
            </View>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>Lifetime</Text>
              {selectedPlan === 'lifetime' && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.planPrice}>$199.99<Text style={styles.planPeriod}> tek seferlik</Text></Text>
            <Text style={styles.planNote}>Ömür boyu erişim, tek ödeme</Text>
          </TouchableOpacity>
        </View>

        {/* Features Reminder */}
        <View style={styles.featuresReminder}>
          <Text style={styles.featuresTitle}>Tüm Planlarda:</Text>
          <FeatureCheckItem text="Sınırsız tarot okuması" />
          <FeatureCheckItem text="AI Chat - CohenDad" />
          <FeatureCheckItem text="Tüm yayılımlar (Celtic Cross, vb.)" />
          <FeatureCheckItem text="Detaylı astroloji raporları" />
          <FeatureCheckItem text="Rüya analizi" />
          <FeatureCheckItem text="Haftalık deep dive insights" />
          <FeatureCheckItem text="Reklamsız deneyim" />
        </View>

        {/* Terms */}
        <Text style={styles.terms}>
          Satın alımı tamamlayarak Kullanım Koşulları ve Gizlilik Politikası'nı kabul etmiş olursunuz.
          Deneme süresi bitiminde otomatik olarak faturalandırma başlar. İstediğiniz zaman iptal edebilirsiniz.
        </Text>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.subscribeButton, loading && styles.buttonDisabled]}
          onPress={handleSubscribe}
          disabled={loading}
        >
          <Text style={styles.subscribeButtonText}>
            {loading ? 'İşleniyor...' : '7 Gün Ücretsiz Başlat'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
          <Text style={styles.restoreButtonText}>Satın Alımları Geri Yükle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface FeatureCheckItemProps {
  text: string;
}

const FeatureCheckItem: React.FC<FeatureCheckItemProps> = ({ text }) => (
  <View style={styles.featureCheckItem}>
    <Text style={styles.featureCheck}>✓</Text>
    <Text style={styles.featureCheckText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.dark,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 160,
  },
  header: {
    marginBottom: spacing.xl,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  closeText: {
    ...typography.h3,
    color: colors.text.muted,
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
  plansSection: {
    marginBottom: spacing.xl,
  },
  planCard: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border.light,
    marginBottom: spacing.md,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: colors.primary.purple,
    backgroundColor: colors.primary.purple + '10',
  },
  popularPlan: {
    borderColor: colors.primary.gold,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: spacing.lg,
    backgroundColor: colors.primary.gold,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  popularBadgeText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.background.dark,
    fontWeight: 'bold',
  },
  lifetimeBadge: {
    backgroundColor: colors.accent.danger + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  lifetimeBadgeText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.accent.danger,
    fontWeight: 'bold',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  planName: {
    ...typography.h2,
    fontSize: 22,
    color: colors.text.primary,
  },
  checkmark: {
    fontSize: 24,
    color: colors.primary.purple,
  },
  planPrice: {
    ...typography.h1,
    fontSize: 32,
    color: colors.text.accent,
    marginBottom: spacing.xs,
  },
  planPeriod: {
    ...typography.body,
    fontSize: 16,
    color: colors.text.muted,
  },
  savingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  originalPrice: {
    ...typography.caption,
    color: colors.text.muted,
    textDecorationLine: 'line-through',
  },
  savingsBadge: {
    backgroundColor: colors.accent.ethereal + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  savingsText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.accent.ethereal,
    fontWeight: '600',
  },
  planNote: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  featuresReminder: {
    backgroundColor: colors.background.modal,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
    marginBottom: spacing.lg,
  },
  featuresTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  featureCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featureCheck: {
    fontSize: 16,
    color: colors.primary.purple,
    marginRight: spacing.sm,
  },
  featureCheckText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
  },
  terms: {
    ...typography.caption,
    fontSize: 11,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: colors.background.dark,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  subscribeButton: {
    backgroundColor: colors.primary.purple,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  subscribeButtonText: {
    ...typography.button,
    fontSize: 17,
    color: colors.text.primary,
  },
  restoreButton: {
    padding: spacing.sm,
    alignItems: 'center',
  },
  restoreButtonText: {
    ...typography.caption,
    color: colors.text.muted,
    textDecorationLine: 'underline',
  },
});

export default SubscriptionPlansScreen;
