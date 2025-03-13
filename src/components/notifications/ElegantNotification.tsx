
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, Check } from "lucide-react";

export interface NotificationProps {
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  duration?: number;
  onClose?: () => void;
}

export const ElegantNotification = ({
  title,
  message,
  type = "info",
  duration = 5000,
  onClose
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        closeNotification();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const closeNotification = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Attendre la fin de l'animation avant d'appeler onClose
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 text-green-700";
      case "warning":
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500 text-amber-700";
      case "error":
        return "bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-700";
      default:
        return "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 text-blue-700";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <Check className="w-5 h-5 text-green-500" />;
      case "warning":
        return <Bell className="w-5 h-5 text-amber-500" />;
      case "error":
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`rounded-lg shadow-lg overflow-hidden max-w-md ${getTypeStyles()}`}
        >
          <div className="flex items-start p-4">
            <div className="flex-shrink-0 mr-3 mt-0.5">
              {getIcon()}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm opacity-90 mt-1">{message}</p>
            </div>
            <button 
              onClick={closeNotification}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <motion.div 
            className="h-1 bg-gradient-to-r from-transparent to-current opacity-30"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
