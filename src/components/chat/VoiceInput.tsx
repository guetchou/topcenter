
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VoiceInputProps {
  onVoiceInput: (text: string) => void;
  isDisabled?: boolean;
}

export const VoiceInput = ({ onVoiceInput, isDisabled = false }: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    // Vérifier la compatibilité du navigateur avec l'API SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn("La reconnaissance vocale n'est pas prise en charge par ce navigateur.");
      return;
    }

    // Nettoyer l'instance de reconnaissance vocale à la désinstallation
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isDisabled) return;
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    try {
      // Initialiser l'API de reconnaissance vocale
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configurer l'API pour le français
      recognitionRef.current.lang = 'fr-FR';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      // Configurer les événements
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsProcessing(true);
        
        // Envoyer le texte reconnu
        onVoiceInput(transcript);
        
        // Petit délai pour montrer le traitement
        setTimeout(() => {
          setIsProcessing(false);
          setIsListening(false);
        }, 500);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        toast.error('Erreur lors de la reconnaissance vocale');
        setIsListening(false);
        setIsProcessing(false);
      };

      recognitionRef.current.onend = () => {
        if (isListening && !isProcessing) {
          setIsListening(false);
        }
      };

      // Démarrer la reconnaissance
      recognitionRef.current.start();
    } catch (error) {
      console.error('Erreur lors du démarrage de la reconnaissance vocale:', error);
      toast.error('Impossible de démarrer la reconnaissance vocale');
      setIsListening(false);
      setIsProcessing(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  return (
    <Button
      type="button"
      size="icon"
      variant={isListening ? "default" : "outline"}
      className={`relative transition-all duration-200 ${
        isListening ? "bg-primary text-primary-foreground animate-pulse" : ""
      }`}
      onClick={toggleListening}
      disabled={isDisabled || isProcessing}
    >
      {isProcessing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isListening ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
      
      {isListening && (
        <span className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      )}
    </Button>
  );
};

// Type definitions for the Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
