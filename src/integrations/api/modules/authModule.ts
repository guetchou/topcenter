
import { processResponse } from '../utils';
import api from '@/services/api';

// Module pour l'authentification
export const authModule = {
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
};
