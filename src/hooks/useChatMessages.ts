
import { useState, useCallback, useEffect } from 'react';
import { MessageType, Message } from '@/types/chat';
import { useChatAdapter } from '@/hooks/useChatAdapter';

export const useChatMessages = (useAdapter = false) => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      text: 'Bienvenue chez TopCenter ! Comment puis-je vous aider aujourd\'hui ?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [queuePosition, setQueuePosition] = useState(3);
  const [isConnectedToAgent, setIsConnectedToAgent] = useState(false);

  // Initialiser l'adaptateur de chat si nécessaire
  const {
    messages: adapterMessages,
    sendMessage: sendAdapterMessage,
    isLoading
  } = useChatAdapter(useAdapter ? { provider: 'internal' } : undefined);

  // Convertir les messages de l'adaptateur au format MessageType
  useEffect(() => {
    if (useAdapter && adapterMessages.length > 0) {
      const convertedMessages = adapterMessages.map((msg: Message): MessageType => ({
        text: msg.content,
        isUser: msg.sender === 'user',
        timestamp: new Date(msg.timestamp),
        status: msg.status
      }));
      
      setMessages(convertedMessages);
    }
  }, [useAdapter, adapterMessages]);

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;

    const userMessageObj: MessageType = {
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
      status: 'sending'
    };

    // Ajouter le message de l'utilisateur aux messages
    setMessages(prevMessages => [...prevMessages, userMessageObj]);
    setNewMessage('');
    setIsTyping(true);

    try {
      if (useAdapter) {
        // Utiliser l'adaptateur pour envoyer le message
        await sendAdapterMessage(newMessage);
        // La réponse sera ajoutée automatiquement via le callback de l'adaptateur
      } else {
        // Simulation d'une réponse pour le mode sans adaptateur
        setTimeout(() => {
          const botReply: MessageType = {
            text: `Je suis là pour vous aider concernant "${newMessage}". Comment puis-je vous assister davantage ?`,
            isUser: false,
            timestamp: new Date()
          };
          
          setMessages(prevMessages => [...prevMessages, botReply]);
          setIsTyping(false);
          
          // Simuler une connexion à un agent après quelques messages
          if (messages.length > 4 && queuePosition > 0) {
            setQueuePosition(prev => Math.max(0, prev - 1));
          }
          
          if (queuePosition === 0 && !isConnectedToAgent) {
            setIsConnectedToAgent(true);
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      
      // Mettre à jour le statut du message en cas d'erreur
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg === userMessageObj ? { ...msg, status: 'error' } : msg
        )
      );
      
      setIsTyping(false);
    }
  }, [newMessage, messages.length, queuePosition, isConnectedToAgent, useAdapter, sendAdapterMessage]);

  return {
    messages,
    newMessage,
    setNewMessage,
    isTyping,
    queuePosition,
    isConnectedToAgent,
    handleSendMessage,
    setQueuePosition,
    setIsConnectedToAgent
  };
};
