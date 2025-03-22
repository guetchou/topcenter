
import { useState, useEffect } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInputForm } from "./ChatInputForm";
import { ChatTabs } from "./ChatTabs";
import { useAIChat } from "@/hooks/useAIChat";
import { ChatActions } from "./ChatActions";
import { ChatButton } from "./ChatButton";
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
        <ChatPanel 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          messages={messages}
          isLoading={isLoading}
          transferring={transferring}
          message={message}
          setMessage={setMessage}
          handleMessageSubmit={handleMessageSubmit}
          onClose={() => setIsOpen(false)}
          chatterpalLoaded={chatterpalLoaded}
          transferToHuman={transferToHuman}
        />
      ) : (
        <ChatButton 
          onClick={() => setIsOpen(true)}
          hasMessages={messages.length > 0}
        />
      )}
    </div>
  );
};

interface ChatPanelProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  messages: any[];
  isLoading: boolean;
  transferring: boolean;
  message: string;
  setMessage: (message: string) => void;
  handleMessageSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  chatterpalLoaded: boolean;
  transferToHuman: () => void;
}

const ChatPanel = ({
  activeTab,
  setActiveTab,
  selectedModel,
  setSelectedModel,
  messages,
  isLoading,
  transferring,
  message,
  setMessage,
  handleMessageSubmit,
  onClose,
  chatterpalLoaded,
  transferToHuman
}: ChatPanelProps) => {
  return (
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
        onClose={onClose} 
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
            <ChatActions 
              activeTab={activeTab}
              messages={messages}
              transferring={transferring}
              transferToHuman={transferToHuman}
            />
            
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
  );
};
