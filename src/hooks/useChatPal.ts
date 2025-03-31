
import { useEffect, useState } from 'react';
import ChatPalManager from '@/services/chatpal/ChatPalManager';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ChatPalConfig {
  id: string;
  name: string;
  embedId: string;
  remoteBaseUrl?: string;
  version?: string;
  enabled: boolean;
  position?: 'internal' | 'fixed';
  containerSelector?: string;
  initialMessage?: string;
}

export const useChatPal = (
  config?: Partial<ChatPalConfig>,
  autoInit: boolean = false
) => {
  const [instance, setInstance] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Récupération des configurations depuis Supabase
  const { data: chatbotConfigs } = useQuery({
    queryKey: ['chatbots-settings'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('chatbots_settings')
          .select('*')
          .eq('enabled', true);
          
        if (error) throw error;
        return data as ChatPalConfig[];
      } catch (error) {
        console.error("Erreur lors du chargement des configs ChatPal:", error);
        return [] as ChatPalConfig[];
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
  
  // Si autoInit est true, initialiser automatiquement avec la première config disponible
  useEffect(() => {
    if (autoInit && chatbotConfigs && chatbotConfigs.length > 0 && !isInitialized) {
      const defaultConfig = chatbotConfigs[0];
      initChatPal(defaultConfig);
    } else if (autoInit && config && config.embedId && !isInitialized) {
      // Si pas de configs dans la base mais une config fournie en props
      initChatPal(config);
    }
  }, [chatbotConfigs, autoInit, isInitialized, config]);

  // Nettoyage à la désinstallation du composant
  useEffect(() => {
    return () => {
      if (instance && config?.embedId) {
        ChatPalManager.destroyChatPal(config.embedId);
      }
    };
  }, [instance, config?.embedId]);

  // Fonction d'initialisation
  const initChatPal = (initConfig?: Partial<ChatPalConfig>) => {
    const finalConfig = { ...config, ...initConfig };
    
    if (!finalConfig.embedId) {
      setError(new Error('embedId is required'));
      return;
    }

    try {
      const chatPalInstance = ChatPalManager.initChatPal({
        embedId: finalConfig.embedId,
        remoteBaseUrl: finalConfig.remoteBaseUrl || 'https://chatappdemo.com/',
        version: finalConfig.version || '8.3',
        containerSelector: finalConfig.containerSelector,
        position: finalConfig.position
      });

      if (chatPalInstance) {
        setInstance(chatPalInstance);
        setIsInitialized(true);
        setError(null);
      } else {
        setError(new Error('Failed to initialize ChatPal'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    }
  };

  // Fonction de destruction
  const destroyChatPal = () => {
    if (config?.embedId && isInitialized) {
      ChatPalManager.destroyChatPal(config.embedId);
      setInstance(null);
      setIsInitialized(false);
    }
  };

  // Fonction d'envoi de message
  const sendMessage = (message: string) => {
    if (config?.embedId && isInitialized) {
      ChatPalManager.sendMessage(config.embedId, message);
    }
  };

  return {
    instance,
    isInitialized,
    error,
    initChatPal,
    destroyChatPal,
    sendMessage,
    availableConfigs: chatbotConfigs || []
  };
};
