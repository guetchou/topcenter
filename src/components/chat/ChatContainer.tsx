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
      if (typeof window.ChatPal !== 'undefined') {
        try {
          if (!window.chatPal) {
            window.chatPal = new window.ChatPal({
              embedId: '2yyMeBsp8GxX',
              remoteBaseUrl: 'https://chatterpal.me/',
              version: '8.3',
              containerSelector: '#chatterpal-container'
            });
          }
          setChatterpalLoaded(true);
        } catch (error) {
          console.error("Erreur lors de l'initialisation de ChatterPal:", error);
          toast.error("Impossible de charger le chat humain. Veuillez réessayer.");
        }
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
        <div className="bg-background border rounded-lg shadow-lg w-[400px] max-h-[600px] flex flex-col animate-in slide-in-from-bottom-5">
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

              <div className="p-4 border-t flex flex-col gap-2">
                {activeTab === "ai" && messages.length > 1 && !transferring && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs flex items-center gap-1 mb-1 hover:bg-amber-50"
                    onClick={transferToHuman}
                  >
                    <User className="w-3 h-3" />
                    Parler à un agent humain pour des questions complexes
                  </Button>
                )}
                
                <ChatInputForm 
                  message={message} 
                  setMessage={setMessage} 
                  onSubmit={handleMessageSubmit} 
                  isLoading={isLoading} 
                  transferring={transferring} 
                />
              </div>
            </div>
          </ChatTabs>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full w-12 h-12 shadow-lg animate-bounce-subtle"
        >
          <MessageSquareText className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};
