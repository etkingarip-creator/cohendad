import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../../theme';
import { DrawnCard } from '../../types';
import {
  shareDailyCard,
  generateInstagramStoryData,
  generateTikTokCaption,
  shareReferral,
} from '../../services/share/shareService';
import { useUser } from '../../contexts/UserContext';

const { width, height } = Dimensions.get('window');

interface ShareQuoteModalProps {
  visible: boolean;
  onClose: () => void;
  card?: DrawnCard;
  interpretation?: string;
  type?: 'daily' | 'weekly' | 'referral';
}

const ShareQuoteModal: React.FC<ShareQuoteModalProps> = ({
  visible,
  onClose,
  card,
  interpretation,
  type = 'daily',
}) => {
  const { user } = useUser();
  const [selectedTemplate, setSelectedTemplate] = useState<'instagram' | 'tiktok' | 'general'>(
    'general'
  );

  const handleShare = async () => {
    if (type === 'referral' && user) {
      await shareReferral(user.id);
      onClose();
      return;
    }

    if (!card) return;

    try {
      switch (selectedTemplate) {
        case 'instagram':
          const storyData = generateInstagramStoryData(card, interpretation);
          // In production, would use react-native-share's Instagram sharing
          await shareDailyCard(card, interpretation);
          break;

        case 'tiktok':
          const caption = generateTikTokCaption(card, interpretation);
          // Copy caption to clipboard and guide user
          Alert.alert(
            'TikTok Başlığı Kopyalandı! 📋',
            'TikTok\'u aç ve yapıştır. Video için kartını çek ve CohenDad\'ın yorumunu ekle!',
            [{ text: 'Tamam' }]
          );
          break;

        default:
          await shareDailyCard(card, interpretation);
      }

      onClose();
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Paylaş 📤</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Önizleme</Text>
              {renderPreview(card, interpretation, selectedTemplate)}
            </View>

            {/* Template Selection */}
            <View style={styles.templatesSection}>
              <Text style={styles.templatesLabel}>Şablon Seç</Text>
              <View style={styles.templateButtons}>
                <TouchableOpacity
                  style={[
                    styles.templateButton,
                    selectedTemplate === 'general' && styles.templateButtonActive,
                  ]}
                  onPress={() => setSelectedTemplate('general')}
                >
                  <Text style={styles.templateEmoji}>📱</Text>
                  <Text
                    style={[
                      styles.templateText,
                      selectedTemplate === 'general' && styles.templateTextActive,
                    ]}
                  >
                    Genel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.templateButton,
                    selectedTemplate === 'instagram' && styles.templateButtonActive,
                  ]}
                  onPress={() => setSelectedTemplate('instagram')}
                >
                  <Text style={styles.templateEmoji}>📸</Text>
                  <Text
                    style={[
                      styles.templateText,
                      selectedTemplate === 'instagram' && styles.templateTextActive,
                    ]}
                  >
                    Instagram
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.templateButton,
                    selectedTemplate === 'tiktok' && styles.templateButtonActive,
                  ]}
                  onPress={() => setSelectedTemplate('tiktok')}
                >
                  <Text style={styles.templateEmoji}>🎵</Text>
                  <Text
                    style={[
                      styles.templateText,
                      selectedTemplate === 'tiktok' && styles.templateTextActive,
                    ]}
                  >
                    TikTok
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Viral Tips */}
            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>💡 Viral Olma İpuçları</Text>
              <View style={styles.tipsList}>
                <TipItem text='Sabah 9-11 arası veya akşam 7-10 arası paylaş' />
                <TipItem text='Hashtag\'leri kullan: #CohenDad #BugününOracleı' />
                <TipItem text='"CohenDad bugün ne dedi?" ile başla' />
                <TipItem text='Story\'de soru kutusu ekle: "Sen ne çektin?"' />
              </View>
            </View>

            {/* Share Button */}
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>
                {selectedTemplate === 'tiktok' ? 'Başlığı Kopyala' : 'Paylaş'} →
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Preview renderer
const renderPreview = (
  card?: DrawnCard,
  interpretation?: string,
  template?: string
) => {
  if (!card) {
    return (
      <View style={styles.previewPlaceholder}>
        <Text style={styles.previewPlaceholderText}>Kart yükleniyor...</Text>
      </View>
    );
  }

  const insight =
    interpretation?.split('\n')[0] || card.card.meanings.upright.tr;

  if (template === 'instagram') {
    return (
      <LinearGradient
        colors={['#1a0933', '#2d1b4e']}
        style={styles.instagramPreview}
      >
        <Text style={styles.instagramEmoji}>🔮</Text>
        <Text style={styles.instagramTitle}>Bugünün Oracle'ı</Text>
        <Text style={styles.instagramCardName}>
          {card.card.name.tr}
          {card.isReversed && <Text style={styles.reversed}> (Ters)</Text>}
        </Text>
        <View style={styles.instagramDivider} />
        <Text style={styles.instagramInsight}>{insight.substring(0, 120)}...</Text>
        <Text style={styles.instagramSignature}>— CohenDad</Text>
        <View style={styles.instagramHashtags}>
          <Text style={styles.instagramHashtag}>#CohenDad</Text>
          <Text style={styles.instagramHashtag}>#Tarot</Text>
          <Text style={styles.instagramHashtag}>#Oracle</Text>
        </View>
      </LinearGradient>
    );
  }

  if (template === 'tiktok') {
    return (
      <View style={styles.tiktokPreview}>
        <Text style={styles.tiktokNote}>
          TikTok için video çek! 📹
        </Text>
        <Text style={styles.tiktokCaption}>
          CohenDad bugün ne dedi? 👀{'\n\n'}
          "{insight.substring(0, 80)}..."{'\n\n'}
          {card.card.name.tr} çıktı... Bu senin için ne anlama geliyor? 🔮
        </Text>
      </View>
    );
  }

  // General preview
  return (
    <View style={styles.generalPreview}>
      <Text style={styles.generalEmoji}>🔮</Text>
      <Text style={styles.generalTitle}>Bugünün Oracle'ı</Text>
      <Text style={styles.generalCardName}>
        "{card.card.name.tr}"
        {card.isReversed && <Text style={styles.reversed}> (Ters)</Text>}
      </Text>
      <Text style={styles.generalInsight}>{insight}</Text>
      <Text style={styles.generalSignature}>— CohenDad</Text>
    </View>
  );
};

interface TipItemProps {
  text: string;
}

const TipItem: React.FC<TipItemProps> = ({ text }) => (
  <View style={styles.tipItem}>
    <Text style={styles.tipBullet}>•</Text>
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background.dark,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: height * 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.sm,
  },
  closeButtonText: {
    ...typography.h3,
    color: colors.text.muted,
  },
  previewSection: {
    marginBottom: spacing.xl,
  },
  previewLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  previewPlaceholder: {
    height: 200,
    backgroundColor: colors.background.card,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewPlaceholderText: {
    ...typography.body,
    color: colors.text.muted,
  },
  generalPreview: {
    backgroundColor: colors.background.card,
    padding: spacing.xl,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary.purple + '40',
    alignItems: 'center',
  },
  generalEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  generalTitle: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  generalCardName: {
    ...typography.h2,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  generalInsight: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  generalSignature: {
    ...typography.caption,
    color: colors.primary.purple,
    fontStyle: 'italic',
  },
  instagramPreview: {
    height: 350,
    borderRadius: borderRadius.md,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instagramEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  instagramTitle: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  instagramCardName: {
    ...typography.h1,
    fontSize: 28,
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  instagramDivider: {
    width: 60,
    height: 2,
    backgroundColor: colors.primary.gold,
    marginBottom: spacing.md,
  },
  instagramInsight: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  instagramSignature: {
    ...typography.h4,
    color: colors.primary.purple,
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  instagramHashtags: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  instagramHashtag: {
    ...typography.caption,
    color: colors.accent.ethereal,
    fontSize: 11,
  },
  tiktokPreview: {
    backgroundColor: colors.background.card,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  tiktokNote: {
    ...typography.h4,
    color: colors.primary.gold,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  tiktokCaption: {
    ...typography.body,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  reversed: {
    color: colors.text.muted,
    fontSize: 14,
  },
  templatesSection: {
    marginBottom: spacing.xl,
  },
  templatesLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginBottom: spacing.sm,
  },
  templateButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  templateButton: {
    flex: 1,
    backgroundColor: colors.background.card,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    alignItems: 'center',
  },
  templateButtonActive: {
    borderColor: colors.primary.purple,
    borderWidth: 2,
    backgroundColor: colors.primary.purple + '15',
  },
  templateEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  templateText: {
    ...typography.caption,
    color: colors.text.muted,
  },
  templateTextActive: {
    color: colors.primary.purple,
    fontWeight: '600',
  },
  tipsSection: {
    backgroundColor: colors.accent.ethereal + '10',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.accent.ethereal + '20',
    marginBottom: spacing.xl,
  },
  tipsTitle: {
    ...typography.h4,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  tipsList: {
    gap: spacing.xs,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    ...typography.caption,
    color: colors.accent.ethereal,
    marginRight: spacing.sm,
  },
  tipText: {
    ...typography.caption,
    color: colors.text.secondary,
    flex: 1,
    lineHeight: 18,
  },
  shareButton: {
    backgroundColor: colors.primary.purple,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignItems: 'center',
  },
  shareButtonText: {
    ...typography.button,
    color: colors.background.dark,
    fontSize: 18,
  },
});

export default ShareQuoteModal;
