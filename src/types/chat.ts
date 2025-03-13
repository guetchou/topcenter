
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

declare global {
  interface Window {
    ChatPal?: any;
    chatPal?: any;
    SpeechRecognition?: typeof SpeechRecognition;
    webkitSpeechRecognition?: typeof SpeechRecognition;
  }
}
