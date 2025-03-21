
/**
 * Utilitaires pour gérer la transition de design
 */

// Variable de configuration pour activer/désactiver les fonctionnalités du nouveau design
export const designConfig = {
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
};

// Fonction pour désactiver le nouveau design sur un composant spécifique
export const disableNewDesign = (componentName: keyof typeof designConfig.components): void => {
  designConfig.components[componentName] = false;
};

// Fonction pour activer le nouveau design globalement
export const enableNewDesignGlobally = (): void => {
  designConfig.useNewDesign = true;
};

// Fonction pour désactiver le nouveau design globalement
export const disableNewDesignGlobally = (): void => {
  designConfig.useNewDesign = false;
};
