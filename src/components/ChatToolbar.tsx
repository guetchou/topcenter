import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatToolbarProps {
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: () => void;
  handleAttachFile: () => void;
  handleVoiceMessage: () => void;
}

export const ChatToolbar = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleAttachFile,
  handleVoiceMessage
}: ChatToolbarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tapez votre message..."
        />
        <Button type="submit" size="icon" disabled={newMessage.trim() === ""}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
