
import { AxiosError } from 'axios';

// Error registry to prevent duplicate error messages
const errorRegistry = {
  errors: new Map<string, { count: number; timestamp: number }>(),
  timeout: 5000, // 5 seconds timeout before showing the same error again
  
  // Register an error and check if it should be shown
  shouldShowError(errorKey: string): boolean {
    const now = Date.now();
    const existingError = this.errors.get(errorKey);
    
    // If the error is not in the registry or the timeout has passed, show it
    if (!existingError || (now - existingError.timestamp > this.timeout)) {
      this.errors.set(errorKey, { count: 1, timestamp: now });
      return true;
    }
    
    // Increment the error count
    existingError.count += 1;
    existingError.timestamp = now;
    this.errors.set(errorKey, existingError);
    
    // Only show every 5th occurrence within timeout to avoid spam
    return existingError.count % 5 === 0;
  },
  
  // Clear old errors from registry
  clearOldErrors(): void {
    const now = Date.now();
    this.errors.forEach((value, key) => {
      if (now - value.timestamp > this.timeout) {
        this.errors.delete(key);
      }
    });
  }
};

/**
 * Handle API errors consistently across the application
 * @param error The axios error to handle
 * @returns The processed error
 */
export const handleApiError = (error: AxiosError): Error => {
  // Clear old errors
  errorRegistry.clearOldErrors();
  
  // Extract error details
  let errorMessage = 'An unexpected error occurred';
  let errorCode = 'UNKNOWN_ERROR';
  
  if (error.response) {
    // Server responded with a status code outside of 2xx range
    errorCode = `HTTP_${error.response.status}`;
    
    const data = error.response.data as any;
    errorMessage = data?.message || 
                  data?.error || 
                  `Request failed with status code ${error.response.status}`;
  } else if (error.request) {
    // Request was made but no response was received
    errorCode = 'NO_RESPONSE';
    errorMessage = 'No response received from server';
  } else if (error.message) {
    // Error setting up the request
    errorCode = 'REQUEST_SETUP_ERROR';
    errorMessage = error.message;
  }
  
  // Create a unique key for this error
  const errorKey = `${errorCode}:${errorMessage}`;
  
  // Determine if this error should be shown to the user
  const shouldShowToUser = errorRegistry.shouldShowError(errorKey);
  
  // Create custom error object
  const customError = new Error(errorMessage) as Error & { 
    code?: string; 
    shouldShowToUser?: boolean;
    originalError?: AxiosError;
  };
  
  customError.code = errorCode;
  customError.shouldShowToUser = shouldShowToUser;
  customError.originalError = error;
  
  return customError;
};

// Export utility methods
export const errorHandlerUtils = {
  clearErrorRegistry: (): void => {
    errorRegistry.errors.clear();
  },
  getRegisteredErrors: (): Map<string, { count: number; timestamp: number }> => {
    return new Map(errorRegistry.errors);
  },
  setErrorTimeout: (timeout: number): void => {
    errorRegistry.timeout = timeout;
  }
};
