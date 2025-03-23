
// src/adapters/providers/ChatterPalProvider.ts
import { ChatAdapterInterface } from '../types/adapterTypes';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export class ChatterPalProvider implements Partial<ChatAdapterInterface> {
  private messageCallback?: (message: Message) => void;
  private connected: boolean = false;

  async connect(): Promise<boolean> {
    if (window.chatPal) {
      this.connected = true;
      return true;
    } else {
      console.warn('ChatterPal not initialized');
      return false;
    }
  }

  async sendMessage(content: string): Promise<Message> {
    const message: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: Date.now(),
      status: 'sending'
    };

    if (window.chatPal && typeof window.chatPal.sendMessage === 'function') {
      window.chatPal.sendMessage(content);
      message.status = 'sent';
    } else {
      console.warn('ChatterPal API not available');
      message.status = 'error';
    }

    return message;
  }

  async getMessages(): Promise<Message[]> {
    return []; // ChatterPal ne permet pas de récupérer l'historique
  }

  async disconnect(): Promise<void> {
    if (window.chatPal && typeof window.chatPal.destroy === 'function') {
      window.chatPal.destroy();
    }
    this.connected = false;
  }

  onMessageReceived(callback: (message: Message) => void): void {
    this.messageCallback = callback;
    // Pour ChatterPal, on pourrait ajouter un listener si nécessaire
  }
}
