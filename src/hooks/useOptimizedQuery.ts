
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useApiError } from "./useApiError";
import { toast } from "sonner";

type OptimizedQueryOptions<TData, TError> = Omit<UseQueryOptions<TData, TError, TData>, 'queryKey' | 'queryFn'> & {
  showSuccessToast?: boolean;
  successToastMessage?: string;
  showErrorToast?: boolean;
  errorToastMessage?: string;
  staleTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnReconnect?: boolean;
  refetchInterval?: number | false;
  refetchIntervalInBackground?: boolean;
};

export function useOptimizedQuery<TData, TError = Error>(
  queryKey: string[],
  queryFn: () => Promise<TData>,
  options?: OptimizedQueryOptions<TData, TError>
) {
  const { isServerUnavailable, checkServerAvailability } = useApiError();
  const [connectionPaused, setConnectionPaused] = useState(false);
  
  // Only refetch when online
  useEffect(() => {
    const handleOnline = async () => {
      if (connectionPaused) {
        const serverAvailable = await checkServerAvailability();
        if (serverAvailable) {
          setConnectionPaused(false);
          toast.success("Reconnecté au serveur", {
            description: "Les données sont à nouveau synchronisées."
          });
        }
      }
    };
    
    const handleOffline = () => {
      setConnectionPaused(true);
      toast.warning("Mode hors connexion", {
        description: "Les données affichées peuvent ne pas être à jour."
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkServerAvailability, connectionPaused]);
  
  return useQuery({
    queryKey,
    queryFn,
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes default
    gcTime: options?.cacheTime || 10 * 60 * 1000, // 10 minutes default
    retry: options?.retry !== undefined ? options.retry : 1,
    refetchOnWindowFocus: options?.refetchOnWindowFocus !== undefined ? options.refetchOnWindowFocus : false,
    refetchOnReconnect: options?.refetchOnReconnect !== undefined ? options.refetchOnReconnect : true,
    refetchIntervalInBackground: false,
    enabled: !connectionPaused && !isServerUnavailable && (options?.enabled !== undefined ? options.enabled : true),
    // Utiliser le mécanisme d'événements de TanStack Query v5
    meta: {
      onSuccess: (data: TData) => {
        if (options?.showSuccessToast) {
          toast.success(options.successToastMessage || "Données mises à jour");
        }
      },
      onError: (error: TError) => {
        if (error instanceof Error && error.message.includes('network')) {
          setConnectionPaused(true);
        }
        
        if (options?.showErrorToast) {
          toast.error(options.errorToastMessage || "Erreur lors du chargement des données");
        }
      }
    },
    ...options
  });
}
