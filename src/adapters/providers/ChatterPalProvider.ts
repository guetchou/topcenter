
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

    try {
      if (window.chatPal) {
        // Check if the sendMessage function exists on the instance
        if (typeof window.chatPal.sendMessage === 'function') {
          window.chatPal.sendMessage(content);
          message.status = 'sent';
        } else {
          console.warn('ChatterPal sendMessage method not available');
          message.status = 'error';
        }
      } else {
        console.warn('ChatterPal API not available');
        message.status = 'error';
      }
    } catch (error) {
      console.error('Error sending message to ChatterPal:', error);
      message.status = 'error';
    }

    return message;
  }

  async getMessages(): Promise<Message[]> {
    return []; // ChatterPal doesn't provide a way to retrieve message history
  }

  async disconnect(): Promise<void> {
    if (window.chatPal && typeof window.chatPal.destroy === 'function') {
      try {
        window.chatPal.destroy();
        this.connected = false;
      } catch (error) {
        console.error('Error disconnecting from ChatterPal:', error);
      }
    }
  }

  onMessageReceived(callback: (message: Message) => void): void {
    this.messageCallback = callback;
    // For ChatterPal, we could add a listener if needed
  }
}
