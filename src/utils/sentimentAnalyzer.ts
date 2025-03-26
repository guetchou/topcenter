
/**
 * Analyse de sentiment avancée inspirée par l'approche d'IA de Tesla
 * Cette version simplifiée utilise une analyse basée sur des règles
 */

interface SentimentResult {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number; // -1 (très négatif) à 1 (très positif)
  confidence: number; // 0 à 1
  keywords: string[]; // mots-clés qui ont influencé l'analyse
}

// Liste des mots positifs, neutres et négatifs en français
const POSITIVE_WORDS = [
  'bien', 'super', 'excellent', 'fantastique', 'parfait', 'génial', 'merci',
  'bravo', 'content', 'satisfait', 'heureux', 'agréable', 'efficace', 'rapide',
  'pratique', 'utile', 'apprécier', 'aimer', 'adorer', 'intéressant', 'précis',
  'professionnel', 'compétent', 'clair', 'facile', 'impressionnant', 'réactif'
];

const NEUTRAL_WORDS = [
  'ok', 'bof', 'moyen', 'correct', 'passable', 'acceptable', 'standard',
  'normal', 'ordinaire', 'peut-être', 'possible', 'éventuellement',
  'probablement', 'partiellement', 'parfois', 'occasionnellement'
];

const NEGATIVE_WORDS = [
  'mauvais', 'horrible', 'terrible', 'affreux', 'nul', 'décevant', 'insatisfait',
  'problème', 'erreur', 'bug', 'lent', 'compliqué', 'difficile', 'confus', 'cher',
  'coûteux', 'pénible', 'long', 'attente', 'retard', 'plainte', 'déçu', 'frustrée',
  'frustré', 'colère', 'inutile', 'inefficace', 'incompétent', 'inquiet', 'inquiète'
];

// Mots intensificateurs et négations
const INTENSIFIERS = [
  'très', 'extrêmement', 'incroyablement', 'vraiment', 'totalement', 'absolument',
  'complètement', 'particulièrement', 'tout à fait', 'beaucoup', 'trop'
];

const NEGATIONS = [
  'ne', 'pas', 'plus', 'jamais', 'aucun', 'aucune', 'sans', 'ni'
];

/**
 * Analyse le sentiment d'un texte
 * @param text Texte à analyser
 * @returns Résultat de l'analyse de sentiment
 */
export const analyzeSentiment = (text: string): SentimentResult => {
  // Convertir le texte en minuscules et diviser en mots
  const normalizedText = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s{2,}/g, ' ');
  
  const words = normalizedText.split(' ');
  
  // Variables pour l'analyse
  let positiveScore = 0;
  let negativeScore = 0;
  let wordCount = 0;
  const keywordsFound: string[] = [];
  let hasNegation = false;
  let intensifierMultiplier = 1;
  
  // Parcourir tous les mots
  for (let i = 0; i < words.length; i++) {
    const currentWord = words[i];
    wordCount++;
    
    // Vérifier s'il s'agit d'un intensificateur
    if (INTENSIFIERS.includes(currentWord)) {
      intensifierMultiplier = 1.5;
      continue;
    }
    
    // Vérifier s'il s'agit d'une négation
    if (NEGATIONS.includes(currentWord)) {
      hasNegation = true;
      continue;
    }
    
    // Calculer les scores
    if (POSITIVE_WORDS.includes(currentWord)) {
      const score = hasNegation ? -1 * intensifierMultiplier : 1 * intensifierMultiplier;
      positiveScore += score;
      keywordsFound.push(currentWord);
      hasNegation = false;
      intensifierMultiplier = 1;
    } 
    else if (NEGATIVE_WORDS.includes(currentWord)) {
      const score = hasNegation ? 1 * intensifierMultiplier : -1 * intensifierMultiplier;
      negativeScore += score;
      keywordsFound.push(currentWord);
      hasNegation = false;
      intensifierMultiplier = 1;
    }
    else if (NEUTRAL_WORDS.includes(currentWord)) {
      keywordsFound.push(currentWord);
      hasNegation = false;
      intensifierMultiplier = 1;
    }
  }
  
  // Calculer le score final
  const totalScore = positiveScore + negativeScore;
  const normalizedScore = wordCount > 0 ? totalScore / Math.min(wordCount, 20) : 0;
  
  // Limiter le score entre -1 et 1
  const finalScore = Math.max(-1, Math.min(1, normalizedScore));
  
  // Déterminer le sentiment
  let sentiment: 'positive' | 'neutral' | 'negative';
  if (finalScore > 0.1) {
    sentiment = 'positive';
  } else if (finalScore < -0.1) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  // Calculer la confiance
  const keywordRatio = keywordsFound.length / wordCount;
  const scoreMagnitude = Math.abs(finalScore);
  const confidence = Math.min(1, (keywordRatio * 0.5) + (scoreMagnitude * 0.5));
  
  return {
    sentiment,
    score: finalScore,
    confidence,
    keywords: keywordsFound
  };
};

/**
 * Analyser la tendance du sentiment basée sur plusieurs messages
 * @param messages Tableau de messages à analyser
 * @returns Tendance du sentiment avec score et confiance
 */
export const analyzeSentimentTrend = (messages: { text: string, isUser: boolean }[]): {
  trend: 'improving' | 'worsening' | 'stable';
  score: number;
  confidence: number;
} => {
  // Filtrer uniquement les messages de l'utilisateur
  const userMessages = messages.filter(msg => msg.isUser);
  
  if (userMessages.length < 2) {
    return { trend: 'stable', score: 0, confidence: 0 };
  }
  
  // Analyser le sentiment de chaque message
  const sentiments = userMessages.map(msg => analyzeSentiment(msg.text));
  
  // Calculer la tendance
  const recentSentiments = sentiments.slice(-3); // Prendre les 3 derniers sentiments
  
  let trendScore = 0;
  for (let i = 1; i < recentSentiments.length; i++) {
    trendScore += recentSentiments[i].score - recentSentiments[i-1].score;
  }
  
  // Normaliser le score de tendance
  const normalizedTrendScore = trendScore / (recentSentiments.length - 1);
  
  // Déterminer la tendance
  let trend: 'improving' | 'worsening' | 'stable';
  if (normalizedTrendScore > 0.1) {
    trend = 'improving';
  } else if (normalizedTrendScore < -0.1) {
    trend = 'worsening';
  } else {
    trend = 'stable';
  }
  
  // Calculer la confiance basée sur la cohérence des scores
  const scoreVariance = calculateVariance(sentiments.map(s => s.score));
  const confidence = Math.max(0, 1 - scoreVariance);
  
  return {
    trend,
    score: normalizedTrendScore,
    confidence
  };
};

/**
 * Calculer la variance d'un tableau de nombres
 */
function calculateVariance(values: number[]): number {
  if (values.length === 0) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  
  return variance;
}
