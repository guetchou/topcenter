
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIAssistantMessage } from "./AIAssistantMessage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAssistantContentProps {
  messages: Message[];
  isTyping: boolean;
}

export const AIAssistantContent = ({ messages, isTyping }: AIAssistantContentProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Faire défiler vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="space-y-4">
        {messages.map((msg) => (
          <AIAssistantMessage key={msg.id} message={msg} />
        ))}

        {isTyping && (
          <div className="flex justify-start gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/lovable-uploads/logo-topcenter.png" alt="TopCenter" />
              <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
            </Avatar>
            <div className="bg-muted rounded-lg px-3 py-2">
              <div className="flex space-x-1 items-center">
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
