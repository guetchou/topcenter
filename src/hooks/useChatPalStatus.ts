
import { useState, useEffect } from 'react';

export const useChatPalStatus = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Vérifier si le script est chargé
    const checkScriptLoaded = () => {
      if (window.ChatPal) {
        setIsLoaded(true);
        return true;
      }
      return false;
    };

    // Vérifier si une instance est déjà initialisée
    const checkInstanceInitialized = () => {
      if (window.chatPal) {
        setIsInitialized(true);
        return true;
      }
      return false;
    };

    // Première vérification immédiate
    checkScriptLoaded();
    checkInstanceInitialized();

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
        setError(new Error("Le script ChatPal n'a pas pu être chargé dans le délai imparti"));
      } else if (!isInitialized) {
        setError(new Error("L'instance ChatPal n'a pas pu être initialisée dans le délai imparti"));
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
