
import { useState } from "react";
import { Bell, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

export function ProfessionalNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Bienvenue sur TopCenter",
      message: "Merci de visiter notre site. Découvrez nos services.",
      date: new Date(),
      read: false,
      type: "info"
    },
    {
      id: "2",
      title: "Nouvelle formation disponible",
      message: "Une formation sur la relation client est maintenant disponible.",
      date: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      type: "success"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const getTypeStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success": return "border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20";
      case "warning": return "border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20";
      case "error": return "border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20";
      default: return "border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 px-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-[10px]"
              variant="default"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[350px] p-0 max-h-[500px] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="text-lg font-medium">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              Tout marquer comme lu
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground">
            Aucune notification
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`p-3 border-b relative ${getTypeStyles(notification.type)} ${notification.read ? 'opacity-70' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{notification.title}</h4>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="text-xs mt-1 text-muted-foreground">{notification.message}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-muted-foreground">
                    {notification.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!notification.read && (
                    <Badge variant="default" className="text-[10px] h-5 bg-primary/80">
                      Nouveau
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer justify-center text-primary hover:text-primary font-medium">
          Voir toutes les notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
