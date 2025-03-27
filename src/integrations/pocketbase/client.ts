
// Fichier client PocketBase pour faciliter les interactions avec l'API PocketBase
import PocketBase from 'pocketbase';

// URL de base de l'API PocketBase
const POCKETBASE_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://api.topcenter.cg';

// Création d'une instance singleton de PocketBase
export const pb = new PocketBase(POCKETBASE_URL);

// Test de connexion à PocketBase
export const testPocketBaseConnection = async (): Promise<boolean> => {
  try {
    // Utiliser l'endpoint health pour vérifier si l'API est accessible
    const response = await fetch(`${POCKETBASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error("Erreur lors du test de connexion PocketBase:", error);
    return false;
  }
};

// Initialisation de PocketBase (pour les composants qui ont besoin d'une nouvelle instance)
export const initPocketBase = (): PocketBase => {
  return new PocketBase(POCKETBASE_URL);
};

// Récupération de l'instance PocketBase (pour la compatibilité avec les imports existants)
export const getPocketBaseInstance = () => {
  return pb;
};

// Alias pour la compatibilité avec le code existant
export const getPocketbase = () => {
  return pb;
};

// Fonction pour créer une collection (utilisée dans PocketBaseCollections)
export const createCollection = async (name: string, schema: any) => {
  try {
    const adminAuthData = await pb.admins.authWithPassword('admin@topcenter.cg', 'Admin2013-');
    const result = await pb.collections.create({
      name,
      schema,
      type: 'base',
    });
    return result;
  } catch (error) {
    console.error("Erreur lors de la création de la collection:", error);
    throw error;
  }
};

// Fonction pour récupérer les enregistrements d'une collection
export const getRecords = async (collectionId: string) => {
  try {
    const records = await pb.collection(collectionId).getList(1, 50);
    return records.items;
  } catch (error) {
    console.error(`Erreur lors de la récupération des enregistrements de ${collectionId}:`, error);
    return [];
  }
};

// Export par défaut pour la compatibilité avec les imports existants
export default {
  pb,
  testPocketBaseConnection,
  initPocketBase,
  getPocketBaseInstance,
  getPocketbase,
  createCollection,
  getRecords,
};
