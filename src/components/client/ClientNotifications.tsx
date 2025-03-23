
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, CheckCheck, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { wsService } from "@/services/websocketService";
import { useNotifications } from "@/components/notifications/NotificationsProvider";

interface ClientNotification {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
  action?: string;
}

export const ClientNotifications = () => {
  const [notifications, setNotifications] = useState<ClientNotification[]>([
    {
      id: "1",
      title: "Bienvenue sur votre espace client",
      message: "Votre espace client est maintenant actif. Vous pouvez consulter vos demandes et documents.",
      timestamp: Date.now() - 86400000, // 1 day ago
      isRead: false,
      type: 'info'
    },
    {
      id: "2",
      title: "Nouvelle facture disponible",
      message: "Votre facture du mois de mars est maintenant disponible dans votre espace documents.",
      timestamp: Date.now() - 3600000, // 1 hour ago
      isRead: false,
      type: 'info',
      action: 'Voir la facture'
    }
  ]);
  
  const { addNotification } = useNotifications();
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    toast.success("Toutes les notifications ont été marquées comme lues");
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };
  
  const handleAction = (notification: ClientNotification) => {
    toast.info(`Action: ${notification.action}`);
    markAsRead(notification.id);
  };
  
  // Connect to WebSocket for real-time notifications
  useEffect(() => {
    wsService.connect().then(connected => {
      if (connected) {
        console.log("Connected to WebSocket for notifications");
      }
    });
    
    // Register handler for notification messages
    const unregister = wsService.on('notification', (data) => {
      const newNotification: ClientNotification = {
        id: data.id,
        title: data.title,
        message: data.message,
        timestamp: data.timestamp || Date.now(),
        isRead: false,
        type: data.type || 'info',
        action: data.action
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      // Show a toast notification
      addNotification(newNotification.title, newNotification.message, newNotification.type);
    });
    
    // Clean up
    return () => {
      unregister();
    };
  }, [addNotification]);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Notifications</CardTitle>
          <CardDescription>Vos alertes et informations</CardDescription>
        </div>
        
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="mr-1 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            <Bell className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>Aucune notification</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-3">
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-4 rounded-lg border transition-colors relative group",
                    notification.isRead 
                      ? "bg-card" 
                      : "bg-muted/30 border-primary/20"
                  )}
                >
                  {!notification.isRead && (
                    <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary animate-pulse" />
                  )}
                  
                  <div className="flex items-start gap-2">
                    <div className={cn(
                      "p-2 rounded-full",
                      notification.type === 'success' && "bg-green-100",
                      notification.type === 'warning' && "bg-amber-100",
                      notification.type === 'error' && "bg-red-100",
                      notification.type === 'info' && "bg-blue-100"
                    )}>
                      <Bell className={cn(
                        "h-4 w-4",
                        notification.type === 'success' && "text-green-600",
                        notification.type === 'warning' && "text-amber-600",
                        notification.type === 'error' && "text-red-600",
                        notification.type === 'info' && "text-blue-600"
                      )} />
                    </div>
                    
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        <time className="text-xs text-muted-foreground">
                          {new Date(notification.timestamp).toLocaleString()}
                        </time>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      
                      <div className="pt-2 flex justify-between items-center">
                        <div className="flex gap-2">
                          {notification.action && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleAction(notification)}
                              className="text-xs h-8"
                            >
                              {notification.action}
                            </Button>
                          )}
                          
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs h-8"
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Marquer comme lu
                            </Button>
                          )}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
