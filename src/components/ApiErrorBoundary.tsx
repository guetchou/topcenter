
import React, { useState, useEffect } from 'react';
import { useApiError } from '@/hooks/useApiError';
import { Spinner } from '@/components/ui/spinner';
import ErrorBoundary from './ErrorBoundary';
import { Button } from './ui/button';
import { RefreshCw, WifiOff } from 'lucide-react';

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  retryFunction?: () => void;
  isLoading?: boolean;
  error?: Error | null;
  maxRetries?: number;
}

export const ApiErrorBoundary: React.FC<ApiErrorBoundaryProps> = ({
  children,
  fallback,
  loadingFallback,
  retryFunction,
  isLoading,
  error,
  maxRetries = 1
}) => {
  const { ApiErrorAlert, isServerUnavailable } = useApiError();
  const [retryCount, setRetryCount] = useState(0);
  const [shouldAutoRetry, setShouldAutoRetry] = useState(true);
  
  const defaultLoadingFallback = (
    <div className="flex flex-col justify-center items-center h-64 gap-3 animate-fade-in">
      <Spinner className="h-8 w-8 text-primary" aria-label="Chargement en cours" />
      <p className="text-sm text-muted-foreground animate-pulse-subtle" aria-live="polite">Chargement en cours...</p>
    </div>
  );

  // Handle auto-retry with exponential backoff
  useEffect(() => {
    let retryTimeout: number | null = null;
    
    if (error && retryFunction && shouldAutoRetry && retryCount < maxRetries) {
      // Exponential backoff: 2^retryCount * 1000 ms (1s, 2s, 4s, 8s, etc.)
      const delay = Math.min(2 ** retryCount * 1000, 10000);
      
      retryTimeout = window.setTimeout(() => {
        setRetryCount(prev => prev + 1);
        retryFunction();
      }, delay);
    }
    
    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
    };
  }, [error, retryFunction, retryCount, maxRetries, shouldAutoRetry]);

  // Manual retry handler
  const handleManualRetry = () => {
    if (retryFunction) {
      setRetryCount(0);
      retryFunction();
    }
  };

  // If server is unavailable after retries, show offline message
  if (error && isServerUnavailable && retryCount >= maxRetries) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 text-center flex flex-col items-center gap-3" role="alert">
        <WifiOff className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <h3 className="font-medium">Mode hors ligne</h3>
        <p className="text-sm text-muted-foreground">
          Connexion au serveur impossible. Les données affichées peuvent ne pas être à jour.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualRetry}
          className="mt-2"
        >
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Réessayer
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShouldAutoRetry(prev => !prev)}
          className="mt-1"
        >
          {shouldAutoRetry ? "Désactiver" : "Activer"} la reconnexion automatique
        </Button>
      </div>
    );
  }

  // If an error is passed in props, display the error alert
  if (error) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <ApiErrorAlert onRetry={handleManualRetry} />;
  }

  // If isLoading is true, display the loading indicator
  if (isLoading) {
    return <>{loadingFallback || defaultLoadingFallback}</>;
  }

  // Use ErrorBoundary to catch errors in child components
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="container py-8">
            <ApiErrorAlert onRetry={handleManualRetry} />
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ApiErrorBoundary;
