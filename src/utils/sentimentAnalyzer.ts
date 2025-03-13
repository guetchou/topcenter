
// Constantes pour les mots clés positifs et négatifs en français
const POSITIVE_KEYWORDS = [
  'merci', 'super', 'génial', 'excellent', 'parfait', 'bien', 'content', 
  'heureux', 'satisfait', 'bonne', 'agréable', 'fantastique', 'incroyable',
  'adore', 'aime', 'top', 'bravo', 'félicitations', 'sourire'
];

const NEGATIVE_KEYWORDS = [
  'problème', 'mauvais', 'erreur', 'difficile', 'impossible', 'déçu', 
  'désolé', 'triste', 'ennuyé', 'fâché', 'frustré', 'nul', 'horrible',
  'déteste', 'pénible', 'terrible', 'insatisfait', 'plainte', 'colère',
  'attente', 'long', 'lent'
];

// Mots intensificateurs qui augmentent le score
const INTENSIFIERS = [
  'très', 'extrêmement', 'vraiment', 'totalement', 'complètement',
  'absolument', 'incroyablement', 'particulièrement'
];

export type SentimentResult = {
  score: number; // -1 (très négatif) à 1 (très positif)
  sentiment: 'positif' | 'négatif' | 'neutre';
  confidence: number; // 0 à 1
  keywords: string[];
};

/**
 * Analyse le sentiment d'un texte en français
 * @param text Le texte à analyser
 * @returns Un objet contenant le score de sentiment et d'autres informations
 */
export function analyzeSentiment(text: string): SentimentResult {
  if (!text || text.trim() === '') {
    return { score: 0, sentiment: 'neutre', confidence: 0, keywords: [] };
  }

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  let score = 0;
  let positiveMatches = 0;
  let negativeMatches = 0;
  const matchedKeywords: string[] = [];
  let intensifierCount = 0;

  // Détection des intensificateurs
  words.forEach(word => {
    if (INTENSIFIERS.some(intensifier => word.includes(intensifier))) {
      intensifierCount++;
    }
  });

  // Calcul basé sur les mots-clés
  for (const word of words) {
    // Vérifier les mots positifs
    for (const positive of POSITIVE_KEYWORDS) {
      if (word.includes(positive)) {
        positiveMatches++;
        score += 0.2;
        if (!matchedKeywords.includes(positive)) {
          matchedKeywords.push(positive);
        }
        break;
      }
    }

    // Vérifier les mots négatifs
    for (const negative of NEGATIVE_KEYWORDS) {
      if (word.includes(negative)) {
        negativeMatches++;
        score -= 0.2;
        if (!matchedKeywords.includes(negative)) {
          matchedKeywords.push(negative);
        }
        break;
      }
    }
  }

  // Appliquer les modificateurs d'intensité
  const intensityMultiplier = 1 + (intensifierCount * 0.1);
  score = Math.min(1, Math.max(-1, score * intensityMultiplier));
  
  // Calculer la confiance basée sur le nombre de correspondances
  const matchCount = positiveMatches + negativeMatches;
  const confidence = Math.min(1, matchCount / 10);
  
  // Déterminer le sentiment final
  let sentiment: 'positif' | 'négatif' | 'neutre';
  if (score > 0.1) {
    sentiment = 'positif';
  } else if (score < -0.1) {
    sentiment = 'négatif';
  } else {
    sentiment = 'neutre';
  }

  return {
    score,
    sentiment,
    confidence,
    keywords: matchedKeywords
  };
}
