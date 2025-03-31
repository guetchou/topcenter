
import React, { Component, ErrorInfo, ReactNode } from "react";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error("ErrorBoundary caught an error:", error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    
    // Notification à l'utilisateur
    toast.error("Une erreur est survenue dans l'application");
    
    // Appel de la fonction onError si fournie
    this.props.onError?.(error, errorInfo);
    
    // Log côté serveur si en production
    if (process.env.NODE_ENV === 'production') {
      // Ici vous pourriez implémenter un appel à un service de logging comme Sentry
      console.error("Production error logged:", error);
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
          <div className="w-full max-w-md p-6 rounded-lg bg-red-50 border border-red-200 shadow-sm">
            <h2 className="text-xl font-semibold text-red-700 mb-4">
              Une erreur s'est produite
            </h2>
            <p className="text-red-600 mb-4">
              Nous rencontrons des difficultés à afficher ce contenu. Veuillez rafraîchir la page ou réessayer plus tard.
            </p>
            <pre className="mt-4 p-3 text-xs bg-red-100 rounded overflow-auto max-h-40">
              {this.state.error?.message}
            </pre>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Rafraîchir la page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
