
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

// Intercepteur pour ajouter le token d'authentification aux requêtes
api.interceptors.request.use((config) => {
  // Vérifier si on est en ligne avant d'envoyer la requête
  if (!navigator.onLine) {
    // Mode hors ligne
    return Promise.reject(
      new Error('Vous êtes actuellement hors ligne. Veuillez vous reconnecter à Internet.')
    );
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
    // Vérifier si c'est une erreur liée au mode hors ligne
    if (!navigator.onLine || error.message === 'Network Error') {
      toast.error('Vous êtes hors ligne. Certaines fonctionnalités peuvent être limitées.');
      return Promise.reject(new Error('Vous êtes hors ligne'));
    }
    
    // Gérer les erreurs d'authentification (401)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth';
    }
    
    // Afficher les erreurs avec toast
    const errorMessage = error.response?.data?.message || 'Une erreur est survenue';
    toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

export default api;
