
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { toast } from 'sonner';

// Timeout par défaut pour les requêtes
const DEFAULT_TIMEOUT = 30000;

// URL de base de l'API backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Instance Axios avec configuration de base
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur de requête pour ajouter le token d'authentification
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && token !== 'dev-mode-token') {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse pour gérer les erreurs
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('auth_token');
      toast.error('Session expirée', {
        description: 'Veuillez vous reconnecter'
      });
    } else if (error.response?.status >= 500) {
      toast.error('Erreur serveur', {
        description: 'Une erreur est survenue sur le serveur'
      });
    }
    
    return Promise.reject(error);
  }
);

export default api;

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
