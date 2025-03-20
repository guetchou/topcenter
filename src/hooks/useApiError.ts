
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useApiError = () => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: Error) => {
    console.error('API Error:', err);
    setError(err);

    // Afficher un toast avec le message d'erreur
    toast.error(err.message || 'Une erreur est survenue');

    return err;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
};

export default useApiError;
