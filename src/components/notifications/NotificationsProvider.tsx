
import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';

type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}

interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (title: string, message: string, type?: NotificationType) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  // Check notification permission status on mount
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, []);

  const addNotification = (title: string, message: string, type: NotificationType = 'info') => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      read: false,
      createdAt: new Date()
    };

    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
    
    // Show toast notification
    toast[type](title, {
      description: message,
      icon: <Bell className="h-4 w-4" />,
    });
    
    // Show browser notification if enabled
    if (notificationsEnabled && document.hidden) {
      try {
        // Play notification sound
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.error('Failed to play notification sound', e));
        
        // Display browser notification
        const notification = new Notification(title, {
          body: message,
          icon: '/lovable-uploads/logo-topcenter.png',
        });
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        notificationsEnabled,
        setNotificationsEnabled
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
