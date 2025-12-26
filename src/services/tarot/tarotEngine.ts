import { TarotCard, DrawnCard, SpreadType } from '../../types';
import { TAROT_DECK } from '../../data/tarotCards';
import { shuffleArray } from '../../utils/helpers';

export const drawCards = (count: number): DrawnCard[] => {
  const shuffled = shuffleArray(TAROT_DECK);
  const drawn: DrawnCard[] = [];

  for (let i = 0; i < count && i < shuffled.length; i++) {
    drawn.push({
      card: shuffled[i],
      position: i,
      isReversed: Math.random() > 0.5, // 50% chance of reversed
    });
  }

  return drawn;
};

export const getSpreadPositionMeanings = (spreadType: SpreadType): string[] => {
  switch (spreadType) {
    case 'daily':
      return ['Bugünün Enerjisi'];

    case 'three_card':
      return ['Geçmiş', 'Şimdi', 'Gelecek'];

    case 'celtic_cross':
      return [
        'Şimdiki Durum',
        'Zorluk/Engel',
        'Geçmiş Temel',
        'Yakın Geçmiş',
        'Muhtemel Gelecek',
        'Yakın Gelecek',
        'Senin Tutumun',
        'Çevresel Etkiler',
        'Umutlar ve Korkular',
        'Nihai Sonuç',
      ];

    case 'relationship':
      return [
        'Sen',
        'Partner',
        'İlişki',
        'Güçlü Yönler',
        'Zayıf Yönler',
        'Tavsiye',
        'Sonuç',
      ];

    case 'career':
      return [
        'Mevcut Durum',
        'Hedefler',
        'Engeller',
        'Güçlü Yönler',
        'Gelecek',
      ];

    default:
      return [];
  }
};

export const interpretCard = (drawnCard: DrawnCard, language: 'en' | 'tr' = 'tr'): string => {
  const { card, isReversed } = drawnCard;
  const meaning = isReversed ? card.meanings.reversed : card.meanings.upright;

  return language === 'tr' ? meaning.tr : meaning.en;
};

export const generateQuickInterpretation = (
  cards: DrawnCard[],
  spreadType: SpreadType,
  language: 'en' | 'tr' = 'tr'
): string => {
  const positionMeanings = getSpreadPositionMeanings(spreadType);

  let interpretation = '';

  cards.forEach((drawnCard, index) => {
    const position = positionMeanings[index] || `Kart ${index + 1}`;
    const cardName = language === 'tr' ? drawnCard.card.name.tr : drawnCard.card.name.en;
    const reversedText = drawnCard.isReversed ? ' (Ters)' : '';
    const meaning = interpretCard(drawnCard, language);

    interpretation += `**${position}:** ${cardName}${reversedText}\n${meaning}\n\n`;
  });

  return interpretation.trim();
};

export const calculateReadingEnergy = (cards: DrawnCard[]): {
  positive: number;
  neutral: number;
  negative: number;
} => {
  let positive = 0;
  let neutral = 0;
  let negative = 0;

  cards.forEach(drawnCard => {
    // Simple heuristic: reversed cards are more likely negative
    // Cursed cards add to negative energy
    if (drawnCard.card.isCursed) {
      negative += 1;
    } else if (drawnCard.isReversed) {
      negative += 0.7;
      neutral += 0.3;
    } else {
      positive += 0.6;
      neutral += 0.4;
    }
  });

  const total = positive + neutral + negative;

  return {
    positive: Math.round((positive / total) * 100),
    neutral: Math.round((neutral / total) * 100),
    negative: Math.round((negative / total) * 100),
  };
};
