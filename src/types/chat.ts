
// Types pour le chat
export type MessageType = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  sender: 'user' | 'assistant' | 'system' | 'agent';
};

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system' | 'agent';
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
}

export type ChatProviderType = 'internal' | 'chatterpal' | 'websocket' | 'pocketbase';

export interface ChatSettings {
  apiKey?: string;
  endpoint?: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
  settings: ChatSettings;
}

export interface ChatActions {
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
}

export interface ChatStoreState extends ChatState {
  actions: ChatActions;
}

export interface ChatContextState extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  updateSettings: (settings: Partial<ChatSettings>) => void;
}

// We remove the duplicate declaration here since it's now properly defined in chatterpal.d.ts
