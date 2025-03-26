
import { toast } from 'sonner';
import { AxiosError, AxiosInstance } from 'axios';

// Type pour les réponses d'erreur de l'API
interface ApiErrorResponse {
  message: string;
  details?: string;
  code?: string;
}

// Configuration des messages d'erreur par code HTTP
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Requête incorrecte',
  401: 'Non autorisé - veuillez vous reconnecter',
  403: 'Accès refusé',
  404: 'Ressource non trouvée',
  422: 'Données invalides',
  429: 'Trop de requêtes, veuillez réessayer plus tard',
  500: 'Erreur serveur interne',
  502: 'Erreur de passerelle',
  503: 'Service indisponible',
  504: 'Délai d\'attente dépassé'
};

/**
 * Gère les erreurs Axios et affiche un toast approprié
 */
export const handleApiError = (error: unknown) => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as ApiErrorResponse | undefined;
    
    // Message d'erreur à afficher
    const errorMessage = data?.message 
      || (status ? ERROR_MESSAGES[status] : null) 
      || 'Une erreur est survenue';
    
    // Afficher le toast d'erreur
    toast.error('Erreur API', {
      description: errorMessage,
      duration: 5000,
    });
    
    // Journaliser l'erreur pour le débogage
    console.error('API Error:', {
      status,
      url: error.config?.url,
      message: errorMessage,
      details: data?.details || error.message
    });
    
    return { message: errorMessage, status };
  }
  
  // En cas d'erreur non Axios
  const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
  toast.error('Erreur', { 
    description: errorMessage 
  });
  
  console.error('Non-Axios Error:', error);
  return { message: errorMessage };
};

/**
 * Configure les intercepteurs d'erreur pour une instance Axios
 */
export const setupErrorHandlers = (api: AxiosInstance) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      handleApiError(error);
      return Promise.reject(error);
    }
  );
  
  return api;
};
