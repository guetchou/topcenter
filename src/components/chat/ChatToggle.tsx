
import { Bot, Radio, UserRound, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatToggleProps {
  useChatterPal: boolean;
  useWebSocket?: boolean;
  onToggleStandard: () => void;
  onToggleChatterPal: () => void;
  onToggleWebSocket?: () => void;
}

export const ChatToggle = ({ 
  useChatterPal, 
  useWebSocket = false,
  onToggleStandard, 
  onToggleChatterPal,
  onToggleWebSocket
}: ChatToggleProps) => {
  const isStandard = !useChatterPal && !useWebSocket;
  
  return (
    <div className="flex border-b">
      <button
        onClick={onToggleStandard}
        className={cn(
          "flex-1 flex flex-col items-center justify-center py-2 px-4 transition-colors",
          isStandard 
            ? "bg-primary/10 border-b-2 border-primary text-primary" 
            : "hover:bg-muted/60"
        )}
      >
        <UserRound size={16} className="mb-1" />
        <span className="text-xs">Standard</span>
      </button>
      
      <button
        onClick={onToggleChatterPal}
        className={cn(
          "flex-1 flex flex-col items-center justify-center py-2 px-4 transition-colors",
          useChatterPal 
            ? "bg-primary/10 border-b-2 border-primary text-primary" 
            : "hover:bg-muted/60"
        )}
      >
        <Bot size={16} className="mb-1" />
        <span className="text-xs">ChatterPal</span>
      </button>
      
      {onToggleWebSocket && (
        <button
          onClick={onToggleWebSocket}
          className={cn(
            "flex-1 flex flex-col items-center justify-center py-2 px-4 transition-colors",
            useWebSocket 
              ? "bg-primary/10 border-b-2 border-primary text-primary" 
              : "hover:bg-muted/60"
          )}
        >
          <Wifi size={16} className="mb-1" />
          <span className="text-xs">Live Chat</span>
        </button>
      )}
    </div>
  );
};
