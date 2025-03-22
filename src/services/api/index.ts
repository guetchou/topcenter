
import axios from 'axios';
import { setupRequestInterceptor, setupResponseInterceptor } from './interceptors';
import { checkServerAvailability, serverStatusUtils } from './serverStatus';
import { errorHandlerUtils } from './errorHandler';

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

// Setup interceptors
setupRequestInterceptor(api);
setupResponseInterceptor(api);

// Export combined API utilities
export const apiUtils = {
  checkServerAvailability,
  ...serverStatusUtils,
  ...errorHandlerUtils
};

export default api;
