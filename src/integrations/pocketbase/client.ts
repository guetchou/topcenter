
import PocketBase from 'pocketbase';

// Création d'une instance PocketBase
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://api.topcenter.cg';
export const pb = new PocketBase(PB_URL);

// Fonction pour tester la connexion à PocketBase
export const testPocketBaseConnection = async (): Promise<boolean> => {
  try {
    // Tester la connexion en récupérant la liste des collections
    await pb.collections.getList(1, 1);
    console.log('PocketBase connection successful');
    return true;
  } catch (error) {
    console.error('PocketBase connection failed:', error);
    return false;
  }
};

// Fonction pour créer une nouvelle collection
export const createCollection = async (collectionName: string, schema: any) => {
  try {
    const newCollection = await pb.collections.create({
      name: collectionName,
      schema: schema
    });
    return newCollection;
  } catch (error) {
    console.error(`Error creating collection ${collectionName}:`, error);
    throw error;
  }
};

// Fonction pour récupérer des enregistrements
export const getRecords = async (collectionName: string, page = 1, perPage = 50) => {
  try {
    const records = await pb.collection(collectionName).getList(page, perPage);
    return records.items;
  } catch (error) {
    console.error(`Error fetching records from ${collectionName}:`, error);
    return [];
  }
};

// Fonction pour créer un nouvel enregistrement
export const createRecord = async (collectionName: string, data: any) => {
  try {
    const record = await pb.collection(collectionName).create(data);
    return record;
  } catch (error) {
    console.error(`Error creating record in ${collectionName}:`, error);
    throw error;
  }
};

// Fonction pour mettre à jour un enregistrement
export const updateRecord = async (collectionName: string, id: string, data: any) => {
  try {
    const record = await pb.collection(collectionName).update(id, data);
    return record;
  } catch (error) {
    console.error(`Error updating record ${id} in ${collectionName}:`, error);
    throw error;
  }
};

// Fonction pour supprimer un enregistrement
export const deleteRecord = async (collectionName: string, id: string) => {
  try {
    await pb.collection(collectionName).delete(id);
    return true;
  } catch (error) {
    console.error(`Error deleting record ${id} from ${collectionName}:`, error);
    throw error;
  }
};

// Fonction pour authentification admin
export const authenticateAdmin = async (email: string, password: string) => {
  try {
    const authData = await pb.admins.authWithPassword(email, password);
    return authData;
  } catch (error) {
    console.error('Admin authentication failed:', error);
    throw error;
  }
};

export default {
  pb,
  testPocketBaseConnection,
  createCollection,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  authenticateAdmin
};
