
import React, { useState, useEffect } from 'react';
import { checkServerAvailability, pb } from '@/integrations/pocketbase/client';
import { Button } from '@/components/ui/button';
import { RefreshCw, Database, WifiOff, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const PocketBaseStatus: React.FC = () => {
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Vérifier la disponibilité au montage du composant
  useEffect(() => {
    checkAvailability();
    
    // Configurer des vérifications périodiques (toutes les 2 minutes)
    const intervalId = setInterval(checkAvailability, 2 * 60 * 1000);
    
    // Écouter les événements de connectivité du navigateur
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkAvailability = async () => {
    if (isChecking) return;
    
    setIsChecking(true);
    setErrorMessage('');
    
    try {
      const available = await checkServerAvailability();
      setIsAvailable(available);
      
      if (!available) {
        setErrorMessage('Serveur PocketBase non disponible');
        toast.error('Serveur PocketBase indisponible', {
          description: 'Vérifiez votre connexion ou contactez l\'administrateur'
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      setIsAvailable(false);
      setErrorMessage(error instanceof Error ? error.message : 'Erreur inconnue');
    } finally {
      setLastCheck(new Date());
      setIsChecking(false);
    }
  };

  const handleOnline = () => {
    toast.info('Connexion Internet rétablie, vérification de PocketBase...');
    checkAvailability();
  };

  const handleOffline = () => {
    setIsAvailable(false);
    setErrorMessage('Appareil hors ligne');
    toast.error('Appareil hors ligne', {
      description: 'Les fonctionnalités PocketBase sont limitées'
    });
  };

  if (isAvailable) {
    return (
      <div className="flex items-center text-sm text-muted-foreground">
        <Database className="w-4 h-4 mr-2 text-green-500" />
        <span className="mr-2">PocketBase connecté</span>
        {lastCheck && (
          <span className="text-xs">
            (vérifié {lastCheck.toLocaleTimeString()})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-3">
      <div className="flex items-center">
        <WifiOff className="h-5 w-5 text-red-500 mr-2" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">
            PocketBase indisponible
          </h3>
          <p className="text-xs text-red-700 mt-1">
            {errorMessage || `Impossible de se connecter à ${pb.baseUrl}`}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={checkAvailability}
          disabled={isChecking}
          className="ml-2"
        >
          <RefreshCw className={`h-3 w-3 mr-1 ${isChecking ? 'animate-spin' : ''}`} />
          Vérifier
        </Button>
      </div>
    </div>
  );
};

export default PocketBaseStatus;
