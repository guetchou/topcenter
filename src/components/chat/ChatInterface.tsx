
import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal, Wifi } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { cn } from "@/lib/utils";
import { MessageType } from "@/types/chat";

interface ChatInterfaceProps {
  messages: MessageType[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isTyping: boolean;
  queuePosition: number;
  isConnectedToAgent: boolean;
  isWebSocket?: boolean;
}

export const ChatInterface = ({
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isTyping,
  queuePosition,
  isConnectedToAgent,
  isWebSocket = false
}: ChatInterfaceProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isConnectedToAgent) {
      inputRef.current?.focus();
    }
  }, [isConnectedToAgent]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.text}
              sender={message.sender}
              timestamp={message.timestamp}
            />
          ))}

          {isTyping && (
            <div className="flex w-full max-w-md">
              <div className="bg-secondary text-secondary-foreground rounded-lg px-4 py-2">
                <div className="flex space-x-1 items-center h-6">
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {queuePosition > 0 && !isConnectedToAgent && !isWebSocket ? (
        <div className="p-4 bg-amber-50 border-t text-center">
          <p className="text-sm text-amber-800">
            Vous êtes en file d'attente ({queuePosition} {queuePosition === 1 ? "personne" : "personnes"} avant vous)
          </p>
        </div>
      ) : isWebSocket && !isConnectedToAgent ? (
        <div className="p-4 bg-blue-50 border-t text-center flex items-center justify-center gap-2">
          <Wifi className="w-4 h-4 text-blue-600 animate-pulse" />
          <p className="text-sm text-blue-800">
            Connexion au chat en temps réel en cours...
          </p>
        </div>
      ) : null}

      <div className="p-3 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1"
            disabled={!isConnectedToAgent && !isWebSocket}
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || (!isConnectedToAgent && !isWebSocket)}
            className={cn(
              "transition-all",
              newMessage.trim() && (isConnectedToAgent || isWebSocket) ? "opacity-100" : "opacity-50"
            )}
          >
            <SendHorizonal className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
