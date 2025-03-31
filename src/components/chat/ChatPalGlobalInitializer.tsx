
import { useEffect, useState } from 'react';
import { useChatPal } from '@/hooks/useChatPal';
import { toast } from 'sonner';

/**
 * Composant global qui initialise automatiquement ChatterPal
 * avec la configuration par défaut au chargement de la page
 */
export const ChatPalGlobalInitializer = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { initChatPal, error } = useChatPal({
    embedId: 'HSNNDA8bdXzs',
    remoteBaseUrl: 'https://chatappdemo.com/',
    version: '8.3'
  }, false); // On désactive l'initialisation automatique pour mieux la contrôler ici

  // Vérifier si le script ChatPal est chargé
  useEffect(() => {
    const checkScriptLoaded = () => {
      if (window.ChatPal) {
        setScriptLoaded(true);
        console.log('Script ChatPal détecté et chargé.');
        return true;
      }
      return false;
    };

    // Si déjà chargé, marquer comme prêt
    if (checkScriptLoaded()) return;

    // Sinon, attendre que le script soit chargé
    const scriptCheckInterval = setInterval(() => {
      if (checkScriptLoaded()) {
        clearInterval(scriptCheckInterval);
      }
    }, 500);

    // Timeout après 10 secondes si le script ne se charge pas
    const timeout = setTimeout(() => {
      clearInterval(scriptCheckInterval);
      if (!window.ChatPal) {
        console.error('Le script ChatPal n\'a pas pu être chargé après 10 secondes');
        toast.error('Impossible de charger le chat. Veuillez rafraîchir la page.');
      }
    }, 10000);

    return () => {
      clearInterval(scriptCheckInterval);
      clearTimeout(timeout);
    };
  }, []);

  // Initialiser ChatPal une fois le script chargé
  useEffect(() => {
    if (scriptLoaded) {
      console.log('Initialisation de ChatPal avec embedId: HSNNDA8bdXzs');
      try {
        // Vérifier si une instance globale existe déjà et la détruire si nécessaire
        if (window.chatPal && typeof window.chatPal.destroy === 'function') {
          console.log('Instance ChatPal existante trouvée, destruction...');
          window.chatPal.destroy();
        }
        
        // Initialiser notre instance gérée
        initChatPal();
      } catch (err) {
        console.error('Erreur lors de l\'initialisation de ChatPal:', err);
      }
    }
  }, [scriptLoaded, initChatPal]);

  // Afficher les erreurs éventuelles
  useEffect(() => {
    if (error) {
      console.error('Erreur ChatPal:', error);
      toast.error('Problème avec le chat. Veuillez rafraîchir la page.');
    }
  }, [error]);

  // Composant invisible
  return null;
};

export default ChatPalGlobalInitializer;
