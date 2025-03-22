
import { Button } from "@/components/ui/button";

interface ChatToggleProps {
  useChatterPal: boolean;
  onToggleStandard: () => void;
  onToggleChatterPal: () => void;
}

export const ChatToggle = ({ 
  useChatterPal, 
  onToggleStandard, 
  onToggleChatterPal 
}: ChatToggleProps) => {
  return (
    <div className="flex border-b">
      <Button
        variant={!useChatterPal ? "default" : "ghost"}
        size="sm"
        className="flex-1 rounded-none"
        onClick={onToggleStandard}
      >
        Chat Standard
      </Button>
      <Button
        variant={useChatterPal ? "default" : "ghost"}
        size="sm"
        className="flex-1 rounded-none"
        onClick={onToggleChatterPal}
      >
        Agent ChatterPal
      </Button>
    </div>
  );
};
