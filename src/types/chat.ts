
export interface MessageType {
  text: string;
  isUser: boolean;
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
  handleSendMessage: () => Promise<void>;
  transferToHuman: () => void;
}
