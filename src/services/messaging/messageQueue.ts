
import { wsService } from '../websocketService';
import { v4 as uuidv4 } from 'uuid';

export interface QueueMessage {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retries?: number;
  maxRetries?: number;
  delay?: number;
}

export interface MessageHandler {
  (message: QueueMessage): Promise<void> | void;
}

export class MessageQueue {
  private handlers: Map<string, Set<MessageHandler>> = new Map();
  private pendingMessages: Map<string, QueueMessage> = new Map();
  private retryQueue: QueueMessage[] = [];
  private isProcessing: boolean = false;

  constructor() {
    this.startProcessing();
    this.setupWebSocketHandler();
  }

  private setupWebSocketHandler() {
    // Listen for messages from other services via WebSocket
    wsService.on('queue_message', (data) => {
      const message: QueueMessage = {
        id: data.id || uuidv4(),
        type: data.type,
        payload: data.payload,
        timestamp: data.timestamp || Date.now(),
        retries: 0,
        maxRetries: data.maxRetries || 3
      };
      
      this.processMessage(message);
    });
  }

  public subscribe(messageType: string, handler: MessageHandler): () => void {
    if (!this.handlers.has(messageType)) {
      this.handlers.set(messageType, new Set());
    }
    
    this.handlers.get(messageType)!.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.handlers.get(messageType)?.delete(handler);
      if (this.handlers.get(messageType)?.size === 0) {
        this.handlers.delete(messageType);
      }
    };
  }

  public async publish(messageType: string, payload: any, options?: {
    delay?: number;
    maxRetries?: number;
    target?: 'local' | 'remote' | 'broadcast';
  }): Promise<void> {
    const message: QueueMessage = {
      id: uuidv4(),
      type: messageType,
      payload,
      timestamp: Date.now(),
      retries: 0,
      maxRetries: options?.maxRetries || 3,
      delay: options?.delay
    };

    const target = options?.target || 'local';

    if (target === 'remote' || target === 'broadcast') {
      // Send to other services via WebSocket
      wsService.send({
        type: 'queue_message',
        ...message
      });
    }

    if (target === 'local' || target === 'broadcast') {
      // Process locally
      if (message.delay && message.delay > 0) {
        setTimeout(() => this.processMessage(message), message.delay);
      } else {
        await this.processMessage(message);
      }
    }
  }

  private async processMessage(message: QueueMessage): Promise<void> {
    const handlers = this.handlers.get(message.type);
    
    if (!handlers || handlers.size === 0) {
      console.warn(`No handlers registered for message type: ${message.type}`);
      return;
    }

    this.pendingMessages.set(message.id, message);

    try {
      // Execute all handlers for this message type
      await Promise.all(
        Array.from(handlers).map(async (handler) => {
          try {
            await handler(message);
          } catch (error) {
            console.error(`Handler error for message ${message.id}:`, error);
            throw error;
          }
        })
      );

      // Message processed successfully
      this.pendingMessages.delete(message.id);
      console.log(`Message ${message.id} processed successfully`);
    } catch (error) {
      console.error(`Error processing message ${message.id}:`, error);
      await this.handleMessageFailure(message);
    }
  }

  private async handleMessageFailure(message: QueueMessage): Promise<void> {
    message.retries = (message.retries || 0) + 1;

    if (message.retries < (message.maxRetries || 3)) {
      // Add to retry queue with exponential backoff
      const retryDelay = Math.pow(2, message.retries) * 1000; // 2s, 4s, 8s...
      
      setTimeout(() => {
        this.retryQueue.push(message);
      }, retryDelay);
      
      console.log(`Message ${message.id} scheduled for retry ${message.retries}/${message.maxRetries}`);
    } else {
      // Message failed permanently
      this.pendingMessages.delete(message.id);
      console.error(`Message ${message.id} failed permanently after ${message.retries} retries`);
      
      // Optionally, move to dead letter queue or log for manual intervention
      this.handleDeadLetter(message);
    }
  }

  private handleDeadLetter(message: QueueMessage): void {
    // Log dead letter message for debugging
    console.error('Dead letter message:', message);
    
    // Could send to a dead letter queue service or alert monitoring
    this.publish('dead_letter', message, { target: 'remote' });
  }

  private async startProcessing(): Promise<void> {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    // Process retry queue every 5 seconds
    setInterval(() => {
      if (this.retryQueue.length > 0) {
        const message = this.retryQueue.shift();
        if (message) {
          this.processMessage(message);
        }
      }
    }, 5000);
  }

  public getStatus() {
    return {
      pendingMessages: this.pendingMessages.size,
      retryQueueSize: this.retryQueue.length,
      registeredHandlers: Array.from(this.handlers.keys()),
      isProcessing: this.isProcessing
    };
  }
}

// Create singleton instance
export const messageQueue = new MessageQueue();
