
import { useState, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInputForm } from "./ChatInputForm";
import { ChatTabs } from "./ChatTabs";
import { useAIChat } from "@/hooks/useAIChat";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import { User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const ChatContainer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [chatterpalLoaded, setChatterpalLoaded] = useState(false);
  const {
    message,
    setMessage,
    messages,
    setMessages,
    isLoading,
    selectedModel,
    setSelectedModel,
    activeTab,
    setActiveTab,
    transferring,
    handleSendMessage,
    transferToHuman
  } = useAIChat();

  useEffect(() => {
    if (activeTab === "chatterpal" && isOpen && !chatterpalLoaded) {
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
          embedId: '2yyMeBsp8GxX',
          remoteBaseUrl: 'https://chatterpal.me/',
          version: '8.3',
          containerSelector: '#chatterpal-container',
          position: 'internal',
          width: '100%',
          height: '100%'
        });
        
        setChatterpalLoaded(true);
      } catch (error) {
        console.error("Erreur lors de l'initialisation de ChatterPal:", error);
        toast.error("Impossible de charger le chat humain. Veuillez réessayer.");
      }
    }
  }, [activeTab, isOpen]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        text: "Bonjour ! Je suis l'assistant virtuel de TopCenter. Comment puis-je vous aider aujourd'hui ? Je peux vous renseigner sur nos services de centre d'appels, notre support client 24/7 ou vous aider à obtenir un devis personnalisé.",
        isUser: false
      }]);
    }
  }, [isOpen, messages.length, setMessages]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className={cn(
          "bg-background border rounded-lg shadow-lg w-[400px] max-h-[600px] flex flex-col",
          "transition-all duration-300 ease-in-out",
          "transform animate-in slide-in-from-bottom-5 fade-in-0",
          "hover:shadow-xl",
          "border-primary/10"
        )}>
          <ChatHeader 
            activeTab={activeTab} 
            selectedModel={selectedModel} 
            setSelectedModel={setSelectedModel} 
            onClose={() => setIsOpen(false)} 
          />

          <ChatTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
            chatterpalLoaded={chatterpalLoaded}
          >
            <div className="flex-1 flex flex-col data-[state=active]:flex data-[state=inactive]:hidden">
              <ChatMessages 
                messages={messages} 
                isLoading={isLoading} 
                transferring={transferring} 
              />

              <div className={cn(
                "p-4 border-t flex flex-col gap-2",
                "bg-gradient-to-b from-background to-background/80",
                "backdrop-blur-sm"
              )}>
                {activeTab === "ai" && messages.length > 1 && !transferring && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "w-full text-xs flex items-center gap-1 mb-1",
                      "transition-colors duration-200",
                      "hover:bg-primary/5 hover:text-primary",
                      "group"
                    )}
                    onClick={transferToHuman}
                  >
                    <User className="w-3 h-3 transition-transform group-hover:scale-110" />
                    Parler à un agent humain pour des questions complexes
                  </Button>
                )}
                
                <ChatInputForm 
                  message={message} 
                  setMessage={setMessage} 
                  onSubmit={handleMessageSubmit} 
                  isLoading={isLoading} 
                  transferring={transferring}
                  messages={messages}
                />
              </div>
            </div>
          </ChatTabs>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className={cn(
            "rounded-full w-12 h-12 shadow-lg",
            "transition-all duration-300",
            "hover:shadow-xl hover:scale-105",
            "bg-primary text-primary-foreground",
            "animate-bounce-subtle",
            messages.length > 0 && "ring-2 ring-primary/20 ring-offset-2"
          )}
        >
          <MessageSquareText className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};
