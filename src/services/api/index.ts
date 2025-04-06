
import axios from 'axios';
import { setupInterceptors } from './interceptors';
import { setupErrorHandlers } from './errorHandler';
import { markServerAsAvailable, markServerAsUnavailable, serverIsAvailable } from './serverStatus';

// Variable pour suivre les tentatives de connexion
let connectionAttempts = 0;
const maxConnectionAttempts = 3;

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
    });
    
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

// Exécuter une vérification initiale de la santé du serveur
checkServerHealth();

// Export combined API utilities
export const apiUtils = {
  serverIsAvailable,
  markServerAsAvailable,
  markServerAsUnavailable,
  checkServerHealth
};

export default api;
