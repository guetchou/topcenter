
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const WebPushNotification = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

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
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setIsSubscribed(true);
        
        // Affiche une notification de test
        new Notification('Bienvenue chez TopCenter!', {
          body: 'Vous recevrez désormais nos actualités en temps réel.',
          icon: '/lovable-uploads/logo-topcenter.png'
        });

        toast({
          title: "Notifications activées",
          description: "Vous recevrez nos actualités en temps réel.",
        });
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications.",
        variant: "destructive",
      });
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
        >
          <Bell className="h-4 w-4" />
          Notifications
        </Button>
      )}
    </div>
  );
};
