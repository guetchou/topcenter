
// Add the missing 'id' property to ChatMessage interface if it's not already defined
export interface ChatMessage {
  id: string;
  content: string;
  sender: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
}
