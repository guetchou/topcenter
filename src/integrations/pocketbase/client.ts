import PocketBase from 'pocketbase';
import { toast } from 'sonner';

// Create a single PocketBase instance to use throughout the app
export const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Export the PocketBase types for use in the app
import type { RecordModel } from 'pocketbase';
export type { RecordModel };

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

// Nouvelle méthode de test de l'API PocketBase
export const testPocketBaseConnection = async (url: string = import.meta.env.VITE_POCKETBASE_URL) => {
  try {
    const pb = new PocketBase(url);
    
    // Vérifier la santé du serveur
    const health = await pb.health.check();
    
    // Si la vérification réussit
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

// Exporter la nouvelle fonction avec les exports existants
export { 
  isUserValid,
  getCurrentUser,
  logout,
  testPocketBaseConnection 
};

export default pb;
