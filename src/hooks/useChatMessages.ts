
import { useState, useCallback, useEffect } from 'react';
import { MessageType, Message } from '@/types/chat';
import { useChatAdapter } from '@/hooks/useChatAdapter';
import { v4 as uuidv4 } from 'uuid';

export const useChatMessages = (useAdapter = false) => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: uuidv4(),
      text: 'Bienvenue chez TopCenter ! Comment puis-je vous aider aujourd\'hui ?',
      isUser: false,
      timestamp: new Date(),
      sender: 'agent'
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
        id: msg.id,
        text: msg.content,
        isUser: msg.sender === 'user',
        timestamp: new Date(msg.timestamp),
        status: msg.status,
        sender: msg.sender === 'user' ? 'user' : 'agent'
      }));
      
      setMessages(convertedMessages);
    }
  }, [useAdapter, adapterMessages]);

  // Fonction utilitaire pour convertir MessageType en Message
  const convertToMessage = (messageType: MessageType): Message => {
    return {
      id: messageType.id,
      content: messageType.text,
      sender: messageType.sender,
      timestamp: messageType.timestamp.getTime(),
      status: messageType.status
    };
  };

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim()) return;

    const userMessageObj: MessageType = {
      id: uuidv4(),
      text: newMessage,
      isUser: true,
      timestamp: new Date(),
      status: 'sending',
      sender: 'user'
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
            id: uuidv4(),
            text: `Je suis là pour vous aider concernant "${newMessage}". Comment puis-je vous assister davantage ?`,
            isUser: false,
            timestamp: new Date(),
            sender: 'agent'
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
