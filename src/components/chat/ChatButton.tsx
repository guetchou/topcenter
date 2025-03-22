
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ChatButtonProps {
  onClick: () => void;
  hasMessages: boolean;
}

export const ChatButton = ({ onClick, hasMessages }: ChatButtonProps) => {
  const [animate, setAnimate] = useState(false);
  
  // Add attention animation when new messages arrive
  useEffect(() => {
    if (hasMessages) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasMessages]);
  
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "rounded-full w-12 h-12 shadow-lg",
        "transition-all duration-300",
        "hover:shadow-xl hover:scale-105",
        "bg-primary text-primary-foreground",
        animate ? "animate-pulse" : "animate-bounce-subtle",
        hasMessages && "ring-2 ring-primary/20 ring-offset-2"
      )}
      aria-label="Ouvrir le chat"
    >
      <MessageSquareText className={cn(
        "w-6 h-6", 
        animate && "animate-wiggle"
      )} />
    </Button>
  );
};
