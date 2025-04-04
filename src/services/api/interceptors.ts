
import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosHeaders } from 'axios';
import { markServerAsAvailable, markServerAsUnavailable } from './serverStatus';

export function setupInterceptors(api: AxiosInstance) {
  // Intercepteur de requête
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Récupérer le token d'authentification du localStorage
      const token = localStorage.getItem('authToken');
      
      // Si un token existe, l'ajouter à l'en-tête Authorization
      if (token) {
        // Créer une nouvelle instance de AxiosHeaders pour éviter les erreurs de type
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        
        // Définir l'en-tête d'autorisation
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      
      return config;
    },
    (error: AxiosError) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );

  // Intercepteur de réponse
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      // Marquer le serveur comme disponible en cas de réponse réussie
      markServerAsAvailable();
      return response;
    },
    (error: AxiosError) => {
      // Si la demande a échoué en raison d'un problème de réseau ou d'un timeout
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
        markServerAsUnavailable();
      }
      
      return Promise.reject(error);
    }
  );
}
