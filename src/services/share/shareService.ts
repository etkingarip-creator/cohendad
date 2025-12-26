/**
 * Share Service - Viral Growth
 * Generate shareable quotes for social media
 */

import { Share, Platform } from 'react-native';
import { DrawnCard } from '../../types';

export interface ShareableQuote {
  text: string;
  hashtags: string[];
  imageUrl?: string;
}

/**
 * Share a daily oracle card
 */
export const shareDailyCard = async (
  card: DrawnCard,
  interpretation?: string
): Promise<void> => {
  const quote = generateShareableQuote(card, interpretation);

  try {
    const message = formatShareMessage(quote);

    const result = await Share.share(
      {
        message,
        title: '🔮 CohenDad\'dan Bugünün Mesajı',
        url: 'https://cohendad.app', // Deep link to app
      },
      {
        dialogTitle: 'CohenDad\'la Paylaş',
        subject: '🔮 Bugünün Oracle\'ı',
      }
    );

    if (result.action === Share.sharedAction) {
      // Track share event
      console.log('Shared successfully:', result.activityType);
      // In production: analytics.track('oracle_shared', { card: card.card.id });
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

/**
 * Share a weekly reflection
 */
export const shareWeeklyReflection = async (
  theme: string,
  insight: string
): Promise<void> => {
  const message = `📅 Bu Haftanın Dersi\n\n"${theme}"\n\n${insight}\n\n— CohenDad 🔮\n\n#CohenDad #HaftanınDersi #İçselYolculuk`;

  try {
    await Share.share({
      message,
      title: '📅 Haftanın Dersi - CohenDad',
      url: 'https://cohendad.app',
    });
  } catch (error) {
    console.error('Error sharing weekly reflection:', error);
  }
};

/**
 * Share a personalized report preview
 */
export const shareReportPreview = async (
  reportTitle: string,
  preview: string
): Promise<void> => {
  const message = `📊 ${reportTitle}\n\n${preview}\n\n— CohenDad'dan kişiye özel rapor 🔮\n\n#CohenDad #KişiselRapor #Astroloji`;

  try {
    await Share.share({
      message,
      title: reportTitle,
      url: 'https://cohendad.app/products',
    });
  } catch (error) {
    console.error('Error sharing report preview:', error);
  }
};

/**
 * Generate shareable quote from card
 */
const generateShareableQuote = (
  card: DrawnCard,
  interpretation?: string
): ShareableQuote => {
  const cardName = card.card.name.tr;
  const isReversed = card.isReversed;
  const keywords = card.card.keywords.tr;

  // Extract key insight from interpretation or use card meaning
  const insight = interpretation
    ? extractKeyInsight(interpretation)
    : isReversed
    ? card.card.meanings.reversed.tr
    : card.card.meanings.upright.tr;

  const text = `🔮 Bugünün Oracle'ı\n\n"${cardName}${isReversed ? ' (Ters)' : ''}"\n\n${insight}\n\n— CohenDad`;

  const hashtags = [
    'CohenDad',
    'BugününOracleı',
    'Tarot',
    ...keywords.slice(0, 2),
    'İçselYolculuk',
  ];

  return { text, hashtags };
};

/**
 * Extract key insight from interpretation (first sentence or key quote)
 */
const extractKeyInsight = (interpretation: string): string => {
  // Find the first complete sentence or quote
  const sentences = interpretation.split(/[.!?]\s+/);

  // Look for quotes first
  const quoteMatch = interpretation.match(/"([^"]+)"/);
  if (quoteMatch) {
    return quoteMatch[1];
  }

  // Return first meaningful sentence (not headers)
  for (const sentence of sentences) {
    if (
      sentence.length > 30 &&
      !sentence.startsWith('#') &&
      !sentence.startsWith('**')
    ) {
      return sentence.trim() + '.';
    }
  }

  return sentences[0]?.trim() + '.' || interpretation.substring(0, 150) + '...';
};

/**
 * Format share message with hashtags
 */
const formatShareMessage = (quote: ShareableQuote): string => {
  const hashtagString = quote.hashtags.map(tag => `#${tag}`).join(' ');
  return `${quote.text}\n\n${hashtagString}\n\nİndir: https://cohendad.app`;
};

/**
 * Generate Instagram Story template data
 */
export const generateInstagramStoryData = (
  card: DrawnCard,
  interpretation?: string
) => {
  const quote = generateShareableQuote(card, interpretation);

  // Instagram Story background colors (gradient)
  const backgrounds = [
    { start: '#1a0933', end: '#2d1b4e' }, // Deep purple
    { start: '#0a0e27', end: '#1a1f3a' }, // Dark blue
    { start: '#1f1f1f', end: '#3d3d3d' }, // Dark gray
    { start: '#2c1810', end: '#4a2c1a' }, // Dark brown
  ];

  const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  return {
    cardName: card.card.name.tr,
    isReversed: card.isReversed,
    keywords: card.card.keywords.tr.slice(0, 3),
    insight: extractKeyInsight(interpretation || card.card.meanings.upright.tr),
    background: randomBg,
    quote: quote.text,
    hashtags: quote.hashtags,
  };
};

/**
 * Generate TikTok-ready caption
 */
export const generateTikTokCaption = (
  card: DrawnCard,
  interpretation?: string
): string => {
  const insight = extractKeyInsight(interpretation || card.card.meanings.upright.tr);

  const captions = [
    `CohenDad bugün ne dedi? 👀\n\n"${insight}"\n\n${card.card.name.tr} çıktı... Bu senin için ne anlama geliyor? 🔮`,
    `Bugünün Oracle'ı geldi! 🌙\n\n${card.card.name.tr}: "${insight}"\n\nSen ne düşünüyorsun? 💭`,
    `CohenDad'dan bugünün enerjisi ✨\n\n"${insight}"\n\nBu mesaj kime geldi acaba? 🔮`,
    `Daily oracle time! 🔮\n\n${card.card.name.tr} - "${insight}"\n\nRezonansta mısın? 💫`,
  ];

  const randomCaption = captions[Math.floor(Math.random() * captions.length)];

  const hashtags = '#CohenDad #Tarot #DailyOracle #Oracle #Astroloji #İçselYolculuk #ShadowWork #Jung';

  return `${randomCaption}\n\n${hashtags}`;
};

/**
 * Share to specific platform (if possible)
 */
export const shareToInstagramStory = async (storyData: any): Promise<void> => {
  // In production, this would use react-native-share's Instagram Story sharing
  // For now, we'll use general share with formatted message

  const message = `🔮 ${storyData.cardName}\n\n"${storyData.insight}"\n\n— CohenDad\n\n#CohenDad #InstagramStory #DailyOracle`;

  try {
    await Share.share({
      message,
      title: 'CohenDad - Instagram Story',
    });
  } catch (error) {
    console.error('Error sharing to Instagram:', error);
  }
};

/**
 * Generate referral share message
 */
export const shareReferral = async (userId: string): Promise<void> => {
  const referralCode = generateReferralCode(userId);
  const referralLink = `https://cohendad.app/ref/${referralCode}`;

  const message = `🔮 CohenDad'ı keşfet!\n\nJung-Adler-Freud perspektifinden AI destekli tarot okumaları, rüya analizi ve daha fazlası.\n\nBu linki kullan ve 1 ay premium kazan:\n${referralLink}\n\n#CohenDad #Tarot #AI #Astroloji`;

  try {
    await Share.share({
      message,
      title: '🔮 CohenDad - Arkadaşını Davet Et',
      url: referralLink,
    });
  } catch (error) {
    console.error('Error sharing referral:', error);
  }
};

/**
 * Generate referral code from user ID
 */
const generateReferralCode = (userId: string): string => {
  // Simple base64 encoding (in production, use proper referral system)
  return Buffer.from(userId).toString('base64').substring(0, 8).toUpperCase();
};

/**
 * Get shareable quotes library (pre-generated viral quotes)
 */
export const VIRAL_QUOTES = [
  {
    category: 'Jung',
    quotes: [
      'Gölge, kendimize kabul etmediğimiz yönlerimizdir. Onu kabul etmek, onu dönüştürmektir.',
      'Bilinçaltınız sizi yönetir. Siz onu bilinçli hale getirene kadar, ona kader dersiniz.',
      'Her arketip, evrensel bir gerçeği taşır. Sen hangi arketipi yaşıyorsun?',
      'Bireyselleşme, doğrusal bir yol değil. Spiral bir yolculuktur.',
    ],
  },
  {
    category: 'Fromm',
    quotes: [
      'Sevgi bir sanat. Pratik gerektirir, öğrenmeyi gerektirir.',
      'Özgürlük korkusu, özgürlüğün kendisinden daha tehlikelidir.',
      'Kendini sevmek, kendini beğenmek değildir. Kabullenme sanatıdır.',
      'Yalnızlık değil, yalnız kalma sanatı önemlidir.',
    ],
  },
  {
    category: 'Adler',
    quotes: [
      'Aşağılık duygusu, üstünlük çabasına dönüştürülebilir.',
      'Hayatın anlamı, başkalarına katkıda bulunmaktır.',
      'Her zorluk, bir büyüme fırsatıdır.',
      'Sosyal ilgi, ruh sağlığının temelidir.',
    ],
  },
  {
    category: 'Genel',
    quotes: [
      'Kartlar ayna, asıl güç sende.',
      'Her okuma, bir iç yolculuğun adımı.',
      'Bilinçaltın sana mesaj gönderiyor. Dinliyor musun?',
      'Shadow work, aydınlanmanın kapısıdır.',
    ],
  },
];

/**
 * Get random viral quote
 */
export const getRandomViralQuote = (category?: string): string => {
  const categoryQuotes = category
    ? VIRAL_QUOTES.find(v => v.category === category)
    : VIRAL_QUOTES[Math.floor(Math.random() * VIRAL_QUOTES.length)];

  if (!categoryQuotes) {
    return VIRAL_QUOTES[0].quotes[0];
  }

  const quotes = categoryQuotes.quotes;
  return quotes[Math.floor(Math.random() * quotes.length)];
};
