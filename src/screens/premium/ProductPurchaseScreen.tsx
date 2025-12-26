import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { getProductById } from '../../data/personalizedProducts';
import { PersonalizedProduct } from '../../types';
import { usePremium } from '../../context/PremiumContext';
import { useUser } from '../../context/UserContext';

type ProductPurchaseRouteParams = {
  productId: string;
};

const ProductPurchaseScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: ProductPurchaseRouteParams }, 'params'>>();
  const { productId } = route.params;
  const { isPremium } = usePremium();
  const { user } = useUser();

  const [product, setProduct] = useState<PersonalizedProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const foundProduct = getProductById(productId);
    setProduct(foundProduct || null);
  }, [productId]);

  const handlePurchase = async () => {
    if (!product || !user) return;

    setPurchasing(true);

    try {
      // In production, this would integrate with payment processor
      // For now, simulate purchase flow

      /*
      Example RevenueCat integration:

      const offering = await Purchases.getOfferings();
      const packageToPurchase = offering.current?.availablePackages.find(
        pkg => pkg.identifier === product.id
      );

      if (packageToPurchase) {
        const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);

        // Check if purchase was successful
        if (customerInfo.entitlements.active[product.id]) {
          // Generate personalized report via Cloud Function
          await generatePersonalizedReport(product.id, user.id);

          // Navigate to result
          navigation.navigate('ProductResult', { productId: product.id });
        }
      }
      */

      // Placeholder: Simulate purchase delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      Alert.alert(
        'Satın Alma Başarılı! 🎉',
        `${product.name.tr} raporunuz hazırlanıyor. CohenDad sizin için özel bir analiz oluşturuyor...`,
        [
          {
            text: 'Tamam',
            onPress: () => {
              // Navigate to result screen (to be created)
              navigation.navigate('ProductResult' as never, { productId: product.id } as never);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert('Hata', 'Satın alma işlemi tamamlanamadı. Lütfen tekrar deneyin.');
    } finally {
      setPurchasing(false);
    }
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.purple} />
      </View>
    );
  }

  const discountedPrice = isPremium ? product.price * 0.8 : product.price;
  const savings = isPremium ? product.price * 0.2 : 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Product Header */}
        <View style={styles.productHeader}>
          <Text style={styles.productEmoji}>{getProductEmoji(product.type)}</Text>
          <Text style={styles.productName}>{product.name.tr}</Text>
          <Text style={styles.productDescription}>{product.description.tr}</Text>
        </View>

        {/* Premium Discount Banner */}
        {isPremium && (
          <View style={styles.discountBanner}>
            <Text style={styles.discountText}>
              ✨ Premium üye indirimi: %20 tasarruf!
            </Text>
          </View>
        )}

        {/* What's Included */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Raporunuzda Neler Var?</Text>
          <View style={styles.featuresBox}>
            {getProductFeatures(product.type).map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* CohenDad Note */}
        <View style={styles.cohenDadNote}>
          <Text style={styles.noteEmoji}>🔮</Text>
          <Text style={styles.noteText}>
            CohenDad'dan: Bu rapor, Jung-Adler-Freud perspektifinden sizin için özel
            hazırlanacak. Bilinçaltınızın mesajlarını ortaya çıkaracak, dönüşüm
            fırsatlarınızı gösterecek.
          </Text>
        </View>

        {/* How It Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Nasıl Çalışır?</Text>
          <View style={styles.stepsContainer}>
            <StepItem
              number={1}
              title="Satın Al"
              description="Ödeme işlemini tamamla"
            />
            <StepItem
              number={2}
              title="AI Hazırlıyor"
              description="CohenDad sizin için özel rapor oluşturuyor (2-3 dakika)"
            />
            <StepItem
              number={3}
              title="Keşfet"
              description="Kişiselleştirilmiş raporunuzu okuyun, kaydedin, paylaşın"
            />
          </View>
        </View>

        {/* Pricing */}
        <View style={styles.pricingSection}>
          {isPremium && (
            <View style={styles.originalPrice}>
              <Text style={styles.originalPriceText}>${product.price.toFixed(2)}</Text>
              <View style={styles.strikethrough} />
            </View>
          )}
          <View style={styles.currentPrice}>
            <Text style={styles.priceAmount}>${discountedPrice.toFixed(2)}</Text>
            <Text style={styles.priceCurrency}>USD</Text>
          </View>
          {isPremium && (
            <Text style={styles.savingsText}>
              ${savings.toFixed(2)} tasarruf ettiniz!
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Purchase Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.purchaseButton, purchasing && styles.purchaseButtonDisabled]}
          onPress={handlePurchase}
          disabled={purchasing}
        >
          {purchasing ? (
            <ActivityIndicator color={colors.background.dark} />
          ) : (
            <Text style={styles.purchaseButtonText}>
              Satın Al - ${discountedPrice.toFixed(2)}
            </Text>
          )}
        </TouchableOpacity>
        <Text style={styles.footerNote}>
          Güvenli ödeme • Anında teslimat • %100 memnuniyet garantisi
        </Text>
      </View>
    </View>
  );
};

interface StepItemProps {
  number: number;
  title: string;
  description: string;
}

const StepItem: React.FC<StepItemProps> = ({ number, title, description }) => (
  <View style={styles.stepItem}>
    <View style={styles.stepNumber}>
      <Text style={styles.stepNumberText}>{number}</Text>
    </View>
    <View style={styles.stepContent}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
  </View>
);

const getProductEmoji = (type: PersonalizedProduct['type']): string => {
  const emojis: Record<PersonalizedProduct['type'], string> = {
    horoscope_report: '⭐',
    numerology_deep_dive: '🔢',
    couple_compatibility: '💕',
    yearly_map: '🗺️',
  };
  return emojis[type] || '📊';
};

const getProductFeatures = (type: PersonalizedProduct['type']): string[] => {
  const features: Record<PersonalizedProduct['type'], string[]> = {
    horoscope_report: [
      'Aylık transit analizi ve etkileri',
      'Kişiselleştirilmiş burç yorumu',
      'Jung arketipleri perspektifinden okuma',
      'Ay fazları ve enerjileri',
      'Günlük pratik öneriler',
      'PDF formatında kayıt edilebilir',
    ],
    numerology_deep_dive: [
      'Yaşam yolu sayısı detaylı analizi',
      'Kader sayısı ve anlamı',
      'Kişisel yıl hesaplaması',
      'İfade ve ruh dürtüsü sayıları',
      'Bilinçaltı motivasyonlar',
      'Kişisel gelişim fırsatları',
    ],
    couple_compatibility: [
      '2 kişinin astrolojik uyumu',
      'Numerolojik uyumluluk analizi',
      'İlişki dinamikleri ve örüntüler',
      'Güçlü yönler ve zorluklar',
      'İletişim önerileri',
      'Birlikte büyüme fırsatları',
    ],
    yearly_map: [
      '12 aylık kapsamlı okuma',
      'Solar return analizi',
      'Aylık enerji tahminleri',
      'Dönüm noktaları ve fırsatlar',
      'Kişisel dönüşüm haritası',
      'Aylık eylem planı',
    ],
  };
  return features[type] || [];
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
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120,
  },
  productHeader: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  productEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  productName: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  productDescription: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
  discountBanner: {
    backgroundColor: colors.primary.gold + '20',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.gold,
    marginBottom: spacing.lg,
  },
  discountText: {
    ...typography.button,
    color: colors.primary.gold,
    textAlign: 'center',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  featuresBox: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  featureBullet: {
    ...typography.body,
    color: colors.primary.purple,
    marginRight: spacing.sm,
    fontSize: 18,
  },
  featureText: {
    ...typography.body,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 22,
  },
  cohenDadNote: {
    backgroundColor: colors.primary.purple + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple + '30',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  noteEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  noteText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  stepsContainer: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary.purple,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepNumberText: {
    ...typography.button,
    color: colors.background.dark,
    fontSize: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  stepDescription: {
    ...typography.caption,
    color: colors.text.muted,
    lineHeight: 18,
  },
  pricingSection: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  originalPrice: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  originalPriceText: {
    ...typography.h3,
    color: colors.text.muted,
    fontSize: 18,
  },
  strikethrough: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: colors.text.muted,
  },
  currentPrice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  priceAmount: {
    ...typography.h1,
    fontSize: 48,
    color: colors.primary.gold,
    fontWeight: 'bold',
  },
  priceCurrency: {
    ...typography.h3,
    color: colors.primary.gold,
    marginLeft: spacing.xs,
    marginTop: spacing.sm,
  },
  savingsText: {
    ...typography.caption,
    color: colors.accent.ethereal,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background.dark,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  purchaseButton: {
    backgroundColor: colors.primary.purple,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    ...typography.button,
    color: colors.text.primary,
    fontSize: 18,
  },
  footerNote: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    fontSize: 11,
  },
});

export default ProductPurchaseScreen;
