
/**
 * Utilitaires pour la gestion des fonctionnalités PWA
 */

// Vérifie si l'application est exécutée en mode standalone (installée)
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         // @ts-ignore - propriété non standard mais utilisée par certains navigateurs
         (window.navigator.standalone === true);
};

// Vérifie si le Service Worker est pris en charge
export const isServiceWorkerSupported = (): boolean => {
  return 'serviceWorker' in navigator;
};

// Vérifie si les notifications sont prises en charge et autorisées
export const areNotificationsAvailable = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  
  // Si la permission n'est pas définie, on demande
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Erreur lors de la demande de permission de notification', error);
    return false;
  }
};

// Vérifie si l'installation d'application est prise en charge
export const isAppInstallSupported = (): boolean => {
  return window.matchMedia('(display-mode: browser)').matches && 
         'BeforeInstallPromptEvent' in window;
};

// Envoie un message au Service Worker
export const sendMessageToSW = (message: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!navigator.serviceWorker.controller) {
      reject(new Error('No active Service Worker'));
      return;
    }

    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data);
    };

    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
  });
};

// Vérifie si l'actualisation de contenu est nécessaire en cas de mise à jour de SW
export const checkForContentUpdate = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.waiting) {
      // Il y a un nouveau service worker en attente
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erreur lors de la vérification des mises à jour', error);
    return false;
  }
};

// Force l'installation du nouveau Service Worker
export const updateServiceWorker = async (): Promise<void> => {
  const registration = await navigator.serviceWorker.ready;
  
  if (registration.waiting) {
    // Si un nouveau SW attend, on lui envoie un message pour qu'il prenne le contrôle
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    // Sinon on force la vérification d'une mise à jour
    await registration.update();
  }
};

// Précharge et met en cache des ressources importantes
export const prefetchImportantResources = async (urls: string[]): Promise<void> => {
  if (!isServiceWorkerSupported()) return;
  
  try {
    await sendMessageToSW({
      type: 'CACHE_RESOURCES',
      payload: { urls }
    });
  } catch (error) {
    console.warn('Échec de la précharge des ressources', error);
  }
};

// Met à jour les données hors ligne
export const updateOfflineData = async (): Promise<void> => {
  if (!isServiceWorkerSupported()) return;
  
  try {
    await sendMessageToSW({ type: 'UPDATE_OFFLINE_DATA' });
  } catch (error) {
    console.warn('Échec de la mise à jour des données hors ligne', error);
  }
};
