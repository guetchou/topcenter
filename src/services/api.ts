
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from 'sonner';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Cache for server availability checks
const serverStatusCache = {
  lastChecked: 0,
  isAvailable: true,
  checkInterval: 30000 // 30 seconds
};

// Error registry to avoid repeated toasts
const errorRegistry = new Map<string, number>();
const ERROR_COOLDOWN = 30000; // 30 seconds

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

/**
 * Registers an error in the error registry to prevent duplicate toasts
 * @param errorKey The unique key for the error
 * @returns boolean indicating if this is a new error
 */
const registerError = (errorKey: string): boolean => {
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
const handleApiError = (error: AxiosError): Error => {
  const errorMessage = error.response?.data && typeof error.response.data === 'object' 
    ? (error.response.data as any).message || 'unknown-error'
    : error.message || 'unknown-error';
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
    const displayMessage = error.response.data && typeof error.response.data === 'object' 
      ? (error.response.data as any).message || 'An error occurred'
      : 'An error occurred';
    toast.error(displayMessage);
  }
  
  return error;
};

// Request interceptor to add auth token and check connectivity
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check if online before sending request
    if (!navigator.onLine) {
      return Promise.reject(
        new Error('You are currently offline. Please reconnect to the internet.')
      );
    }
    
    // For authentication or important routes, also check server availability
    const isImportantRoute = 
      config.url?.includes('/auth/') || 
      config.method === 'post' || 
      config.method === 'put' || 
      config.method === 'delete';
      
    if (isImportantRoute) {
      const isServerAvailable = await checkServerAvailability();
      if (!isServerAvailable) {
        return Promise.reject(
          new Error('The service is temporarily unavailable. Please try again later.')
        );
      }
    }
    
    // Add authentication token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    return Promise.reject(handleApiError(error));
  }
);

// Export additional utility methods
export const apiUtils = {
  checkServerAvailability,
  resetErrorRegistry: () => errorRegistry.clear(),
  getServerStatus: () => serverStatusCache.isAvailable,
  refreshServerStatus: () => checkServerAvailability(true),
  setCheckInterval: (interval: number) => {
    serverStatusCache.checkInterval = interval;
  }
};

export default api;
