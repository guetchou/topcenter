
import axios from 'axios';
import { setupInterceptors } from './interceptors';
import { setupErrorHandlers } from './errorHandler';
import { markServerAsAvailable, markServerAsUnavailable, serverIsAvailable } from './serverStatus';

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
setupInterceptors(api);
setupErrorHandlers(api);

// Export combined API utilities
export const apiUtils = {
  serverIsAvailable,
  markServerAsAvailable,
  markServerAsUnavailable
};

export default api;
