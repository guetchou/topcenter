
// État de disponibilité du serveur
let isServerAvailable = true;

// Dernière fois que le statut a été mis à jour
let lastStatusUpdate = Date.now();

// Temps minimum entre les notifications (5 minutes)
const NOTIFICATION_THROTTLE = 5 * 60 * 1000;

/**
 * Vérifie si le serveur est disponible
 */
export function serverIsAvailable(): boolean {
  return isServerAvailable;
}

/**
 * Marquer le serveur comme indisponible
 */
export function markServerAsUnavailable(): void {
  const now = Date.now();
  
  // Ne mettre à jour le statut que si nous étions auparavant disponibles
  // ou si assez de temps s'est écoulé depuis la dernière notification
  if (isServerAvailable || (now - lastStatusUpdate > NOTIFICATION_THROTTLE)) {
    isServerAvailable = false;
    lastStatusUpdate = now;
    
    // Déclencher un événement personnalisé pour notifier l'application
    const event = new CustomEvent('server-status-change', { 
      detail: { available: false } 
    });
    window.dispatchEvent(event);
    
    console.warn('API server is unavailable');
  }
}

/**
 * Marquer le serveur comme disponible
 */
export function markServerAsAvailable(): void {
  const now = Date.now();
  
  // Ne mettre à jour le statut que si nous étions auparavant indisponibles
  // ou si assez de temps s'est écoulé depuis la dernière notification
  if (!isServerAvailable || (now - lastStatusUpdate > NOTIFICATION_THROTTLE)) {
    isServerAvailable = true;
    lastStatusUpdate = now;
    
    // Déclencher un événement personnalisé pour notifier l'application
    const event = new CustomEvent('server-status-change', { 
      detail: { available: true } 
    });
    window.dispatchEvent(event);
    
    console.info('API server is available');
  }
}

/**
 * Fonction pour tester manuellement la disponibilité du serveur
 */
export async function testServerAvailability(apiInstance: any): Promise<boolean> {
  try {
    await apiInstance.get('/health');
    markServerAsAvailable();
    return true;
  } catch (error) {
    markServerAsUnavailable();
    return false;
  }
}
