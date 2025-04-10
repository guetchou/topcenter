
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'sonner';
import { serverIsAvailable, markServerAsUnavailable, markServerAsAvailable } from './serverStatus';
import { setupErrorHandlers } from './errorHandler';
import { setupInterceptors } from './interceptors';
import { CustomAxiosRequestConfig } from '@/types/api';

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

// Fonction pour vérifier la disponibilité du serveur de manière silencieuse
export const checkServerHealth = async () => {
  try {
    if (connectionAttempts >= maxConnectionAttempts) {
      // Si trop de tentatives ont échoué, on ne réessaie plus pour éviter de ralentir l'application
      return false;
    }
    
    const response = await api.get('/health', { 
      timeout: 3000,
      // Ne pas déclencher les gestionnaires d'erreurs globaux pour cette requête
      silentError: true 
    } as CustomAxiosRequestConfig);
    
    if (response.status === 200) {
      markServerAsAvailable();
      connectionAttempts = 0;
      return true;
    } else {
      markServerAsUnavailable();
      connectionAttempts++;
      return false;
    }
  } catch (error) {
    console.log("Serveur API non disponible, utilisation des données de secours");
    markServerAsUnavailable();
    connectionAttempts++;
    return false;
  }
};

// Variable pour suivre les tentatives de connexion
let connectionAttempts = 0;
const maxConnectionAttempts = 3;

// Exécuter une vérification initiale de la santé du serveur
checkServerHealth();

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
