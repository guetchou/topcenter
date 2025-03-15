
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

interface NotificationButtonProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export function NotificationButton({ 
  notificationsEnabled, 
  setNotificationsEnabled 
}: NotificationButtonProps) {
  const [notifications, setNotifications] = useState<Array<{id: string, title: string, content: string, read: boolean}>>([
    {id: '1', title: 'Bienvenue chez TopCenter', content: 'Merci de nous faire confiance pour vos services de centre d\'appels.', read: false},
    {id: '2', title: 'Nouvelle offre disponible', content: 'Découvrez notre nouveau forfait premium avec support 24/7.', read: false}
  ]);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

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

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={notificationsEnabled ? "Notifications activées" : "Activer les notifications"}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          {notificationsEnabled && unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">
            {notificationsEnabled ? "Notifications activées" : "Activer les notifications"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs" 
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <Bell className="mb-2 h-8 w-8 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                Aucune notification pour le moment
              </p>
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <div 
                  key={notification.id}
                  className={`border-b p-3 hover:bg-muted/50 cursor-pointer transition-colors ${notification.read ? 'opacity-70' : 'bg-secondary/50'}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div className={`mr-2 mt-1 h-2 w-2 rounded-full ${notification.read ? 'bg-transparent' : 'bg-primary'}`}></div>
                    <div>
                      <h4 className="text-sm font-medium">{notification.title}</h4>
                      <p className="text-xs text-muted-foreground">{notification.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t p-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs" 
            onClick={handleNotificationToggle}
          >
            {notificationsEnabled 
              ? "Gérer les notifications" 
              : "Activer les notifications"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
