
// src/adapters/providers/WebSocketProvider.ts
import { ChatAdapterInterface } from '../types/adapterTypes';
import { Message } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

export class WebSocketProvider implements Partial<ChatAdapterInterface> {
  private wsConnection?: WebSocket;
  private wsUrl: string;
  private connected: boolean = false;
  private messageCallback?: (message: Message) => void;

  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
  }

  async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.wsUrl) {
        console.error('WebSocket URL is not defined');
        resolve(false);
        return;
      }

      this.wsConnection = new WebSocket(this.wsUrl);

      this.wsConnection.onopen = () => {
        console.log('WebSocket connection established');
        this.connected = true;
        resolve(true);
      };

      this.wsConnection.onclose = () => {
        console.log('WebSocket connection closed');
        this.connected = false;
      };

      this.wsConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        resolve(false);
      };

      this.wsConnection.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'chat_message' && this.messageCallback) {
            const message: Message = {
              id: data.id || uuidv4(),
              content: data.data.content,
              sender: data.data.senderId || 'assistant',
              timestamp: data.data.timestamp || Date.now()
            };
            
            this.messageCallback(message);
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
        }
      };
    });
  }

  async sendMessage(content: string): Promise<Message> {
    const message: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: Date.now(),
      status: 'sending'
    };

    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        type: 'chat_message',
        data: {
          content,
          senderId: 'user',
          timestamp: Date.now()
        }
      }));
      message.status = 'sent';
    } else {
      console.warn('WebSocket connection not available');
      message.status = 'error';
    }

    return message;
  }

  async disconnect(): Promise<void> {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = undefined;
      this.connected = false;
    }
  }

  onMessageReceived(callback: (message: Message) => void): void {
    this.messageCallback = callback;
  }
}
