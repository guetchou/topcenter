
import { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { serverIsAvailable, markServerAsAvailable } from './serverStatus';

/**
 * Sets up request and response interceptors for an Axios instance
 * @param api The Axios instance to configure
 */
export const setupInterceptors = (api: AxiosInstance): void => {
  // Request interceptor
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add authentication token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Add timestamp to prevent caching for GET requests
      if (config.method === 'get') {
        config.params = {
          ...config.params,
          _t: Date.now()
        };
      }
      
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );
  
  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      // Mark server as available on successful response
      if (!serverIsAvailable()) {
        markServerAsAvailable();
      }
      
      // Add any additional response processing here
      return response;
    },
    (error) => {
      // Let the error handler deal with errors
      return Promise.reject(error);
    }
  );
};
