
import React from 'react';
import { useApiError } from '@/hooks/useApiError';
import { Spinner } from '@/components/ui/spinner';
import ErrorBoundary from './ErrorBoundary';

interface ApiErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  retryFunction?: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

export const ApiErrorBoundary: React.FC<ApiErrorBoundaryProps> = ({
  children,
  fallback,
  loadingFallback,
  retryFunction,
  isLoading,
  error
}) => {
  const { ApiErrorAlert } = useApiError();
  
  const defaultLoadingFallback = (
    <div className="flex justify-center items-center h-64">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  );

  // Si une erreur est passée en props, afficher l'alerte d'erreur
  if (error) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return <ApiErrorAlert onRetry={retryFunction} />;
  }

  // Si isLoading est vrai, afficher l'indicateur de chargement
  if (isLoading) {
    return <>{loadingFallback || defaultLoadingFallback}</>;
  }

  // Utiliser ErrorBoundary pour intercepter les erreurs dans les composants enfants
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="container py-8">
            <ApiErrorAlert onRetry={retryFunction} />
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
};

export default ApiErrorBoundary;
