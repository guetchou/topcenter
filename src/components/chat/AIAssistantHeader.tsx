
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AIAssistantHeaderProps {
  onClose: () => void;
}

export const AIAssistantHeader = ({ onClose }: AIAssistantHeaderProps) => {
  return (
    <div className="p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Bot className="w-5 h-5" />
        <h3 className="font-semibold">Assistant TopCenter</h3>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClose}
        className="text-primary-foreground hover:bg-primary/20"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
