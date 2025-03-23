
import { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "@/components/notifications/NotificationsProvider";
import { AIAssistantHeader } from "@/components/chat/AIAssistantHeader";
import { AIAssistantContent } from "@/components/chat/AIAssistantContent";
import { AIAssistantInput } from "@/components/chat/AIAssistantInput";
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const AIChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { addNotification } = useNotifications();

  // Ajouter un message de bienvenue lorsque le chatbot est ouvert
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: "welcome",
        content: "Bonjour ! Je suis l'assistant virtuel de TopCenter. Comment puis-je vous aider aujourd'hui ?",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage = {
      id: uuidv4(),
      content: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setMessage("");
    setIsTyping(true);

    // Simuler une réponse de l'IA après un court délai
    setTimeout(() => {
      const botResponses = [
        "Je comprends votre demande. Comment puis-je vous aider davantage ?",
        "Merci pour votre message. Chez TopCenter, nous offrons une gamme complète de services de centre d'appels.",
        "Excellente question ! TopCenter est spécialisé dans la gestion de relation client pour les entreprises congolaises.",
        "Je peux vous aider avec ça. Souhaitez-vous obtenir un devis personnalisé ?",
        "Nos experts sont disponibles 24/7 pour répondre à vos besoins spécifiques."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const newBotMessage = {
        id: uuidv4(),
        content: randomResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
      
      addNotification(
        "Nouveau message",
        "L'assistant a répondu à votre demande",
        "info"
      );
    }, 1500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-80 bg-card rounded-lg shadow-xl border overflow-hidden flex flex-col"
            style={{ height: "500px" }}
          >
            {/* Header */}
            <AIAssistantHeader onClose={() => setIsOpen(false)} />

            {/* Messages */}
            <AIAssistantContent 
              messages={messages} 
              isTyping={isTyping} 
            />

            {/* Input */}
            <AIAssistantInput 
              message={message}
              setMessage={setMessage}
              handleSendMessage={handleSendMessage}
              isTyping={isTyping}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-r from-primary to-primary/80"
            >
              <MessageSquare className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
