
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateContextualSuggestions } from "@/utils/intentAnalyzer";
import { MessageType } from "@/types/chat";

interface ContextualSuggestionsProps {
  currentMessage: string;
  messages: MessageType[];
  onSelect: (suggestion: string) => void;
  className?: string;
}

export const ContextualSuggestions = ({ 
  currentMessage, 
  messages, 
  onSelect, 
  className 
}: ContextualSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  // Générer des suggestions contextuelle lorsque le message change
  useEffect(() => {
    // Seulement générer des suggestions si le message actuel a une certaine longueur
    if (currentMessage && currentMessage.length > 3) {
      const contextualSuggestions = generateContextualSuggestions(
        currentMessage,
        messages
      );
      setSuggestions(contextualSuggestions);
      setIsVisible(contextualSuggestions.length > 0);
    } else {
      setIsVisible(false);
    }
  }, [currentMessage, messages]);

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div 
      className={cn(
        "p-2 bg-muted/50 rounded-lg mb-2 animate-in slide-in-from-bottom-5 fade-in-50 duration-300",
        "border border-dashed border-primary/20",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
        <Lightbulb className="w-3 h-3 text-amber-500" />
        <span>Suggestions basées sur votre message</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className={cn(
              "text-xs bg-background hover:bg-primary/5",
              "border-primary/20 text-primary-foreground/80",
              "transition-all duration-200 hover:scale-105"
            )}
            onClick={() => {
              onSelect(suggestion);
              setIsVisible(false);
            }}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};
