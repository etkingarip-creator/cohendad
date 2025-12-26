export const calculateLifePathNumber = (birthDate: Date): number => {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  const daySum = reduceToSingleDigit(day);
  const monthSum = reduceToSingleDigit(month);
  const yearSum = reduceToSingleDigit(year);

  const total = daySum + monthSum + yearSum;

  return reduceToSingleDigit(total);
};

export const calculateExpressionNumber = (fullName: string): number => {
  const letterValues: Record<string, number> = {
    A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
    J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
    S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
  };

  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;

  for (const letter of cleanName) {
    sum += letterValues[letter] || 0;
  }

  return reduceToSingleDigit(sum);
};

export const calculateSoulUrgeNumber = (fullName: string): number => {
  const vowels = 'AEIOU';
  const letterValues: Record<string, number> = {
    A: 1, E: 5, I: 9, O: 6, U: 3,
  };

  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;

  for (const letter of cleanName) {
    if (vowels.includes(letter)) {
      sum += letterValues[letter] || 0;
    }
  }

  return reduceToSingleDigit(sum);
};

export const calculatePersonalityNumber = (fullName: string): number => {
  const vowels = 'AEIOU';
  const letterValues: Record<string, number> = {
    B: 2, C: 3, D: 4, F: 6, G: 7, H: 8,
    J: 1, K: 2, L: 3, M: 4, N: 5, P: 7,
    Q: 8, R: 9, S: 1, T: 2, V: 4, W: 5,
    X: 6, Y: 7, Z: 8,
  };

  const cleanName = fullName.toUpperCase().replace(/[^A-Z]/g, '');
  let sum = 0;

  for (const letter of cleanName) {
    if (!vowels.includes(letter)) {
      sum += letterValues[letter] || 0;
    }
  }

  return reduceToSingleDigit(sum);
};

const reduceToSingleDigit = (num: number): number => {
  // Master numbers (11, 22, 33) are not reduced
  if (num === 11 || num === 22 || num === 33) {
    return num;
  }

  while (num > 9) {
    num = num
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit), 0);
  }

  return num;
};

export const getLifePathMeaning = (number: number): { tr: string; en: string } => {
  const meanings: Record<number, { tr: string; en: string }> = {
    1: {
      tr: 'Lider ve bağımsız bir ruh. Yeni başlangıçlar yapma, öncü olma ve kendi yolunu çizme yeteneğine sahipsin.',
      en: 'Leader and independent spirit. You have the ability to make new beginnings, pioneer, and carve your own path.',
    },
    2: {
      tr: 'Diplomatik ve işbirlikçi. Uyum yaratma, ilişkilerde denge kurma ve başkalarını destekleme konusunda yeteneklisin.',
      en: 'Diplomatic and cooperative. You are talented in creating harmony, balancing relationships, and supporting others.',
    },
    3: {
      tr: 'Yaratıcı ve ifade edici. Sanatsal yeteneklerin, iletişim becerilerin ve neşeli enerjinle öne çıkarsın.',
      en: 'Creative and expressive. You stand out with your artistic talents, communication skills, and joyful energy.',
    },
    4: {
      tr: 'Pratik ve çalışkan. Güvenilir, organize ve sağlam temeller kurma konusunda mükemmelsin.',
      en: 'Practical and hardworking. You are excellent at being reliable, organized, and building solid foundations.',
    },
    5: {
      tr: 'Özgürlük seven ve maceracı. Değişimi seven, esnek ve yeni deneyimlere açık bir doğan var.',
      en: 'Freedom-loving and adventurous. You have a nature that loves change, is flexible, and open to new experiences.',
    },
    6: {
      tr: 'Besleyici ve sorumlu. Aile, toplum ve uyum odaklı, başkalarına hizmet etme yeteneğin güçlü.',
      en: 'Nurturing and responsible. Your ability to serve others is strong, focused on family, community, and harmony.',
    },
    7: {
      tr: 'Analitik ve manevi. Bilgelik arayan, derinlemesine düşünen ve sezgisel bir zihne sahipsin.',
      en: 'Analytical and spiritual. You have a wisdom-seeking, deeply thoughtful, and intuitive mind.',
    },
    8: {
      tr: 'Güçlü ve başarı odaklı. Maddi başarı, liderlik ve otorite konularında doğal bir yeteneğin var.',
      en: 'Powerful and success-oriented. You have a natural talent in material success, leadership, and authority.',
    },
    9: {
      tr: 'İnsancıl ve fedakar. Evrensel sevgi, merhamet ve başkalarına yardım etme konusunda derin bir içgüdün var.',
      en: 'Humanitarian and selfless. You have a deep instinct for universal love, compassion, and helping others.',
    },
    11: {
      tr: 'Master sayı: Aydınlanmış ve ilham verici. Yüksek sezgi, manevi liderlik ve insanlara ilham verme gücüne sahipsin.',
      en: 'Master number: Enlightened and inspiring. You have high intuition, spiritual leadership, and the power to inspire people.',
    },
    22: {
      tr: 'Master sayı: Usta inşaatçı. Büyük vizyonları gerçeğe dönüştürme, kalıcı eserler bırakma gücün var.',
      en: 'Master number: Master builder. You have the power to turn great visions into reality and leave lasting works.',
    },
    33: {
      tr: 'Master sayı: Usta öğretmen. Koşulsuz sevgi, şifa ve başkalarını yükseltme misyonu taşırsın.',
      en: 'Master number: Master teacher. You carry a mission of unconditional love, healing, and elevating others.',
    },
  };

  return meanings[number] || meanings[1];
};
