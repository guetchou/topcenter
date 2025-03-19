
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Send, Mic } from "lucide-react";
import { VoiceInput } from './chat/VoiceInput';

interface ChatToolbarProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
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
  
  // Fonction pour traiter l'entrée vocale
  const handleVoiceInput = (text: string) => {
    setNewMessage(text);
  };

  return (
    <div className="p-3 border-t flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button 
          type="button" 
          size="icon" 
          variant="ghost" 
          onClick={handleAttachFile}
        >
          <Paperclip className="w-4 h-4" />
        </Button>
        
        <VoiceInput onVoiceInput={handleVoiceInput} />
        
        <Button 
          type="button" 
          size="icon" 
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
