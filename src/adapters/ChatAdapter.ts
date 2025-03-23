
/**
 * Adaptateur unifié pour les différentes solutions de chat
 * Permet d'abstraire l'implémentation spécifique (API interne, ChatterPal, etc.)
 */

import { Message, MessageType } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { 
  ChatAdapterConfig, 
  ChatAdapterInterface, 
  ChatProviderType 
} from './types/adapterTypes';
import { toMessageType, fromMessageType } from './utils/messageConverters';
import { WebSocketProvider } from './providers/WebSocketProvider';
import { InternalProvider } from './providers/InternalProvider';
import { ChatterPalProvider } from './providers/ChatterPalProvider';

/**
 * Classe d'adaptateur pour les services de chat
 */
export class ChatAdapter implements ChatAdapterInterface {
  private config: ChatAdapterConfig;
  private connected: boolean = false;
  private messageCallback?: (message: Message) => void;
  private provider: Partial<ChatAdapterInterface> | null = null;

  constructor(config: ChatAdapterConfig) {
    this.config = config;
    
    // Initialiser le provider approprié
    switch (config.provider) {
      case 'websocket':
        if (config.wsUrl) {
          this.provider = new WebSocketProvider(config.wsUrl);
        }
        break;
      case 'internal':
        this.provider = new InternalProvider(config);
        break;
      case 'chatterpal':
        this.provider = new ChatterPalProvider();
        break;
      default:
        console.warn(`Provider "${config.provider}" non pris en charge`);
    }
  }

  /**
   * Convertit un message du format interne vers le format MessageType
   */
  static toMessageType = toMessageType;

  /**
   * Convertit un MessageType vers le format Message interne
   */
  static fromMessageType = fromMessageType;

  /**
   * Envoie un message via l'adaptateur approprié
   */
  async sendMessage(content: string): Promise<Message> {
    if (!this.connected) {
      await this.connect();
    }

    if (this.provider && this.provider.sendMessage) {
      return this.provider.sendMessage(content);
    }

    // Fallback si pas de provider spécifique
    const message: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: Date.now(),
      status: 'error'
    };
    
    console.error('Aucun provider disponible pour envoyer le message');
    return message;
  }

  /**
   * Récupère l'historique des messages
   */
  async getMessages(): Promise<Message[]> {
    if (this.provider && this.provider.getMessages) {
      return this.provider.getMessages();
    }
    
    return [];
  }

  /**
   * Établit la connexion avec le service de chat
   */
  async connect(): Promise<boolean> {
    if (this.connected) return true;

    try {
      if (this.provider && this.provider.connect) {
        const connected = await this.provider.connect();
        this.connected = connected;
        return connected;
      }
      
      // Fallback si pas de provider spécifique
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
      if (this.provider && this.provider.disconnect) {
        await this.provider.disconnect();
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
    
    if (this.provider && this.provider.onMessageReceived) {
      this.provider.onMessageReceived(callback);
    }
  }
}

/**
 * Crée une instance de ChatAdapter avec la configuration spécifiée
 */
export const createChatAdapter = (config: ChatAdapterConfig): ChatAdapterInterface => {
  return new ChatAdapter(config);
};

export { ChatProviderType, ChatAdapterConfig, ChatAdapterInterface };
