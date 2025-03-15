
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIChatBubbleProps {
  initialMessage?: string;
}

export const AIChatBubble = ({ initialMessage = "Bonjour, comment puis-je vous aider aujourd'hui ?" }: AIChatBubbleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const chatterpalContainerRef = useRef<HTMLDivElement>(null);

  // Initialiser ChatterPal quand le composant est monté et visible
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);

      // Vérifier si ChatterPal est chargé
      const initChatterPal = () => {
        if (window.ChatPal) {
          try {
            // Nettoyer l'instance précédente si elle existe
            if (window.chatPal) {
              window.chatPal.destroy();
            }

            // Initialiser une nouvelle instance
            window.chatPal = new window.ChatPal({
              embedId: '2yyMeBsp8GxX', // Remplacer par votre ID ChatterPal
              remoteBaseUrl: 'https://chatterpal.me/',
              version: '8.3',
              containerSelector: '#chatterpal-container',
              position: 'internal',
              width: '100%',
              height: '100%'
            });

            setIsLoading(false);
          } catch (error) {
            console.error("Erreur lors de l'initialisation de ChatterPal:", error);
            setIsLoading(false);
          }
        } else {
          // Si ChatterPal n'est pas encore chargé, attendre et réessayer
          setTimeout(initChatterPal, 500);
        }
      };

      initChatterPal();

      return () => {
        // Nettoyer à la fermeture
        if (window.chatPal) {
          try {
            window.chatPal.destroy();
          } catch (error) {
            console.error("Erreur lors de la destruction de ChatterPal:", error);
          }
        }
      };
    }
  }, [isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className={cn(
          "bg-background border rounded-lg shadow-lg w-[350px] h-[500px] flex flex-col",
          "transition-all duration-300 ease-in-out",
          "transform animate-in slide-in-from-bottom-5 fade-in-0",
          "hover:shadow-xl",
          "border-orange-300"
        )}>
          <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-400 p-3 text-white rounded-t-lg">
            <h3 className="font-semibold">TopCenter Assistant</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-orange-600/20 h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </div>
          
          <div className="flex-1 overflow-hidden relative">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-2" />
                <p className="text-muted-foreground text-sm">Chargement de l'assistant...</p>
              </div>
            )}
            <div id="chatterpal-container" ref={chatterpalContainerRef} className="w-full h-full"></div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className={cn(
            "rounded-full w-14 h-14 shadow-lg",
            "transition-all duration-300",
            "hover:shadow-xl hover:scale-105",
            "bg-gradient-to-r from-orange-500 to-orange-400 text-white",
            "animate-bounce-subtle"
          )}
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};

export default AIChatBubble;
