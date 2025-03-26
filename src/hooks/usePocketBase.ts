
import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { getPocketBase, checkServerAvailability, getCurrentUser, isUserValid } from '@/integrations/pocketbase/client';

export const usePocketBase = () => {
  const [pb, setPb] = useState<PocketBase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    try {
      const pbInstance = getPocketBase();
      setPb(pbInstance);
      
      // Vérifier la connexion au serveur
      checkServerAvailability()
        .then(connected => {
          setIsConnected(connected);
          setIsLoading(false);
        })
        .catch(err => {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        });
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
    }
  }, []);

  const user = getCurrentUser();
  const isAuthenticated = isUserValid();

  return {
    pb,
    isLoading,
    error,
    isConnected,
    user,
    isAuthenticated
  };
};

export default usePocketBase;
