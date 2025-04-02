
// Déclarations globales pour les types manquants

// Extension de Window pour ChatPal
interface Window {
  ChatPal?: any;
  chatPal?: any;
}

// Compatibilité avec les imports de modules sans types
declare module '*.css';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.json';

// Pour les bibliothèques sans types
declare module '@tiptap/pm/*';
declare module 'cmdk';
declare module 'input-otp';
declare module 'vaul';
