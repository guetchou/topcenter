
import PocketBase from 'pocketbase';
import { toast } from 'sonner';

// Create a single PocketBase instance to use throughout the app
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'https://api.topcenter.cg');

// Export the PocketBase types for use in the app
import type { RecordModel, BaseAuthStore } from 'pocketbase';
export type { RecordModel, BaseAuthStore };

// Helper to extract the type from a collection
export type TypedPocketBase<T extends Record<string, any> = Record<string, any>> = PocketBase & {
  collection(idOrName: string): any;
};

// Authentication helpers
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

// Auto refresh authentication token
pb.autoCancellation(false);

// Initialize the auth store from localStorage
try {
  // Load auth state from localStorage on startup
  const authData = localStorage.getItem('pocketbase_auth');
  if (authData) {
    const { token, model } = JSON.parse(authData);
    pb.authStore.save(token, model);
  }
} catch (error) {
  console.error('Error initializing PocketBase auth:', error);
  // Clear potentially corrupted auth data
  localStorage.removeItem('pocketbase_auth');
  pb.authStore.clear();
}

// Persist auth store changes to localStorage
pb.authStore.onChange((token, model) => {
  if (token) {
    localStorage.setItem('pocketbase_auth', JSON.stringify({ token, model }));
  } else {
    localStorage.removeItem('pocketbase_auth');
  }
});

// Test PocketBase connection
export const testPocketBaseConnection = async (url: string = pb.baseUrl) => {
  try {
    const testPb = new PocketBase(url);
    
    // Check server health
    const health = await testPb.health.check();
    
    // If check succeeds
    toast.success('Connexion à PocketBase réussie', {
      description: `Serveur PocketBase disponible à ${url}`
    });
    
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
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      message: 'La connexion à PocketBase a échoué'
    };
  }
};

// Admin login
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

// Collection management helpers
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

// Generic CRUD operations
export const createRecord = async (collection: string, data: Record<string, any>) => {
  try {
    const record = await pb.collection(collection).create(data);
    return { success: true, record };
  } catch (error) {
    console.error(`Erreur lors de la création dans ${collection}:`, error);
    return { success: false, error };
  }
};

export const getRecords = async (collection: string, page = 1, perPage = 50, filter = '', sort = '') => {
  try {
    const records = await pb.collection(collection).getList(page, perPage, { filter, sort });
    return { success: true, ...records };
  } catch (error) {
    console.error(`Erreur lors de la récupération depuis ${collection}:`, error);
    return { success: false, error };
  }
};

export const getRecord = async (collection: string, id: string) => {
  try {
    const record = await pb.collection(collection).getOne(id);
    return { success: true, record };
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'élément ${id} dans ${collection}:`, error);
    return { success: false, error };
  }
};

export const updateRecord = async (collection: string, id: string, data: Record<string, any>) => {
  try {
    const record = await pb.collection(collection).update(id, data);
    return { success: true, record };
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'élément ${id} dans ${collection}:`, error);
    return { success: false, error };
  }
};

export const deleteRecord = async (collection: string, id: string) => {
  try {
    await pb.collection(collection).delete(id);
    return { success: true };
  } catch (error) {
    console.error(`Erreur lors de la suppression de l'élément ${id} dans ${collection}:`, error);
    return { success: false, error };
  }
};

export default pb;
