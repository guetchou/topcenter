
// Types pour les Progressive Web Apps

// Type pour l'événement beforeinstallprompt
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

// Étendre la déclaration de Window pour les événements PWA
interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent;
  appinstalled: Event;
}

// Type pour les événements du Service Worker
interface ServiceWorkerEventMap extends ExtendableEventInit {
  sync: SyncEvent;
  periodicsync: PeriodicSyncEvent;
  push: PushEvent;
  notificationclick: NotificationEvent;
  notificationclose: NotificationEvent;
  message: ExtendableMessageEvent;
}

// Type pour les enregistrements du Service Worker
interface ServiceWorkerRegistrationOptions {
  scope?: string;
  type?: 'classic' | 'module';
  updateViaCache?: 'imports' | 'all' | 'none';
}

// Type pour les éléments de cache
interface CacheQueryOptions {
  ignoreSearch?: boolean;
  ignoreMethod?: boolean;
  ignoreVary?: boolean;
  cacheName?: string;
}

// Type pour les notifications
interface NotificationOptions {
  actions?: NotificationAction[];
  badge?: string;
  body?: string;
  data?: any;
  dir?: 'auto' | 'ltr' | 'rtl';
  icon?: string;
  image?: string;
  lang?: string;
  renotify?: boolean;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  timestamp?: number;
  vibrate?: VibratePattern;
}

// Type pour la syndication périodique
interface PeriodicSyncManager {
  register(tag: string, options?: { minInterval: number }): Promise<void>;
  unregister(tag: string): Promise<void>;
  getTags(): Promise<string[]>;
}

// Étendre ServiceWorkerRegistration pour PeriodicSync
interface ServiceWorkerRegistration {
  readonly periodicSync?: PeriodicSyncManager;
  showNotification(title: string, options?: NotificationOptions): Promise<void>;
}
