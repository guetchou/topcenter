
/**
 * Système d'analyse prédictive pour conversations IA
 * Inspiré par l'approche des premiers principes d'Elon Musk
 */

interface PredictionResult {
  nextTopics: string[];
  confidence: number;
  suggestedResponses: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  complexity: 'simple' | 'moderate' | 'complex';
  userIntent: {
    type: 'information' | 'assistance' | 'complaint' | 'purchase' | 'other';
    confidence: number;
  };
}

/**
 * Analyser le contexte de la conversation pour prédire les intentions futures
 */
export const predictNextInteraction = (
  messages: { text: string; isUser: boolean }[],
  userHistory?: { topic: string; frequency: number }[]
): PredictionResult => {
  if (messages.length === 0) {
    return getDefaultPrediction();
  }

  // Extraire les derniers messages pour l'analyse
  const recentMessages = messages.slice(-5);
  const lastUserMessage = recentMessages.filter(m => m.isUser).pop()?.text || '';
  
  // Détecter le sentiment général
  const sentiment = detectSentiment(recentMessages);
  
  // Analyser la complexité des questions
  const complexity = analyzeComplexity(lastUserMessage);
  
  // Détecter l'intention de l'utilisateur
  const userIntent = detectIntent(lastUserMessage);
  
  // Générer des suggestions de réponses basées sur l'intention et le contexte
  const suggestedResponses = generateSuggestedResponses(userIntent, sentiment, complexity);
  
  // Prédire les prochains sujets probables
  const nextTopics = predictTopics(recentMessages, userHistory);
  
  return {
    nextTopics,
    confidence: calculateConfidence(userIntent.confidence, recentMessages.length),
    suggestedResponses,
    sentiment,
    complexity,
    userIntent
  };
};

/**
 * Détecter le sentiment général de la conversation
 */
const detectSentiment = (messages: { text: string; isUser: boolean }[]): 'positive' | 'neutral' | 'negative' => {
  const userMessages = messages.filter(m => m.isUser).map(m => m.text.toLowerCase());
  
  const positiveWords = ['merci', 'excellent', 'super', 'bien', 'génial', 'content', 'satisfait'];
  const negativeWords = ['problème', 'erreur', 'mauvais', 'déçu', 'insatisfait', 'bug', 'difficile'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  userMessages.forEach(msg => {
    positiveWords.forEach(word => {
      if (msg.includes(word)) positiveScore++;
    });
    
    negativeWords.forEach(word => {
      if (msg.includes(word)) negativeScore++;
    });
  });
  
  if (positiveScore > negativeScore + 1) return 'positive';
  if (negativeScore > positiveScore + 1) return 'negative';
  return 'neutral';
};

/**
 * Analyser la complexité de la question
 */
const analyzeComplexity = (message: string): 'simple' | 'moderate' | 'complex' => {
  const wordCount = message.split(' ').length;
  const sentenceCount = message.split(/[.!?]+/).filter(Boolean).length;
  
  if (wordCount < 10 && sentenceCount <= 1) return 'simple';
  if (wordCount > 30 || sentenceCount > 3) return 'complex';
  return 'moderate';
};

/**
 * Détecter l'intention principale de l'utilisateur
 */
const detectIntent = (message: string): { type: 'information' | 'assistance' | 'complaint' | 'purchase' | 'other'; confidence: number } => {
  const msg = message.toLowerCase();
  
  // Recherche de modèles pour l'intention
  if (msg.includes('comment') || msg.includes('quoi') || msg.includes('où') || msg.includes('quand') || msg.includes('pourquoi')) {
    return { type: 'information', confidence: 0.85 };
  }
  
  if (msg.includes('aide') || msg.includes('besoin') || msg.includes('problème') || msg.includes('erreur') || msg.includes('bug')) {
    return { type: 'assistance', confidence: 0.8 };
  }
  
  if (msg.includes('déçu') || msg.includes('insatisfait') || msg.includes('mauvais service') || msg.includes('plainte')) {
    return { type: 'complaint', confidence: 0.9 };
  }
  
  if (msg.includes('acheter') || msg.includes('prix') || msg.includes('coût') || msg.includes('tarif') || msg.includes('devis')) {
    return { type: 'purchase', confidence: 0.85 };
  }
  
  // Analyse plus avancée des mots-clés
  const informationScore = calculateKeywordScore(msg, ['information', 'savoir', 'connaître', 'détails', 'expliquer']);
  const assistanceScore = calculateKeywordScore(msg, ['aider', 'support', 'assistance', 'résoudre']);
  const complaintScore = calculateKeywordScore(msg, ['problème', 'déçu', 'mauvais', 'insatisfait']);
  const purchaseScore = calculateKeywordScore(msg, ['acheter', 'prix', 'payer', 'coût', 'offre']);
  
  const scores = [
    { type: 'information', score: informationScore },
    { type: 'assistance', score: assistanceScore },
    { type: 'complaint', score: complaintScore },
    { type: 'purchase', score: purchaseScore }
  ];
  
  // Trouver l'intention avec le score le plus élevé
  const highestScore = scores.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  
  if (highestScore.score > 0.6) {
    return { type: highestScore.type as any, confidence: highestScore.score };
  }
  
  return { type: 'other', confidence: 0.5 };
};

/**
 * Calculer un score basé sur la présence de mots-clés
 */
const calculateKeywordScore = (text: string, keywords: string[]): number => {
  let score = 0;
  keywords.forEach(keyword => {
    if (text.includes(keyword)) {
      score += 1 / keywords.length;
    }
  });
  return score;
};

/**
 * Générer des suggestions de réponses basées sur l'intention et le contexte
 */
const generateSuggestedResponses = (
  userIntent: { type: 'information' | 'assistance' | 'complaint' | 'purchase' | 'other'; confidence: number },
  sentiment: 'positive' | 'neutral' | 'negative',
  complexity: 'simple' | 'moderate' | 'complex'
): string[] => {
  const responses: string[] = [];
  
  switch (userIntent.type) {
    case 'information':
      responses.push('Voici les informations que vous recherchez...');
      responses.push('Je serais ravi de vous renseigner sur ce sujet.');
      responses.push('Pour répondre à votre question de manière précise...');
      break;
    case 'assistance':
      responses.push('Je peux vous aider à résoudre ce problème.');
      responses.push('Voici comment nous pouvons résoudre cette situation.');
      responses.push('Pour vous assister efficacement, j\'aurais besoin de quelques précisions.');
      break;
    case 'complaint':
      responses.push('Je comprends votre frustration et je suis là pour vous aider.');
      responses.push('Je suis désolé pour cette expérience. Voyons comment nous pouvons rectifier la situation.');
      responses.push('Votre satisfaction est notre priorité. Permettez-moi de vous proposer une solution.');
      break;
    case 'purchase':
      responses.push('Je peux vous donner tous les détails sur nos tarifs et services.');
      responses.push('Voici les options qui pourraient répondre à vos besoins.');
      responses.push('Pour vous proposer le meilleur devis, j\'aurais besoin de quelques informations supplémentaires.');
      break;
    default:
      responses.push('Comment puis-je vous aider aujourd\'hui ?');
      responses.push('Y a-t-il un sujet particulier sur lequel vous aimeriez en savoir plus ?');
      responses.push('Je suis à votre disposition pour répondre à vos questions ou vous assister.');
      break;
  }
  
  // Ajouter des réponses spécifiques au sentiment
  if (sentiment === 'negative') {
    responses.push('Je comprends que la situation est frustrante. Je suis là pour vous aider à la résoudre.');
    responses.push('Votre satisfaction est importante pour nous. Voyons comment améliorer votre expérience.');
  }
  
  // Ajouter des réponses spécifiques à la complexité
  if (complexity === 'complex') {
    responses.push('Cette question mérite une réponse détaillée. Permettez-moi de développer plusieurs points.');
  }
  
  return responses;
};

/**
 * Prédire les prochains sujets probables
 */
const predictTopics = (
  recentMessages: { text: string; isUser: boolean }[],
  userHistory?: { topic: string; frequency: number }[]
): string[] => {
  const commonFollowUpTopics = {
    'prix': ['devis', 'options', 'comparaison', 'réduction'],
    'services': ['fonctionnalités', 'support', 'délais', 'intégration'],
    'problème': ['diagnostic', 'solution', 'alternative', 'compensation'],
    'contrat': ['durée', 'conditions', 'renouvellement', 'résiliation'],
    'équipe': ['expertise', 'disponibilité', 'contact direct', 'responsable']
  };
  
  // Détecter les sujets récents
  const recentTopics: string[] = [];
  Object.keys(commonFollowUpTopics).forEach(topic => {
    recentMessages.forEach(msg => {
      if (msg.isUser && msg.text.toLowerCase().includes(topic)) {
        recentTopics.push(topic);
      }
    });
  });
  
  // Si aucun sujet récent n'est détecté, utiliser les sujets fréquents de l'historique
  if (recentTopics.length === 0 && userHistory && userHistory.length > 0) {
    // Trier l'historique par fréquence et prendre les 3 premiers
    const topHistoryTopics = [...userHistory].sort((a, b) => b.frequency - a.frequency).slice(0, 3);
    return topHistoryTopics.map(item => item.topic);
  }
  
  // Générer des sujets de suivi probables
  const potentialNextTopics: string[] = [];
  recentTopics.forEach(topic => {
    if (topic in commonFollowUpTopics) {
      potentialNextTopics.push(...commonFollowUpTopics[topic as keyof typeof commonFollowUpTopics]);
    }
  });
  
  // S'il n'y a pas assez de sujets prédits, ajouter des sujets généraux
  if (potentialNextTopics.length < 3) {
    const generalTopics = ['qualité du service', 'support client', 'nouveaux services', 'témoignages clients'];
    potentialNextTopics.push(...generalTopics);
  }
  
  // Prendre les 5 premiers sujets uniques
  return [...new Set(potentialNextTopics)].slice(0, 5);
};

/**
 * Calculer le niveau de confiance de la prédiction
 */
const calculateConfidence = (intentConfidence: number, messageCount: number): number => {
  // Plus nous avons de messages, plus la confiance est élevée
  const contextFactor = Math.min(messageCount / 10, 1); // Max 1 pour 10+ messages
  
  // La confiance est une combinaison de la confiance d'intention et du facteur contextuel
  return (intentConfidence * 0.7) + (contextFactor * 0.3);
};

/**
 * Obtenir une prédiction par défaut
 */
const getDefaultPrediction = (): PredictionResult => {
  return {
    nextTopics: ['services', 'tarifs', 'support', 'fonctionnalités', 'démonstration'],
    confidence: 0.5,
    suggestedResponses: [
      'Comment puis-je vous aider aujourd\'hui ?',
      'Bienvenue chez TopCenter ! Que puis-je faire pour vous ?',
      'Je suis à votre disposition pour répondre à vos questions sur nos services.'
    ],
    sentiment: a='neutral',
    complexity: 'simple',
    userIntent: {
      type: 'information',
      confidence: 0.5
    }
  };
};
