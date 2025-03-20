
/**
 * Fichier client pour les intégrations API
 * Remplace l'ancien client Supabase après la migration vers NestJS + Directus
 */

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
          },
          eq: (column: string, value: any) => ({
            execute: async () => {
              try {
                const response = await api.get(`/directus/${table}`, {
                  params: {
                    fields,
                    sort: `${ascending ? '' : '-'}${column}`,
                    limit,
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
          // Ajout d'une méthode single pour obtenir un seul enregistrement
          single: async () => {
            try {
              const response = await api.get(`/directus/${table}/first`, {
                params: {
                  fields,
                  sort: `${ascending ? '' : '-'}${column}`,
                  limit: 1
                }
              });
              return { data: response.data && response.data.length > 0 ? response.data[0] : null, error: null };
            } catch (error) {
              console.error(`Erreur lors de la récupération d'un enregistrement de ${table}:`, error);
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
                  sort: `${ascending ? '' : '-'}${column}`,
                  filter: { [column]: { _eq: value } }
                }
              });
              return { data: response.data, error: null };
            } catch (error) {
              console.error(`Erreur lors de la récupération des données de ${table}:`, error);
              return { data: null, error };
            }
          },
          // Ajout d'une méthode order pour chaîner les requêtes
          order: (innerColumn: string, { ascending: innerAscending = true } = {}) => ({
            execute: async () => {
              try {
                const response = await api.get(`/directus/${table}`, {
                  params: {
                    fields,
                    filter: { [column]: { _eq: value } },
                    sort: `${innerAscending ? '' : '-'}${innerColumn}`
                  }
                });
                return { data: response.data, error: null };
              } catch (error) {
                console.error(`Erreur lors de la récupération des données de ${table}:`, error);
                return { data: null, error };
              }
            }
          }),
          // Ajout d'une méthode single pour obtenir un seul enregistrement avec condition
          single: async () => {
            try {
              const response = await api.get(`/directus/${table}/first`, {
                params: {
                  fields,
                  filter: { [column]: { _eq: value } }
                }
              });
              return { data: response.data && response.data.length > 0 ? response.data[0] : null, error: null };
            } catch (error) {
              console.error(`Erreur lors de la récupération d'un enregistrement de ${table}:`, error);
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
        },
        // Ajout d'une méthode single pour obtenir un seul enregistrement
        single: async () => {
          try {
            const response = await api.get(`/directus/${table}/first`, {
              params: {
                fields,
                sort: `${ascending ? '' : '-'}${column}`,
                limit: 1
              }
            });
            return { data: response.data && response.data.length > 0 ? response.data[0] : null, error: null };
          } catch (error) {
            console.error(`Erreur lors de la récupération d'un enregistrement de ${table}:`, error);
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
        },
        order: (innerColumn: string, { ascending: innerAscending = true } = {}) => ({
          execute: async () => {
            try {
              const response = await api.get(`/directus/${table}`, {
                params: {
                  fields,
                  filter: { [column]: { _eq: value } },
                  sort: `${innerAscending ? '' : '-'}${innerColumn}`
                }
              });
              return { data: response.data, error: null };
            } catch (error) {
              console.error(`Erreur lors de la récupération des données de ${table}:`, error);
              return { data: null, error };
            }
          },
          limit: (limit: number) => ({
            execute: async () => {
              try {
                const response = await api.get(`/directus/${table}`, {
                  params: {
                    fields,
                    filter: { [column]: { _eq: value } },
                    sort: `${innerAscending ? '' : '-'}${innerColumn}`,
                    limit
                  }
                });
                return { data: response.data, error: null };
              } catch (error) {
                console.error(`Erreur lors de la récupération des données de ${table}:`, error);
                return { data: null, error };
              }
            }
          })
        }),
        // Ajout d'une méthode single pour obtenir un seul enregistrement
        single: async () => {
          try {
            const response = await api.get(`/directus/${table}/first`, {
              params: {
                fields,
                filter: { [column]: { _eq: value } }
              }
            });
            return { data: response.data && response.data.length > 0 ? response.data[0] : null, error: null };
          } catch (error) {
            console.error(`Erreur lors de la récupération d'un enregistrement de ${table}:`, error);
            return { data: null, error };
          }
        }
      }),
      limit: (limit: number) => ({
        execute: async () => {
          try {
            const response = await api.get(`/directus/${table}`, {
              params: {
                fields,
                limit
              }
            });
            return { data: response.data, error: null };
          } catch (error) {
            console.error(`Erreur lors de la récupération des données de ${table}:`, error);
            return { data: null, error };
          }
        },
        eq: (column: string, value: any) => ({
          execute: async () => {
            try {
              const response = await api.get(`/directus/${table}`, {
                params: {
                  fields,
                  limit,
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
        order: (column: string, { ascending = true } = {}) => ({
          execute: async () => {
            try {
              const response = await api.get(`/directus/${table}`, {
                params: {
                  fields,
                  limit,
                  sort: `${ascending ? '' : '-'}${column}`
                }
              });
              return { data: response.data, error: null };
            } catch (error) {
              console.error(`Erreur lors de la récupération des données de ${table}:`, error);
              return { data: null, error };
            }
          }
        })
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
      },
      // Ajout d'une méthode single pour obtenir un seul enregistrement
      single: async () => {
        try {
          const response = await api.get(`/directus/${table}/first`, {
            params: {
              fields,
              limit: 1
            }
          });
          return { data: response.data && response.data.length > 0 ? response.data[0] : null, error: null };
        } catch (error) {
          console.error(`Erreur lors de la récupération d'un enregistrement de ${table}:`, error);
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
    upsert: (data: any) => ({
      execute: async () => {
        try {
          const response = await api.post(`/directus/${table}/upsert`, data);
          return { data: response.data, error: null };
        } catch (error) {
          console.error(`Erreur lors de l'upsert de données dans ${table}:`, error);
          return { data: null, error };
        }
      }
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
    }),
    // Ajout d'une méthode select directe pour utilisation simplifiée
    count: (column: string = '*') => ({
      execute: async () => {
        try {
          const response = await api.get(`/directus/${table}/count`, {
            params: { fields: column }
          });
          return { count: response.data.count || 0, error: null };
        } catch (error) {
          console.error(`Erreur lors du comptage des données de ${table}:`, error);
          return { count: 0, error };
        }
      }
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
    },
    // Ajout de fonctions supplémentaires d'authentification
    getSession: async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          return { data: { session: null }, error: null };
        }
        const response = await api.get('/auth/session');
        return { data: { session: response.data }, error: null };
      } catch (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        return { data: { session: null }, error };
      }
    },
    getUser: async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          return { data: { user: null }, error: null };
        }
        const response = await api.get('/auth/user');
        return { data: { user: response.data }, error: null };
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return { data: { user: null }, error };
      }
    },
    updateUser: async (updates: any) => {
      try {
        const response = await api.patch('/auth/user', updates);
        return { data: response.data, error: null };
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        return { data: null, error };
      }
    },
    admin: {
      // Ajout de fonctions d'administration
      createUser: async (userData: any) => {
        try {
          const response = await api.post('/admin/users', userData);
          return { data: response.data, error: null };
        } catch (error) {
          console.error('Erreur lors de la création d\'utilisateur:', error);
          return { data: null, error };
        }
      },
      deleteUser: async (userId: string) => {
        try {
          const response = await api.delete(`/admin/users/${userId}`);
          return { data: response.data, error: null };
        } catch (error) {
          console.error('Erreur lors de la suppression d\'utilisateur:', error);
          return { data: null, error };
        }
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
  },

  // Ajouter des fonctions Edge/Serveur
  functions: {
    invoke: async (functionName: string, options?: { body?: any }) => {
      try {
        const response = await api.post(`/functions/${functionName}`, options?.body || {});
        return { data: response.data, error: null };
      } catch (error) {
        console.error(`Erreur lors de l'invocation de la fonction ${functionName}:`, error);
        return { data: null, error };
      }
    }
  }
};

// Exporter le client pour compatibilité avec les anciens imports
export { apiClient as supabase };
export default apiClient;
