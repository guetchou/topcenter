
import React from 'react';
import { ApiErrorBoundary } from './ApiErrorBoundary';
import { Spinner } from './ui/spinner';

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
  const defaultLoadingFallback = (
    <div className="flex justify-center items-center h-64">
      <Spinner className="h-8 w-8 text-primary" />
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
      {data ? children(data) : fallback}
    </ApiErrorBoundary>
  );
}
