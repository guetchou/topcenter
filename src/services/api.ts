
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

// Fonction utilitaire pour vérifier si le serveur est accessible
const checkServerAvailability = async () => {
  try {
    // Requête HEAD vers une ressource statique qui devrait toujours être disponible
    await fetch('/lovable-uploads/logo-topcenter.png', { 
      method: 'HEAD',
      cache: 'no-store',
      headers: { 'pragma': 'no-cache' },
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    return true;
  } catch (error) {
    console.error("Server check failed:", error);
    return false;
  }
};

// Intercepteur pour ajouter le token d'authentification aux requêtes
api.interceptors.request.use(async (config) => {
  // Vérifier si on est en ligne avant d'envoyer la requête
  if (!navigator.onLine) {
    // Réponse personnalisée pour le mode hors ligne
    return Promise.reject(
      new Error('Vous êtes actuellement hors ligne. Veuillez vous reconnecter à Internet.')
    );
  }
  
  // Pour les routes d'authentification, vérifiez aussi la disponibilité du serveur
  if (config.url?.includes('/auth/')) {
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

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Vérifier si c'est une erreur liée au mode hors ligne ou à un problème réseau
    if (!navigator.onLine || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      toast.error('Vous êtes hors ligne ou le serveur est inaccessible. Certaines fonctionnalités peuvent être limitées.');
      return Promise.reject(new Error('Le service est temporairement indisponible. Veuillez réessayer plus tard.'));
    }
    
    // Vérifier le statut de l'erreur HTTP
    if (error.response) {
      // Gérer les erreurs d'authentification (401)
      if (error.response.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/auth';
        return Promise.reject(new Error('Session expirée. Veuillez vous reconnecter.'));
      }
      
      // Gérer les erreurs 503 (service indisponible)
      if (error.response.status === 503) {
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
    
    return Promise.reject(error);
  }
);

export default api;
