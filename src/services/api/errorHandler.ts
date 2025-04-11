
import { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';
import { markServerAsUnavailable } from './serverStatus';
import { CustomAxiosRequestConfig } from '@/types/api';

/**
 * Sets up global error handlers for an Axios instance
 * @param api The Axios instance to configure
 */
export const setupErrorHandlers = (api: AxiosInstance): void => {
  api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      // Skip error handling if the request was configured to be silent
      const config = error.config as CustomAxiosRequestConfig;
      if (config?.silentError) {
        return Promise.reject(error);
      }

      if (!error.response) {
        // Network error or server unavailable
        toast.error("Erreur de connexion", {
          description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet."
        });
        markServerAsUnavailable();
      } else {
        // Handle HTTP errors based on status codes
        const status = error.response.status;
        
        if (status === 401) {
          toast.error("Non autorisé", {
            description: "Veuillez vous connecter pour accéder à cette ressource."
          });
        } else if (status === 403) {
          toast.error("Accès refusé", {
            description: "Vous n'avez pas les permissions nécessaires pour cette action."
          });
        } else if (status === 404) {
          toast.error("Ressource introuvable", {
            description: "La ressource demandée n'existe pas."
          });
        } else if (status >= 500) {
          toast.error("Erreur serveur", {
            description: "Une erreur est survenue sur le serveur. Veuillez réessayer plus tard."
          });
        } else {
          // Fallback for other errors
          const errorData = error.response.data;
          const errorMessage = errorData && typeof errorData === 'object' && 'message' in errorData 
            ? String(errorData.message) 
            : "Une erreur est survenue";
          
          toast.error("Erreur", {
            description: errorMessage
          });
        }
      }

      return Promise.reject(error);
    }
  );
};
