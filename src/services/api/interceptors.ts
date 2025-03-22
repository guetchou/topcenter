
import { InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance, AxiosHeaders } from 'axios';
import { checkServerAvailability } from './serverStatus';
import { handleApiError } from './errorHandler';

/**
 * Setup request interceptor for an Axios instance
 * @param axiosInstance The Axios instance to configure
 */
export const setupRequestInterceptor = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.request.use(
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
        // Ensure headers is an AxiosHeaders instance
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

/**
 * Setup response interceptor for an Axios instance
 * @param axiosInstance The Axios instance to configure
 */
export const setupResponseInterceptor = (axiosInstance: AxiosInstance): void => {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      return Promise.reject(handleApiError(error));
    }
  );
};
