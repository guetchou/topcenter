
import api from '@/services/api';

// Fonction utilitaire pour gérer les réponses d'API de manière cohérente
export const processResponse = async (promise) => {
  try {
    const response = await promise;
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Erreur API:`, error);
    return { data: null, error };
  }
};

// Fonction pour créer un objet chaînable avec data et error accessibles directement
export const createChainable = (executePromise) => {
  const chainable = {
    // Méthode execute pour exécuter la promesse
    execute: async () => await executePromise(),
    
    // Accesseurs pour data et error
    get data() {
      const executeMethod = async () => {
        const result = await executePromise();
        return result.data;
      };
      return executeMethod();
    },
    
    get error() {
      const executeMethod = async () => {
        const result = await executePromise();
        return result.error;
      };
      return executeMethod();
    }
  };
  
  return chainable;
};

// Fonction pour ajouter les méthodes supplémentaires aux objets chaînables
export const extendChainable = (chainable, extensions) => {
  Object.entries(extensions).forEach(([key, value]) => {
    chainable[key] = value;
  });
  return chainable;
};

// Gestionnaire de requête pour simplifier les appels API
export const requestHandler = {
  get: (url, params = {}) => {
    return processResponse(api.get(url, { params }));
  },
  
  post: (url, data = {}) => {
    return processResponse(api.post(url, data));
  },
  
  put: (url, data = {}) => {
    return processResponse(api.put(url, data));
  },
  
  patch: (url, data = {}) => {
    return processResponse(api.patch(url, data));
  },
  
  delete: (url) => {
    return processResponse(api.delete(url));
  }
};
