
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ChatInterface } from "./chat/ChatInterface";
import { ChatterPalInterface } from "./chat/ChatterPalInterface";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatToggle } from "./chat/ChatToggle";
import { useChatMessages } from "../hooks/useChatMessages";
import { MessageType } from "@/types/chat";

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [useChatterPal, setUseChatterPal] = useState(false);
  const [chatterpalLoaded, setChatterpalLoaded] = useState(false);
  const [selectedModel, setSelectedModel] = useState("perplexity");
  const { toast } = useToast();
  const {
    messages,
    newMessage,
    setNewMessage,
    isTyping,
    queuePosition,
    isConnectedToAgent,
    handleSendMessage,
    setQueuePosition,
    setIsConnectedToAgent
  } = useChatMessages();

  const switchToChatBot = () => {
    setUseChatterPal(false);
    setIsConnectedToAgent(false);
    setQueuePosition(3);
  };

  const switchToChatterPal = () => {
    setUseChatterPal(true);
  };

  const handleChatterPalLoaded = () => {
    setChatterpalLoaded(true);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="shadow-lg hover:shadow-xl transition-shadow"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Chat en direct
        </Button>
      ) : (
        <div className="w-96 h-[32rem] bg-white rounded-lg shadow-xl border animate-fade-in flex flex-col">
          <ChatHeader 
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isConnectedToAgent={isConnectedToAgent}
            queuePosition={queuePosition}
            useChatterPal={useChatterPal}
            onClose={() => setIsOpen(false)}
          />

          <ChatToggle 
            useChatterPal={useChatterPal}
            onToggleStandard={switchToChatBot}
            onToggleChatterPal={switchToChatterPal}
          />

          {!useChatterPal ? (
            <ChatInterface 
              messages={messages as MessageType[]}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              isTyping={isTyping}
              queuePosition={queuePosition}
              isConnectedToAgent={isConnectedToAgent}
            />
          ) : (
            <ChatterPalInterface onLoad={handleChatterPalLoaded} />
          )}
        </div>
      )}
    </div>
  );
};
