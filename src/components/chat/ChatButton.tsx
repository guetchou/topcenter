
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatButtonProps {
  onClick: () => void;
  hasMessages: boolean;
}

export const ChatButton = ({ onClick, hasMessages }: ChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "rounded-full w-12 h-12 shadow-lg",
        "transition-all duration-300",
        "hover:shadow-xl hover:scale-105",
        "bg-primary text-primary-foreground",
        "animate-bounce-subtle",
        hasMessages && "ring-2 ring-primary/20 ring-offset-2"
      )}
    >
      <MessageSquareText className="w-6 h-6" />
    </Button>
  );
};
