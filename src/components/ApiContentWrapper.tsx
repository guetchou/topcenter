
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
  maxRetries?: number;
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
  emptyMessage = "Aucune donnée disponible",
  maxRetries = 1
}: ApiContentWrapperProps<T>) {
  // Reusable component for displaying loading state with animation
  const defaultLoadingFallback = (
    <div className="flex flex-col justify-center items-center h-64 gap-3 animate-fade-in">
      <Spinner 
        className="h-8 w-8 text-primary animate-bounce-subtle" 
        aria-label="Chargement des données"
      />
      <p 
        className="text-sm text-muted-foreground animate-pulse-subtle"
        aria-live="polite"
      >
        Chargement en cours...
      </p>
    </div>
  );

  // Conditional animation for content when loaded
  const ContentWithAnimation = ({ children }: { children: React.ReactNode }) => (
    <div 
      className={cn(
        "animate-fade-in transition-opacity duration-500",
        isLoading ? "opacity-0" : "opacity-100"
      )}
      aria-busy={isLoading}
      aria-live="polite"
    >
      {children}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-8">
      <p className="text-muted-foreground">{emptyMessage}</p>
    </div>
  );

  // Improved handling of errors and loading states
  return (
    <ApiErrorBoundary
      isLoading={isLoading}
      error={error as Error}
      retryFunction={refetch}
      loadingFallback={loadingFallback || defaultLoadingFallback}
      fallback={errorFallback}
      maxRetries={maxRetries}
    >
      <ContentWithAnimation>
        {data ? (
          Array.isArray(data) && data.length === 0 ? (
            <EmptyState />
          ) : (
            children(data)
          )
        ) : (
          fallback
        )}
      </ContentWithAnimation>
    </ApiErrorBoundary>
  );
}
