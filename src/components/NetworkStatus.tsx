
import { useState, useEffect, useCallback } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasShownOfflineToast, setHasShownOfflineToast] = useState(false);

  // Fonction pour vérifier activement la connexion au serveur
  const checkServerConnection = useCallback(async () => {
    try {
      // Utiliser un timestamp pour éviter le cache
      const response = await fetch(`/lovable-uploads/logo-topcenter.png?t=${Date.now()}`, { 
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'pragma': 'no-cache' }
      });
      
      const newOnlineStatus = response.ok;
      
      if (newOnlineStatus !== isOnline) {
        setIsOnline(newOnlineStatus);
        
        if (newOnlineStatus) {
          toast.success("Vous êtes de nouveau connecté à Internet");
          setHasShownOfflineToast(false);
        } else if (!hasShownOfflineToast) {
          toast.error("Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.", {
            duration: 10000
          });
          setHasShownOfflineToast(true);
        }
      }
    } catch (error) {
      if (isOnline) {
        setIsOnline(false);
        if (!hasShownOfflineToast) {
          toast.error("Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.", {
            duration: 10000
          });
          setHasShownOfflineToast(true);
        }
      }
    }
  }, [isOnline, hasShownOfflineToast]);

  useEffect(() => {
    // Vérification immédiate au chargement
    checkServerConnection();
    
    // Vérification périodique
    const intervalId = setInterval(checkServerConnection, 30000); // Toutes les 30 secondes
    
    // Gestionnaire pour les changements de statut de connexion du navigateur
    const handleOnline = () => {
      checkServerConnection(); // Vérifier la connexion réelle au serveur
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (!hasShownOfflineToast) {
        toast.error("Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.", {
          duration: 10000
        });
        setHasShownOfflineToast(true);
      }
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
  }, [checkServerConnection, hasShownOfflineToast]);

  // Ne rien afficher si l'utilisateur est en ligne
  if (isOnline) return null;

  // Afficher un indicateur seulement en mode hors ligne
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center bg-destructive text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
      <WifiOff className="w-4 h-4 mr-2" />
      <span className="text-sm font-medium">Mode hors ligne</span>
    </div>
  );
}
