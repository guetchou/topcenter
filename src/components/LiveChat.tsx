
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, X, Download, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ChatMessage } from "./ChatMessage";
import { ChatToolbar } from "./ChatToolbar";

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
  const [useChatterPal, setUseChatterPal] = useState(false);
  const [chatterpalLoaded, setChatterpalLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatterpalContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Simulate queue position updates
  useEffect(() => {
    if (isOpen && queuePosition > 0 && !useChatterPal) {
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
  }, [isOpen, queuePosition, useChatterPal]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current && !useChatterPal) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, useChatterPal]);

  // Initialize ChatterPal when switched to that mode
  useEffect(() => {
    if (isOpen && useChatterPal && !chatterpalLoaded) {
      initializeChatterPal();
    }
    
    return () => {
      // Cleanup ChatterPal when component unmounts
      if (window.chatPal) {
        try {
          window.chatPal.destroy();
        } catch (error) {
          console.error("Error destroying ChatterPal:", error);
        }
      }
    };
  }, [isOpen, useChatterPal]);

  const initializeChatterPal = () => {
    try {
      // Réinitialiser l'instance si elle existe
      if (window.chatPal) {
        try {
          window.chatPal.destroy();
        } catch (e) {
          console.log("Pas d'instance précédente à détruire");
        }
      }
      
      // Configurer la nouvelle instance
      window.chatPal = new window.ChatPal({
        embedId: 'v8HfNRZjDyZ3',
        remoteBaseUrl: 'https://chatappdemo.com/',
        version: '8.3',
        containerSelector: '#chatterpal-container',
        position: 'internal',
        width: '100%',
        height: '100%'
      });
      
      setChatterpalLoaded(true);
    } catch (error) {
      console.error("Erreur lors de l'initialisation de ChatterPal:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le chat avec un agent humain. Veuillez réessayer."
      });
    }
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

  const handleAttachFile = () => {
    toast({
      title: "Pièce jointe",
      description: "La fonctionnalité d'attachement de fichiers sera bientôt disponible.",
    });
  };

  const handleVoiceMessage = () => {
    toast({
      title: "Message vocal",
      description: "La fonctionnalité de messages vocaux sera bientôt disponible.",
    });
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

  const switchToChatBot = () => {
    setUseChatterPal(false);
  };

  const switchToChatterPal = () => {
    setUseChatterPal(true);
    initializeChatterPal();
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
          <div className="p-4 border-b flex justify-between items-center bg-primary text-primary-foreground rounded-t-lg">
            <div>
              <h3 className="font-semibold">Chat en direct</h3>
              {!isConnectedToAgent && queuePosition > 0 && !useChatterPal && (
                <p className="text-sm opacity-90">
                  Position dans la file : {queuePosition}
                </p>
              )}
              {isConnectedToAgent && !useChatterPal && (
                <p className="text-sm opacity-90">
                  Agent connecté
                </p>
              )}
              {useChatterPal && (
                <p className="text-sm opacity-90">
                  Agent ChatterPal
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

          <div className="flex border-b">
            <Button
              variant={!useChatterPal ? "default" : "ghost"}
              size="sm"
              className="flex-1 rounded-none"
              onClick={switchToChatBot}
            >
              Chat Standard
            </Button>
            <Button
              variant={useChatterPal ? "default" : "ghost"}
              size="sm"
              className="flex-1 rounded-none"
              onClick={switchToChatterPal}
            >
              Agent ChatterPal
            </Button>
          </div>

          {!useChatterPal ? (
            <>
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      content={message.content}
                      sender={message.sender}
                      timestamp={message.timestamp}
                    />
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Agent est en train d'écrire...
                    </div>
                  )}
                </div>
              </ScrollArea>

              <ChatToolbar
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
                handleAttachFile={handleAttachFile}
                handleVoiceMessage={handleVoiceMessage}
              />

              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadHistory}
                  className="mx-4 mb-2 text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Télécharger l'historique
                </Button>
              )}
            </>
          ) : (
            <div id="chatterpal-container" ref={chatterpalContainerRef} className="flex-1 relative">
              {!chatterpalLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="ml-2">Chargement de l'agent ChatterPal...</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
