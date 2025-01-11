import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, X, Send, Download, Smile, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [queuePosition, setQueuePosition] = useState(3);
  const [isConnectedToAgent, setIsConnectedToAgent] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Simulate queue position updates
  useEffect(() => {
    if (isOpen && queuePosition > 0) {
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
  }, [isOpen, queuePosition]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => {
      console.log("Audio playback failed");
    });
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    playNotificationSound();
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user message
    addMessage({
      id: Date.now().toString(),
      content: newMessage,
      sender: "user",
      timestamp: new Date(),
    });

    setNewMessage("");
    setIsTyping(true);

    // Simulate agent typing and response
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

  const getAutoResponse = (message: string): string => {
    const responses = [
      "Je comprends votre demande. Pouvez-vous me donner plus de détails ?",
      "Merci pour votre message. Je vais vous aider avec cela.",
      "Bien sûr, je peux vous aider avec ça.",
      "Laissez-moi vérifier cela pour vous.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const downloadHistory = () => {
    const history = messages
      .map((msg) => 
        `[${format(msg.timestamp, 'dd/MM/yyyy HH:mm', { locale: fr })}] ${msg.sender}: ${msg.content}`
      )
      .join('\n');
    
    const blob = new Blob([history], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${format(new Date(), 'dd-MM-yyyy')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-foreground rounded-t-lg">
            <div>
              <h3 className="font-semibold">Chat en direct</h3>
              {!isConnectedToAgent && queuePosition > 0 && (
                <p className="text-sm opacity-90">
                  Position dans la file : {queuePosition}
                </p>
              )}
              {isConnectedToAgent && (
                <p className="text-sm opacity-90">
                  Agent connecté
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {format(message.timestamp, 'HH:mm', { locale: fr })}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Agent est en train d'écrire...
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Écrivez votre message..."
                className="flex-1"
              />
              <Button size="icon" onClick={() => {}}>
                <Smile className="w-4 h-4" />
              </Button>
              <Button size="icon" onClick={handleSendMessage}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={downloadHistory}
                className="mt-2 w-full text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Télécharger l'historique
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};