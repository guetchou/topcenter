
import { useState, useEffect } from 'react';
import { getPocketbase } from '@/integrations/pocketbase/client';

export const usePocketBase = () => {
  const [pb, setPb] = useState(getPocketbase());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const healthCheck = await pb.health.check();
        setIsConnected(healthCheck.code === 200);
        setError(null);
      } catch (err) {
        setIsConnected(false);
        setError(err instanceof Error ? err : new Error('Failed to connect to PocketBase'));
      }
    };

    checkConnection();
  }, [pb]);

  return { pb, isConnected, error };
};

export default usePocketBase;
