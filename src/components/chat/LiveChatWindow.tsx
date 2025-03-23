
import { useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatToggle } from "./ChatToggle";
import { ChatInterface } from "./ChatInterface";
import { ChatterPalInterface } from "./ChatterPalInterface";
import { MessageType } from "@/types/chat";

interface LiveChatWindowProps {
  useChatterPal: boolean;
  useWebSocket?: boolean;
  messages: MessageType[];
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isTyping: boolean;
  queuePosition: number;
  isConnectedToAgent: boolean;
  onToggleStandard: () => void;
  onToggleChatterPal: () => void;
  onToggleWebSocket?: () => void;
  onClose: () => void;
}

export const LiveChatWindow = ({
  useChatterPal,
  useWebSocket = false,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isTyping,
  queuePosition,
  isConnectedToAgent,
  onToggleStandard,
  onToggleChatterPal,
  onToggleWebSocket,
  onClose
}: LiveChatWindowProps) => {
  const [selectedModel, setSelectedModel] = useState("perplexity");
  const [chatterpalLoaded, setChatterpalLoaded] = useState(false);

  const handleChatterPalLoaded = () => {
    setChatterpalLoaded(true);
  };

  return (
    <div className="w-96 h-[32rem] bg-white rounded-lg shadow-xl border animate-fade-in flex flex-col">
      <ChatHeader 
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        isConnectedToAgent={isConnectedToAgent}
        queuePosition={queuePosition}
        useChatterPal={useChatterPal}
        useWebSocket={useWebSocket}
        onClose={onClose}
      />

      <ChatToggle 
        useChatterPal={useChatterPal}
        useWebSocket={useWebSocket}
        onToggleStandard={onToggleStandard}
        onToggleChatterPal={onToggleChatterPal}
        onToggleWebSocket={onToggleWebSocket}
      />

      {!useChatterPal ? (
        <ChatInterface 
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          isTyping={isTyping}
          queuePosition={queuePosition}
          isConnectedToAgent={isConnectedToAgent}
          isWebSocket={useWebSocket}
        />
      ) : (
        <ChatterPalInterface onLoad={handleChatterPalLoaded} />
      )}
    </div>
  );
};
