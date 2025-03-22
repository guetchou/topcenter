
import axios from 'axios';
import { toast } from 'sonner';

// Création d'une instance axios avec la configuration de base
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Cache pour les vérifications de disponibilité du serveur
let lastServerCheck = 0;
let lastServerStatus = true;
const SERVER_CHECK_INTERVAL = 30000; // 30 secondes

// Fonction utilitaire pour vérifier si le serveur est accessible
const checkServerAvailability = async (force = false) => {
  const now = Date.now();
  
  // Utiliser le résultat en cache si la dernière vérification est récente
  if (!force && now - lastServerCheck < SERVER_CHECK_INTERVAL) {
    return lastServerStatus;
  }
  
  try {
    // Requête HEAD vers une ressource statique qui devrait toujours être disponible
    const response = await fetch('/lovable-uploads/logo-topcenter.png', { 
      method: 'HEAD',
      cache: 'no-store',
      headers: { 'pragma': 'no-cache' },
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    
    lastServerCheck = now;
    lastServerStatus = response.ok;
    return response.ok;
  } catch (error) {
    console.error("Server check failed:", error);
    lastServerCheck = now;
    lastServerStatus = false;
    return false;
  }
};

// Intercepteur pour ajouter le token d'authentification aux requêtes
api.interceptors.request.use(async (config) => {
  // Vérifier si on est en ligne avant d'envoyer la requête
  if (!navigator.onLine) {
    return Promise.reject(
      new Error('Vous êtes actuellement hors ligne. Veuillez vous reconnecter à Internet.')
    );
  }
  
  // Pour les routes d'authentification ou importantes, vérifiez aussi la disponibilité du serveur
  if (config.url?.includes('/auth/') || config.method === 'post' || config.method === 'put' || config.method === 'delete') {
    const isServerAvailable = await checkServerAvailability();
    if (!isServerAvailable) {
      return Promise.reject(
        new Error('Le service est temporairement indisponible. Veuillez réessayer plus tard.')
      );
    }
  }
  
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Un registre des erreurs pour éviter de montrer des toasts répétitifs
const errorRegistry = new Map();
const ERROR_COOLDOWN = 30000; // 30 secondes

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorKey = error.message || 'unknown-error';
    const now = Date.now();
    
    // Vérifier si cette erreur a déjà été affichée récemment
    if (!errorRegistry.has(errorKey) || now - errorRegistry.get(errorKey) > ERROR_COOLDOWN) {
      // Enregistrer l'erreur
      errorRegistry.set(errorKey, now);
      
      // Nettoyer périodiquement le registre des erreurs
      setTimeout(() => {
        errorRegistry.delete(errorKey);
      }, ERROR_COOLDOWN);
      
      // Vérifier si c'est une erreur liée au mode hors ligne ou à un problème réseau
      if (!navigator.onLine || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        toast.error('Vous êtes hors ligne ou le serveur est inaccessible. Certaines fonctionnalités peuvent être limitées.');
        // Mettre à jour le statut du serveur
        lastServerStatus = false;
        lastServerCheck = now;
        return Promise.reject(new Error('Le service est temporairement indisponible. Veuillez réessayer plus tard.'));
      }
      
      // Vérifier le statut de l'erreur HTTP
      if (error.response) {
        // Gérer les erreurs d'authentification (401)
        if (error.response.status === 401) {
          localStorage.removeItem('auth_token');
          // Ne pas rediriger automatiquement, car cela peut interrompre l'expérience utilisateur
          // Montrer un toast à la place
          toast.error('Session expirée. Veuillez vous reconnecter.', {
            action: {
              label: 'Se connecter',
              onClick: () => window.location.href = '/login'
            }
          });
          return Promise.reject(new Error('Session expirée. Veuillez vous reconnecter.'));
        }
        
        // Gérer les erreurs 503 (service indisponible)
        if (error.response.status === 503) {
          // Mettre à jour le statut du serveur
          lastServerStatus = false;
          lastServerCheck = now;
          return Promise.reject(new Error('Le service est temporairement indisponible. Veuillez réessayer plus tard.'));
        }
        
        // Gérer les erreurs 500 (erreur serveur)
        if (error.response.status >= 500) {
          return Promise.reject(new Error('Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.'));
        }
        
        // Afficher les erreurs avec toast pour les autres codes d'erreur
        const errorMessage = error.response.data?.message || 'Une erreur est survenue';
        toast.error(errorMessage);
      }
    }
    
    return Promise.reject(error);
  }
);

// Exporter des méthodes supplémentaires
export const apiUtils = {
  checkServerAvailability,
  resetErrorRegistry: () => errorRegistry.clear()
};

export default api;
