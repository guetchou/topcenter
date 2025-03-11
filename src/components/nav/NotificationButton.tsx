
import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NotificationButtonProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export function NotificationButton({ 
  notificationsEnabled, 
  setNotificationsEnabled 
}: NotificationButtonProps) {
  const handleNotificationToggle = async () => {
    if (!('Notification' in window)) {
      toast("Votre navigateur ne supporte pas les notifications.");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        
        // Affiche une notification de test
        new Notification('Bienvenue chez TopCenter!', {
          body: 'Vous recevrez désormais nos actualités en temps réel.',
          icon: '/lovable-uploads/logo-topcenter.png'
        });

        toast.success("Vous recevrez nos actualités en temps réel.");
      } else {
        toast("Vous ne recevrez pas de notifications.");
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error("Impossible d'activer les notifications.");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={notificationsEnabled ? "Notifications activées" : "Activer les notifications"}
      onClick={handleNotificationToggle}
      className="mr-1 relative"
    >
      <Bell className="h-5 w-5" />
      {notificationsEnabled && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
      )}
      <span className="sr-only">
        {notificationsEnabled ? "Notifications activées" : "Activer les notifications"}
      </span>
    </Button>
  );
}
