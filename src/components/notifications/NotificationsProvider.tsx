
import React, { createContext, useContext, useState, ReactNode } from "react";
import { createPortal } from "react-dom";
import { ElegantNotification, NotificationProps } from "./ElegantNotification";
import { AnimatePresence, motion } from "framer-motion";

interface NotificationItem extends NotificationProps {
  id: string;
}

interface NotificationsContextType {
  showNotification: (notification: NotificationProps) => string;
  hideNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
};

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = (notification: NotificationProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  };

  const hideNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <NotificationsContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed top-4 right-4 z-[100] space-y-3 max-w-md w-full pointer-events-none flex flex-col items-end">
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -20, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="pointer-events-auto"
              >
                <ElegantNotification
                  {...notification}
                  onClose={() => hideNotification(notification.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </NotificationsContext.Provider>
  );
};
