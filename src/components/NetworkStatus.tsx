
import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Gestionnaire pour les changements de statut de connexion
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Vous êtes de nouveau connecté à Internet");
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error("Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.");
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Nettoyage
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Ne rien afficher si l'utilisateur est en ligne
  if (isOnline) return null;

  // Afficher un indicateur seulement en mode hors ligne
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center bg-destructive text-white px-4 py-2 rounded-full shadow-lg">
      <WifiOff className="w-4 h-4 mr-2" />
      <span className="text-sm font-medium">Mode hors ligne</span>
    </div>
  );
}
