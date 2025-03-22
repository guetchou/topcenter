
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface ChatActionsProps {
  activeTab: string;
  messages: Message[];
  transferring: boolean;
  transferToHuman: () => void;
}

export const ChatActions = ({ 
  activeTab, 
  messages, 
  transferring, 
  transferToHuman 
}: ChatActionsProps) => {
  if (activeTab !== "ai" || messages.length <= 1 || transferring) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={cn(
        "w-full text-xs flex items-center gap-1 mb-1",
        "transition-colors duration-200",
        "hover:bg-primary/5 hover:text-primary",
        "group"
      )}
      onClick={transferToHuman}
    >
      <User className="w-3 h-3 transition-transform group-hover:scale-110" />
      Parler à un agent humain pour des questions complexes
    </Button>
  );
};
