
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MessageType } from "@/types/chat";

interface ChatMessagesProps {
  messages: MessageType[];
  isLoading: boolean;
  transferring: boolean;
}

export const ChatMessages = ({ 
  messages, 
  isLoading, 
  transferring 
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Faire défiler automatiquement vers le dernier message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={cn(
            "flex",
            msg.isUser ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[80%] rounded-lg p-3",
              msg.isUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            {msg.text}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-muted rounded-lg p-3 animate-pulse">
            En train d'écrire...
          </div>
        </div>
      )}
      {transferring && (
        <div className="flex justify-start">
          <div className="bg-amber-100 rounded-lg p-3 animate-pulse flex items-center space-x-2">
            <span>Transfert vers un agent humain</span>
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
