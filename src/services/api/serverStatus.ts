
/**
 * Server status utilities
 */

// Cache for server availability checks
export const serverStatusCache = {
  lastChecked: 0,
  isAvailable: true,
  checkInterval: 30000 // 30 seconds
};

/**
 * Checks if the server is accessible
 * @param force Force a fresh check regardless of cache
 * @returns Promise<boolean> indicating if server is available
 */
export const checkServerAvailability = async (force = false): Promise<boolean> => {
  const now = Date.now();
  
  // Use cached result if the last check was recent and not forced
  if (!force && (now - serverStatusCache.lastChecked < serverStatusCache.checkInterval)) {
    return serverStatusCache.isAvailable;
  }
  
  try {
    // HEAD request to a static resource that should always be available
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('/lovable-uploads/logo-topcenter.png', { 
      method: 'HEAD',
      cache: 'no-store',
      headers: { 'pragma': 'no-cache' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Update cache
    serverStatusCache.lastChecked = now;
    serverStatusCache.isAvailable = response.ok;
    
    return response.ok;
  } catch (error) {
    console.error("Server check failed:", error);
    
    // Update cache
    serverStatusCache.lastChecked = now;
    serverStatusCache.isAvailable = false;
    
    return false;
  }
};

// Export additional utility methods
export const serverStatusUtils = {
  getServerStatus: () => serverStatusCache.isAvailable,
  refreshServerStatus: () => checkServerAvailability(true),
  setCheckInterval: (interval: number) => {
    serverStatusCache.checkInterval = interval;
  }
};
