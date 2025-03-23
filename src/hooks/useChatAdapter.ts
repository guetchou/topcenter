
import { useState, useEffect, useCallback } from 'react';
import { 
  ChatAdapter, 
  ChatAdapterConfig, 
  ChatAdapterInterface, 
  ChatProviderType 
} from '@/adapters/ChatAdapter';
import { Message } from '@/types/chat';

export const useChatAdapter = (initialConfig?: Partial<ChatAdapterConfig>) => {
  const [adapter, setAdapter] = useState<ChatAdapterInterface | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialiser l'adaptateur avec la configuration
  const initAdapter = useCallback(async (config: ChatAdapterConfig) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newAdapter = new ChatAdapter(config);
      
      // Configurer le callback pour les nouveaux messages
      newAdapter.onMessageReceived?.((message: Message) => {
        setMessages(prev => [...prev, message]);
      });
      
      // Se connecter au service
      const connected = await newAdapter.connect();
      
      if (connected) {
        setAdapter(newAdapter);
        setIsConnected(true);
        
        // Charger les messages existants
        try {
          const history = await newAdapter.getMessages();
          setMessages(history);
        } catch (err) {
          console.error('Error loading message history:', err);
        }
      } else {
        throw new Error('Failed to connect to chat service');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Chat adapter initialization error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialiser avec la configuration par défaut si fournie
  useEffect(() => {
    if (initialConfig && initialConfig.provider) {
      initAdapter({
        provider: initialConfig.provider,
        apiUrl: initialConfig.apiUrl || '/api',
        headers: initialConfig.headers || {},
        authToken: initialConfig.authToken
      });
    }
    
    // Cleanup lors du démontage du composant
    return () => {
      if (adapter) {
        adapter.disconnect();
      }
    };
  }, [initialConfig, initAdapter, adapter]);

  // Fonction pour envoyer un message
  const sendMessage = useCallback(async (content: string) => {
    if (!adapter || !isConnected) {
      setError(new Error('Chat not connected'));
      return null;
    }
    
    try {
      setIsLoading(true);
      const message = await adapter.sendMessage(content);
      setMessages(prev => [...prev, message]);
      return message;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error sending message'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [adapter, isConnected]);

  // Fonction pour changer de provider
  const switchProvider = useCallback((provider: ChatProviderType, config?: Partial<ChatAdapterConfig>) => {
    // Déconnecter l'adaptateur actuel
    if (adapter) {
      adapter.disconnect();
    }
    
    // Initialiser un nouvel adaptateur
    initAdapter({
      provider,
      apiUrl: config?.apiUrl || '/api',
      headers: config?.headers || {},
      authToken: config?.authToken
    });
  }, [adapter, initAdapter]);

  return {
    adapter,
    messages,
    isConnected,
    isLoading,
    error,
    sendMessage,
    switchProvider,
    initAdapter
  };
};
