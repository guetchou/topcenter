
import React, { useState, useCallback } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryActions {
  resetError: () => void;
}

export const useErrorBoundary = (): ErrorBoundaryState & ErrorBoundaryActions => {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
  });

  const resetError = useCallback(() => {
    setState({ hasError: false, error: null });
  }, []);

  const ErrorBoundaryComponent = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      class ErrorBoundary extends React.Component<
        { children: React.ReactNode },
        ErrorBoundaryState
      > {
        constructor(props: { children: React.ReactNode }) {
          super(props);
          this.state = { hasError: false, error: null };
        }

        static getDerivedStateFromError(error: Error): ErrorBoundaryState {
          // Update state to render fallback UI on the next render
          return { hasError: true, error };
        }

        componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
          // Log error information for debugging
          console.error('Error caught by ErrorBoundary:', error, errorInfo);
          setState({ hasError: true, error });
        }

        render(): React.ReactNode {
          if (this.state.hasError) {
            return null; // Let the parent handle rendering of fallback UI
          }
          return this.props.children;
        }
      }

      return <ErrorBoundary>{children}</ErrorBoundary>;
    },
    []
  );

  return { 
    ...state, 
    resetError,
    ErrorBoundary: ErrorBoundaryComponent 
  };
};

export default useErrorBoundary;
