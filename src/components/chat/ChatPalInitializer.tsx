
import { useEffect } from 'react';
import { useChatPal } from '@/hooks/useChatPal';

/**
 * Composant invisible qui initialise globalement les instances ChatPal
 * selon les configurations activées dans la base de données.
 */
export const ChatPalInitializer = () => {
  const { availableConfigs, initChatPal } = useChatPal({}, false);

  useEffect(() => {
    // Pour chaque configuration active, initialiser une instance ChatPal
    availableConfigs?.forEach(config => {
      if (config.enabled) {
        initChatPal({
          id: config.id,
          name: config.name,
          embedId: config.embedId,
          remoteBaseUrl: config.remoteBaseUrl,
          version: config.version,
          enabled: config.enabled
        });
      }
    });
    
    // Nettoyage à la désinstallation du composant
    return () => {
      // La destruction est gérée dans le hook useChatPal
    };
  }, [availableConfigs]);

  // Composant invisible
  return null;
};

export default ChatPalInitializer;
