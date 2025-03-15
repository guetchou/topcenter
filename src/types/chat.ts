
export interface MessageType {
  text: string;
  isUser: boolean;
  timestamp?: Date;
  status?: 'sending' | 'sent' | 'error';
  type?: 'text' | 'suggestion' | 'quick_reply';
}

export interface QuickReply {
  text: string;
  action: string;
}

export interface ChatContextType {
  message: string;
  setMessage: (message: string) => void;
  messages: MessageType[];
  setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>;
  isLoading: boolean;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  transferring: boolean;
  systemContext: string;
  lastSentimentScore: number;
  handleSendMessage: () => Promise<void>;
  transferToHuman: () => void;
}

// Fixed interface for ChatPal options
export interface ChatPalOptions {
  embedId: string;
  remoteBaseUrl: string;
  version: string;
  containerSelector?: string;
  position?: string;
  width?: string;
  height?: string;
  language?: string;
}

// Fixed class definition
export interface ChatPal {
  destroy: () => void;
}

// Fixed global declaration
declare global {
  interface Window {
    ChatPal: new (options: ChatPalOptions) => ChatPal;
    chatPal?: ChatPal;
  }
}
