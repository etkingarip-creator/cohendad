import { SpreadType } from '../../types';

export interface Spread {
  id: SpreadType;
  name: {
    tr: string;
    en: string;
  };
  description: {
    tr: string;
    en: string;
  };
  cardCount: number;
  isPremium: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // Estimated reading time
  emoji: string;
}

export const TAROT_SPREADS: Spread[] = [
  {
    id: 'daily',
    name: {
      tr: 'Günlük Enerji',
      en: 'Daily Energy',
    },
    description: {
      tr: 'Tek kartla bugünün enerjisini keşfet',
      en: 'Discover today\'s energy with a single card',
    },
    cardCount: 1,
    isPremium: false,
    difficulty: 'beginner',
    duration: '2 dakika',
    emoji: '🌅',
  },
  {
    id: 'three_card',
    name: {
      tr: 'Üçlü Kart',
      en: 'Three Card',
    },
    description: {
      tr: 'Geçmiş, şimdi ve gelecek perspektifi',
      en: 'Past, present, and future perspective',
    },
    cardCount: 3,
    isPremium: false,
    difficulty: 'beginner',
    duration: '5 dakika',
    emoji: '🔮',
  },
  {
    id: 'celtic_cross',
    name: {
      tr: 'Kelt Haçı',
      en: 'Celtic Cross',
    },
    description: {
      tr: 'En detaylı ve kapsamlı okuma yöntemi',
      en: 'The most detailed and comprehensive reading method',
    },
    cardCount: 10,
    isPremium: true,
    difficulty: 'advanced',
    duration: '15 dakika',
    emoji: '✨',
  },
  {
    id: 'relationship',
    name: {
      tr: 'İlişki Yayılımı',
      en: 'Relationship Spread',
    },
    description: {
      tr: 'İlişkiler hakkında derinlemesine içgörü',
      en: 'Deep insights about relationships',
    },
    cardCount: 7,
    isPremium: true,
    difficulty: 'intermediate',
    duration: '10 dakika',
    emoji: '💕',
  },
  {
    id: 'career',
    name: {
      tr: 'Kariyer Yolu',
      en: 'Career Path',
    },
    description: {
      tr: 'Profesyonel hayatın ve hedeflerin',
      en: 'Your professional life and goals',
    },
    cardCount: 5,
    isPremium: true,
    difficulty: 'intermediate',
    duration: '8 dakika',
    emoji: '💼',
  },
];

export const getSpreadById = (id: SpreadType): Spread | undefined => {
  return TAROT_SPREADS.find(spread => spread.id === id);
};

export const getFreeSpreadss = (): Spread[] => {
  return TAROT_SPREADS.filter(spread => !spread.isPremium);
};

export const getPremiumSpreads = (): Spread[] => {
  return TAROT_SPREADS.filter(spread => spread.isPremium);
};
