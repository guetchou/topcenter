
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle2, Clock } from "lucide-react";

// Define the type we're actually using in this component
interface MessageType {
  text: string;
  isUser: boolean;
  timestamp?: Date;
  status?: 'sending' | 'sent' | 'error';
}

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={cn(
            "flex animate-in slide-in-from-bottom-2 duration-300",
            msg.isUser ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[80%] rounded-lg p-3 transition-all group relative",
              "shadow-sm hover:shadow",
              msg.isUser
                ? "bg-primary text-primary-foreground slide-in-from-right-2"
                : "bg-muted slide-in-from-left-2"
            )}
          >
            {msg.text}
            <div className={cn(
              "text-[10px] opacity-70 mt-1 flex items-center gap-1",
              msg.isUser ? "justify-end" : "justify-start"
            )}>
              {msg.timestamp && (
                <span>
                  {format(new Date(msg.timestamp), "HH:mm", { locale: fr })}
                </span>
              )}
              {msg.isUser && msg.status && (
                <span className="flex items-center gap-1">
                  {msg.status === 'sending' && <Clock className="w-3 h-3" />}
                  {msg.status === 'sent' && <CheckCircle2 className="w-3 h-3" />}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-start animate-in fade-in-0 duration-200">
          <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
            <span>En train d'écrire</span>
            <span className="flex gap-1">
              <span className="w-1 h-1 bg-foreground/70 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
              <span className="w-1 h-1 bg-foreground/70 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
              <span className="w-1 h-1 bg-foreground/70 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </span>
          </div>
        </div>
      )}
      
      {transferring && (
        <div className="flex justify-start animate-in slide-in-from-bottom-2">
          <div className="bg-amber-100 rounded-lg p-3 flex items-center gap-2">
            <span>Transfert vers un agent humain</span>
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
