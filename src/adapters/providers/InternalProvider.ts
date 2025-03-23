
// src/adapters/providers/InternalProvider.ts
import { ChatAdapterInterface, ChatAdapterConfig } from '../types/adapterTypes';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';
import { createAssistantMessage } from '../utils/messageConverters';

export class InternalProvider implements Partial<ChatAdapterInterface> {
  private config: ChatAdapterConfig;
  private messageCallback?: (message: Message) => void;

  constructor(config: ChatAdapterConfig) {
    this.config = config;
  }

  async connect(): Promise<boolean> {
    return true; // Pour l'API interne, on suppose toujours que la connexion réussit
  }

  async sendMessage(content: string): Promise<Message> {
    const message: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: Date.now(),
      status: 'sending'
    };

    try {
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
          const botMessage = createAssistantMessage(data.response.text);
          
          if (this.messageCallback) {
            this.messageCallback(botMessage);
          }
        }, 500);
      }

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      message.status = 'error';
      return message;
    }
  }

  async getMessages(): Promise<Message[]> {
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

  async disconnect(): Promise<void> {
    // Rien à faire pour l'API interne
  }

  onMessageReceived(callback: (message: Message) => void): void {
    this.messageCallback = callback;
  }
}
