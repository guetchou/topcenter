
import api from './api';

// Service pour communiquer avec Directus CMS via NestJS
export const directusService = {
  // Récupérer tous les items d'une collection
  getItems: async (collection: string) => {
    const response = await api.get(`/directus/${collection}`);
    return response.data;
  },
  
  // Récupérer un item spécifique
  getItem: async (collection: string, id: string) => {
    const response = await api.get(`/directus/${collection}/${id}`);
    return response.data;
  },
  
  // Créer un nouvel item
  createItem: async (collection: string, data: any) => {
    const response = await api.post(`/directus/${collection}`, data);
    return response.data;
  },
  
  // Mettre à jour un item existant
  updateItem: async (collection: string, id: string, data: any) => {
    const response = await api.patch(`/directus/${collection}/${id}`, data);
    return response.data;
  },
  
  // Supprimer un item
  deleteItem: async (collection: string, id: string) => {
    const response = await api.delete(`/directus/${collection}/${id}`);
    return response.data;
  },
  
  // Effectuer une recherche filtrée
  searchItems: async (collection: string, query: Record<string, any>) => {
    const response = await api.get(`/directus/${collection}`, { params: { filter: query } });
    return response.data;
  }
};

export default directusService;
