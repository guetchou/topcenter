
import PocketBase from 'pocketbase';
import { toast } from 'sonner';

// URL par défaut si celle de l'environnement n'est pas disponible
const DEFAULT_PB_URL = 'https://api.topcenter.cg';

// Créer une instance PocketBase unique à utiliser dans toute l'application
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || DEFAULT_PB_URL);

// Exporter les types PocketBase pour une utilisation dans l'application
import type { RecordModel, BaseAuthStore, ListResult } from 'pocketbase';
export type { RecordModel, BaseAuthStore, ListResult };

// Helper pour extraire le type d'une collection
export type TypedPocketBase<T extends Record<string, any> = Record<string, any>> = PocketBase & {
  collection(idOrName: string): any;
};

// Variables d'état pour la disponibilité du serveur
let isServerAvailable = true;
let offlineMode = false;
let lastServerCheckTime = 0;

// Helpers d'authentification
export const isUserValid = () => {
  return pb.authStore.isValid;
};

export const getCurrentUser = () => {
  return pb.authStore.model;
};

export const logout = () => {
  pb.authStore.clear();
  toast.success('Déconnexion réussie');
};

// Empêcher l'annulation automatique des requêtes
pb.autoCancellation(false);

// Initialiser le store d'authentification depuis localStorage
try {
  // Charger l'état d'authentification depuis localStorage au démarrage
  const authData = localStorage.getItem('pocketbase_auth');
  if (authData) {
    const { token, model } = JSON.parse(authData);
    pb.authStore.save(token, model);
  }
} catch (error) {
  console.error('Error initializing PocketBase auth:', error);
  // Effacer les données d'authentification potentiellement corrompues
  localStorage.removeItem('pocketbase_auth');
  pb.authStore.clear();
}

// Persister les changements du store d'authentification dans localStorage
pb.authStore.onChange((token, model) => {
  if (token) {
    localStorage.setItem('pocketbase_auth', JSON.stringify({ token, model }));
  } else {
    localStorage.removeItem('pocketbase_auth');
  }
});

// Vérifier si le serveur est disponible
export const checkServerAvailability = async (url: string = pb.baseUrl) => {
  const now = Date.now();
  
  // Limiter la fréquence des vérifications à toutes les 5 secondes
  if (now - lastServerCheckTime < 5000) {
    return isServerAvailable;
  }
  
  lastServerCheckTime = now;
  
  try {
    const testPb = new PocketBase(url);
    await testPb.health.check();
    
    if (!isServerAvailable) {
      toast.success('Connexion à PocketBase rétablie', {
        description: `Serveur PocketBase disponible à ${url}`
      });
    }
    
    isServerAvailable = true;
    offlineMode = false;
    return true;
  } catch (error) {
    if (isServerAvailable) {
      console.error('Erreur de connexion à PocketBase:', error);
      toast.error('Échec de la connexion à PocketBase', {
        description: `Impossible de se connecter à ${url}`
      });
    }
    
    isServerAvailable = false;
    offlineMode = true;
    return false;
  }
};

// Tester la connexion PocketBase
export const testPocketBaseConnection = async (url: string = pb.baseUrl) => {
  try {
    const testPb = new PocketBase(url);
    
    // Vérifier la santé du serveur
    const health = await testPb.health.check();
    
    // Si la vérification réussit
    toast.success('Connexion à PocketBase réussie', {
      description: `Serveur PocketBase disponible à ${url}`
    });
    
    isServerAvailable = true;
    offlineMode = false;
    
    return {
      success: true,
      status: health.code,
      message: 'Connexion à PocketBase établie avec succès'
    };
  } catch (error) {
    console.error('Erreur de connexion à PocketBase:', error);
    
    toast.error('Échec de la connexion à PocketBase', {
      description: `Impossible de se connecter à ${url}`
    });
    
    isServerAvailable = false;
    offlineMode = true;
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      message: 'La connexion à PocketBase a échoué'
    };
  }
};

// Vérification périodique de la connexion au serveur (toutes les 30 secondes)
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (navigator.onLine) {
      checkServerAvailability();
    }
  }, 30000);
  
  // Surveiller les changements de connectivité du navigateur
  window.addEventListener('online', () => {
    checkServerAvailability();
  });
  
  window.addEventListener('offline', () => {
    isServerAvailable = false;
    offlineMode = true;
    toast.error('Le navigateur est hors ligne', {
      description: 'Les fonctionnalités PocketBase sont limitées'
    });
  });
}

// Login admin
export const adminLogin = async (email: string, password: string) => {
  try {
    const admin = await pb.admins.authWithPassword(email, password);
    toast.success('Connexion admin réussie', {
      description: `Bienvenue, ${admin.admin.email}`
    });
    return { success: true, admin };
  } catch (error) {
    console.error('Erreur de connexion admin:', error);
    toast.error('Échec de la connexion admin', {
      description: error instanceof Error ? error.message : 'Erreur inconnue'
    });
    return { success: false, error };
  }
};

// Helpers pour la gestion des collections
export const createCollection = async (name: string, schema: any) => {
  try {
    const result = await pb.collections.create({
      name,
      type: 'base',
      schema
    });
    toast.success(`Collection ${name} créée avec succès`);
    return { success: true, collection: result };
  } catch (error) {
    console.error(`Erreur lors de la création de la collection ${name}:`, error);
    toast.error(`Échec de la création de la collection ${name}`, {
      description: error instanceof Error ? error.message : 'Erreur inconnue'
    });
    return { success: false, error };
  }
};

// Wrapper pour gérer les erreurs et le mode hors ligne
const safeApiCall = async (apiCall: () => Promise<any>, fallbackValue: any = null) => {
  if (offlineMode) {
    console.warn('PocketBase en mode hors ligne, utilisation des données locales si disponibles');
    return { success: false, error: 'Mode hors ligne actif', offlineMode: true, data: fallbackValue };
  }
  
  try {
    const result = await apiCall();
    return { success: true, ...result };
  } catch (error) {
    // Vérifier si l'erreur est due à un problème de connectivité
    if (!navigator.onLine || error.message?.includes('network') || error.message?.includes('connection')) {
      offlineMode = true;
      isServerAvailable = false;
    }
    
    console.error(`Erreur API PocketBase:`, error);
    return { success: false, error };
  }
};

// Opérations CRUD génériques avec gestion des erreurs améliorée
export const createRecord = async (collection: string, data: Record<string, any>) => {
  return safeApiCall(async () => {
    const record = await pb.collection(collection).create(data);
    return { record };
  });
};

export const getRecords = async (collection: string, page = 1, perPage = 50, filter = '', sort = '') => {
  return safeApiCall(async () => {
    const records = await pb.collection(collection).getList(page, perPage, { filter, sort });
    return records;
  }, { items: [], totalItems: 0, totalPages: 0, page: 1 });
};

export const getRecord = async (collection: string, id: string) => {
  return safeApiCall(async () => {
    const record = await pb.collection(collection).getOne(id);
    return { record };
  });
};

export const updateRecord = async (collection: string, id: string, data: Record<string, any>) => {
  return safeApiCall(async () => {
    const record = await pb.collection(collection).update(id, data);
    return { record };
  });
};

export const deleteRecord = async (collection: string, id: string) => {
  return safeApiCall(async () => {
    await pb.collection(collection).delete(id);
    return { deleted: true };
  });
};

// Fonction utilitaire pour charger des données depuis le cache
export const getLocalStorageCache = (key: string) => {
  try {
    const cached = localStorage.getItem(`pb_cache_${key}`);
    if (cached) {
      const { data, expiry } = JSON.parse(cached);
      if (expiry > Date.now()) {
        return data;
      }
    }
    return null;
  } catch (e) {
    console.error('Erreur lors de la lecture du cache:', e);
    return null;
  }
};

// Fonction pour mettre en cache des données avec une durée de vie
export const setLocalStorageCache = (key: string, data: any, ttlMinutes = 60) => {
  try {
    const expiry = Date.now() + ttlMinutes * 60 * 1000;
    localStorage.setItem(`pb_cache_${key}`, JSON.stringify({ data, expiry }));
  } catch (e) {
    console.error('Erreur lors de la mise en cache:', e);
  }
};

export default pb;
