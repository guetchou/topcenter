
import { AxiosError, AxiosInstance } from 'axios';
import { toast } from 'sonner';
import { markServerAsUnavailable, markServerAsAvailable } from './serverStatus';

/**
 * Gère les erreurs API de manière centralisée
 */
export const handleApiError = (error: any) => {
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    
    // Vérifier si le serveur est indisponible
    if (!error.response || statusCode === 0 || statusCode === 502 || statusCode === 503 || statusCode === 504) {
      markServerAsUnavailable();
      console.error('API server is unavailable:', error.message);
      return;
    }
    
    // Erreurs d'authentification
    if (statusCode === 401) {
      toast.error('Session expirée. Veuillez vous reconnecter.');
      // Rediriger vers la page de connexion si nécessaire
      return;
    }
    
    // Erreurs d'autorisation
    if (statusCode === 403) {
      toast.error('Vous n\'avez pas les droits nécessaires pour cette action.');
      return;
    }
    
    // Erreurs serveur
    if (statusCode && statusCode >= 500) {
      toast.error('Une erreur serveur est survenue. Veuillez réessayer plus tard.');
      return;
    }
    
    // Erreurs de validation ou autres erreurs 4xx
    if (statusCode && statusCode >= 400) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`Erreur: ${errorMessage}`);
      return;
    }
  }
  
  // Erreurs génériques non-Axios
  toast.error(`Une erreur est survenue: ${error.message || 'Erreur inconnue'}`);
  console.error('API error:', error);
};

/**
 * Configure les intercepteurs pour l'instance Axios
 */
export const setupErrorHandlers = (apiInstance: AxiosInstance) => {
  // Intercepteur de réponse
  apiInstance.interceptors.response.use(
    (response) => {
      // Marquer le serveur comme disponible sur une réponse réussie
      markServerAsAvailable();
      return response;
    },
    (error) => {
      // Gérer l'erreur
      if (error.isAxiosError) {
        handleApiError(error);
      }
      return Promise.reject(error);
    }
  );
  
  // Intercepteur de requête
  apiInstance.interceptors.request.use(
    (config) => {
      // Ajouter un token d'authentification si disponible
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};
