
import { useEffect, useState } from 'react';
import { useChatPal } from '@/hooks/useChatPal';
import { useChatPalStatus } from '@/hooks/useChatPalStatus';
import { toast } from 'sonner';

/**
 * Composant global qui initialise automatiquement ChatterPal
 * avec la configuration par défaut au chargement de la page
 */
export const ChatPalGlobalInitializer = () => {
  const [initialized, setInitialized] = useState(false);
  const { isLoaded, isInitialized, error: statusError } = useChatPalStatus();
  const { initChatPal, error } = useChatPal({
    embedId: 'HSNNDA8bdXzs',
    remoteBaseUrl: 'https://chatappdemo.com/',
    version: '8.3'
  }, false); // On désactive l'initialisation automatique pour mieux la contrôler ici

  // Initialiser ChatPal une fois que le script est détecté comme chargé
  useEffect(() => {
    if (isLoaded && !isInitialized && !initialized) {
      console.log('ChatPal script détecté, tentative d\'initialisation');
      try {
        // Vérifier s'il existe une ancienne instance et la nettoyer si nécessaire
        if (window.chatPal && typeof window.chatPal.destroy === 'function') {
          console.log('Instance ChatPal existante trouvée, destruction...');
          window.chatPal.destroy();
        }
        
        // Initialiser manuellement si nécessaire
        if (!window.chatPal) {
          console.log('Initialisation manuelle de ChatPal');
          window.chatPal = new window.ChatPal({
            embedId: 'HSNNDA8bdXzs', 
            remoteBaseUrl: 'https://chatappdemo.com/', 
            version: '8.3'
          });
        } else {
          console.log('ChatPal déjà initialisé, réutilisation de l\'instance existante');
        }
        
        setInitialized(true);
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de ChatPal:', err);
        toast.error('Problème avec le chat. Veuillez rafraîchir la page.');
      }
    }
  }, [isLoaded, isInitialized, initialized, initChatPal]);

  // Afficher les erreurs éventuelles
  useEffect(() => {
    const errorToShow = error || statusError;
    if (errorToShow) {
      console.error('Erreur ChatPal:', errorToShow);
      toast.error('Problème avec le chat. Veuillez rafraîchir la page.');
    }
  }, [error, statusError]);

  // Ajouter une vérification périodique pour s'assurer que ChatPal reste disponible
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (!window.ChatPal || !window.chatPal) {
        console.warn('ChatPal semble avoir été déchargé ou corrompu, tentative de réinitialisation...');
        setInitialized(false);
      }
    }, 30000);
    
    return () => clearInterval(checkInterval);
  }, []);

  // Composant invisible
  return null;
};

export default ChatPalGlobalInitializer;
