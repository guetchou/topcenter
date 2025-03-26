
import PocketBase from 'pocketbase';

let pocketbaseInstance: PocketBase | null = null;

export const initPocketBase = (url?: string) => {
  const pocketbaseUrl = url || import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';
  pocketbaseInstance = new PocketBase(pocketbaseUrl);
  return pocketbaseInstance;
};

export const getPocketbase = (): PocketBase => {
  if (!pocketbaseInstance) {
    return initPocketBase();
  }
  return pocketbaseInstance;
};

// État de disponibilité de PocketBase
let isPocketBaseAvailable = false;
let isCheckingPocketBase = false;

export const usePocketBaseStatus = () => {
  return {
    isAvailable: isPocketBaseAvailable,
    isChecking: isCheckingPocketBase
  };
};

// Pour les tests de connexion PocketBase
export const testPocketBaseConnection = async (): Promise<boolean> => {
  try {
    isCheckingPocketBase = true;
    const pb = getPocketbase();
    const health = await pb.health.check();
    isPocketBaseAvailable = health.code === 200;
    return isPocketBaseAvailable;
  } catch (error) {
    isPocketBaseAvailable = false;
    return false;
  } finally {
    isCheckingPocketBase = false;
  }
};

// Pour la création de collections PocketBase
export const createCollection = async (collectionName: string, schema: any) => {
  const pb = getPocketbase();
  // Cette fonction est un stub - à implémenter selon les besoins
  console.log('Creating collection:', collectionName, schema);
  return true;
};

// Pour récupérer des enregistrements PocketBase
export const getRecords = async (collectionName: string, options = {}) => {
  const pb = getPocketbase();
  // Cette fonction est un stub - à implémenter selon les besoins
  console.log('Getting records from collection:', collectionName, options);
  return [];
};

// Pour l'authentification PocketBase
export const loginUser = async (email: string, password: string) => {
  const pb = getPocketbase();
  // Cette fonction est un stub - à implémenter selon les besoins
  console.log('Logging in user:', email);
  return true;
};

// Pour vérifier la disponibilité du serveur
export const checkServerAvailability = async () => {
  return await testPocketBaseConnection();
};

// Exporter pb pour la compatibilité avec les composants existants
export const pb = getPocketbase();

export default getPocketbase;
