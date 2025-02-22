
// @ts-nocheck
import React from 'react';

interface ChatToolbarProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  handleAttachFile: () => void;
  handleVoiceMessage: () => void;
}

export const ChatToolbar = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  handleAttachFile,
  handleVoiceMessage
}: ChatToolbarProps) => {
  return (
    <div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
      <button onClick={handleAttachFile}>Attach File</button>
      <button onClick={handleVoiceMessage}>Voice Message</button>
    </div>
  );
};
