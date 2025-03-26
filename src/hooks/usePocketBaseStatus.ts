
import { useState, useEffect } from 'react';
import { testPocketBaseConnection } from '@/integrations/pocketbase/client';

export const usePocketBaseStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setIsChecking(true);
        const result = await testPocketBaseConnection();
        setIsConnected(result);
      } catch (error) {
        setIsConnected(false);
        console.error('Error checking PocketBase connection:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { isConnected, isChecking };
};

export default usePocketBaseStatus;
