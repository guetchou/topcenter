
import { useEffect, useState, useRef } from 'react';
import { useChatPalStatus } from '@/hooks/useChatPalStatus';
import { toast } from 'sonner';

/**
 * Composant global qui initialise automatiquement ChatterPal
 * avec la configuration par défaut au chargement de la page
 */
export const ChatPalGlobalInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  const { isLoaded, isInitialized, error: statusError } = useChatPalStatus();
  const initAttemptsRef = useRef(0);
  const maxInitAttempts = 3;

  // Initialiser ChatPal une fois que le script est détecté comme chargé
  useEffect(() => {
    if (isLoaded && !isInitialized && !initialized && initAttemptsRef.current < maxInitAttempts) {
      initAttemptsRef.current += 1;
      console.log(`ChatPal script détecté, tentative d'initialisation #${initAttemptsRef.current}`);
      
      try {
        // Vérifier s'il existe une ancienne instance et la nettoyer si nécessaire
        if (window.chatPal && typeof window.chatPal.destroy === 'function') {
          console.log('Instance ChatPal existante trouvée, destruction...');
          window.chatPal.destroy();
        }
        
        // Initialiser avec un délai pour s'assurer que le DOM et les scripts sont prêts
        const initTimeout = setTimeout(() => {
          try {
            if (typeof window !== 'undefined' && window.ChatPal) {
              window.chatPal = new window.ChatPal({
                embedId: 'HSNNDA8bdXzs', 
                remoteBaseUrl: 'https://chatappdemo.com/', 
                version: '8.3'
              });
              
              if (window.chatPal) {
                console.log('ChatPal initialisé avec succès', window.chatPal);
                setInitialized(true);
              } else {
                console.error('ChatPal non initialisé correctement');
              }
            } else {
              console.error('ChatPal constructor not available in window');
            }
          } catch (innerErr) {
            console.error('Erreur lors de l\'initialisation différée de ChatPal:', innerErr);
          }
        }, 1500); // Délai augmenté pour s'assurer que le DOM est prêt
        
        // Nettoyage du timeout si le composant est démonté
        return () => clearTimeout(initTimeout);
        
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de ChatPal:', err);
        
        if (initAttemptsRef.current >= maxInitAttempts) {
          toast.error('Problème avec le chat. Veuillez rafraîchir la page.');
        }
      }
    }
  }, [isLoaded, isInitialized, initialized]);

  // Afficher les erreurs éventuelles
  useEffect(() => {
    if (statusError && initAttemptsRef.current >= maxInitAttempts) {
      console.error('Erreur ChatPal persistante:', statusError);
      toast.error('Problème avec le chat. Veuillez rafraîchir la page.');
    }
  }, [statusError]);

  // Ajouter une vérification périodique pour s'assurer que ChatPal reste disponible
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (initialized && (!window.ChatPal || !window.chatPal)) {
        console.warn('ChatPal semble avoir été déchargé ou corrompu, tentative de réinitialisation...');
        setInitialized(false);
        initAttemptsRef.current = 0; // Réinitialiser le compteur pour permettre de nouvelles tentatives
      }
    }, 30000);
    
    return () => clearInterval(checkInterval);
  }, [initialized]);

  // Composant invisible
  return null;
};

export default ChatPalGlobalInitializer;
