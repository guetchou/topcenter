
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const WebPushNotification = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Vérifie si les notifications sont supportées
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    try {
      const permission = await Notification.permission;
      setIsSubscribed(permission === 'granted');
    } catch (error) {
      console.error('Error checking notification permission:', error);
    }
  };

  const handleSubscribe = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setIsSubscribed(true);
        
        // S'assurer que le service worker est enregistré
        const registration = await navigator.serviceWorker.ready;
        
        // Affiche une notification de test
        const notificationOptions = {
          body: 'Vous recevrez désormais nos actualités en temps réel.',
          icon: '/lovable-uploads/logo-topcenter.png',
          badge: '/lovable-uploads/logo-topcenter.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
          }
        };

        try {
          await registration.showNotification('Bienvenue chez TopCenter!', notificationOptions);
        } catch (e) {
          // Fallback à l'API Notification si showNotification échoue
          new Notification('Bienvenue chez TopCenter!', notificationOptions);
        }

        toast.success("Vous recevrez nos actualités en temps réel.");
      } else if (permission === 'denied') {
        toast.error("Les notifications ont été bloquées. Veuillez les autoriser dans les paramètres de votre navigateur.");
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      toast.error("Impossible d'activer les notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="fixed top-20 right-4 z-50">
      {!isSubscribed && (
        <Button
          variant="default"
          size="sm"
          className="shadow-lg gap-2"
          onClick={handleSubscribe}
          disabled={isLoading}
        >
          <Bell className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
          {isLoading ? 'Activation...' : 'Notifications'}
        </Button>
      )}
    </div>
  );
};
