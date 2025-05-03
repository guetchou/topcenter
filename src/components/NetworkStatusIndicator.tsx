
import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

export const NetworkStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    // Gestionnaires d'événements pour la connectivité
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Connexion internet rétablie", {
        description: "Vous êtes à nouveau connecté"
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Connexion internet perdue", {
        description: "Certaines fonctionnalités peuvent être limitées"
      });
    };

    // Ajout des écouteurs d'événements
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Vérifier périodiquement la connexion au serveur
    const checkServerInterval = setInterval(async () => {
      if (navigator.onLine) {
        try {
          // Tente de récupérer un petit fichier d'une URL fiable avec un timestamp pour éviter le cache
          const response = await fetch('/favicon.ico?_=' + Date.now(), { 
            method: 'HEAD',
            cache: 'no-store'
          });
          
          if (!response.ok && isOnline) {
            // Si le serveur répond avec une erreur
            toast.warning("Connexion au serveur instable", {
              description: "Certaines données peuvent ne pas se charger correctement"
            });
          }
        } catch (error) {
          // En cas d'échec de connexion au serveur
          if (isOnline) {
            toast.error("Impossible de se connecter au serveur", {
              description: "Vos données sont disponibles en mode hors ligne"
            });
          }
        }
      }
    }, 30000); // Vérifie toutes les 30 secondes

    // Nettoyage à la destruction du composant
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(checkServerInterval);
    };
  }, [isOnline]);

  // Ne pas afficher l'indicateur si déjà en ligne lors du chargement initial
  if (isOnline && navigator.onLine) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
        isOnline ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 animate-pulse"
      }`}>
        {isOnline ? (
          <Wifi className="h-4 w-4" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <span>{isOnline ? "En ligne" : "Hors ligne"}</span>
      </div>
    </div>
  );
};

export default NetworkStatusIndicator;
