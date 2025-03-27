import axios, { AxiosInstance } from 'axios';
import { handleApiError, setupErrorHandlers } from './errorHandler';

// Configuration de base de l'API
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Création de l'instance axios
const apiInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 secondes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Configuration des intercepteurs pour les erreurs
setupErrorHandlers(apiInstance);

// Fonctions de base de l'API
const apiClient = {
  get: async (url: string, config = {}) => {
    try {
      const response = await apiInstance.get(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  post: async (url: string, data = {}, config = {}) => {
    try {
      const response = await apiInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  put: async (url: string, data = {}, config = {}) => {
    try {
      const response = await apiInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  patch: async (url: string, data = {}, config = {}) => {
    try {
      const response = await apiInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  delete: async (url: string, config = {}) => {
    try {
      const response = await apiInstance.delete(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

// Module auth
const auth = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  checkSession: async () => {
    try {
      const response = await apiClient.get('/auth/session');
      return response;
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
      const response = await apiClient.post('/database/connect', connectionInfo);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  query: async (sql, params = {}) => {
    try {
      const response = await apiClient.post('/database/query', { sql, params });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getDatabases: async () => {
    try {
      const response = await apiClient.get('/db-explorer/databases');
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getTables: async (database) => {
    try {
      const response = await apiClient.get(`/db-explorer/databases/${database}/tables`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getColumns: async (database, table) => {
    try {
      const response = await apiClient.get(`/db-explorer/databases/${database}/tables/${table}/columns`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

// Module deploy - Amélioré avec de nouvelles fonctionnalités
const deploy = {
  getStatus: async () => {
    try {
      const response = await apiClient.get('/deploy/status');
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  triggerDeploy: async (options = {}) => {
    try {
      const response = await apiClient.post('/deploy/trigger', options);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  getLogs: async (deployId: string) => {
    try {
      const response = await apiClient.get(`/deploy/${deployId}/logs`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Nouvelles fonctions pour l'intégration GitHub Actions
  getGithubWorkflows: async (owner: string, repo: string) => {
    try {
      const response = await apiClient.get(`/deploy/github/workflows?owner=${owner}&repo=${repo}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  triggerGithubWorkflow: async (owner: string, repo: string, workflowId: string, options = {}) => {
    try {
      const response = await apiClient.post(`/deploy/github/workflows/${workflowId}/dispatch`, {
        owner,
        repo,
        ...options
      });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Fonctions pour les sauvegardes
  getBackups: async () => {
    try {
      const response = await apiClient.get('/deploy/backups');
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  createBackup: async (options = {}) => {
    try {
      const response = await apiClient.post('/deploy/backups', options);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  restoreBackup: async (backupId: string) => {
    try {
      const response = await apiClient.post(`/deploy/backups/${backupId}/restore`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  deleteBackup: async (backupId: string) => {
    try {
      const response = await apiClient.delete(`/deploy/backups/${backupId}`);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  // Fonctions pour les domaines Infomaniak
  getInfomaniakDomains: async () => {
    try {
      const response = await apiClient.get('/deploy/domains');
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  updateDomainConfig: async (domainId: string, config = {}) => {
    try {
      const response = await apiClient.put(`/deploy/domains/${domainId}`, config);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }
};

// Export des modules
export default {
  api: apiInstance,
  ...apiClient,
  auth,
  database,
  deploy
};
