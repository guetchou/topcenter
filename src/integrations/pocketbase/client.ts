
import { useState, useEffect } from 'react';
import PocketBase from 'pocketbase';

const API_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';

// Client PocketBase singleton
let pbInstance: PocketBase | null = null;

// Initialiser le client PocketBase
export const initPocketBase = (): PocketBase => {
  if (!pbInstance) {
    pbInstance = new PocketBase(API_URL);
    
    // Vérifier si une session existe déjà dans le localStorage
    const token = localStorage.getItem('pocketbase_auth');
    if (token) {
      try {
        const authData = JSON.parse(token);
        pbInstance.authStore.save(authData.token, authData.model);
      } catch (err) {
        console.error('Erreur lors de la restauration de la session:', err);
        localStorage.removeItem('pocketbase_auth');
      }
    }
  }
  
  return pbInstance;
};

// Export direct de l'instance PocketBase pour une utilisation simplifiée
export const pb = initPocketBase();

// Vérifier la disponibilité du serveur
export const checkServerAvailability = async (): Promise<boolean> => {
  try {
    const client = initPocketBase();
    const health = await client.health.check();
    return health.code === 200;
  } catch (error) {
    console.error('Erreur lors de la vérification de la disponibilité du serveur:', error);
    return false;
  }
};

// Obtenir l'utilisateur actuel
export const getCurrentUser = () => {
  const client = initPocketBase();
  return client.authStore.model;
};

// Vérifier si l'utilisateur est valide
export const isUserValid = (): boolean => {
  const client = initPocketBase();
  return client.authStore.isValid;
};

// Authentification utilisateur
export const loginUser = async (email: string, password: string) => {
  const client = initPocketBase();
  return await client.collection('users').authWithPassword(email, password);
};

// Déconnexion utilisateur
export const logoutUser = () => {
  const client = initPocketBase();
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
  const client = initPocketBase();
  return await client.collection('users').create(data);
};

// Authentification admin
export const adminLogin = async (email: string, password: string) => {
  const client = initPocketBase();
  const authData = await client.admins.authWithPassword(email, password);
  
  if (authData && authData.token) {
    return { success: true, admin: true };
  }
  
  return { success: false };
};

// Fonction pour créer une collection
export const createCollection = async (name: string, schema: Record<string, any>) => {
  try {
    // Cette fonction est une simulation, car PocketBase API JavaScript ne permet pas 
    // de créer des collections directement (nécessite un accès admin)
    console.log(`Collection ${name} would be created with schema:`, schema);
    return { success: true, name };
  } catch (error) {
    console.error('Error creating collection:', error);
    return { success: false, error };
  }
};

// Fonction pour récupérer des enregistrements
export const getRecords = async (collection: string, params = {}) => {
  try {
    const client = initPocketBase();
    return await client.collection(collection).getList(1, 50, params);
  } catch (error) {
    console.error(`Error getting records from ${collection}:`, error);
    return { items: [], totalItems: 0 };
  }
};

// Fonction pour tester la connexion PocketBase
export const testPocketBaseConnection = async () => {
  try {
    const client = initPocketBase();
    const health = await client.health.check();
    return {
      success: health.code === 200,
      message: 'PocketBase connection successful',
      details: health
    };
  } catch (error) {
    return {
      success: false,
      message: 'PocketBase connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
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
  pb,
  checkServerAvailability,
  getCurrentUser,
  isUserValid,
  loginUser,
  logoutUser,
  registerUser,
  adminLogin,
  createCollection,
  getRecords,
  testPocketBaseConnection
};
