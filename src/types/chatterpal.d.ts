
interface ChatPalOptions {
  embedId: string;
  remoteBaseUrl: string;
  version: string;
  containerSelector?: string;
  position?: string;
  width?: string;
  height?: string;
  language?: string;
}

interface ChatPal {
  destroy: () => void;
}

interface Window {
  ChatPal: new (options: ChatPalOptions) => ChatPal;
  chatPal?: ChatPal;
}
