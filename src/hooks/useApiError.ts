
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useApiError = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isServerUnavailable, setIsServerUnavailable] = useState(false);

  const handleError = useCallback((err: Error) => {
    console.error('API Error:', err);
    setError(err);

    // Détecter les problèmes de disponibilité du serveur
    if (
      !navigator.onLine || 
      err.message.includes('indisponible') || 
      err.message.includes('hors ligne') ||
      err.message.includes('Network Error') ||
      err.message.includes('connexion au serveur')
    ) {
      setIsServerUnavailable(true);
      toast.error(err.message || 'Le serveur est temporairement indisponible');
    } else {
      // Afficher un toast avec le message d'erreur pour les autres erreurs
      toast.error(err.message || 'Une erreur est survenue');
    }

    return err;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setIsServerUnavailable(false);
  }, []);

  // Fonction pour vérifier si le serveur est disponible
  const checkServerAvailability = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch('/lovable-uploads/logo-topcenter.png', { 
        method: 'HEAD',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const available = response.ok;
      setIsServerUnavailable(!available);
      return available;
    } catch (error) {
      setIsServerUnavailable(true);
      return false;
    }
  }, []);

  return {
    error,
    isServerUnavailable,
    handleError,
    clearError,
    checkServerAvailability
  };
};

export default useApiError;
