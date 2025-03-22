
import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChatMessage } from "../ChatMessage";
import { ChatToolbar } from "../ChatToolbar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: Message[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isTyping: boolean;
  queuePosition: number;
  isConnectedToAgent: boolean;
}

export const ChatInterface = ({
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isTyping,
  queuePosition,
  isConnectedToAgent
}: ChatInterfaceProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleAttachFile = () => {
    toast({
      title: "Pièce jointe",
      description: "La fonctionnalité d'attachement de fichiers sera bientôt disponible.",
    });
  };

  const handleVoiceMessage = () => {
    toast({
      title: "Message vocal",
      description: "La fonctionnalité de messages vocaux sera bientôt disponible.",
    });
  };

  const downloadHistory = () => {
    const history = messages
      .map((msg) => 
        `[${format(msg.timestamp, 'dd/MM/yyyy HH:mm', { locale: fr })}] ${msg.sender}: ${msg.content}`
      )
      .join('\n');
    
    const blob = new Blob([history], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${format(new Date(), 'dd-MM-yyyy')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
            />
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              Agent est en train d'écrire...
            </div>
          )}
        </div>
      </ScrollArea>

      <ChatToolbar
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        handleAttachFile={handleAttachFile}
        handleVoiceMessage={handleVoiceMessage}
      />

      {messages.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={downloadHistory}
          className="mx-4 mb-2 text-xs"
        >
          <Download className="w-3 h-3 mr-1" />
          Télécharger l'historique
        </Button>
      )}
    </>
  );
};
