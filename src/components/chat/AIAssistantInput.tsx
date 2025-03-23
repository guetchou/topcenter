
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface AIAssistantInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  isTyping: boolean;
}

export const AIAssistantInput = ({ 
  message, 
  setMessage, 
  handleSendMessage, 
  isTyping 
}: AIAssistantInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-3 border-t bg-background">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Posez votre question..."
          className="flex-1"
          onKeyDown={handleKeyPress}
        />
        <Button 
          size="icon" 
          onClick={handleSendMessage} 
          disabled={!message.trim() || isTyping}
          className={`${!message.trim() || isTyping ? 'opacity-70' : 'animate-pulse-subtle'}`}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
      <div className="text-xs text-muted-foreground text-center mt-2">
        TopCenter - Support client 24/7
      </div>
    </div>
  );
};
