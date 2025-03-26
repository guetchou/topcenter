
import axios from 'axios';
import { setupInterceptors } from './interceptors';
import { setupErrorHandlers } from './errorHandler';
import { markServerAsAvailable, markServerAsUnavailable, serverIsAvailable, testServerAvailability } from './serverStatus';

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
  markServerAsUnavailable,
  testServerAvailability
};

// Fonctions utilitaires pour les requêtes simples
export const fetchData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await api.get<T>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const postData = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await api.post<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};

export const updateData = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response = await api.put<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error;
  }
};

export const deleteData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response = await api.delete<T>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error);
    throw error;
  }
};

// Réexportation des fonctions de statut du serveur
export { serverIsAvailable, markServerAsUnavailable, markServerAsAvailable };

export default api;
