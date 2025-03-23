
// src/types/chat.ts
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant' | 'system' | 'agent';
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
  attachments?: Attachment[];
  metadata?: Record<string, any>;
}

export interface Attachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video';
  url: string;
  name: string;
  size?: number;
  mimeType?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  icon: string;
  unreadCount: number;
  lastMessage?: Message;
}

export interface ChatSession {
  id: string;
  channel: ChatChannel;
  messages: Message[];
  metadata?: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface ChatState {
  activeChatId: string | null;
  sessions: Record<string, ChatSession>;
  isOpen: boolean;
  isMinimized: boolean;
}

export type ChatAction = 
  | { type: 'SEND_MESSAGE'; chatId: string; message: Message }
  | { type: 'RECEIVE_MESSAGE'; chatId: string; message: Message }
  | { type: 'OPEN_CHAT' }
  | { type: 'CLOSE_CHAT' }
  | { type: 'MINIMIZE_CHAT' }
  | { type: 'MAXIMIZE_CHAT' }
  | { type: 'SET_ACTIVE_CHAT'; chatId: string }
  | { type: 'CREATE_SESSION'; session: ChatSession }
  | { type: 'DELETE_SESSION'; chatId: string };

// Interface MessageType compatible with Message
export interface MessageType {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  sender: 'user' | 'agent';
}

// Declare global interface for ChatPal without duplicate modifiers
declare global {
  interface Window {
    chatPal?: {
      sendMessage: (message: string) => void;
      destroy: () => void;
    };
    ChatPal?: new (config: any) => any;
  }
}
