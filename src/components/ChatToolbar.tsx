import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Smile, PaperclipIcon, Mic } from "lucide-react";

interface ChatToolbarProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleAttachFile?: () => void;
  handleVoiceMessage?: () => void;
}

export const ChatToolbar = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleAttachFile,
  handleVoiceMessage,
}: ChatToolbarProps) => {
  return (
    <div className="p-4 border-t">
      <div className="flex gap-2">
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={handleAttachFile}
          className="hover:bg-muted"
        >
          <PaperclipIcon className="w-4 h-4" />
        </Button>
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Écrivez votre message..."
          className="flex-1"
        />
        <Button 
          size="icon" 
          variant="ghost"
          className="hover:bg-muted"
        >
          <Smile className="w-4 h-4" />
        </Button>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={handleVoiceMessage}
          className="hover:bg-muted"
        >
          <Mic className="w-4 h-4" />
        </Button>
        <Button size="icon" onClick={handleSendMessage}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};