
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CustomAxiosRequestConfig } from '@/types/api';
import { serverIsAvailable, markServerAsUnavailable } from './serverStatus';
import { setupErrorHandlers } from './errorHandler';
import { setupInterceptors } from './interceptors';

/**
 * Create a new Axios instance with default configuration
 * @param baseURL The base URL for API requests
 * @param config Additional Axios configuration
 * @returns Configured Axios instance
 */
export const createApiClient = (
  baseURL: string = import.meta.env.VITE_API_URL || '/api',
  config: AxiosRequestConfig = {}
): AxiosInstance => {
  // Create a new Axios instance with provided configuration
  const api = axios.create({
    baseURL,
    timeout: 30000, // Default timeout: 30 seconds
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...config,
  });

  // Set up request and response interceptors
  setupInterceptors(api);
  setupErrorHandlers(api);

  return api;
};

// Create a default API client instance
export const apiClient = createApiClient();

/**
 * Perform a GET request with the API client
 * @param url The endpoint URL
 * @param config Optional Axios request configuration
 * @returns Promise with the response data
 */
export const get = async <T>(url: string, config?: CustomAxiosRequestConfig): Promise<T> => {
  return apiClient.get<T, AxiosResponse<T>>(url, config)
    .then(response => response.data);
};

/**
 * Perform a POST request with the API client
 * @param url The endpoint URL
 * @param data The data to send in the request body
 * @param config Optional Axios request configuration
 * @returns Promise with the response data
 */
export const post = async <T>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T> => {
  return apiClient.post<T, AxiosResponse<T>>(url, data, config)
    .then(response => response.data);
};

/**
 * Perform a PUT request with the API client
 * @param url The endpoint URL
 * @param data The data to send in the request body
 * @param config Optional Axios request configuration
 * @returns Promise with the response data
 */
export const put = async <T>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T> => {
  return apiClient.put<T, AxiosResponse<T>>(url, data, config)
    .then(response => response.data);
};

/**
 * Perform a PATCH request with the API client
 * @param url The endpoint URL
 * @param data The data to send in the request body
 * @param config Optional Axios request configuration
 * @returns Promise with the response data
 */
export const patch = async <T>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<T> => {
  return apiClient.patch<T, AxiosResponse<T>>(url, data, config)
    .then(response => response.data);
};

/**
 * Perform a DELETE request with the API client
 * @param url The endpoint URL
 * @param config Optional Axios request configuration
 * @returns Promise with the response data
 */
export const del = async <T>(url: string, config?: CustomAxiosRequestConfig): Promise<T> => {
  return apiClient.delete<T, AxiosResponse<T>>(url, config)
    .then(response => response.data);
};

export default {
  client: apiClient,
  get,
  post,
  put,
  patch,
  delete: del
};
