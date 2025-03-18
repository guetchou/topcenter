
import { Bell, X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ElegantNotificationProps {
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  onClose: () => void;
  duration?: number;
}

export const ElegantNotification = ({
  title,
  message,
  type = "info",
  onClose,
  duration = 5000,
}: ElegantNotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "info":
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case "success": return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
      case "warning": return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700";
      case "error": return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700";
      case "info":
      default: return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "w-full max-w-sm p-4 rounded-lg shadow-lg border",
            "backdrop-blur-sm",
            getBgColor()
          )}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {getIcon()}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">{title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ElegantNotification;
