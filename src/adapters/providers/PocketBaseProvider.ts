
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types/chat';
import { ChatAdapterInterface } from '../types/adapterTypes';
import { pb } from '@/integrations/pocketbase/client';

export class PocketBaseProvider implements Partial<ChatAdapterInterface> {
  private messageCallback?: (message: Message) => void;
  private connected: boolean = false;
  private messageSubscription: any = null;

  constructor() {
    // Initialize PocketBase connection
  }

  async connect(): Promise<boolean> {
    try {
      // Check if PocketBase is accessible
      await pb.health.check();
      this.connected = true;
      
      // Subscribe to realtime updates for new messages
      this.subscribeToMessages();
      
      return true;
    } catch (error) {
      console.error('Failed to connect to PocketBase:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
      this.messageSubscription = null;
    }
    this.connected = false;
  }

  async sendMessage(content: string): Promise<Message> {
    try {
      const message: Message = {
        id: uuidv4(),
        content,
        sender: 'user',
        timestamp: Date.now(),
        status: 'sending'
      };

      // Save message to PocketBase
      const savedMessage = await pb.collection('chat_messages').create({
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
      });

      // Update message with saved ID and mark as sent
      message.status = 'sent';
      message.id = savedMessage.id;

      return message;
    } catch (error) {
      console.error('Failed to send message to PocketBase:', error);
      
      // Return error message
      return {
        id: uuidv4(),
        content,
        sender: 'user',
        timestamp: Date.now(),
        status: 'error'
      };
    }
  }

  async getMessages(): Promise<Message[]> {
    try {
      // Fetch messages from PocketBase
      const records = await pb.collection('chat_messages').getList(1, 50, {
        sort: 'timestamp',
      });

      // Convert PocketBase records to Message format
      return records.items.map(record => ({
        id: record.id,
        content: record.content,
        sender: record.sender,
        timestamp: new Date(record.timestamp).getTime(),
        status: 'sent'
      }));
    } catch (error) {
      console.error('Failed to fetch messages from PocketBase:', error);
      return [];
    }
  }

  onMessageReceived(callback: (message: Message) => void): void {
    this.messageCallback = callback;
  }

  private subscribeToMessages() {
    this.messageSubscription = pb.collection('chat_messages').subscribe('*', (data) => {
      if (data.action === 'create' && data.record.sender !== 'user' && this.messageCallback) {
        // Convert PocketBase record to Message format
        const message: Message = {
          id: data.record.id,
          content: data.record.content,
          sender: data.record.sender,
          timestamp: new Date(data.record.timestamp).getTime(),
          status: 'sent'
        };
        
        this.messageCallback(message);
      }
    });
  }
}
