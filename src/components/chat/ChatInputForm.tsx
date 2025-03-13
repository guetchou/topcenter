
import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QuickReplies } from "./QuickReplies";
import { ContextualSuggestions } from "./ContextualSuggestions";
import { MessageType } from "@/types/chat";

interface ChatInputFormProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  transferring: boolean;
  messages: MessageType[];
}

const commonQuestions = [
  "Quels sont vos services ?",
  "Comment obtenir un devis ?",
  "Horaires d'ouverture",
  "Tarifs centre d'appels"
];

export const ChatInputForm = ({ 
  message, 
  setMessage, 
  onSubmit, 
  isLoading, 
  transferring,
  messages
}: ChatInputFormProps) => {
  const handleSuggestionSelect = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <div className="flex flex-col gap-2">
      <QuickReplies 
        suggestions={commonQuestions}
        onSelect={handleSuggestionSelect}
        className="mb-2"
      />
      
      <ContextualSuggestions
        currentMessage={message}
        messages={messages}
        onSelect={handleSuggestionSelect}
        className="mb-2"
      />
      
      <form onSubmit={onSubmit} className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1"
          disabled={transferring}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || transferring || !message.trim()}
        >
          <MessageSquareText className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};
