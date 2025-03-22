
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export interface ApiErrorState {
  error: Error | null;
  isServerUnavailable: boolean;
  isFetching: boolean;
}

export const useApiError = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isServerUnavailable, setIsServerUnavailable] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

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
  
  // Fonction pour marquer le début d'une requête API
  const startFetching = useCallback(() => {
    setIsFetching(true);
    clearError();
  }, [clearError]);
  
  // Fonction pour marquer la fin d'une requête API
  const endFetching = useCallback(() => {
    setIsFetching(false);
  }, []);

  // Composant pour afficher une erreur API
  const ApiErrorAlert = useCallback(({ onRetry }: { onRetry?: () => void }) => {
    if (!error) return null;
    
    return (
      <Alert variant="destructive" className="mb-4">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <p>{isServerUnavailable 
            ? "Le serveur est temporairement indisponible. Certaines fonctionnalités peuvent être limitées."
            : error.message || "Une erreur est survenue lors du chargement des données."
          }</p>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              className="self-start mt-2" 
              onClick={onRetry}
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Réessayer
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }, [error, isServerUnavailable]);

  // Composant Wrapper pour traiter les données
  const withApiErrorHandling = useCallback(<T,>(
    Component: React.ComponentType<T>,
    options?: {
      loadingFallback?: React.ReactNode;
      errorFallback?: React.ReactNode;
    }
  ) => {
    return (props: T & { isLoading?: boolean; error?: any; retry?: () => void }) => {
      const { isLoading, error: componentError, retry, ...rest } = props;
      
      // Gérer l'erreur si elle existe
      if (componentError || error) {
        if (componentError && componentError !== error) {
          handleError(componentError);
        }
        
        if (options?.errorFallback) {
          return <>{options.errorFallback}</>;
        }
        
        return <ApiErrorAlert onRetry={retry} />;
      }
      
      // Afficher le chargement
      if (isLoading || isFetching) {
        return options?.loadingFallback || <div>Chargement...</div>;
      }
      
      // Sinon, afficher le composant normalement
      return <Component {...rest as unknown as T} />;
    };
  }, [error, isFetching, ApiErrorAlert, handleError]);

  return {
    error,
    isServerUnavailable,
    isFetching,
    handleError,
    clearError,
    checkServerAvailability,
    startFetching,
    endFetching,
    ApiErrorAlert,
    withApiErrorHandling
  };
};

export default useApiError;
