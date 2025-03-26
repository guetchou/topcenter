
import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const API_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

// Client PocketBase singleton
let pb: PocketBase | null = null;

// Initialiser le client PocketBase
export const initPocketBase = (): PocketBase => {
  if (!pb) {
    pb = new PocketBase(API_URL);
    
    // Vérifier si une session existe déjà dans le localStorage
    const token = localStorage.getItem('pocketbase_auth');
    if (token) {
      try {
        const authData = JSON.parse(token);
        pb.authStore.save(authData.token, authData.model);
      } catch (err) {
        console.error('Erreur lors de la restauration de la session:', err);
        localStorage.removeItem('pocketbase_auth');
      }
    }
  }
  
  return pb;
};

// Obtenir l'instance du client
export const getPocketBase = (): PocketBase => {
  return pb || initPocketBase();
};

// Vérifier la disponibilité du serveur
export const checkServerAvailability = async (): Promise<boolean> => {
  try {
    const client = getPocketBase();
    const health = await client.health.check();
    return health.code === 200;
  } catch (error) {
    console.error('Erreur lors de la vérification de la disponibilité du serveur:', error);
    return false;
  }
};

// Obtenir l'utilisateur actuel
export const getCurrentUser = () => {
  const client = getPocketBase();
  return client.authStore.model;
};

// Vérifier si l'utilisateur est valide
export const isUserValid = (): boolean => {
  const client = getPocketBase();
  return client.authStore.isValid;
};

// Authentification utilisateur
export const loginUser = async (email: string, password: string) => {
  const client = getPocketBase();
  return await client.collection('users').authWithPassword(email, password);
};

// Déconnexion utilisateur
export const logoutUser = () => {
  const client = getPocketBase();
  client.authStore.clear();
  localStorage.removeItem('pocketbase_auth');
};

// Inscription utilisateur
export const registerUser = async (data: {
  email: string;
  password: string;
  passwordConfirm: string;
  name?: string;
}) => {
  const client = getPocketBase();
  return await client.collection('users').create(data);
};

// Authentification admin
export const adminLogin = async (email: string, password: string) => {
  const client = getPocketBase();
  const authData = await client.admins.authWithPassword(email, password);
  
  if (authData && authData.token) {
    return { success: true, admin: true };
  }
  
  return { success: false };
};

// Hook pour vérifier la connexion PocketBase
export const usePocketBaseStatus = () => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      const available = await checkServerAvailability();
      setIsAvailable(available);
      setIsChecking(false);
    };

    checkStatus();

    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isAvailable, isChecking };
};

export default {
  initPocketBase,
  getPocketBase,
  checkServerAvailability,
  getCurrentUser,
  isUserValid,
  loginUser,
  logoutUser,
  registerUser,
  adminLogin
};
