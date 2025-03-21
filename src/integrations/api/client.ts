
/**
 * Fichier client pour les intégrations API
 * Remplace l'ancien client Supabase après la migration vers NestJS + Directus
 */

import api from '@/services/api';

// Fonction utilitaire pour gérer les réponses d'API de manière cohérente
const processResponse = async (promise) => {
  try {
    const response = await promise;
    return { data: response.data, error: null };
  } catch (error) {
    console.error(`Erreur API:`, error);
    return { data: null, error };
  }
};

// Function to make the response object chainable (based on the Supabase API pattern)
const createChainableResponse = (executeMethod) => {
  // Return a function that will execute the method when called
  const chainableMethod = async () => {
    return await executeMethod();
  };
  
  // Add properties and methods to the chainable function
  Object.defineProperties(chainableMethod, {
    data: {
      get: async function() {
        const result = await executeMethod();
        return result.data;
      }
    },
    error: {
      get: async function() {
        const result = await executeMethod();
        return result.error;
      }
    }
  });
  
  return chainableMethod;
};

// Fonction utilitaire pour simuler la structure de l'ancien client Supabase
export const apiClient = {
  // Méthodes pour récupérer des données
  from: (table: string) => ({
    select: (fields: string = '*') => {
      const baseSelect = {
        order: (column: string, { ascending = true } = {}) => {
          const orderObj = {
            limit: (limit: number) => {
              const limitObj = {
                execute: async () => {
                  return processResponse(api.get(`/directus/${table}`, {
                    params: {
                      fields,
                      sort: `${ascending ? '' : '-'}${column}`,
                      limit
                    }
                  }));
                },
                eq: (column: string, value: any) => {
                  return {
                    execute: async () => {
                      return processResponse(api.get(`/directus/${table}`, {
                        params: {
                          fields,
                          sort: `${ascending ? '' : '-'}${column}`,
                          limit,
                          filter: { [column]: { _eq: value } }
                        }
                      }));
                    }
                  };
                },
                single: async () => {
                  return processResponse(api.get(`/directus/${table}/first`, {
                    params: {
                      fields,
                      sort: `${ascending ? '' : '-'}${column}`,
                      limit: 1
                    }
                  }));
                }
              };
              
              // Add data and error properties
              Object.defineProperties(limitObj, {
                data: {
                  get: async function() {
                    const result = await this.execute();
                    return result.data;
                  }
                },
                error: {
                  get: async function() {
                    const result = await this.execute();
                    return result.error;
                  }
                }
              });
              
              return limitObj;
            },
            eq: (column: string, value: any) => {
              const eqObj = {
                execute: async () => {
                  return processResponse(api.get(`/directus/${table}`, {
                    params: {
                      fields,
                      sort: `${ascending ? '' : '-'}${column}`,
                      filter: { [column]: { _eq: value } }
                    }
                  }));
                },
                order: (innerColumn: string, { ascending: innerAscending = true } = {}) => {
                  return {
                    execute: async () => {
                      return processResponse(api.get(`/directus/${table}`, {
                        params: {
                          fields,
                          filter: { [column]: { _eq: value } },
                          sort: `${innerAscending ? '' : '-'}${innerColumn}`
                        }
                      }));
                    },
                    limit: (limit: number) => {
                      return {
                        execute: async () => {
                          return processResponse(api.get(`/directus/${table}`, {
                            params: {
                              fields,
                              filter: { [column]: { _eq: value } },
                              sort: `${innerAscending ? '' : '-'}${innerColumn}`,
                              limit
                            }
                          }));
                        }
                      };
                    }
                  };
                },
                single: async () => {
                  return processResponse(api.get(`/directus/${table}/first`, {
                    params: {
                      fields,
                      filter: { [column]: { _eq: value } }
                    }
                  }));
                }
              };
              
              // Add data and error properties
              Object.defineProperties(eqObj, {
                data: {
                  get: async function() {
                    const result = await this.execute();
                    return result.data;
                  }
                },
                error: {
                  get: async function() {
                    const result = await this.execute();
                    return result.error;
                  }
                }
              });
              
              return eqObj;
            },
            execute: async () => {
              return processResponse(api.get(`/directus/${table}`, {
                params: {
                  fields,
                  sort: `${ascending ? '' : '-'}${column}`
                }
              }));
            },
            single: async () => {
              return processResponse(api.get(`/directus/${table}/first`, {
                params: {
                  fields,
                  sort: `${ascending ? '' : '-'}${column}`,
                  limit: 1
                }
              }));
            }
          };
          
          // Add data and error properties
          Object.defineProperties(orderObj, {
            data: {
              get: async function() {
                const result = await this.execute();
                return result.data;
              }
            },
            error: {
              get: async function() {
                const result = await this.execute();
                return result.error;
              }
            }
          });
          
          return orderObj;
        },
        eq: (column: string, value: any) => {
          const eqObj = {
            execute: async () => {
              return processResponse(api.get(`/directus/${table}`, {
                params: {
                  fields,
                  filter: { [column]: { _eq: value } }
                }
              }));
            },
            order: (innerColumn: string, { ascending: innerAscending = true } = {}) => {
              return {
                execute: async () => {
                  return processResponse(api.get(`/directus/${table}`, {
                    params: {
                      fields,
                      filter: { [column]: { _eq: value } },
                      sort: `${innerAscending ? '' : '-'}${innerColumn}`
                    }
                  }));
                },
                limit: (limit: number) => {
                  return {
                    execute: async () => {
                      return processResponse(api.get(`/directus/${table}`, {
                        params: {
                          fields,
                          filter: { [column]: { _eq: value } },
                          sort: `${innerAscending ? '' : '-'}${innerColumn}`,
                          limit
                        }
                      }));
                    }
                  };
                }
              };
            },
            single: async () => {
              return processResponse(api.get(`/directus/${table}/first`, {
                params: {
                  fields,
                  filter: { [column]: { _eq: value } }
                }
              }));
            }
          };
          
          // Add data and error properties
          Object.defineProperties(eqObj, {
            data: {
              get: async function() {
                const result = await this.execute();
                return result.data;
              }
            },
            error: {
              get: async function() {
                const result = await this.execute();
                return result.error;
              }
            }
          });
          
          return eqObj;
        },
        limit: (limit: number) => {
          const limitObj = {
            execute: async () => {
              return processResponse(api.get(`/directus/${table}`, {
                params: {
                  fields,
                  limit
                }
              }));
            },
            eq: (column: string, value: any) => {
              return {
                execute: async () => {
                  return processResponse(api.get(`/directus/${table}`, {
                    params: {
                      fields,
                      limit,
                      filter: { [column]: { _eq: value } }
                    }
                  }));
                }
              };
            },
            order: (column: string, { ascending = true } = {}) => {
              return {
                execute: async () => {
                  return processResponse(api.get(`/directus/${table}`, {
                    params: {
                      fields,
                      limit,
                      sort: `${ascending ? '' : '-'}${column}`
                    }
                  }));
                }
              };
            },
            single: async () => {
              return processResponse(api.get(`/directus/${table}/first`, {
                params: {
                  fields,
                  limit: 1
                }
              }));
            }
          };
          
          // Add data and error properties
          Object.defineProperties(limitObj, {
            data: {
              get: async function() {
                const result = await this.execute();
                return result.data;
              }
            },
            error: {
              get: async function() {
                const result = await this.execute();
                return result.error;
              }
            }
          });
          
          return limitObj;
        },
        execute: async () => {
          return processResponse(api.get(`/directus/${table}`, {
            params: { fields }
          }));
        },
        single: async () => {
          return processResponse(api.get(`/directus/${table}/first`, {
            params: {
              fields,
              limit: 1
            }
          }));
        }
      };
      
      // Add data and error properties
      Object.defineProperties(baseSelect, {
        data: {
          get: async function() {
            const result = await this.execute();
            return result.data;
          }
        },
        error: {
          get: async function() {
            const result = await this.execute();
            return result.error;
          }
        }
      });
      
      return baseSelect;
    },
    insert: (data: any) => ({
      execute: async () => {
        return processResponse(api.post(`/directus/${table}`, data));
      },
      select: () => ({
        execute: async () => {
          const result = await processResponse(api.post(`/directus/${table}`, data));
          return result;
        }
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        execute: async () => {
          return processResponse(api.patch(`/directus/${table}/${value}`, data));
        }
      })
    }),
    upsert: (data: any, options?: any) => ({
      execute: async () => {
        return processResponse(api.post(`/directus/${table}/upsert`, { data, options }));
      }
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        execute: async () => {
          return processResponse(api.delete(`/directus/${table}/${value}`));
        }
      })
    }),
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
      return processResponse(api.post('/auth/register', credentials));
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
      return processResponse(api.post('/auth/reset-password', { email }));
    },
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
      return processResponse(api.patch('/auth/user', updates));
    },
    admin: {
      createUser: async (userData: any) => {
        return processResponse(api.post('/admin/users', userData));
      },
      deleteUser: async (userId: string) => {
        return processResponse(api.delete(`/admin/users/${userId}`));
      },
      listUsers: async () => {
        return processResponse(api.get('/admin/users'));
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
