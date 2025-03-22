
import { createChainable, extendChainable, processResponse } from '../utils';
import api from '@/services/api';

// Module pour manipuler les tables
export const createTableModule = (table: string) => {
  return {
    select: (fields: string = '*') => {
      // Base select avec les propriétés data et error accessibles directement
      const baseSelect = createChainable(async () => {
        return processResponse(api.get(`/directus/${table}`, {
          params: { fields }
        }));
      });
      
      // Ajouter les méthodes de chaînage avec data et error également accessibles
      return extendChainable(baseSelect, {
        order: (column: string, { ascending = true } = {}) => {
          const orderChainable = createChainable(async () => {
            return processResponse(api.get(`/directus/${table}`, {
              params: {
                fields,
                sort: `${ascending ? '' : '-'}${column}`
              }
            }));
          });
          
          return extendChainable(orderChainable, {
            limit: (limit: number) => {
              const limitChainable = createChainable(async () => {
                return processResponse(api.get(`/directus/${table}`, {
                  params: {
                    fields,
                    sort: `${ascending ? '' : '-'}${column}`,
                    limit
                  }
                }));
              });
              
              return extendChainable(limitChainable, {
                eq: (column: string, value: any) => {
                  return createChainable(async () => {
                    return processResponse(api.get(`/directus/${table}`, {
                      params: {
                        fields,
                        sort: `${ascending ? '' : '-'}${column}`,
                        limit,
                        filter: { [column]: { _eq: value } }
                      }
                    }));
                  });
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
              });
            },
            eq: (column: string, value: any) => {
              const eqChainable = createChainable(async () => {
                return processResponse(api.get(`/directus/${table}`, {
                  params: {
                    fields,
                    sort: `${ascending ? '' : '-'}${column}`,
                    filter: { [column]: { _eq: value } }
                  }
                }));
              });
              
              return extendChainable(eqChainable, {
                order: (innerColumn: string, { ascending: innerAscending = true } = {}) => {
                  const innerOrderChainable = createChainable(async () => {
                    return processResponse(api.get(`/directus/${table}`, {
                      params: {
                        fields,
                        filter: { [column]: { _eq: value } },
                        sort: `${innerAscending ? '' : '-'}${innerColumn}`
                      }
                    }));
                  });
                  
                  return extendChainable(innerOrderChainable, {
                    limit: (limit: number) => {
                      return createChainable(async () => {
                        return processResponse(api.get(`/directus/${table}`, {
                          params: {
                            fields,
                            filter: { [column]: { _eq: value } },
                            sort: `${innerAscending ? '' : '-'}${innerColumn}`,
                            limit
                          }
                        }));
                      });
                    }
                  });
                },
                single: async () => {
                  return processResponse(api.get(`/directus/${table}/first`, {
                    params: {
                      fields,
                      filter: { [column]: { _eq: value } }
                    }
                  }));
                }
              });
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
          });
        },
        eq: (column: string, value: any) => {
          const eqChainable = createChainable(async () => {
            return processResponse(api.get(`/directus/${table}`, {
              params: {
                fields,
                filter: { [column]: { _eq: value } }
              }
            }));
          });
          
          return extendChainable(eqChainable, {
            order: (innerColumn: string, { ascending: innerAscending = true } = {}) => {
              const orderChainable = createChainable(async () => {
                return processResponse(api.get(`/directus/${table}`, {
                  params: {
                    fields,
                    filter: { [column]: { _eq: value } },
                    sort: `${innerAscending ? '' : '-'}${innerColumn}`
                  }
                }));
              });
              
              return extendChainable(orderChainable, {
                limit: (limit: number) => {
                  return createChainable(async () => {
                    return processResponse(api.get(`/directus/${table}`, {
                      params: {
                        fields,
                        filter: { [column]: { _eq: value } },
                        sort: `${innerAscending ? '' : '-'}${innerColumn}`,
                        limit
                      }
                    }));
                  });
                },
                eq: (column: string, value: any) => {
                  return createChainable(async () => {
                    return processResponse(api.get(`/directus/${table}`, {
                      params: {
                        fields,
                        filter: { [column]: { _eq: value } }
                      }
                    }));
                  });
                }
              });
            },
            eq: (column: string, value: any) => {
              return createChainable(async () => {
                return processResponse(api.get(`/directus/${table}`, {
                  params: {
                    fields,
                    filter: { [column]: { _eq: value } }
                  }
                }));
              });
            },
            single: async () => {
              return processResponse(api.get(`/directus/${table}/first`, {
                params: {
                  fields,
                  filter: { [column]: { _eq: value } }
                }
              }));
            }
          });
        },
        limit: (limit: number) => {
          const limitChainable = createChainable(async () => {
            return processResponse(api.get(`/directus/${table}`, {
              params: {
                fields,
                limit
              }
            }));
          });
          
          return extendChainable(limitChainable, {
            eq: (column: string, value: any) => {
              return createChainable(async () => {
                return processResponse(api.get(`/directus/${table}`, {
                  params: {
                    fields,
                    limit,
                    filter: { [column]: { _eq: value } }
                  }
                }));
              });
            },
            order: (column: string, { ascending = true } = {}) => {
              return createChainable(async () => {
                return processResponse(api.get(`/directus/${table}`, {
                  params: {
                    fields,
                    limit,
                    sort: `${ascending ? '' : '-'}${column}`
                  }
                }));
              });
            },
            single: async () => {
              return processResponse(api.get(`/directus/${table}/first`, {
                params: {
                  fields,
                  limit: 1
                }
              }));
            }
          });
        },
        single: async () => {
          return processResponse(api.get(`/directus/${table}/first`, {
            params: {
              fields,
              limit: 1
            }
          }));
        }
      });
    },
    
    insert: (data: any) => {
      const insertChainable = createChainable(async () => {
        return processResponse(api.post(`/directus/${table}`, data));
      });
      
      return extendChainable(insertChainable, {
        select: () => {
          return createChainable(async () => {
            const result = await processResponse(api.post(`/directus/${table}`, data));
            return result;
          });
        }
      });
    },
    
    update: (data: any) => ({
      eq: (column: string, value: any) => {
        return createChainable(async () => {
          return processResponse(api.patch(`/directus/${table}/${value}`, data));
        });
      }
    }),
    
    upsert: (data: any, options?: any) => {
      return createChainable(async () => {
        return processResponse(api.post(`/directus/${table}/upsert`, { data, options }));
      });
    },
    
    delete: () => ({
      eq: (column: string, value: any) => {
        return createChainable(async () => {
          return processResponse(api.delete(`/directus/${table}/${value}`));
        });
      }
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
  };
};
