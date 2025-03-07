
import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputFormProps {
  message: string;
  setMessage: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  transferring: boolean;
}

export const ChatInputForm = ({ 
  message, 
  setMessage, 
  onSubmit, 
  isLoading, 
  transferring 
}: ChatInputFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Écrivez votre message..."
        className="flex-1"
        disabled={transferring}
      />
      <Button type="submit" size="icon" disabled={isLoading || transferring}>
        <MessageSquareText className="w-4 h-4" />
      </Button>
    </form>
  );
};
