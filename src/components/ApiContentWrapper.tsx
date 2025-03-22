
import React from 'react';
import { ApiErrorBoundary } from './ApiErrorBoundary';
import { Spinner } from './ui/spinner';
import { cn } from '@/lib/utils';

interface ApiContentWrapperProps<T> {
  data: T | null | undefined;
  isLoading: boolean;
  error: Error | null | undefined;
  refetch: () => void;
  children: (data: T) => React.ReactNode;
  fallback: React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  emptyMessage?: string;
}

export function ApiContentWrapper<T>({
  data,
  isLoading,
  error,
  refetch,
  children,
  fallback,
  loadingFallback,
  errorFallback,
  emptyMessage = "Aucune donnée disponible"
}: ApiContentWrapperProps<T>) {
  // Composant réutilisable pour afficher l'état de chargement avec animation
  const defaultLoadingFallback = (
    <div className="flex flex-col justify-center items-center h-64 gap-3 animate-fade-in">
      <Spinner className="h-8 w-8 text-primary animate-bounce-subtle" />
      <p className="text-sm text-muted-foreground animate-pulse-subtle">Chargement en cours...</p>
    </div>
  );

  // Animation conditionnelle pour le contenu lorsqu'il est chargé
  const ContentWithAnimation = ({ children }: { children: React.ReactNode }) => (
    <div 
      className={cn(
        "animate-fade-in transition-opacity duration-500",
        isLoading ? "opacity-0" : "opacity-100"
      )}
    >
      {children}
    </div>
  );

  // Gestion améliorée des erreurs et des états de chargement
  return (
    <ApiErrorBoundary
      isLoading={isLoading}
      error={error as Error}
      retryFunction={refetch}
      loadingFallback={loadingFallback || defaultLoadingFallback}
      fallback={errorFallback}
    >
      <ContentWithAnimation>
        {data ? children(data) : fallback}
      </ContentWithAnimation>
    </ApiErrorBoundary>
  );
}
