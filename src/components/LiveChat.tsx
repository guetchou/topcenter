
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useChatMessages } from "../hooks/useChatMessages";
import { LiveChatWindow } from "./chat/LiveChatWindow";
import { MessageType } from "@/types/chat";

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [useChatterPal, setUseChatterPal] = useState(false);
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
        <LiveChatWindow
          useChatterPal={useChatterPal}
          messages={messages}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          isTyping={isTyping}
          queuePosition={queuePosition}
          isConnectedToAgent={isConnectedToAgent}
          onToggleStandard={switchToChatBot}
          onToggleChatterPal={switchToChatterPal}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
