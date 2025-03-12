
import { Button } from "@/components/ui/button";

interface QuickRepliesProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  className?: string;
}

export const QuickReplies = ({ suggestions, onSelect, className }: QuickRepliesProps) => {
  return (
    <div className={`flex flex-wrap gap-2 p-2 ${className}`}>
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-xs bg-background hover:bg-primary/5"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
};
