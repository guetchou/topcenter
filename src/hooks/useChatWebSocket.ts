
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNotifications } from '@/components/notifications/NotificationsProvider';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types/chat';

interface WebSocketMessage {
  type: string;
  id: string;
  data: any;
}

export const useChatWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const ws = useRef<WebSocket | null>(null);
  const { addNotification } = useNotifications();
  
  // Connect to WebSocket
  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;
    
    try {
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setReconnectAttempts(0);
        addNotification(
          "Connexion établie", 
          "Vous êtes maintenant connecté au service de chat en temps réel", 
          "success"
        );
      };
      
      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Exponential backoff for reconnection
        const delay = Math.min(30000, Math.pow(1.5, reconnectAttempts) * 1000);
        setReconnectAttempts(prev => prev + 1);
        
        setTimeout(() => {
          connect();
        }, delay);
      };
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        addNotification(
          "Erreur de connexion", 
          "Impossible de se connecter au service de chat. Nouvelle tentative en cours...", 
          "error"
        );
      };
      
      ws.current.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          
          if (data.type === 'chat_message') {
            const newMessage: Message = {
              id: data.id || uuidv4(),
              content: data.data.content,
              sender: data.data.senderId || 'assistant',
              timestamp: data.data.timestamp || Date.now()
            };
            
            setMessages(prev => [...prev, newMessage]);
            
            // Notify if the message is from agent/assistant and window is not focused
            if (newMessage.sender !== 'user' && document.visibilityState !== 'visible') {
              addNotification(
                "Nouveau message", 
                newMessage.content.substring(0, 50) + (newMessage.content.length > 50 ? '...' : ''), 
                "info"
              );
            }
          } else if (data.type === 'status_update') {
            addNotification(
              "Statut du chat", 
              data.data.message, 
              "info"
            );
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
    }
  }, [url, reconnectAttempts, addNotification]);
  
  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);
  
  // Send message function
  const sendMessage = useCallback((content: string) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      addNotification(
        "Erreur d'envoi", 
        "Impossible d'envoyer le message car la connexion est fermée", 
        "error"
      );
      return false;
    }
    
    try {
      const messageId = uuidv4();
      
      const message: Message = {
        id: messageId,
        content,
        sender: 'user',
        timestamp: Date.now()
      };
      
      // Add to local messages
      setMessages(prev => [...prev, message]);
      
      // Send to WebSocket
      ws.current.send(JSON.stringify({
        type: 'chat_message',
        id: messageId,
        data: {
          content,
          senderId: 'user',
          timestamp: Date.now()
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      addNotification(
        "Erreur d'envoi", 
        "Une erreur est survenue lors de l'envoi du message", 
        "error"
      );
      return false;
    }
  }, [addNotification]);
  
  return {
    isConnected,
    messages,
    sendMessage,
    connect
  };
};
