
import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { useState, useEffect } from "react";

// Options spécifiques pour notre hook optimisé
export interface OptimizedQueryOptions<TData, TError> 
  extends Omit<UseQueryOptions<TData, TError, TData, any[]>, 'queryKey' | 'queryFn'> {
  queryKey: any[];
  queryFn: () => Promise<TData>;
  retryOnReconnect?: boolean;
  offlineData?: TData;
}

/**
 * Hook personnalisé qui étend useQuery avec des fonctionnalités d'optimisation
 * - Gestion de l'état offline avec données de secours
 * - Nouvelle tentative automatique lors de la reconnexion
 * - Mise en cache avancée
 */
export function useOptimizedQuery<TData, TError = Error>({
  queryKey,
  queryFn,
  retryOnReconnect = true,
  offlineData,
  ...options
}: OptimizedQueryOptions<TData, TError>): UseQueryResult<TData, TError> {
  // État pour suivre la connectivité réseau
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Surveiller les changements de connectivité
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Étendre les options avec des configurations optimisées
  const optimizedOptions: UseQueryOptions<TData, TError, TData, any[]> = {
    ...options,
    queryKey,
    // Si nous sommes hors ligne, ne pas faire de requêtes au serveur
    enabled: options.enabled !== false && (isOnline || !!offlineData),
    // Tenter à nouveau la requête lorsque l'application revient en ligne
    retry: isOnline ? options.retry : false,
    // Utiliser gcTime au lieu de cacheTime (obsolète dans la dernière version)
    gcTime: options.gcTime || 5 * 60 * 1000, // 5 minutes par défaut
    // Stratégie pour les données périmées
    staleTime: options.staleTime || 60 * 1000, // 1 minute par défaut
  };

  // Si nous sommes hors ligne et avons des données de secours
  if (!isOnline && offlineData) {
    // Essayer de récupérer les données mises en cache précédemment
    try {
      const cachedData = localStorage.getItem(`query-${queryKey.join('-')}`);
      if (cachedData) {
        const parsedData = JSON.parse(cachedData) as TData;
        const queryResult = useQuery<TData, TError>({
          ...optimizedOptions,
          queryFn: () => Promise.resolve(parsedData),
        });

        // Conserver la structure du résultat
        return queryResult;
      }
    } catch (error) {
      console.warn('Erreur lors de la récupération des données en cache :', error);
    }

    // Utiliser les données de secours si aucune donnée mise en cache n'est disponible
    return useQuery<TData, TError>({
      ...optimizedOptions,
      queryFn: () => Promise.resolve(offlineData as TData)
    });
  }

  // Comportement normal lorsque nous sommes en ligne
  const queryResult = useQuery<TData, TError>({
    ...optimizedOptions,
    queryFn,
  });

  // Stocker les données dans le localStorage pour y accéder hors connexion
  useEffect(() => {
    if (queryResult.data && offlineData) {
      try {
        localStorage.setItem(
          `query-${queryKey.join('-')}`, 
          JSON.stringify(queryResult.data)
        );
      } catch (error) {
        console.warn('Impossible de mettre en cache les données :', error);
      }
    }
  }, [queryResult.data, queryKey, offlineData]);

  return queryResult;
}
