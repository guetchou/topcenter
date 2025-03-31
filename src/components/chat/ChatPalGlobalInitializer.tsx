
import { useEffect } from 'react';
import { useChatPal } from '@/hooks/useChatPal';

/**
 * Composant global qui initialise automatiquement ChatterPal
 * avec la configuration par défaut au chargement de la page
 */
export const ChatPalGlobalInitializer = () => {
  const { initChatPal } = useChatPal({
    embedId: 'HSNNDA8bdXzs',
    remoteBaseUrl: 'https://chatappdemo.com/',
    version: '8.3'
  }, true); // Le flag "true" permet l'initialisation automatique

  useEffect(() => {
    // Initialiser explicitement en cas de besoin
    initChatPal();
    
    // Nettoyage à la désinstallation du composant
    return () => {
      // La destruction est gérée dans le hook useChatPal
    };
  }, [initChatPal]);

  // Composant invisible
  return null;
};

export default ChatPalGlobalInitializer;
