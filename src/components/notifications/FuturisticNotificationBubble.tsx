
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FuturisticNotificationBubbleProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  onClose?: () => void;
}

export const FuturisticNotificationBubble = ({
  message,
  type = 'info',
  duration = 5000,
  position = 'bottom-right',
  onClose
}: FuturisticNotificationBubbleProps) => {
  const [visible, setVisible] = useState(true);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setAnimating(true);
    setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!visible) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const typeClasses = {
    info: 'bg-blue-500 border-blue-600',
    success: 'bg-green-500 border-green-600',
    warning: 'bg-amber-500 border-amber-600',
    error: 'bg-red-500 border-red-600',
  };

  return (
    <div
      className={cn(
        'fixed z-50 max-w-md p-4 text-white rounded-lg shadow-lg',
        'backdrop-blur-md border',
        'transform transition-all duration-300',
        typeClasses[type],
        positionClasses[position],
        animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">{message}</div>
        <button
          onClick={handleClose}
          className="p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>
      </div>
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-lg animate-progress" style={{
          animationDuration: `${duration}ms`,
          width: '100%'
        }} />
      )}
    </div>
  );
};

export default FuturisticNotificationBubble;
