
import axios from 'axios';
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
let lastServerCheck = 0;
let lastServerStatus = true;
const SERVER_CHECK_INTERVAL = 30000; // 30 seconds

// Utility function to check if the server is accessible
const checkServerAvailability = async (force = false) => {
  const now = Date.now();
  
  // Use cached result if the last check was recent
  if (!force && now - lastServerCheck < SERVER_CHECK_INTERVAL) {
    return lastServerStatus;
  }
  
  try {
    // HEAD request to a static resource that should always be available
    const response = await fetch('/lovable-uploads/logo-topcenter.png', { 
      method: 'HEAD',
      cache: 'no-store',
      headers: { 'pragma': 'no-cache' },
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    
    lastServerCheck = now;
    lastServerStatus = response.ok;
    return response.ok;
  } catch (error) {
    console.error("Server check failed:", error);
    lastServerCheck = now;
    lastServerStatus = false;
    return false;
  }
};

// Request interceptor to add auth token and check connectivity
api.interceptors.request.use(async (config) => {
  // Check if online before sending request
  if (!navigator.onLine) {
    return Promise.reject(
      new Error('You are currently offline. Please reconnect to the internet.')
    );
  }
  
  // For authentication or important routes, also check server availability
  if (config.url?.includes('/auth/') || config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    const isServerAvailable = await checkServerAvailability();
    if (!isServerAvailable) {
      return Promise.reject(
        new Error('The service is temporarily unavailable. Please try again later.')
      );
    }
  }
  
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Error registry to avoid repeated toasts
const errorRegistry = new Map();
const ERROR_COOLDOWN = 30000; // 30 seconds

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorKey = error.message || 'unknown-error';
    const now = Date.now();
    
    // Check if this error was already shown recently
    if (!errorRegistry.has(errorKey) || now - errorRegistry.get(errorKey) > ERROR_COOLDOWN) {
      // Register the error
      errorRegistry.set(errorKey, now);
      
      // Clean up error registry periodically
      setTimeout(() => {
        errorRegistry.delete(errorKey);
      }, ERROR_COOLDOWN);
      
      // Handle offline or network errors
      if (!navigator.onLine || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('You are offline or the server is unreachable. Some features may be limited.');
        // Update server status
        lastServerStatus = false;
        lastServerCheck = now;
        return Promise.reject(new Error('The service is temporarily unavailable. Please try again later.'));
      }
      
      // Handle HTTP error statuses
      if (error.response) {
        // Authentication errors (401)
        if (error.response.status === 401) {
          localStorage.removeItem('auth_token');
          // Show toast instead of auto-redirect to avoid interrupting user experience
          toast.error('Session expired. Please login again.', {
            action: {
              label: 'Login',
              onClick: () => window.location.href = '/login'
            }
          });
          return Promise.reject(new Error('Session expired. Please login again.'));
        }
        
        // Service unavailable (503)
        if (error.response.status === 503) {
          // Update server status
          lastServerStatus = false;
          lastServerCheck = now;
          return Promise.reject(new Error('The service is temporarily unavailable. Please try again later.'));
        }
        
        // Server errors (500+)
        if (error.response.status >= 500) {
          return Promise.reject(new Error('A server error occurred. Please try again later.'));
        }
        
        // Show toast for other error codes
        const errorMessage = error.response.data?.message || 'An error occurred';
        toast.error(errorMessage);
      }
    }
    
    return Promise.reject(error);
  }
);

// Export additional utility methods
export const apiUtils = {
  checkServerAvailability,
  resetErrorRegistry: () => errorRegistry.clear(),
  getLastServerStatus: () => lastServerStatus,
  refreshServerStatus: () => checkServerAvailability(true)
};

export default api;
