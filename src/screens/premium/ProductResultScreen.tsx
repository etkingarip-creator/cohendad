import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { getProductById } from '../../data/personalizedProducts';
import { PersonalizedProduct } from '../../types';
import { useUser } from '../../context/UserContext';

type ProductResultRouteParams = {
  productId: string;
};

interface PersonalizedReport {
  id: string;
  productId: string;
  productName: string;
  generatedAt: Date;
  content: {
    title: string;
    sections: ReportSection[];
  };
}

interface ReportSection {
  title: string;
  emoji: string;
  content: string;
}

const ProductResultScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: ProductResultRouteParams }, 'params'>>();
  const { productId } = route.params;
  const { user } = useUser();

  const [product, setProduct] = useState<PersonalizedProduct | null>(null);
  const [report, setReport] = useState<PersonalizedReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundProduct = getProductById(productId);
    setProduct(foundProduct || null);
    loadReport();
  }, [productId]);

  const loadReport = async () => {
    setLoading(true);

    try {
      // In production, this would fetch from Firebase/Cloud Function
      /*
      const reportDoc = await firestore()
        .collection('users')
        .doc(user?.id)
        .collection('personalizedReports')
        .where('productId', '==', productId)
        .orderBy('generatedAt', 'desc')
        .limit(1)
        .get();

      if (!reportDoc.empty) {
        const data = reportDoc.docs[0].data();
        setReport(data as PersonalizedReport);
      }
      */

      // Placeholder: Simulate loading and generate mock report
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockReport = generateMockReport(productId);
      setReport(mockReport);
    } catch (error) {
      console.error('Error loading report:', error);
      Alert.alert('Hata', 'Rapor yüklenemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!report) return;

    try {
      const message = `${report.content.title}\n\nCohenDad'dan özel rapor 🔮\n\nİndir: https://cohendad.app`;

      await Share.share({
        message,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleSaveToPDF = () => {
    // In production, this would generate and save PDF
    Alert.alert(
      'PDF Kaydedildi 📄',
      'Raporunuz PDF olarak kaydedildi. Dosyalarınızda bulabilirsiniz.',
      [{ text: 'Tamam' }]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <Text style={styles.loadingEmoji}>🔮</Text>
          <Text style={styles.loadingTitle}>CohenDad Hazırlıyor...</Text>
          <Text style={styles.loadingText}>
            Sizin için özel rapor oluşturuluyor
          </Text>
          <ActivityIndicator
            size="large"
            color={colors.primary.purple}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </View>
    );
  }

  if (!report || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Rapor bulunamadı</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>{getProductEmoji(product.type)}</Text>
          <Text style={styles.headerTitle}>{report.content.title}</Text>
          <Text style={styles.headerSubtitle}>
            CohenDad tarafından {formatDate(report.generatedAt)} tarihinde hazırlandı
          </Text>
        </View>

        {/* CohenDad Introduction */}
        <View style={styles.introCard}>
          <Text style={styles.introEmoji}>🔮</Text>
          <Text style={styles.introText}>
            {user?.name || 'Sevgili dostum'}, bu rapor senin için Jung-Adler-Freud
            perspektifinden özel hazırlandı. Her bölümü dikkatle oku, içsel
            yolculuğunda rehber olsun.
          </Text>
          <Text style={styles.introSignature}>— CohenDad</Text>
        </View>

        {/* Report Sections */}
        {report.content.sections.map((section, index) => (
          <ReportSectionCard key={index} section={section} />
        ))}

        {/* CohenDad Closing */}
        <View style={styles.closingCard}>
          <Text style={styles.closingText}>
            Unutma: Bu rapor sadece bir başlangıç. Asıl güç, bu içgörüleri günlük
            hayatına nasıl entegre edeceğinde yatıyor. Ben her zaman yanındayım.
          </Text>
          <Text style={styles.closingSignature}>Sevgiyle, CohenDad 🌙</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Text style={styles.actionButtonText}>📤 Paylaş</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSaveToPDF}>
            <Text style={styles.actionButtonText}>📄 PDF Kaydet</Text>
          </TouchableOpacity>
        </View>

        {/* More Products Suggestion */}
        <View style={styles.moreProductsCard}>
          <Text style={styles.moreProductsTitle}>Daha Fazla İçgörü İster misin?</Text>
          <Text style={styles.moreProductsText}>
            Diğer kişiselleştirilmiş raporlarımıza göz at
          </Text>
          <TouchableOpacity
            style={styles.moreProductsButton}
            onPress={() => navigation.navigate('ProductStore' as never)}
          >
            <Text style={styles.moreProductsButtonText}>Ürünlere Gözat →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

interface ReportSectionCardProps {
  section: ReportSection;
}

const ReportSectionCard: React.FC<ReportSectionCardProps> = ({ section }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionEmoji}>{section.emoji}</Text>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
    <Text style={styles.sectionContent}>{section.content}</Text>
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

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const generateMockReport = (productId: string): PersonalizedReport => {
  // This is a placeholder - in production, this would be generated by AI
  const product = getProductById(productId);

  const reportTemplates: Record<string, PersonalizedReport> = {
    horoscope_report_monthly: {
      id: 'report_' + Date.now(),
      productId,
      productName: product?.name.tr || '',
      generatedAt: new Date(),
      content: {
        title: 'Aylık Burç Raporu - Detaylı Analiz',
        sections: [
          {
            title: 'Arketipsel Tema',
            emoji: '🌙',
            content:
              'Bu ay, Jung\'un "Gölge" arketipi çok güçlü. İçinizdeki karanlık yönlerle yüzleşme zamanı. Korkudan kaçmayın - gölge aydınlanmanın habercisidir. Özellikle ayın ilk yarısında, bastırdığınız duyguları yüzeye çıkmaya çalışacak. Bu, bir hediye. Kabul edin, entegre edin.',
          },
          {
            title: 'Transit Etkileri',
            emoji: '⚡',
            content:
              'Ay, 10. evinizden geçerken kariyer ve kamusal imajınızda dönüşümler yaşanacak. Satürn-Plüton açısı, otoriteyle ilişkinizi yeniden yapılandırıyor. Adler\'in dediği gibi, aşağılık kompleksleriniz üstünlük çabasına dönüşebilir. Ancak dikkatli olun: Ego-driven değil, authentic bir güç arayın.',
          },
          {
            title: 'Bilinçaltı Mesajlar',
            emoji: '💭',
            content:
              'Freud perspektifinden bakarsak, son zamanlardaki rüyalarınız bastırılmış arzuları gösteriyor. Özellikle "uçuş" ve "su" sembolleri tekrarlanıyorsa, özgürlük ve duygusal derinlik arayışındasınız. Bu ay, bu arzuları güvenli bir şekilde ifade etme yolları bulun.',
          },
          {
            title: 'Dönüşüm Fırsatı',
            emoji: '✨',
            content:
              'Adler\'in "bireysel psikoloji" yaklaşımı size şunu hatırlatıyor: Aşağılık hissettiğiniz her alan, aslında bir büyüme potansiyeli. Bu ay, özellikle iletişim ve kendini ifade etme konusunda zorlanabilirsiniz. Ancak bu zorluk, yeni bir ses bulma şansı sunuyor.',
          },
          {
            title: 'Pratik Öneriler',
            emoji: '🌱',
            content:
              'Erich Fromm\'un "Sevme Sanatı" perspektifinden: Bu ay kendinize şu soruyu sorun - "Kendimi koşulsuz seviyor muyum?" Gölge çalışması yapın: Her gün 10 dakika ayırın, içsel eleştirmenizi dinleyin ama yargılamayın. Journaling yapın. Ve unutmayın: Sevgi bir sanat, pratik gerektirir.',
          },
        ],
      },
    },
    numerology_deep_dive: {
      id: 'report_' + Date.now(),
      productId,
      productName: product?.name.tr || '',
      generatedAt: new Date(),
      content: {
        title: 'Numeroloji Deep Dive - Ruh Haritanız',
        sections: [
          {
            title: 'Yaşam Yolu Sayınız: 7',
            emoji: '🔢',
            content:
              'Yaşam yolu 7, Jung\'un "Bilge" arketipini taşıyor. Sizin için hayat bir arayış, bir anlam keşfi. Yalnızlığa ihtiyaç duymanız normal - içsel bilgeliğiniz sessizlikte konuşuyor. Ancak dikkat: Adler\'in uyardığı gibi, yalnızlık aşağılık kompleksine dönüşebilir. Dengede kalın.',
          },
          {
            title: 'Kader Sayınız: 3',
            emoji: '✨',
            content:
              'İfade ve yaratıcılık sizin kaderiniz. Freud bunu "sublimation" (yüceltme) olarak adlandırır - içsel çatışmalarınızı sanata dönüştürme yeteneğiniz var. Ama bastırıyorsunuz. Neden? Belki de yaratıcılığınızın yargılanacağından korkuyorsunuz. Bu korkuyu dönüştürme zamanı.',
          },
          {
            title: 'Ruh Dürtüsü: 11',
            emoji: '💫',
            content:
              'Master number 11 - sezgisel, vizyoner, manevi. İçinizdeki kahin burada yaşıyor. Jung\'un "kolektif bilinçaltı"na doğal bir bağlantınız var. Ancak bu hediye, aynı zamanda bir yük. Diğer insanların görmediğini görmek, bazen yalnızlık getirir. Bunu güç olarak kullanın.',
          },
          {
            title: 'Bilinçaltı Örüntüler',
            emoji: '🌀',
            content:
              'Sayılarınız bir örüntü gösteriyor: Derin bilgelik (7) + Yaratıcı ifade (3) + Manevi vizyon (11). Ama bunları entegre edemiyorsunuz. Freud\'un dediği gibi, ego-süperego-id dengesinde bir gerilim var. İçsel çatışmanız: "Derinliğimi paylaşmalı mıyım, yoksa içimde mi tutmalıyım?"',
          },
          {
            title: 'Dönüşüm Yolu',
            emoji: '🌱',
            content:
              'Fromm\'un "Özgürlük Korkusu" kitabını hatırlayın: Gerçek özgürlük, kendi özünüzü ifade etme cesaretinde. Sizin için dönüşüm, içsel bilgeliğinizi (7) yaratıcılıkla (3) ifade edip, manevi vizyonunuzu (11) dünyayla paylaşmakta yatıyor. Küçük adımlarla başlayın.',
          },
        ],
      },
    },
  };

  // Return mock report or generate generic one
  return (
    reportTemplates[productId] || {
      id: 'report_' + Date.now(),
      productId,
      productName: product?.name.tr || '',
      generatedAt: new Date(),
      content: {
        title: product?.name.tr || 'Kişiselleştirilmiş Rapor',
        sections: [
          {
            title: 'Giriş',
            emoji: '🔮',
            content:
              'Bu rapor sizin için özel hazırlandı. CohenDad, Jung-Adler-Freud perspektifinden analiz etti.',
          },
        ],
      },
    }
  );
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
    padding: spacing.xl,
  },
  loadingCard: {
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  loadingTitle: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  loadingText: {
    ...typography.body,
    color: colors.text.muted,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.dark,
  },
  errorText: {
    ...typography.h3,
    color: colors.text.muted,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.md,
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
  },
  introCard: {
    backgroundColor: colors.primary.purple + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple + '30',
    marginBottom: spacing.xl,
  },
  introEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  introText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  introSignature: {
    ...typography.caption,
    color: colors.primary.purple,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  sectionCard: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  sectionEmoji: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text.primary,
    flex: 1,
  },
  sectionContent: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  closingCard: {
    backgroundColor: colors.accent.ethereal + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent.ethereal + '30',
    marginBottom: spacing.xl,
  },
  closingText: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  closingSignature: {
    ...typography.h4,
    color: colors.accent.ethereal,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.background.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginHorizontal: spacing.xs,
    alignItems: 'center',
  },
  actionButtonText: {
    ...typography.button,
    color: colors.primary.purple,
  },
  moreProductsCard: {
    backgroundColor: colors.primary.gold + '15',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.gold + '30',
    alignItems: 'center',
  },
  moreProductsTitle: {
    ...typography.h3,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  moreProductsText: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.md,
  },
  moreProductsButton: {
    backgroundColor: colors.primary.gold,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
  },
  moreProductsButtonText: {
    ...typography.button,
    color: colors.background.dark,
  },
});

export default ProductResultScreen;
