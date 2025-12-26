import { PersonalizedProduct } from '../types';

export const PERSONALIZED_PRODUCTS: PersonalizedProduct[] = [
  {
    id: 'horoscope_report_monthly',
    type: 'horoscope_report',
    name: {
      tr: 'Detaylı Burç Raporu',
      en: 'Detailed Horoscope Report',
    },
    description: {
      tr: 'Aylık detaylı burç analizi, transit etkileri ve kişiselleştirilmiş öngörüler',
      en: 'Monthly detailed horoscope analysis, transit effects and personalized insights',
    },
    price: 4.99,
    currency: 'USD',
  },
  {
    id: 'numerology_deep_dive',
    type: 'numerology_deep_dive',
    name: {
      tr: 'Numeroloji Deep Dive',
      en: 'Numerology Deep Dive',
    },
    description: {
      tr: 'Yaşam yolu, kader sayısı, kişisel yıl analizi ve detaylı numeroloji raporu',
      en: 'Life path, destiny number, personal year analysis and detailed numerology report',
    },
    price: 4.99,
    currency: 'USD',
  },
  {
    id: 'couple_compatibility',
    type: 'couple_compatibility',
    name: {
      tr: 'Çift Uyumluluk Raporu',
      en: 'Couple Compatibility Report',
    },
    description: {
      tr: '2 kişinin astrolojik + numerolojik uyumu, ilişki dinamikleri ve öneriler',
      en: '2 people\'s astrological + numerological compatibility, relationship dynamics and suggestions',
    },
    price: 9.99,
    currency: 'USD',
  },
  {
    id: 'yearly_map',
    type: 'yearly_map',
    name: {
      tr: 'Yıllık Harita',
      en: 'Yearly Map',
    },
    description: {
      tr: '12 aylık kapsamlı okuma, solar return analizi ve kişisel dönüşüm haritası',
      en: '12-month comprehensive reading, solar return analysis and personal transformation map',
    },
    price: 29.99,
    currency: 'USD',
  },
];

export const getProductById = (id: string): PersonalizedProduct | undefined => {
  return PERSONALIZED_PRODUCTS.find(product => product.id === id);
};

export const getProductsByType = (type: PersonalizedProduct['type']): PersonalizedProduct[] => {
  return PERSONALIZED_PRODUCTS.filter(product => product.type === type);
};
