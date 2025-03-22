
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [queuePosition, setQueuePosition] = useState(3);
  const [isConnectedToAgent, setIsConnectedToAgent] = useState(false);
  const { toast } = useToast();

  // Simulate queue position updates
  useEffect(() => {
    if (queuePosition > 0 && !isConnectedToAgent) {
      const timer = setInterval(() => {
        setQueuePosition((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            connectToAgent();
            return 0;
          }
          return prev - 1;
        });
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [queuePosition, isConnectedToAgent]);

  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {
      console.log("Audio playback failed");
    });
  };

  const connectToAgent = () => {
    setIsConnectedToAgent(true);
    playNotificationSound();
    toast({
      title: "Agent connecté",
      description: "Un agent est maintenant disponible pour vous aider.",
    });
    
    // Simulate agent first message
    setTimeout(() => {
      addMessage({
        id: Date.now().toString(),
        content: "Bonjour, je suis Sarah. Comment puis-je vous aider aujourd'hui ?",
        sender: "agent",
        timestamp: new Date(),
      });
    }, 1000);
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    playNotificationSound();
  };

  const getAutoResponse = (message: string): string => {
    const responses = [
      "Je comprends votre demande. Pouvez-vous me donner plus de détails ?",
      "Merci pour votre message. Je vais vous aider avec cela.",
      "Bien sûr, je peux vous aider avec ça.",
      "Laissez-moi vérifier cela pour vous.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    addMessage({
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    });

    setNewMessage("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      addMessage({
        id: (Date.now() + 1).toString(),
        content: getAutoResponse(newMessage),
        sender: "agent",
        timestamp: new Date(),
      });
    }, 2000);
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    isTyping,
    queuePosition,
    isConnectedToAgent,
    handleSendMessage,
    setQueuePosition,
    setIsConnectedToAgent
  };
};
