
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useChatMessages } from "../hooks/useChatMessages";
import { LiveChatWindow } from "./chat/LiveChatWindow";
import { MessageType } from "@/types/chat";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { useNotifications } from "@/components/notifications/NotificationsProvider";
import { v4 as uuidv4 } from 'uuid';

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [useChatterPal, setUseChatterPal] = useState(false);
  const [useWebSocket, setUseWebSocket] = useState(false);
  const { addNotification } = useNotifications();
  
  // Standard chat hook
  const {
    messages: standardMessages,
    newMessage,
    setNewMessage,
    isTyping,
    queuePosition,
    isConnectedToAgent,
    handleSendMessage: handleSendStandardMessage,
    setQueuePosition,
    setIsConnectedToAgent
  } = useChatMessages();
  
  // WebSocket chat hook
  const {
    isConnected: isWsConnected,
    messages: wsMessages,
    sendMessage: sendWsMessage
  } = useChatWebSocket('wss://echo.websocket.org'); // Replace with your WebSocket server URL
  
  // Combined messages for UI display
  const [messages, setMessages] = useState<MessageType[]>(standardMessages);
  
  // Update messages based on active chat mode
  useEffect(() => {
    if (useWebSocket) {
      // Convert from WebSocket messages to MessageType
      const convertedMessages = wsMessages.map(msg => ({
        id: msg.id,
        text: msg.content,
        isUser: msg.sender === 'user',
        timestamp: new Date(msg.timestamp),
        sender: msg.sender === 'user' ? 'user' : 'agent'
      }));
      setMessages(convertedMessages);
    } else {
      setMessages(standardMessages);
    }
  }, [useWebSocket, standardMessages, wsMessages]);
  
  // Handle sending message based on active mode
  const handleSendMessage = () => {
    if (useWebSocket) {
      if (newMessage.trim()) {
        const success = sendWsMessage(newMessage);
        if (success) {
          setNewMessage('');
        }
      }
    } else {
      handleSendStandardMessage();
    }
  };
  
  // Switch to standard chat
  const switchToStandardChat = () => {
    setUseChatterPal(false);
    setUseWebSocket(false);
    setIsConnectedToAgent(false);
    setQueuePosition(3);
    
    addNotification(
      "Chat standard activé", 
      "Vous utilisez maintenant le chat standard", 
      "info"
    );
  };
  
  // Switch to ChatterPal
  const switchToChatterPal = () => {
    setUseChatterPal(true);
    setUseWebSocket(false);
    
    addNotification(
      "ChatterPal activé", 
      "Vous utilisez maintenant l'assistant intelligent ChatterPal", 
      "info"
    );
  };
  
  // Switch to WebSocket
  const switchToWebSocket = () => {
    setUseChatterPal(false);
    setUseWebSocket(true);
    
    if (isWsConnected) {
      addNotification(
        "Chat en temps réel activé", 
        "Vous êtes connecté au service de chat en temps réel", 
        "success"
      );
    } else {
      addNotification(
        "Connexion en cours", 
        "Tentative de connexion au service de chat en temps réel...", 
        "info"
      );
    }
    
    // Add welcome message if there are no messages
    if (wsMessages.length === 0) {
      setTimeout(() => {
        sendWsMessage("Bienvenue dans le chat en temps réel!");
      }, 1000);
    }
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
          isConnectedToAgent={isConnectedToAgent || (useWebSocket && isWsConnected)}
          onToggleStandard={switchToStandardChat}
          onToggleChatterPal={switchToChatterPal}
          onToggleWebSocket={switchToWebSocket}
          useWebSocket={useWebSocket}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
