
/**
 * Adaptateur unifié pour les différentes solutions de chat
 * Permet d'abstraire l'implémentation spécifique (API interne, ChatterPal, etc.)
 */

import { Message, MessageType } from '@/types/chat';

// Types d'adaptateurs de chat supportés
export type ChatProviderType = 'internal' | 'chatterpal' | 'external';

// Configuration pour l'adaptateur
export interface ChatAdapterConfig {
  provider: ChatProviderType;
  apiUrl?: string;
  headers?: Record<string, string>;
  authToken?: string;
}

// Interface de l'adaptateur
export interface ChatAdapterInterface {
  sendMessage: (content: string) => Promise<Message>;
  getMessages: () => Promise<Message[]>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  onMessageReceived?: (callback: (message: Message) => void) => void;
}

/**
 * Classe d'adaptateur pour les services de chat
 */
export class ChatAdapter implements ChatAdapterInterface {
  private config: ChatAdapterConfig;
  private connected: boolean = false;
  private messageCallback?: (message: Message) => void;

  constructor(config: ChatAdapterConfig) {
    this.config = config;
  }

  /**
   * Convertit un message du format interne vers le format MessageType (pour la compatibilité)
   */
  static toMessageType(message: Message): MessageType {
    return {
      text: message.content,
      isUser: message.sender === 'user',
      timestamp: new Date(message.timestamp),
      status: message.status
    };
  }

  /**
   * Convertit un MessageType vers le format Message interne
   */
  static fromMessageType(messageType: MessageType): Message {
    return {
      id: Math.random().toString(36).substring(2, 9),
      content: messageType.text,
      sender: messageType.isUser ? 'user' : 'assistant',
      timestamp: messageType.timestamp?.getTime() || Date.now(),
      status: messageType.status
    };
  }

  /**
   * Envoie un message via l'adaptateur approprié
   */
  async sendMessage(content: string): Promise<Message> {
    if (!this.connected) {
      await this.connect();
    }

    const message: Message = {
      id: Math.random().toString(36).substring(2, 9),
      content,
      sender: 'user',
      timestamp: Date.now(),
      status: 'sending'
    };

    try {
      if (this.config.provider === 'internal') {
        // Communication avec notre API backend
        const response = await fetch(`${this.config.apiUrl || '/api'}/chatbot/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.config.headers || {})
          },
          body: JSON.stringify({ message: content })
        });

        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        message.status = 'sent';

        // Simuler la réception d'un message de l'assistant
        if (data.response) {
          setTimeout(() => {
            const botMessage: Message = {
              id: Math.random().toString(36).substring(2, 9),
              content: data.response.text,
              sender: 'assistant',
              timestamp: Date.now()
            };
            
            if (this.messageCallback) {
              this.messageCallback(botMessage);
            }
          }, 500);
        }
      } else if (this.config.provider === 'chatterpal') {
        // Envoyer via ChatterPal - en utilisant l'API globale si elle existe
        if (window.chatPal && typeof window.chatPal.sendMessage === 'function') {
          window.chatPal.sendMessage(content);
        } else {
          console.warn('ChatterPal API not available');
          message.status = 'error';
        }
      }

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      message.status = 'error';
      return message;
    }
  }

  /**
   * Récupère l'historique des messages
   */
  async getMessages(): Promise<Message[]> {
    if (this.config.provider === 'internal') {
      try {
        const response = await fetch(`${this.config.apiUrl || '/api'}/chatbot/messages`, {
          headers: {
            ...(this.config.headers || {})
          }
        });

        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }

        const data = await response.json();
        return data.messages.map((msg: any) => ({
          id: msg.id.toString(),
          content: msg.text,
          sender: msg.sender === 'bot' ? 'assistant' : 'user',
          timestamp: new Date(msg.timestamp).getTime()
        }));
      } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
    }
    
    // Pour les autres providers, on commence avec un tableau vide
    return [];
  }

  /**
   * Établit la connexion avec le service de chat
   */
  async connect(): Promise<boolean> {
    if (this.connected) return true;

    try {
      if (this.config.provider === 'chatterpal') {
        // Vérifier si ChatterPal est initialisé
        if (window.chatPal) {
          // ChatterPal est déjà initialisé
          this.connected = true;
          return true;
        } else {
          console.warn('ChatterPal not initialized');
          return false;
        }
      }

      // Pour le provider interne ou autres, on marque simplement comme connecté
      this.connected = true;
      return true;
    } catch (error) {
      console.error('Error connecting to chat service:', error);
      return false;
    }
  }

  /**
   * Déconnecte du service de chat
   */
  async disconnect(): Promise<void> {
    if (!this.connected) return;

    try {
      if (this.config.provider === 'chatterpal' && window.chatPal) {
        // Si ChatterPal a une méthode de déconnexion
        if (typeof window.chatPal.destroy === 'function') {
          window.chatPal.destroy();
        }
      }

      this.connected = false;
    } catch (error) {
      console.error('Error disconnecting from chat service:', error);
    }
  }

  /**
   * Inscrit un callback pour la réception de messages
   */
  onMessageReceived(callback: (message: Message) => void): void {
    this.messageCallback = callback;

    // Pour ChatterPal, on pourrait ajouter un listener si nécessaire
    if (this.config.provider === 'chatterpal' && window.chatPal) {
      // Ici on pourrait ajouter une écoute d'événements si ChatterPal le supporte
    }
  }
}

/**
 * Crée une instance de ChatAdapter avec la configuration spécifiée
 */
export const createChatAdapter = (config: ChatAdapterConfig): ChatAdapterInterface => {
  return new ChatAdapter(config);
};
