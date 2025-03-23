
import { v4 as uuidv4 } from 'uuid';
import { useNotifications } from '@/components/notifications/NotificationsProvider';

type MessageHandler = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private url: string;
  private reconnectAttempts: number = 0;
  private reconnectTimeout: number | null = null;
  private messageHandlers: Map<string, Set<MessageHandler>> = new Map();
  private isConnecting: boolean = false;
  private clientId: string = uuidv4();
  
  constructor(url: string) {
    this.url = url;
  }

  /**
   * Connect to the WebSocket server
   */
  public connect(notify?: boolean): Promise<boolean> {
    if (this.socket?.readyState === WebSocket.OPEN) {
      return Promise.resolve(true);
    }
    
    if (this.isConnecting) {
      return new Promise((resolve) => {
        const checkConnection = setInterval(() => {
          if (this.socket?.readyState === WebSocket.OPEN) {
            clearInterval(checkConnection);
            resolve(true);
          }
        }, 100);
      });
    }
    
    this.isConnecting = true;
    
    return new Promise((resolve) => {
      try {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          console.log('WebSocket Connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          
          // Send identification message
          this.send({
            type: 'register',
            clientId: this.clientId,
            timestamp: Date.now()
          });
          
          if (notify) {
            try {
              // Only attempt to use notifications if available (may not be in all contexts)
              const { addNotification } = useNotifications();
              addNotification(
                "Connexion établie", 
                "Vous êtes maintenant connecté au service en temps réel", 
                "success"
              );
            } catch (e) {
              console.log('Notifications not available in this context');
            }
          }
          
          resolve(true);
        };

        this.socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('WebSocket Message:', data);
            
            // Dispatch message to all handlers for this message type
            if (data.type && this.messageHandlers.has(data.type)) {
              const handlers = this.messageHandlers.get(data.type);
              handlers?.forEach(handler => handler(data));
            }
            
            // Also dispatch to '*' handlers that receive all messages
            if (this.messageHandlers.has('*')) {
              const handlers = this.messageHandlers.get('*');
              handlers?.forEach(handler => handler(data));
            }
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.socket.onclose = () => {
          console.log('WebSocket Disconnected');
          this.isConnecting = false;
          
          // Clear any existing reconnect timeout
          if (this.reconnectTimeout !== null) {
            clearTimeout(this.reconnectTimeout);
          }
          
          // Calculate reconnect delay with exponential backoff
          const delay = Math.min(30000, Math.pow(1.5, this.reconnectAttempts) * 1000);
          this.reconnectAttempts++;
          
          this.reconnectTimeout = window.setTimeout(() => this.connect(), delay);
          resolve(false);
        };
        
        this.socket.onerror = (error) => {
          console.error('WebSocket Error:', error);
          this.isConnecting = false;
          resolve(false);
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        this.isConnecting = false;
        resolve(false);
      }
    });
  }

  /**
   * Send a message to the WebSocket server
   */
  public send(message: any): boolean {
    if (this.socket?.readyState === WebSocket.OPEN) {
      try {
        // Add client ID to message
        const fullMessage = {
          ...message,
          clientId: this.clientId
        };
        
        this.socket.send(JSON.stringify(fullMessage));
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    } else {
      console.warn('WebSocket not connected. Attempting to connect...');
      this.connect().then(connected => {
        if (connected) {
          this.send(message);
        }
      });
      return false;
    }
  }

  /**
   * Close the WebSocket connection
   */
  public close(): void {
    if (this.reconnectTimeout !== null) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
  
  /**
   * Register a message handler
   * @param messageType The type of message to handle, or '*' for all messages
   * @param handler The handler function
   */
  public on(messageType: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(messageType)) {
      this.messageHandlers.set(messageType, new Set());
    }
    
    this.messageHandlers.get(messageType)?.add(handler);
    
    // Return a function to remove this handler
    return () => {
      this.messageHandlers.get(messageType)?.delete(handler);
      
      // Clean up empty sets
      if (this.messageHandlers.get(messageType)?.size === 0) {
        this.messageHandlers.delete(messageType);
      }
    };
  }
  
  /**
   * Get the client ID
   */
  public getClientId(): string {
    return this.clientId;
  }
  
  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// Create default websocket service
export const wsService = new WebSocketService('wss://echo.websocket.org');
