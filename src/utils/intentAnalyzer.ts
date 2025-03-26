
/**
 * Analyseur d'intention basé sur les principes d'IA d'Elon Musk
 * Version simplifiée utilisant une analyse basée sur des règles
 */

interface IntentAnalysisResult {
  detectedIntent: string;
  confidence: number;
  possibleIntents: Array<{
    intent: string;
    confidence: number;
  }>;
}

// Les intentions possibles
const INTENT_PATTERNS = {
  'demande_information': [
    'comment', 'quoi', 'qui', 'quand', 'où', 'pourquoi', 'quel', 'quelle', 
    'information', 'détails', 'savoir', 'connaître', 'expliquer', 'préciser',
    'indiquer', 'clarifier', 'comprendre'
  ],
  'demande_assistance': [
    'aide', 'aider', 'besoin', 'support', 'assister', 'assistance', 'problème', 
    'difficulté', 'erreur', 'bug', 'réparer', 'résoudre', 'soutien', 'guider'
  ],
  'demande_devis': [
    'prix', 'tarif', 'coût', 'devis', 'estimation', 'combien', 'budget', 'payer',
    'facturer', 'forfait', 'offre', 'promotion', 'réduction', 'gratuit', 'économique'
  ],
  'expression_mécontentement': [
    'problème', 'mauvais', 'pas content', 'mécontent', 'déçu', 'décevant', 'plainte',
    'insatisfait', 'erreur', 'bug', 'défaut', 'dysfonctionnement', 'panne', 'lent'
  ],
  'demande_rdv': [
    'rendez-vous', 'rencontre', 'rdv', 'disponibilité', 'agenda', 'programmer',
    'planifier', 'calendrier', 'date', 'heure', 'jour', 'semaine', 'lundi', 'mardi',
    'mercredi', 'jeudi', 'vendredi', 'consulter', 'disponible'
  ],
  'demande_fonctionnalité': [
    'fonctionnalité', 'fonction', 'option', 'outil', 'capacité', 'intégration',
    'ajouter', 'créer', 'développer', 'implémenter', 'améliorer', 'extension'
  ],
  'salutation': [
    'bonjour', 'salut', 'hey', 'coucou', 'bonsoir', 'hello', 'hi', 'bienvenue'
  ],
  'remerciement': [
    'merci', 'remercier', 'remerciement', 'gratitude', 'reconnaissant', 'super',
    'excellent', 'parfait', 'génial', 'apprécier'
  ],
  'conclusion': [
    'au revoir', 'adieu', 'à bientôt', 'à plus', 'bye', 'bonne journée', 
    'bon weekend', 'bonne soirée', 'terminer', 'fin', 'conclure'
  ]
};

/**
 * Analyser l'intention de l'utilisateur dans un texte
 * @param text Texte à analyser
 * @returns Résultat de l'analyse d'intention
 */
export const analyzeUserIntent = (text: string): IntentAnalysisResult => {
  const normalizedText = text.toLowerCase();
  const intentScores: { [key: string]: number } = {};

  // Calculer le score pour chaque intention
  Object.entries(INTENT_PATTERNS).forEach(([intent, patterns]) => {
    let intentScore = 0;
    patterns.forEach(pattern => {
      if (normalizedText.includes(pattern)) {
        // Augmenter le score en fonction de la spécificité du pattern
        intentScore += pattern.length > 7 ? 1.5 : 1;
      }
    });
    intentScores[intent] = intentScore;
  });

  // Convertir les scores en probabilités
  const totalScore = Object.values(intentScores).reduce((sum, score) => sum + score, 0);
  const intentProbabilities: { [key: string]: number } = {};

  for (const intent in intentScores) {
    if (totalScore > 0) {
      intentProbabilities[intent] = intentScores[intent] / totalScore;
    } else {
      intentProbabilities[intent] = 0;
    }
  }

  // Trouver l'intention la plus probable
  let maxIntent = 'demande_information';
  let maxProbability = 0;

  for (const intent in intentProbabilities) {
    if (intentProbabilities[intent] > maxProbability) {
      maxIntent = intent;
      maxProbability = intentProbabilities[intent];
    }
  }

  // Adapter le score de confiance
  // Si aucun pattern n'a été trouvé, la confiance est faible
  const confidence = totalScore > 0 ? maxProbability : 0.3;

  // Créer le tableau des intentions possibles
  const possibleIntents = Object.entries(intentProbabilities)
    .map(([intent, probability]) => ({
      intent,
      confidence: probability
    }))
    .sort((a, b) => b.confidence - a.confidence);

  return {
    detectedIntent: maxIntent,
    confidence,
    possibleIntents
  };
};

/**
 * Analyser l'évolution de l'intention à travers une conversation
 * @param messages Tableau des messages de la conversation
 * @returns Analyse de l'évolution de l'intention
 */
export const analyzeIntentProgression = (messages: { text: string; isUser: boolean }[]) => {
  // Filtrer uniquement les messages de l'utilisateur
  const userMessages = messages.filter(msg => msg.isUser);
  
  if (userMessages.length < 2) {
    return {
      progression: 'undefined',
      currentStage: 'initial',
      confidenceScore: 0
    };
  }
  
  // Analyser l'intention de chaque message
  const intents = userMessages.map(msg => analyzeUserIntent(msg.text));
  
  // Identifier les différentes phases de la conversation
  const hasInquiry = intents.some(intent => 
    intent.detectedIntent === 'demande_information' && intent.confidence > 0.5
  );
  
  const hasIssue = intents.some(intent => 
    (intent.detectedIntent === 'expression_mécontentement' || 
     intent.detectedIntent === 'demande_assistance') && 
    intent.confidence > 0.5
  );
  
  const hasClosing = intents.some(intent => 
    (intent.detectedIntent === 'remerciement' || 
     intent.detectedIntent === 'conclusion') && 
    intent.confidence > 0.5
  );
  
  const hasAction = intents.some(intent => 
    (intent.detectedIntent === 'demande_devis' || 
     intent.detectedIntent === 'demande_rdv') && 
    intent.confidence > 0.5
  );
  
  // Déterminer la progression de la conversation
  let progression: 'inquiry_to_action' | 'issue_to_resolution' | 'browsing' | 'undefined' = 'undefined';
  let currentStage: 'initial' | 'middle' | 'closing' = 'initial';
  let confidenceScore = 0;
  
  if (hasInquiry && hasAction) {
    progression = 'inquiry_to_action';
    confidenceScore = 0.8;
  } else if (hasIssue && hasClosing) {
    progression = 'issue_to_resolution';
    confidenceScore = 0.85;
  } else if (hasInquiry && !hasAction && !hasIssue) {
    progression = 'browsing';
    confidenceScore = 0.6;
  }
  
  // Déterminer l'étape actuelle
  if (hasClosing) {
    currentStage = 'closing';
  } else if (hasAction || (intents.length > 3)) {
    currentStage = 'middle';
  }
  
  return {
    progression,
    currentStage,
    confidenceScore
  };
};
