
import { useEffect, useState, useRef } from 'react';
import { useChatPalStatus } from '@/hooks/useChatPalStatus';
import { toast } from 'sonner';

/**
 * Composant global qui détecte l'existence de ChatPal et gère ses erreurs,
 * mais n'initialise pas de nouvelle instance si une globale existe déjà
 */
export const ChatPalGlobalInitializer = () => {
  const { isLoaded, isInitialized, error: statusError } = useChatPalStatus();
  const initAttemptsRef = useRef(0);
  const maxInitAttempts = 3;
  const [hasAttemptedInit, setHasAttemptedInit] = useState(false);

  // Initialiser ChatPal une fois que le script est détecté comme chargé (seulement si aucune instance n'existe)
  useEffect(() => {
    if (isLoaded && !isInitialized && !hasAttemptedInit && initAttemptsRef.current < maxInitAttempts) {
      initAttemptsRef.current += 1;
      setHasAttemptedInit(true);
      console.log(`ChatPal script détecté, mais pas d'instance. Tentative d'initialisation #${initAttemptsRef.current}`);
      
      try {
        // Vérifier si la fonction est disponible
        if (typeof window.ChatPal !== 'function') {
          console.error('La fonction ChatPal n\'est pas disponible globalement');
          return;
        }

        // Vérifier s'il existe une ancienne instance et la nettoyer si nécessaire
        if (window.chatPal && typeof window.chatPal.destroy === 'function') {
          console.log('Instance ChatPal existante trouvée, aucune nouvelle initialisation nécessaire');
          return; // Une instance existe déjà, ne pas réinitialiser
        }
        
        // Initialiser avec un délai pour s'assurer que le DOM et les scripts sont prêts
        const initTimeout = setTimeout(() => {
          try {
            if (!window.chatPal) {
              console.log('Aucune instance ChatPal existante, initialisation...');
              window.chatPal = new window.ChatPal({
                embedId: 'HSNNDA8bdXzs', 
                remoteBaseUrl: 'https://chatappdemo.com/', 
                version: '8.3'
              });
              
              if (window.chatPal) {
                console.log('ChatPal initialisé avec succès par ChatPalGlobalInitializer', window.chatPal);
              } else {
                console.error('ChatPal non initialisé correctement');
              }
            } else {
              console.log('Instance ChatPal déjà existante, utilisation de celle-ci');
            }
          } catch (innerErr) {
            console.error('Erreur lors de l\'initialisation différée de ChatPal:', innerErr);
          }
        }, 3000); // Délai augmenté à 3 secondes pour s'assurer que le DOM est prêt
        
        // Nettoyage du timeout si le composant est démonté
        return () => clearTimeout(initTimeout);
        
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de ChatPal:', err);
        
        if (initAttemptsRef.current >= maxInitAttempts) {
          toast.error('Problème avec le chat. Veuillez rafraîchir la page.');
        }
      }
    }
  }, [isLoaded, isInitialized, hasAttemptedInit]);

  // Afficher les erreurs éventuelles
  useEffect(() => {
    if (statusError && initAttemptsRef.current >= maxInitAttempts) {
      console.error('Erreur ChatPal persistante:', statusError);
      toast.error('Problème avec le chat. Veuillez rafraîchir la page.');
    }
  }, [statusError]);

  // Composant invisible
  return null;
};

export default ChatPalGlobalInitializer;
