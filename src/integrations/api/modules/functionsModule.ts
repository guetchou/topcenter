
import { processResponse } from '../utils';
import api from '@/services/api';

// Module pour les fonctions edge/server
export const functionsModule = {
  invoke: async (functionName: string, options?: { body?: any }) => {
    try {
      const response = await api.post(`/functions/${functionName}`, options?.body || {});
      return { data: response.data, error: null };
    } catch (error) {
      console.error(`Erreur lors de l'invocation de la fonction ${functionName}:`, error);
      return { data: null, error };
    }
  }
};
