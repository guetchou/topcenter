
interface ChatPalInstance {
  destroy: () => void;
  sendMessage: (content: string) => void;
}

interface ChatPalOptions {
  embedId: string;
  remoteBaseUrl: string;
  version: string;
  containerSelector?: string;
  position?: 'internal' | 'fixed';
  width?: string;
  height?: string;
}

interface ChatPalConstructor {
  new (options: ChatPalOptions): ChatPalInstance;
}

declare global {
  interface Window {
    ChatPal: ChatPalConstructor;
    chatPal?: ChatPalInstance;
  }
}

export {};
