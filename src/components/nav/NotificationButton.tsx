
import { useState, useEffect } from "react";
import { Bell, Sparkles, Rocket, CircuitBoard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationButtonProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export function NotificationButton({ 
  notificationsEnabled, 
  setNotificationsEnabled 
}: NotificationButtonProps) {
  const [notifications, setNotifications] = useState<Array<{id: string, title: string, content: string, read: boolean, type?: string}>>([
    {id: '1', title: 'Bienvenue chez TopCenter', content: 'Merci de nous faire confiance pour vos services de centre d\'appels.', read: false, type: 'info'},
    {id: '2', title: 'Nouvelle offre disponible', content: 'Découvrez notre nouveau forfait premium avec support 24/7.', read: false, type: 'promo'}
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Animation effect when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0 && !isOpen) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount, isOpen]);

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

  // Helper to get icon based on notification type
  const getNotificationIcon = (type?: string) => {
    switch(type) {
      case 'promo': return <Rocket className="h-4 w-4 text-primary" />;
      case 'update': return <CircuitBoard className="h-4 w-4 text-blue-500" />;
      case 'alert': return <Bell className="h-4 w-4 text-red-500" />;
      default: return <Sparkles className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={notificationsEnabled ? "Notifications activées" : "Activer les notifications"}
          className={cn(
            "relative transition-all", 
            isAnimating && "animate-pulse-subtle"
          )}
        >
          {isAnimating ? (
            <AnimatePresence>
              <motion.div
                initial={{ scale: 1 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: 2,
                  ease: "easeInOut"
                }}
              >
                <Bell className="h-5 w-5" />
              </motion.div>
            </AnimatePresence>
          ) : (
            <Bell className="h-5 w-5" />
          )}
          
          {notificationsEnabled && unreadCount > 0 && (
            <span className={cn(
              "absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center", 
              "rounded-full bg-primary text-[10px] text-primary-foreground",
              "animate-in zoom-in-50 duration-300"
            )}>
              {unreadCount}
            </span>
          )}
          <span className="sr-only">
            {notificationsEnabled ? "Notifications activées" : "Activer les notifications"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3 bg-gradient-to-r from-primary/10 to-transparent">
          <h3 className="font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse-subtle" />
            Notifications
          </h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs hover:bg-primary/10" 
              onClick={markAllAsRead}
            >
              Tout marquer comme lu
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <CircuitBoard className="mb-2 h-8 w-8 text-muted-foreground/60" />
              <p className="text-sm text-muted-foreground">
                Aucune notification pour le moment
              </p>
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <motion.div 
                  key={notification.id}
                  initial={{ opacity: 0.8, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ 
                    backgroundColor: "rgba(var(--primary)/0.05)",
                    transition: { duration: 0.2 }
                  }}
                  className={cn(
                    "border-b p-3 cursor-pointer transition-colors",
                    notification.read ? 'opacity-70' : 'bg-secondary/30'
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start">
                    <div className={cn(
                      "mr-2 mt-1 h-2 w-2 rounded-full",
                      notification.read ? 'bg-transparent' : 'bg-primary animate-pulse-subtle'
                    )}></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium flex items-center gap-1.5">
                        {getNotificationIcon(notification.type)}
                        {notification.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{notification.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t p-3 bg-gradient-to-r from-transparent to-primary/10">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs hover:bg-primary/10 hover:text-primary transition-colors" 
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
