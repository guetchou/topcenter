import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { UserRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatMessageProps {
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export const ChatMessage = ({ content, sender, timestamp }: ChatMessageProps) => {
  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"}`}>
      <div className="flex gap-2">
        {sender === "agent" && (
          <Avatar className="w-8 h-8">
            <AvatarImage src="/agent-avatar.png" alt="Agent" />
            <AvatarFallback>
              <UserRound className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )}
        <div
          className={`max-w-[80%] rounded-lg p-3 ${
            sender === "user"
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p>{content}</p>
          <span className="text-xs opacity-70 mt-1 block">
            {format(timestamp, 'HH:mm', { locale: fr })}
          </span>
        </div>
        {sender === "user" && (
          <Avatar className="w-8 h-8">
            <AvatarImage src="/user-avatar.png" alt="User" />
            <AvatarFallback>
              <UserRound className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};