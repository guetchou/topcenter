
/**
 * Fichier client pour les intégrations API
 * Remplace l'ancien client Supabase après la migration vers NestJS + Directus
 */

// Ce fichier est utilisé comme remplacement pour l'ancien client Supabase
// Les composants qui importaient l'ancien client doivent être mis à jour

import api from '@/services/api';

// Fonction utilitaire pour simuler la structure de l'ancien client Supabase
// mais utilisant le nouveau service API basé sur axios
export const apiClient = {
  // Méthodes pour récupérer des données
  from: (table: string) => ({
    select: (fields: string = '*') => ({
      order: (column: string, { ascending = true } = {}) => ({
        limit: (limit: number) => ({
          // Simulation de la méthode d'exécution de requête
          execute: async () => {
            try {
              const response = await api.get(`/directus/${table}`, {
                params: {
                  fields,
                  sort: `${ascending ? '' : '-'}${column}`,
                  limit
                }
              });
              return { data: response.data, error: null };
            } catch (error) {
              console.error(`Erreur lors de la récupération des données de ${table}:`, error);
              return { data: null, error };
            }
          }
        }),
        execute: async () => {
          try {
            const response = await api.get(`/directus/${table}`, {
              params: {
                fields,
                sort: `${ascending ? '' : '-'}${column}`
              }
            });
            return { data: response.data, error: null };
          } catch (error) {
            console.error(`Erreur lors de la récupération des données de ${table}:`, error);
            return { data: null, error };
          }
        }
      }),
      eq: (column: string, value: any) => ({
        execute: async () => {
          try {
            const response = await api.get(`/directus/${table}`, {
              params: {
                fields,
                filter: { [column]: { _eq: value } }
              }
            });
            return { data: response.data, error: null };
          } catch (error) {
            console.error(`Erreur lors de la récupération des données de ${table}:`, error);
            return { data: null, error };
          }
        }
      }),
      execute: async () => {
        try {
          const response = await api.get(`/directus/${table}`, {
            params: { fields }
          });
          return { data: response.data, error: null };
        } catch (error) {
          console.error(`Erreur lors de la récupération des données de ${table}:`, error);
          return { data: null, error };
        }
      }
    }),
    insert: (data: any) => ({
      execute: async () => {
        try {
          const response = await api.post(`/directus/${table}`, data);
          return { data: response.data, error: null };
        } catch (error) {
          console.error(`Erreur lors de l'insertion de données dans ${table}:`, error);
          return { data: null, error };
        }
      }
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        execute: async () => {
          try {
            const response = await api.patch(`/directus/${table}/${value}`, data);
            return { data: response.data, error: null };
          } catch (error) {
            console.error(`Erreur lors de la mise à jour des données dans ${table}:`, error);
            return { data: null, error };
          }
        }
      })
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        execute: async () => {
          try {
            const response = await api.delete(`/directus/${table}/${value}`);
            return { data: response.data, error: null };
          } catch (error) {
            console.error(`Erreur lors de la suppression de données dans ${table}:`, error);
            return { data: null, error };
          }
        }
      })
    })
  }),
  
  // Authentification
  auth: {
    signUp: async (credentials: { email: string; password: string }) => {
      try {
        const response = await api.post('/auth/register', credentials);
        return { data: response.data, error: null };
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        return { data: null, error };
      }
    },
    signIn: async (credentials: { email: string; password: string }) => {
      try {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
          localStorage.setItem('auth_token', response.data.token);
        }
        return { data: response.data, error: null };
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        return { data: null, error };
      }
    },
    signOut: async () => {
      try {
        localStorage.removeItem('auth_token');
        return { error: null };
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        return { error };
      }
    },
    resetPasswordForEmail: async (email: string) => {
      try {
        const response = await api.post('/auth/reset-password', { email });
        return { data: response.data, error: null };
      } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe:', error);
        return { data: null, error };
      }
    }
  },
  
  // Stockage
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: File) => {
        try {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await api.post(`/files/${bucket}/${path}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          return { data: response.data, error: null };
        } catch (error) {
          console.error(`Erreur lors de l'upload dans ${bucket}:`, error);
          return { data: null, error };
        }
      },
      getPublicUrl: (path: string) => {
        return {
          data: {
            publicUrl: `${process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:3000/api'}/files/${bucket}/${path}`
          }
        };
      }
    })
  }
};

// Exporter le client pour compatibilité avec les anciens imports
export { apiClient as supabase };
export default apiClient;
