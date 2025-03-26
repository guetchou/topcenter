
import axios from 'axios';
import { handleApiError, setupErrorHandlers } from './errorHandler';

// Configuration de base de l'API
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Création de l'instance axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 secondes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Configuration des intercepteurs pour les erreurs
setupErrorHandlers(api);

// Module auth
const auth = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  checkSession: async () => {
    try {
      const response = await api.get('/auth/session');
      return response.data;
    } catch (error) {
      // Ne pas afficher d'erreur pour les vérifications de session
      return { authenticated: false };
    }
  }
};

// Module database
const database = {
  connect: async (connectionInfo) => {
    try {
      const response = await api.post('/database/connect', connectionInfo);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  query: async (sql, params = {}) => {
    try {
      const response = await api.post('/database/query', { sql, params });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getDatabases: async () => {
    try {
      const response = await api.get('/db-explorer/databases');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getTables: async (database) => {
    try {
      const response = await api.get(`/db-explorer/databases/${database}/tables`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getColumns: async (database, table) => {
    try {
      const response = await api.get(`/db-explorer/databases/${database}/tables/${table}/columns`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

// Module deploy
const deploy = {
  getStatus: async () => {
    try {
      const response = await api.get('/deploy/status');
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  triggerDeploy: async (options = {}) => {
    try {
      const response = await api.post('/deploy/trigger', options);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getLogs: async (deployId) => {
    try {
      const response = await api.get(`/deploy/${deployId}/logs`);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

// Export des modules
export default {
  api,
  auth,
  database,
  deploy
};
