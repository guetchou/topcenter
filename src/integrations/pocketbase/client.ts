
// Fichier client PocketBase temporaire pour résoudre les erreurs de build
// sera remplacé par l'implémentation complète plus tard

export const testPocketBaseConnection = async (): Promise<boolean> => {
  // Simulation d'une connexion réussie
  console.log("Test de connexion PocketBase simulé");
  return true;
};

// Export de fonctions communes pour la compatibilité
export const getPocketBaseInstance = () => {
  console.log("Client PocketBase simulé");
  return {
    collection: (name: string) => ({
      getList: async () => ({ items: [] }),
      getOne: async () => ({}),
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    }),
    authStore: {
      isValid: false,
      token: "",
      model: null,
      clear: () => {},
    },
  };
};

export default {
  testPocketBaseConnection,
  getPocketBaseInstance,
};
