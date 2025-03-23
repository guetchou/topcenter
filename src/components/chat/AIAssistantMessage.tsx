
import { ThumbsUp, ThumbsDown, RotateCcw, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIAssistantMessageProps {
  message: Message;
}

export const AIAssistantMessage = ({ message }: AIAssistantMessageProps) => {
  return (
    <div
      key={message.id}
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} gap-2`}
    >
      {!message.isUser && (
        <Avatar className="w-8 h-8">
          <AvatarImage src="/lovable-uploads/logo-topcenter.png" alt="TopCenter" />
          <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
        </Avatar>
      )}
      
      <div 
        className={`rounded-lg px-3 py-2 max-w-[75%] ${
          message.isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </p>
        {!message.isUser && (
          <div className="flex gap-1 mt-2">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ThumbsUp className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <ThumbsDown className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
      
      {message.isUser && (
        <Avatar className="w-8 h-8">
          <AvatarImage src="/lovable-uploads/avatar_homme.png" alt="You" />
          <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
