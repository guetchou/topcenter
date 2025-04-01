
import { useState, useEffect } from 'react';

export const useChatPalStatus = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Vérifier si le script est chargé
    const checkScriptLoaded = () => {
      try {
        const isLoaded = typeof window !== 'undefined' && typeof window.ChatPal === 'function';
        console.log(`ChatPal script status: ${isLoaded ? 'loaded' : 'not loaded'}`);
        setIsLoaded(isLoaded);
        return isLoaded;
      } catch (err) {
        console.error("Erreur lors de la vérification du script ChatPal:", err);
        return false;
      }
    };

    // Vérifier si une instance est déjà initialisée
    const checkInstanceInitialized = () => {
      try {
        const isInitialized = typeof window !== 'undefined' && window.chatPal !== undefined;
        console.log(`ChatPal instance status: ${isInitialized ? 'initialized' : 'not initialized'}`);
        setIsInitialized(isInitialized);
        return isInitialized;
      } catch (err) {
        console.error("Erreur lors de la vérification de l'instance ChatPal:", err);
        return false;
      }
    };

    // Première vérification immédiate
    const scriptLoaded = checkScriptLoaded();
    const instanceInitialized = checkInstanceInitialized();

    // Si tout est déjà initialisé, pas besoin de vérifications supplémentaires
    if (scriptLoaded && instanceInitialized) {
      return;
    }

    // Vérifier périodiquement pour détecter les changements
    const intervalId = setInterval(() => {
      const scriptLoaded = checkScriptLoaded();
      const instanceInitialized = checkInstanceInitialized();
      
      if (scriptLoaded && instanceInitialized) {
        clearInterval(intervalId);
      }
    }, 1000);

    // Timeout après 15 secondes
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        const errorMsg = "Le script ChatPal n'a pas pu être chargé dans le délai imparti";
        console.error(errorMsg);
        setError(new Error(errorMsg));
      } else if (!isInitialized) {
        const errorMsg = "L'instance ChatPal n'a pas pu être initialisée dans le délai imparti";
        console.error(errorMsg);
        setError(new Error(errorMsg));
      }
      clearInterval(intervalId);
    }, 15000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [isLoaded, isInitialized]);

  return {
    isLoaded,
    isInitialized,
    error
  };
};
