
import { Bot } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatToolbar } from "@/components/ChatToolbar";

interface AIChannelProps {
  conversation: Array<{role: string, content: string}>;
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  isLoading: boolean;
}

export const AIChannel = ({
  conversation,
  message,
  setMessage,
  handleSendMessage,
  isLoading
}: AIChannelProps) => {
  const handleAttachFile = () => {
    console.log("Attach file functionality not implemented");
  };

  const handleVoiceMessage = () => {
    console.log("Voice message functionality not implemented");
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.map((msg, index) => (
          <ChatMessage
            key={index}
            content={msg.content}
            sender={msg.role === "user" ? "user" : "agent"}
            timestamp={new Date()}
          />
        ))}
      </div>
      <ChatToolbar
        newMessage={message}
        setNewMessage={setMessage}
        handleSendMessage={handleSendMessage}
        handleAttachFile={handleAttachFile}
        handleVoiceMessage={handleVoiceMessage}
      />
    </div>
  );
};
