
// src/adapters/utils/messageConverters.ts
import { Message, MessageType } from '@/types/chat';
import { v4 as uuidv4 } from 'uuid';

/**
 * Convertit un message du format interne vers le format MessageType (pour la compatibilité)
 */
export const toMessageType = (message: Message): MessageType => {
  return {
    id: message.id,
    text: message.content,
    isUser: message.sender === 'user',
    timestamp: new Date(message.timestamp),
    status: message.status,
    sender: message.sender
  };
};

/**
 * Convertit un MessageType vers le format Message interne
 */
export const fromMessageType = (messageType: MessageType): Message => {
  return {
    id: messageType.id || uuidv4(),
    content: messageType.text,
    sender: messageType.sender,
    timestamp: messageType.timestamp.getTime(),
    status: messageType.status
  };
};

/**
 * Crée un nouveau message utilisateur
 */
export const createUserMessage = (content: string): Message => {
  return {
    id: uuidv4(),
    content,
    sender: 'user',
    timestamp: Date.now(),
    status: 'sending'
  };
};

/**
 * Crée un nouveau message assistant
 */
export const createAssistantMessage = (content: string): Message => {
  return {
    id: uuidv4(),
    content,
    sender: 'assistant',
    timestamp: Date.now()
  };
};
