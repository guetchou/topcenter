
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ChatButtonProps {
  onClick: () => void;
  hasMessages: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'subtle' | 'fancy';
}

export const ChatButton = ({ 
  onClick, 
  hasMessages, 
  className,
  size = 'lg',
  variant = 'default'
}: ChatButtonProps) => {
  const [animate, setAnimate] = useState(false);
  const [pulseIntensity, setPulseIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  
  // Handle animations when new messages arrive
  useEffect(() => {
    if (hasMessages) {
      // Set different pulse intensities based on number of unread messages (simulation)
      const randomIntensity = Math.random();
      if (randomIntensity > 0.7) {
        setPulseIntensity('high');
      } else if (randomIntensity > 0.3) {
        setPulseIntensity('medium');
      } else {
        setPulseIntensity('low');
      }
      
      setAnimate(true);
      
      // Clear animation after timeout
      const timeout = setTimeout(() => setAnimate(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [hasMessages]);
  
  // Determine size classes
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-11 h-11",
    lg: "w-12 h-12"
  };
  
  // Determine variant classes
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    subtle: "bg-primary/90 text-primary-foreground",
    fancy: "bg-gradient-to-r from-primary to-secondary text-primary-foreground"
  };
  
  // Determine animation classes
  const getAnimationClasses = () => {
    if (!animate) return "animate-bounce-subtle";
    
    const pulseClasses = {
      low: "animate-pulse-slow",
      medium: "animate-pulse",
      high: "animate-pulse-fast"
    };
    
    return pulseClasses[pulseIntensity];
  };
  
  // Icon animation classes
  const getIconAnimationClass = () => {
    if (!animate) return "";
    return "animate-wiggle";
  };
  
  return (
    <Button
      onClick={onClick}
      size="icon"
      className={cn(
        "rounded-full shadow-lg",
        "transition-all duration-300",
        "hover:shadow-xl hover:scale-105",
        sizeClasses[size],
        variantClasses[variant],
        getAnimationClasses(),
        hasMessages && "ring-2 ring-primary/20 ring-offset-2",
        className
      )}
      aria-label="Ouvrir le chat"
    >
      <MessageSquareText className={cn(
        "w-6 h-6", 
        getIconAnimationClass()
      )} />
    </Button>
  );
};
