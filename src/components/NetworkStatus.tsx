
import { useState, useEffect, useCallback } from "react";
import { Wifi, WifiOff, Server, ServerOff, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useApiError } from "@/hooks/useApiError";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasShownOfflineToast, setHasShownOfflineToast] = useState(false);
  const [serverReachable, setServerReachable] = useState(true);
  const [lastServerCheckTime, setLastServerCheckTime] = useState(0);
  const [isCheckingServer, setIsCheckingServer] = useState(false);
  const { checkServerAvailability } = useApiError();

  // Fonction pour vérifier activement la connexion au serveur
  const checkServerConnection = useCallback(async () => {
    // Avoid multiple simultaneous checks
    if (isCheckingServer) return;
    
    // Don't check too frequently (rate limit to once every 5 seconds)
    const now = Date.now();
    if (now - lastServerCheckTime < 5000) return;
    
    setIsCheckingServer(true);
    setLastServerCheckTime(now);
    
    try {
      const result = await checkServerAvailability();
      const previousStatus = serverReachable;
      setServerReachable(result);
      
      if (result && !previousStatus) {
        toast.success("Connexion au serveur rétablie");
        setHasShownOfflineToast(false);
      } else if (!result && previousStatus && !hasShownOfflineToast) {
        toast.error("Impossible de joindre le serveur. Vérifiez votre connexion ou réessayez plus tard.", {
          duration: 10000
        });
        setHasShownOfflineToast(true);
      }
    } finally {
      setIsCheckingServer(false);
    }
  }, [serverReachable, hasShownOfflineToast, isCheckingServer, lastServerCheckTime, checkServerAvailability]);

  // Fonction pour vérifier le statut de connexion
  const checkConnectionStatus = useCallback(() => {
    const newOnlineStatus = navigator.onLine;
    
    if (newOnlineStatus !== isOnline) {
      setIsOnline(newOnlineStatus);
      
      if (newOnlineStatus) {
        toast.success("Vous êtes de nouveau connecté à Internet");
        setHasShownOfflineToast(false);
        // Vérifier si le serveur est également accessible
        checkServerConnection();
      } else if (!hasShownOfflineToast) {
        toast.error("Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.", {
          duration: 10000
        });
        setHasShownOfflineToast(true);
        setServerReachable(false);
      }
    }
  }, [isOnline, hasShownOfflineToast, checkServerConnection]);

  useEffect(() => {
    // Vérification immédiate au chargement
    checkConnectionStatus();
    checkServerConnection();
    
    // Vérification périodique 
    const intervalId = setInterval(() => {
      checkConnectionStatus();
      if (navigator.onLine) {
        checkServerConnection();
      }
    }, 15000); // Toutes les 15 secondes
    
    // Gestionnaire pour les changements de statut de connexion du navigateur
    const handleOnline = () => {
      checkConnectionStatus();
    };

    const handleOffline = () => {
      checkConnectionStatus();
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Nettoyage
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkConnectionStatus, checkServerConnection]);

  const handleRetry = () => {
    if (!isOnline) {
      toast.info("Tentative de reconnexion...");
      checkConnectionStatus();
    } else if (!serverReachable) {
      toast.info("Vérification de la connexion au serveur...");
      checkServerConnection();
    }
  };

  // Ne rien afficher si l'utilisateur est en ligne et le serveur est accessible
  if (isOnline && serverReachable) return null;

  // Afficher un indicateur pour hors ligne ou serveur inaccessible
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-destructive text-white px-4 py-2 rounded-full shadow-lg">
      {!isOnline ? (
        <>
          <WifiOff className="h-4 w-4" />
          <span className="text-sm font-medium">Mode hors ligne</span>
        </>
      ) : (
        <>
          <ServerOff className="h-4 w-4" />
          <span className="text-sm font-medium">Serveur inaccessible</span>
        </>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRetry}
        className="ml-2 bg-white/10 hover:bg-white/20 text-white"
        disabled={isCheckingServer}
      >
        <RefreshCw className={`h-3 w-3 mr-1 ${isCheckingServer ? 'animate-spin' : ''}`} />
        Réessayer
      </Button>
    </div>
  );
}
