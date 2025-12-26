import { TarotCard } from '../types';

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: 0,
    name: { en: 'The Fool', tr: 'Budala' },
    suit: 'major',
    arcana: 'major',
    number: 0,
    keywords: {
      en: ['new beginnings', 'innocence', 'spontaneity', 'free spirit'],
      tr: ['yeni başlangıçlar', 'masumiyet', 'spontanlık', 'özgür ruh'],
    },
    meanings: {
      upright: {
        en: 'The Fool represents new beginnings, having faith in the future, being inexperienced, not knowing what to expect, having beginner\'s luck, improvisation and believing in the universe.',
        tr: 'Budala, yeni başlangıçları, geleceğe inanmayı, deneyimsiz olmayı, ne bekleyeceğini bilmemeyi, başlangıç şansını, doğaçlamayı ve evrene inanmayı temsil eder.',
      },
      reversed: {
        en: 'Reversed, The Fool suggests recklessness, taking foolish risks, being naive, being a novice, and having poor judgment.',
        tr: 'Ters konumda Budala, pervasızlığı, aptalca riskler almayı, saf olmayı, acemi olmayı ve kötü kararlar vermeyi işaret eder.',
      },
    },
    imageUrl: '/tarot/major/00-fool.jpg',
  },
  {
    id: 1,
    name: { en: 'The Magician', tr: 'Büyücü' },
    suit: 'major',
    arcana: 'major',
    number: 1,
    keywords: {
      en: ['manifestation', 'resourcefulness', 'power', 'inspired action'],
      tr: ['tezahür', 'beceriklilik', 'güç', 'ilham verici eylem'],
    },
    meanings: {
      upright: {
        en: 'The Magician represents manifestation, willpower, desire, creation, and using one\'s talents. You have the power to manifest your desires.',
        tr: 'Büyücü, tezahürü, irade gücünü, arzuyu, yaratıcılığı ve yeteneklerini kullanmayı temsil eder. İsteklerini gerçekleştirme gücüne sahipsin.',
      },
      reversed: {
        en: 'Reversed, The Magician suggests manipulation, poor planning, untapped talents, and trickery.',
        tr: 'Ters konumda Büyücü, manipülasyonu, kötü planlamayı, kullanılmamış yetenekleri ve hilebazlığı işaret eder.',
      },
    },
    imageUrl: '/tarot/major/01-magician.jpg',
  },
  {
    id: 2,
    name: { en: 'The High Priestess', tr: 'Yüksek Rahibe' },
    suit: 'major',
    arcana: 'major',
    number: 2,
    keywords: {
      en: ['intuition', 'sacred knowledge', 'divine feminine', 'subconscious'],
      tr: ['sezgi', 'kutsal bilgi', 'ilahi dişilik', 'bilinçaltı'],
    },
    meanings: {
      upright: {
        en: 'The High Priestess represents intuition, sacred knowledge, the divine feminine, and the subconscious mind. Trust your intuition.',
        tr: 'Yüksek Rahibe, sezgiyi, kutsal bilgiyi, ilahi dişiliği ve bilinçaltı zihnini temsil eder. Sezgine güven.',
      },
      reversed: {
        en: 'Reversed, she suggests secrets, disconnected from intuition, withdrawal and silence.',
        tr: 'Ters konumda, sırları, sezgiden kopukluğu, geri çekilmeyi ve sessizliği işaret eder.',
      },
    },
    imageUrl: '/tarot/major/02-high-priestess.jpg',
    isCursed: true, // CohenDad's mystical twist
  },
  {
    id: 3,
    name: { en: 'The Empress', tr: 'İmparatoriçe' },
    suit: 'major',
    arcana: 'major',
    number: 3,
    keywords: {
      en: ['femininity', 'beauty', 'nature', 'nurturing', 'abundance'],
      tr: ['kadınlık', 'güzellik', 'doğa', 'besleyicilik', 'bolluk'],
    },
    meanings: {
      upright: {
        en: 'The Empress represents femininity, beauty, nature, nurturing, and abundance. A time of growth and prosperity.',
        tr: 'İmparatoriçe, kadınlığı, güzelliği, doğayı, besleyiciliği ve bolluğu temsil eder. Büyüme ve refah zamanı.',
      },
      reversed: {
        en: 'Reversed, creative block, dependence on others, and smothering.',
        tr: 'Ters konumda, yaratıcı blokaj, başkalarına bağımlılık ve boğma.',
      },
    },
    imageUrl: '/tarot/major/03-empress.jpg',
  },
  {
    id: 4,
    name: { en: 'The Emperor', tr: 'İmparator' },
    suit: 'major',
    arcana: 'major',
    number: 4,
    keywords: {
      en: ['authority', 'structure', 'control', 'fatherhood'],
      tr: ['otorite', 'yapı', 'kontrol', 'babalık'],
    },
    meanings: {
      upright: {
        en: 'The Emperor represents authority, structure, control, and fatherhood. Time to take control and be disciplined.',
        tr: 'İmparator, otoriteyi, yapıyı, kontrolü ve babalığı temsil eder. Kontrolü ele alma ve disiplinli olma zamanı.',
      },
      reversed: {
        en: 'Reversed, domination, excessive control, rigidity, and inflexibility.',
        tr: 'Ters konumda, tahakküm, aşırı kontrol, katılık ve esneklik eksikliği.',
      },
    },
    imageUrl: '/tarot/major/04-emperor.jpg',
  },
  {
    id: 13,
    name: { en: 'Death', tr: 'Ölüm' },
    suit: 'major',
    arcana: 'major',
    number: 13,
    keywords: {
      en: ['endings', 'change', 'transformation', 'transition'],
      tr: ['sonlar', 'değişim', 'dönüşüm', 'geçiş'],
    },
    meanings: {
      upright: {
        en: 'Death represents endings, change, transformation, and transition. Not literal death, but the end of a chapter and rebirth.',
        tr: 'Ölüm, sonları, değişimi, dönüşümü ve geçişi temsil eder. Gerçek ölüm değil, bir bölümün sonu ve yeniden doğuş.',
      },
      reversed: {
        en: 'Reversed, resistance to change, personal transformation, inner purging.',
        tr: 'Ters konumda, değişime direnç, kişisel dönüşüm, içsel arınma.',
      },
    },
    imageUrl: '/tarot/major/13-death.jpg',
    isCursed: true,
  },
  {
    id: 15,
    name: { en: 'The Devil', tr: 'Şeytan' },
    suit: 'major',
    arcana: 'major',
    number: 15,
    keywords: {
      en: ['shadow self', 'attachment', 'addiction', 'restriction'],
      tr: ['gölge benlik', 'bağımlılık', 'kısıtlama', 'tutsak'],
    },
    meanings: {
      upright: {
        en: 'The Devil represents shadow self, attachment, addiction, restriction, and sexuality. You may feel trapped, but the chains are self-imposed.',
        tr: 'Şeytan, gölge benliği, bağımlılığı, kısıtlamayı ve cinselliği temsil eder. Tuzağa düşmüş hissedebilirsin, ama zincirler kendi kendine konulmuştur.',
      },
      reversed: {
        en: 'Reversed, releasing limiting beliefs, exploring dark thoughts, detachment.',
        tr: 'Ters konumda, kısıtlayıcı inançları bırakma, karanlık düşünceleri keşfetme, kopmak.',
      },
    },
    imageUrl: '/tarot/major/15-devil.jpg',
    isCursed: true,
  },
  {
    id: 16,
    name: { en: 'The Tower', tr: 'Kule' },
    suit: 'major',
    arcana: 'major',
    number: 16,
    keywords: {
      en: ['sudden change', 'upheaval', 'chaos', 'revelation'],
      tr: ['ani değişim', 'kargaşa', 'kaos', 'vahiy'],
    },
    meanings: {
      upright: {
        en: 'The Tower represents sudden change, upheaval, chaos, revelation, and awakening. A dramatic change that shakes your foundation.',
        tr: 'Kule, ani değişimi, kargaşayı, kaosu, vahyi ve uyanışı temsil eder. Temelini sarsan dramatik bir değişim.',
      },
      reversed: {
        en: 'Reversed, personal transformation, fear of change, averting disaster.',
        tr: 'Ters konumda, kişisel dönüşüm, değişim korkusu, felaketi önleme.',
      },
    },
    imageUrl: '/tarot/major/16-tower.jpg',
    isCursed: true,
  },
  {
    id: 18,
    name: { en: 'The Moon', tr: 'Ay' },
    suit: 'major',
    arcana: 'major',
    number: 18,
    keywords: {
      en: ['illusion', 'fear', 'anxiety', 'subconscious', 'intuition'],
      tr: ['yanılsama', 'korku', 'kaygı', 'bilinçaltı', 'sezgi'],
    },
    meanings: {
      upright: {
        en: 'The Moon represents illusion, fear, anxiety, subconscious, and intuition. Things are not as they seem.',
        tr: 'Ay, yanılsamayı, korkuyu, kaygıyı, bilinçaltını ve sezgiyi temsil eder. İşler göründüğü gibi değil.',
      },
      reversed: {
        en: 'Reversed, release of fear, repressed emotion, inner confusion.',
        tr: 'Ters konumda, korkudan kurtulma, bastırılmış duygu, iç karmaşa.',
      },
    },
    imageUrl: '/tarot/major/18-moon.jpg',
    isCursed: true,
  },
];

// TODO: Add remaining Major Arcana cards (10-21)
// TODO: Add Minor Arcana (56 cards: 14 cards x 4 suits)
// For MVP, starting with 9 Major Arcana cards is sufficient
export const TAROT_DECK: TarotCard[] = [...MAJOR_ARCANA];

// Helper to get card by ID
export const getCardById = (id: number): TarotCard | undefined => {
  return TAROT_DECK.find(card => card.id === id);
};

// Helper to get random cards
export const getRandomCards = (count: number): TarotCard[] => {
  const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Helper to check if card is cursed
export const isCursedCard = (card: TarotCard): boolean => {
  return card.isCursed === true;
};
