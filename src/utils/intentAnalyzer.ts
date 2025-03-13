
interface IntentCategory {
  name: string;
  keywords: string[];
  suggestions: string[];
}

const intentCategories: IntentCategory[] = [
  {
    name: "services",
    keywords: ["service", "offre", "proposez", "prestation", "téléconseillers", "centre d'appels", "appels"],
    suggestions: [
      "Quels types de services de centre d'appels proposez-vous ?",
      "Pouvez-vous gérer des volumes importants d'appels ?",
      "Proposez-vous un service en plusieurs langues ?"
    ]
  },
  {
    name: "prix",
    keywords: ["prix", "tarif", "coût", "budget", "devis", "facturation", "combien", "euros", "fcfa"],
    suggestions: [
      "Comment obtenir un devis personnalisé ?",
      "Quels sont vos tarifs mensuels ?",
      "Y a-t-il des frais d'installation ?"
    ]
  },
  {
    name: "contact",
    keywords: ["joindre", "contacter", "adresse", "email", "téléphone", "rendez-vous", "horaires", "ouverture"],
    suggestions: [
      "Quelles sont vos horaires d'ouverture ?",
      "Comment prendre rendez-vous avec un conseiller ?",
      "Avez-vous un numéro direct pour le support ?"
    ]
  },
  {
    name: "technique",
    keywords: ["système", "logiciel", "équipement", "technologie", "voip", "crm", "intégrer", "installer"],
    suggestions: [
      "Quelles technologies utilisez-vous pour votre centre d'appels ?",
      "Est-il possible d'intégrer votre système avec notre CRM ?",
      "Proposez-vous une solution cloud ?"
    ]
  },
  {
    name: "qualité",
    keywords: ["qualité", "performance", "fiabilité", "formation", "compétence", "certification", "satisfaction"],
    suggestions: [
      "Comment assurez-vous la qualité des appels ?",
      "Quelle formation reçoivent vos agents ?",
      "Avez-vous des certifications particulières ?"
    ]
  }
];

export interface IntentAnalysisResult {
  detectedIntent: string;
  confidence: number;
  suggestions: string[];
}

/**
 * Analyse un message pour déterminer l'intention de l'utilisateur
 * @param message Le message à analyser
 * @returns Résultat de l'analyse avec l'intention détectée, le niveau de confiance et des suggestions
 */
export const analyzeUserIntent = (message: string): IntentAnalysisResult => {
  if (!message || message.trim() === '') {
    return {
      detectedIntent: 'unknown',
      confidence: 0,
      suggestions: []
    };
  }

  const messageLower = message.toLowerCase();
  
  // Initialiser les scores pour chaque catégorie
  const scores: Record<string, number> = {};
  
  intentCategories.forEach(category => {
    // Calculer le score basé sur le nombre de mots-clés trouvés
    let score = 0;
    category.keywords.forEach(keyword => {
      // Vérifier si le mot-clé est présent dans le message
      if (messageLower.includes(keyword.toLowerCase())) {
        // Ajouter un score plus élevé pour les mots-clés plus longs (généralement plus spécifiques)
        score += keyword.length * 0.5;
      }
    });
    scores[category.name] = score;
  });
  
  // Trouver la catégorie avec le score le plus élevé
  let highestCategory = 'unknown';
  let highestScore = 0;
  let suggestions: string[] = [];
  
  Object.entries(scores).forEach(([category, score]) => {
    if (score > highestScore) {
      highestScore = score;
      highestCategory = category;
      // Trouver les suggestions pour cette catégorie
      const categoryData = intentCategories.find(c => c.name === category);
      suggestions = categoryData ? categoryData.suggestions : [];
    }
  });
  
  // Calculer le niveau de confiance (normalisé entre 0 et 1)
  // Si le score est inférieur à un certain seuil, considérer comme inconnu
  const minThreshold = 2;
  if (highestScore < minThreshold) {
    return {
      detectedIntent: 'unknown',
      confidence: 0,
      suggestions: []
    };
  }
  
  // Normaliser le score de confiance entre 0 et 1
  const maxPossibleScore = 20; // Valeur arbitraire pour normaliser
  const confidence = Math.min(highestScore / maxPossibleScore, 1);
  
  return {
    detectedIntent: highestCategory,
    confidence,
    suggestions
  };
};

/**
 * Génère des suggestions contextuelles en fonction du message et de l'historique de conversation
 * @param currentMessage Message actuel de l'utilisateur
 * @param messageHistory Historique des messages précédents
 * @returns Liste de suggestions contextuelles
 */
export const generateContextualSuggestions = (
  currentMessage: string, 
  messageHistory: { text: string; isUser: boolean }[]
): string[] => {
  // Analyser l'intention du message actuel
  const currentIntent = analyzeUserIntent(currentMessage);
  
  // Si la confiance est suffisamment élevée, utiliser les suggestions de l'intention détectée
  if (currentIntent.confidence > 0.3) {
    return currentIntent.suggestions;
  }
  
  // Si pas assez de confiance dans le message actuel, analyser l'historique récent
  const recentUserMessages = messageHistory
    .filter(msg => msg.isUser)
    .slice(-3)
    .map(msg => msg.text);
  
  if (recentUserMessages.length === 0) {
    // Suggestions par défaut si pas d'historique
    return [
      "Quels services de centre d'appels proposez-vous ?",
      "Comment obtenir un devis personnalisé ?",
      "Quelles sont vos horaires d'ouverture ?"
    ];
  }
  
  // Concaténer les messages récents pour l'analyse
  const combinedHistory = recentUserMessages.join(" ");
  const historyIntent = analyzeUserIntent(combinedHistory);
  
  // Utiliser les suggestions basées sur l'historique si la confiance est suffisante
  if (historyIntent.confidence > 0.2) {
    return historyIntent.suggestions;
  }
  
  // Sinon, retourner des suggestions génériques
  return [
    "Parlez-moi de vos services de centre d'appels",
    "Comment vous différenciez-vous des autres centres d'appels ?",
    "Quels sont vos délais de mise en place ?"
  ];
};
