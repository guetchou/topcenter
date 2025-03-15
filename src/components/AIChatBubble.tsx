
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2, X, Sparkles, CircuitBoard } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AIChatBubbleProps {
  initialMessage?: string;
}

export const AIChatBubble = ({ initialMessage = "Bonjour, comment puis-je vous aider aujourd'hui ?" }: AIChatBubbleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPulsing, setIsPulsing] = useState(true);
  const chatterpalContainerRef = useRef<HTMLDivElement>(null);
  
  // Start pulsing animation periodically to attract attention
  useEffect(() => {
    if (!isOpen) {
      const pulseTiming = setInterval(() => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 3000);
      }, 15000);
      
      return () => clearInterval(pulseTiming);
    }
  }, [isOpen]);

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
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div 
            key="chat-window"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "bg-background border rounded-lg shadow-lg w-[350px] h-[500px] flex flex-col",
              "backdrop-blur-sm supports-[backdrop-filter]:bg-background/80",
              "border-orange-300"
            )}
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-orange-500 to-orange-400 p-3 text-white rounded-t-lg relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-400/5"
                animate={{ 
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{ 
                  duration: 15, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
              
              <h3 className="font-semibold flex items-center gap-2 z-10">
                <Sparkles className="h-4 w-4 text-orange-100 animate-pulse-subtle" />
                TopCenter Assistant
              </h3>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-orange-600/20 h-8 w-8 p-0 z-10"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden relative">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    <CircuitBoard className="h-8 w-8 text-orange-500 mb-2" />
                  </motion.div>
                  <p className="text-muted-foreground text-sm mt-2">Initialisation de l'assistant...</p>
                </div>
              )}
              <div id="chatterpal-container" ref={chatterpalContainerRef} className="w-full h-full"></div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="chat-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className={cn(
                "rounded-full w-14 h-14 shadow-lg",
                "transition-all duration-300",
                "hover:shadow-xl",
                "bg-gradient-to-r from-orange-500 to-orange-400 text-white",
                "relative overflow-hidden",
                isPulsing ? "animate-bounce-subtle" : ""
              )}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-500/10"
                animate={{ 
                  rotate: 360,
                }}
                transition={{ 
                  duration: 15, 
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <MessageSquare className="w-6 h-6 relative z-10" />
              
              {isPulsing && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-orange-300/30"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: 2,
                    repeatType: "loop"
                  }}
                />
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatBubble;
