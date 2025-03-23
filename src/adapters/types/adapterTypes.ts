
// src/adapters/types/adapterTypes.ts
import { Message } from '@/types/chat';

// Types d'adaptateurs de chat supportés
export type ChatProviderType = 'internal' | 'chatterpal' | 'external' | 'websocket';

// Configuration pour l'adaptateur
export interface ChatAdapterConfig {
  provider: ChatProviderType;
  apiUrl?: string;
  headers?: Record<string, string>;
  authToken?: string;
  wsUrl?: string;
}

// Interface de l'adaptateur
export interface ChatAdapterInterface {
  sendMessage: (content: string) => Promise<Message>;
  getMessages: () => Promise<Message[]>;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<void>;
  onMessageReceived?: (callback: (message: Message) => void) => void;
}
