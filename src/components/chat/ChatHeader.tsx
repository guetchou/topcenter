
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ChatHeaderProps {
  isConnectedToAgent: boolean;
  queuePosition: number;
  useChatterPal: boolean;
  onClose: () => void;
}

export const ChatHeader = ({ 
  isConnectedToAgent, 
  queuePosition, 
  useChatterPal, 
  onClose 
}: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-foreground rounded-t-lg">
      <div>
        <h3 className="font-semibold">Chat en direct</h3>
        {!isConnectedToAgent && queuePosition > 0 && !useChatterPal && (
          <p className="text-sm opacity-90">
            Position dans la file : {queuePosition}
          </p>
        )}
        {isConnectedToAgent && !useChatterPal && (
          <p className="text-sm opacity-90">
            Agent connecté
          </p>
        )}
        {useChatterPal && (
          <p className="text-sm opacity-90">
            Agent ChatterPal
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="hover:bg-primary/20"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
