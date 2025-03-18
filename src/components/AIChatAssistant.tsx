import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Bot, X, RotateCcw, ThumbsUp, ThumbsDown, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/components/notifications/NotificationsProvider";

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addNotification } = useNotifications();

  // Faire défiler vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isTyping]);

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

  // Focus sur l'input lorsque le chatbot est ouvert
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newUserMessage = {
      id: Date.now().toString(),
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
        id: (Date.now() + 1).toString(),
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
            <div className="p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                <h3 className="font-semibold">Assistant TopCenter</h3>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground hover:bg-primary/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'} gap-2`}
                  >
                    {!msg.isUser && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/lovable-uploads/logo-topcenter.png" alt="TopCenter" />
                        <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                    )}
                    <div 
                      className={`rounded-lg px-3 py-2 max-w-[75%] ${
                        msg.isUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                      {!msg.isUser && (
                        <div className="flex gap-1 mt-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    {msg.isUser && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="/lovable-uploads/avatar_homme.png" alt="You" />
                        <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/lovable-uploads/logo-topcenter.png" alt="TopCenter" />
                      <AvatarFallback><Bot className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="flex space-x-1 items-center">
                        <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Posez votre question..."
                  className="flex-1"
                  onKeyDown={handleKeyPress}
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage} 
                  disabled={!message.trim() || isTyping}
                  className={`${!message.trim() || isTyping ? 'opacity-70' : 'animate-pulse-subtle'}`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground text-center mt-2">
                TopCenter - Support client 24/7
              </div>
            </div>
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
