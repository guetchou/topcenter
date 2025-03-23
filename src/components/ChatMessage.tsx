
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  sender: "user" | "agent" | "assistant" | "system";
  timestamp: Date;
}

export const ChatMessage = ({ content, sender, timestamp }: ChatMessageProps) => {
  const isUser = sender === "user";
  
  return (
    <div
      className={cn(
        "flex w-full max-w-md",
        isUser ? "ml-auto justify-end" : "mr-auto justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground"
        )}
      >
        <p className="text-sm">{content}</p>
        <time className="text-xs opacity-70">
          {timestamp.toLocaleTimeString()}
        </time>
      </div>
    </div>
  );
};
