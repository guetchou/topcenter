
/**
 * Utilitaires pour gérer la transition de design
 */

// Récupérer les paramètres de design du localStorage si disponibles
const getStoredDesignConfig = () => {
  try {
    const storedConfig = localStorage.getItem('designConfig');
    return storedConfig ? JSON.parse(storedConfig) : null;
  } catch (e) {
    console.error('Error reading design config from localStorage:', e);
    return null;
  }
};

// Configuration par défaut
const defaultConfig = {
  // Active ou désactive globalement le nouveau design
  useNewDesign: false,
  
  // Paramètres pour contrôler les composants individuels
  components: {
    navigation: false,
    hero: false,
    services: false,
    testimonials: false,
    footer: false,
  }
};

// Initialiser avec les valeurs stockées ou par défaut
export const designConfig = {
  ...defaultConfig,
  ...getStoredDesignConfig()
};

// Sauvegarder les modifications dans localStorage
const saveDesignConfig = () => {
  try {
    localStorage.setItem('designConfig', JSON.stringify(designConfig));
  } catch (e) {
    console.error('Error saving design config to localStorage:', e);
  }
};

// Fonction pour vérifier si le nouveau design est actif pour un composant spécifique
export const shouldUseNewDesign = (componentName?: keyof typeof designConfig.components): boolean => {
  // Si aucun nom de composant n'est fourni, retourne la valeur globale
  if (!componentName) {
    return designConfig.useNewDesign;
  }
  
  // Si le composant spécifique est configuré, retourne sa valeur
  // Sinon, utilise la valeur globale
  return designConfig.components[componentName] ?? designConfig.useNewDesign;
};

// Fonction pour activer le nouveau design sur un composant spécifique
export const enableNewDesign = (componentName: keyof typeof designConfig.components): void => {
  designConfig.components[componentName] = true;
  saveDesignConfig();
};

// Fonction pour désactiver le nouveau design sur un composant spécifique
export const disableNewDesign = (componentName: keyof typeof designConfig.components): void => {
  designConfig.components[componentName] = false;
  saveDesignConfig();
};

// Fonction pour activer le nouveau design globalement
export const enableNewDesignGlobally = (): void => {
  designConfig.useNewDesign = true;
  saveDesignConfig();
};

// Fonction pour désactiver le nouveau design globalement
export const disableNewDesignGlobally = (): void => {
  designConfig.useNewDesign = false;
  saveDesignConfig();
};

// Fonction pour réinitialiser à la configuration par défaut
export const resetDesignConfig = (): void => {
  Object.assign(designConfig, defaultConfig);
  saveDesignConfig();
};
