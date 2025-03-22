
import { AxiosInstance, AxiosError } from 'axios';
import { toast } from 'sonner';

// Définition du type pour les erreurs d'API
interface ApiErrorResponse {
  message?: string;
  error?: string;
  errors?: { [key: string]: string[] };
  statusCode?: number;
}

export function setupErrorHandlers(api: AxiosInstance) {
  // Intercepteur global pour gérer les erreurs
  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      // Extraire les informations d'erreur
      const statusCode = error.response?.status || 500;
      const errorData = error.response?.data;
      
      // Message d'erreur à afficher
      let errorMessage = 'Une erreur s\'est produite';
      
      // Tenter d'extraire un message d'erreur significatif
      if (errorData) {
        errorMessage = errorData.message || 
                     errorData.error || 
                     (errorData.errors ? 'Erreurs de validation' : errorMessage);
      }
      
      // Gérer différents types d'erreurs selon le code de statut
      switch (statusCode) {
        case 401:
          toast.error('Session expirée. Veuillez vous reconnecter.');
          // Rediriger vers la page de connexion si nécessaire
          // window.location.href = '/login';
          break;
          
        case 403:
          toast.error('Vous n\'avez pas la permission d\'effectuer cette action');
          break;
          
        case 404:
          // Pour les 404, ne pas afficher de toast car cela peut être normal
          console.info('Ressource non trouvée:', error.config?.url);
          break;
          
        case 422:
          // Erreurs de validation
          if (errorData?.errors) {
            const validationErrors = Object.values(errorData.errors).flat();
            if (validationErrors.length > 0) {
              toast.error(validationErrors[0]);
            } else {
              toast.error('Erreurs de validation dans le formulaire');
            }
          } else {
            toast.error(errorMessage);
          }
          break;
          
        case 429:
          toast.error('Trop de requêtes. Veuillez réessayer plus tard.');
          break;
          
        case 500:
        case 502:
        case 503:
          toast.error('Le serveur rencontre des difficultés. Veuillez réessayer plus tard.');
          break;
          
        default:
          if (error.code === 'ECONNABORTED') {
            toast.error('La requête a pris trop de temps à répondre.');
          } else if (!error.response) {
            toast.error('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
          } else {
            toast.error(errorMessage);
          }
      }
      
      return Promise.reject(error);
    }
  );
}
