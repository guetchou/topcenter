
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError, AxiosRequestHeaders } from 'axios';
import { toast } from 'sonner';
import { serverIsAvailable, markServerAsUnavailable, markServerAsAvailable } from './api/serverStatus';
import { setupErrorHandlers } from './api/errorHandler';
import { setupInterceptors } from './api/interceptors';

// Timeout par défaut pour les requêtes
const DEFAULT_TIMEOUT = 30000;

// URL de base de l'API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Instance Axios avec configuration de base
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialisation des intercepteurs et gestionnaires d'erreurs
setupInterceptors(api);
setupErrorHandlers(api);

// Exportation de l'API
export default api;

// Réexportation des fonctions de statut du serveur
export { serverIsAvailable, markServerAsUnavailable, markServerAsAvailable };

// Fonctions utilitaires pour les requêtes simples
export const fetchData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.get<T>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

export const postData = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.post<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error posting data to ${endpoint}:`, error);
    throw error;
  }
};

export const updateData = async <T>(endpoint: string, data: any): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.put<T>(endpoint, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating data at ${endpoint}:`, error);
    throw error;
  }
};

export const deleteData = async <T>(endpoint: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.delete<T>(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error deleting data at ${endpoint}:`, error);
    throw error;
  }
};
