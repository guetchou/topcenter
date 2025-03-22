
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { serverStatusCache } from './serverStatus';

// Error registry to avoid repeated toasts
const errorRegistry = new Map<string, number>();
const ERROR_COOLDOWN = 30000; // 30 seconds

/**
 * Registers an error in the error registry to prevent duplicate toasts
 * @param errorKey The unique key for the error
 * @returns boolean indicating if this is a new error
 */
export const registerError = (errorKey: string): boolean => {
  const now = Date.now();
  
  // Check if this error was already shown recently
  if (errorRegistry.has(errorKey) && (now - errorRegistry.get(errorKey)! <= ERROR_COOLDOWN)) {
    return false; // Not a new error
  }
  
  // Register the error
  errorRegistry.set(errorKey, now);
  
  // Clean up error registry periodically
  setTimeout(() => {
    errorRegistry.delete(errorKey);
  }, ERROR_COOLDOWN);
  
  return true; // New error
};

/**
 * Handle API error and show appropriate toast message
 * @param error The error object
 * @returns The processed error
 */
export const handleApiError = (error: AxiosError): Error => {
  // Extract error message from response data if available
  const errorData = error.response?.data as Record<string, unknown> | undefined;
  const errorMessage = errorData?.message as string || error.message || 'unknown-error';
  const errorKey = `${error.code || ''}-${errorMessage}`;
  
  // Only show toast if this is a new error
  if (!registerError(errorKey)) {
    return error;
  }
  
  // Handle offline or network errors
  if (!navigator.onLine || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    toast.error('You are offline or the server is unreachable. Some features may be limited.');
    serverStatusCache.isAvailable = false;
    serverStatusCache.lastChecked = Date.now();
    return new Error('The service is temporarily unavailable. Please try again later.');
  }
  
  // Handle HTTP error statuses
  if (error.response) {
    const { status } = error.response;
    
    // Authentication errors (401)
    if (status === 401) {
      localStorage.removeItem('auth_token');
      toast.error('Session expired. Please login again.', {
        action: {
          label: 'Login',
          onClick: () => window.location.href = '/login'
        }
      });
      return new Error('Session expired. Please login again.');
    }
    
    // Service unavailable (503)
    if (status === 503) {
      serverStatusCache.isAvailable = false;
      serverStatusCache.lastChecked = Date.now();
      return new Error('The service is temporarily unavailable. Please try again later.');
    }
    
    // Server errors (500+)
    if (status >= 500) {
      return new Error('A server error occurred. Please try again later.');
    }
    
    // Show toast for other error codes
    const displayMessage = errorData?.message as string || 'An error occurred';
    toast.error(displayMessage);
  }
  
  return error;
};

// Export additional utility methods
export const errorHandlerUtils = {
  resetErrorRegistry: () => errorRegistry.clear()
};
