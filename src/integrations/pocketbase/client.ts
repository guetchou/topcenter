
import { useCallback } from 'react';
import PocketBase from 'pocketbase';

let pb: PocketBase;

const isPocketBaseInitialized = () => {
  return typeof pb !== 'undefined';
};

// Initialisation de PocketBase
export const initPocketBase = (url?: string) => {
  const pocketbaseUrl = url || import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';
  
  if (!isPocketBaseInitialized()) {
    pb = new PocketBase(pocketbaseUrl);
    console.log('PocketBase initialized with URL:', pocketbaseUrl);
  }
  
  return pb;
};

// Récupérer l'instance PocketBase
export const getPocketBaseInstance = (): PocketBase => {
  if (!isPocketBaseInitialized()) {
    return initPocketBase();
  }
  return pb;
};

// Création d'une collection
export const createCollection = async (collectionName: string, schema: any) => {
  try {
    if (!isPocketBaseInitialized()) {
      initPocketBase();
    }
    
    // Vérifier si l'utilisateur est authentifié en tant qu'admin
    if (!pb.authStore.isValid || pb.authStore.model?.type !== 'admin') {
      return {
        success: false,
        error: "Vous devez être connecté en tant qu'administrateur pour créer une collection."
      };
    }
    
    const result = await pb.collections.create({
      name: collectionName,
      schema
    });
    
    return {
      success: true,
      collection: result
    };
    
  } catch (error) {
    console.error('Erreur lors de la création de la collection:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur s'est produite."
    };
  }
};

// Récupération des enregistrements
export const getRecords = async (collectionName: string, page = 1, perPage = 50, filter = '') => {
  try {
    if (!isPocketBaseInitialized()) {
      initPocketBase();
    }
    
    const resultList = await pb.collection(collectionName).getList(page, perPage, {
      filter
    });
    
    return {
      success: true,
      items: resultList.items,
      totalItems: resultList.totalItems,
      totalPages: resultList.totalPages,
      page: resultList.page
    };
    
  } catch (error) {
    console.error('Erreur lors de la récupération des enregistrements:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur s'est produite.",
      items: [],
      totalItems: 0,
      totalPages: 0,
      page: 1
    };
  }
};

// Test de connexion à PocketBase
export const testPocketBaseConnection = async (url?: string) => {
  try {
    const pocketbaseUrl = url || import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090';
    
    const tempPb = new PocketBase(pocketbaseUrl);
    
    // Essayer de récupérer la liste des collections pour tester la connexion
    await tempPb.collections.getList(1, 1);
    
    return {
      success: true,
      message: `Connexion réussie à PocketBase: ${pocketbaseUrl}`
    };
    
  } catch (error) {
    console.error('Erreur lors du test de connexion à PocketBase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur s'est produite lors de la connexion à PocketBase."
    };
  }
};

// Authentification admin
export const authenticateAdmin = async (email: string, password: string) => {
  try {
    if (!isPocketBaseInitialized()) {
      initPocketBase();
    }
    
    const authData = await pb.admins.authWithPassword(email, password);
    
    return {
      success: true,
      admin: authData.admin,
      token: authData.token
    };
    
  } catch (error) {
    console.error('Erreur lors de l\'authentification admin:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur s'est produite lors de l'authentification."
    };
  }
};

// Export direct de l'instance PocketBase pour un accès plus facile
export { pb };
