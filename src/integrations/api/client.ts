
/**
 * Fichier client pour les intégrations API
 * Remplace l'ancien client Supabase après la migration vers NestJS + Directus
 */

import { createTableModule } from './modules/tableModule';
import { authModule } from './modules/authModule';
import { storageModule } from './modules/storageModule';
import { functionsModule } from './modules/functionsModule';

// Fonction utilitaire pour simuler la structure de l'ancien client Supabase
export const apiClient = {
  // Méthodes pour récupérer des données
  from: (table: string) => createTableModule(table),
  
  // Authentification
  auth: authModule,
  
  // Stockage
  storage: storageModule,

  // Fonctions Edge/Serveur
  functions: functionsModule
};

// Exporter le client pour compatibilité avec les anciens imports
export { apiClient as supabase };
export default apiClient;
