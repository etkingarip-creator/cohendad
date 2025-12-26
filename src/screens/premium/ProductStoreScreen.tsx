import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { PERSONALIZED_PRODUCTS } from '../../data/personalizedProducts';
import { PersonalizedProduct } from '../../types';

const ProductStoreScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleProductPress = (productId: string) => {
    navigation.navigate('ProductPurchase' as never, { productId } as never);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Kişiye Özel Raporlar 📊</Text>
          <Text style={styles.subtitle}>
            CohenDad'dan özel, detaylı analizler
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>🔮</Text>
          <Text style={styles.infoText}>
            Her rapor, Jung-Adler-Freud perspektifinden hazırlanmış,
            kişiselleştirilmiş rehberlik içerir
          </Text>
        </View>

        {/* Products */}
        <View style={styles.productsSection}>
          {PERSONALIZED_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => handleProductPress(product.id)}
            />
          ))}
        </View>

        {/* Note */}
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            💡 Premium üyeler bu raporlardan %20 indirimli faydalanır
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

interface ProductCardProps {
  product: PersonalizedProduct;
  onPress: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => (
  <TouchableOpacity style={styles.productCard} onPress={onPress}>
    <View style={styles.productHeader}>
      <Text style={styles.productEmoji}>{getProductEmoji(product.type)}</Text>
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>${product.price}</Text>
      </View>
    </View>

    <Text style={styles.productName}>{product.name.tr}</Text>
    <Text style={styles.productDescription}>{product.description.tr}</Text>

    <View style={styles.productFooter}>
      <Text style={styles.purchaseButton}>Satın Al →</Text>
    </View>
  </TouchableOpacity>
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
    marginBottom: spacing.lg,
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
  infoCard: {
    backgroundColor: colors.primary.purple + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple + '30',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  infoEmoji: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 20,
  },
  productsSection: {
    marginBottom: spacing.lg,
  },
  productCard: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.md,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  productEmoji: {
    fontSize: 40,
  },
  priceTag: {
    backgroundColor: colors.primary.gold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  priceText: {
    ...typography.h3,
    fontSize: 18,
    color: colors.background.dark,
    fontWeight: 'bold',
  },
  productName: {
    ...typography.h2,
    fontSize: 20,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  productDescription: {
    ...typography.caption,
    color: colors.text.muted,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  productFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingTop: spacing.md,
  },
  purchaseButton: {
    ...typography.button,
    color: colors.primary.purple,
    textAlign: 'center',
  },
  noteBox: {
    backgroundColor: colors.accent.ethereal + '15',
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.accent.ethereal + '30',
  },
  noteText: {
    ...typography.caption,
    color: colors.accent.ethereal,
    textAlign: 'center',
  },
});

export default ProductStoreScreen;
