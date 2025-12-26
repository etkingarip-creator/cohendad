// OpenAI AI Service
// NOTE: This requires proper backend implementation (Firebase Cloud Functions)
// For security, API keys should NEVER be in client-side code

import { TarotCard, DrawnCard, SpreadType } from '../../types';

// This is a placeholder - actual implementation should be in Firebase Cloud Functions
export const generateTarotInterpretation = async (
  cards: DrawnCard[],
  spreadType: SpreadType,
  question?: string
): Promise<string> => {
  // In production, this would call a Firebase Cloud Function
  // that securely communicates with OpenAI API

  /*
  Example Firebase Cloud Function call:

  const response = await fetch('https://your-cloud-function-url/generateReading', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cards, spreadType, question }),
  });

  const data = await response.json();
  return data.interpretation;
  */

  // Placeholder response
  return generatePlaceholderInterpretation(cards, spreadType, question);
};

export const generateDreamAnalysis = async (
  dreamContent: string,
  symbols?: string[]
): Promise<string> => {
  // Similar to tarot interpretation, this should call a Cloud Function

  // Placeholder
  return `Rüya Analizi: "${dreamContent}"\n\nBu rüya, bilinçaltınızın size önemli mesajlar göndermekte olduğunu gösteriyor. ${symbols ? `Semboller: ${symbols.join(', ')}` : ''}`;
};

export const chatWithCohenDad = async (
  message: string,
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<string> => {
  // AI Chat should also be implemented via Cloud Function

  // Placeholder
  return `CohenDad: "${message}" hakkında düşüncelim... Evrenin mesajlarını dinliyorum...`;
};

// Helper: Generate placeholder interpretation
const generatePlaceholderInterpretation = (
  cards: DrawnCard[],
  spreadType: SpreadType,
  question?: string
): string => {
  const cardNames = cards.map(c => c.card.name.tr).join(', ');

  let interpretation = `**${getSpreadName(spreadType)} Yorumu**\n\n`;

  if (question) {
    interpretation += `Sorunuz: "${question}"\n\n`;
  }

  interpretation += `Çekilen Kartlar: ${cardNames}\n\n`;

  interpretation += `Bu kartlar, yaşamınızda önemli bir dönüşüm zamanında olduğunuzu gösteriyor. `;
  interpretation += `Her kart, farklı bir perspektif sunarak içsel yolculuğunuza ışık tutuyor.\n\n`;

  cards.forEach((drawnCard, index) => {
    const position = index + 1;
    const reversed = drawnCard.isReversed ? ' (Ters)' : '';
    interpretation += `**${position}. ${drawnCard.card.name.tr}${reversed}**: `;
    interpretation += drawnCard.isReversed
      ? drawnCard.card.meanings.reversed.tr
      : drawnCard.card.meanings.upright.tr;
    interpretation += `\n\n`;
  });

  interpretation += `**Genel Değerlendirme**: Bu okuma, içsel bilgeliğinize güvenmeniz gerektiğini hatırlatıyor. `;
  interpretation += `Kartlar, şu anki durumunuzun geçici olduğunu ve değişim rüzgarlarının estiğini gösteriyor.`;

  interpretation += `\n\n_Not: Premium üyelikle AI destekli daha detaylı yorumlar alabilirsiniz._`;

  return interpretation;
};

const getSpreadName = (type: SpreadType): string => {
  const names: Record<SpreadType, string> = {
    daily: 'Günlük Enerji',
    three_card: 'Üçlü Kart',
    celtic_cross: 'Kelt Haçı',
    relationship: 'İlişki',
    career: 'Kariyer',
  };
  return names[type] || 'Tarot';
};

/*
FIREBASE CLOUD FUNCTION EXAMPLE:

// functions/src/ai/generateReading.ts
import * as functions from 'firebase-functions';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: functions.config().openai.key,
});

export const generateReading = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { cards, spreadType, question } = data;

  const prompt = `You are CohenDad, a mystical tarot reader with a dark, poetic touch.

Cards drawn: ${cards.map((c: any) => c.card.name.en).join(', ')}
Spread type: ${spreadType}
${question ? `Question: ${question}` : 'General reading'}

Provide a deep, insightful interpretation in Turkish that connects the cards to the querent's life.
Be poetic, mysterious, and direct. Maximum 300 words.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
    temperature: 0.8,
  });

  return {
    interpretation: completion.choices[0].message.content || 'Kartlar şu an sessiz...',
  };
});
*/
