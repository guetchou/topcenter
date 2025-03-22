
import { useState, useEffect, useCallback } from "react";
import { Wifi, WifiOff, Server, ServerOff } from "lucide-react";
import { toast } from "sonner";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasShownOfflineToast, setHasShownOfflineToast] = useState(false);
  const [serverReachable, setServerReachable] = useState(true);
  const [lastServerCheckTime, setLastServerCheckTime] = useState(0);
  const [isCheckingServer, setIsCheckingServer] = useState(false);

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
      // Check a reliable server resource that should always be available
      const response = await fetch(`/lovable-uploads/logo-topcenter.png?t=${now}`, { 
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'pragma': 'no-cache' },
        timeout: 5000 // 5 second timeout
      });
      
      const newServerStatus = response.ok;
      const previousStatus = serverReachable;
      setServerReachable(newServerStatus);
      
      if (newServerStatus !== previousStatus) {
        if (newServerStatus) {
          toast.success("Connexion au serveur rétablie");
          setHasShownOfflineToast(false);
        } else if (!hasShownOfflineToast) {
          toast.error("Impossible de joindre le serveur. Vérifiez votre connexion ou réessayez plus tard.", {
            duration: 10000
          });
          setHasShownOfflineToast(true);
        }
      }
    } catch (error) {
      console.error("Server check failed:", error);
      const previousStatus = serverReachable;
      setServerReachable(false);
      
      if (previousStatus && !hasShownOfflineToast) {
        toast.error("Impossible de joindre le serveur. Vérifiez votre connexion ou réessayez plus tard.", {
          duration: 10000
        });
        setHasShownOfflineToast(true);
      }
    } finally {
      setIsCheckingServer(false);
    }
  }, [serverReachable, hasShownOfflineToast, isCheckingServer, lastServerCheckTime]);

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

  // Ne rien afficher si l'utilisateur est en ligne et le serveur est accessible
  if (isOnline && serverReachable) return null;

  // Afficher un indicateur pour hors ligne ou serveur inaccessible
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center bg-destructive text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Mode hors ligne</span>
        </>
      ) : (
        <>
          <ServerOff className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Serveur inaccessible</span>
        </>
      )}
    </div>
  );
}
