
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export const ChatMessage = ({ content, sender, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full max-w-md",
        sender === "user" ? "ml-auto justify-end" : "mr-auto justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2",
          sender === "user"
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
