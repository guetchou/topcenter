
import { authStore } from '@/stores/authStore';
import api from '@/services/api';
import { UserWithProfile } from '@/types/auth';

// Helper for development mode
const isDevelopment = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' || 
         window.location.hostname.includes('vercel.app');
};

export const authenticationService = {
  login: async (email: string, password: string, devMode = false) => {
    authStore.setState({ isLoading: true });
    
    try {
      // Si on est en mode développement et devMode est true, on utilise le mode dev
      if (devMode && isDevelopment()) {
        const mockUser: UserWithProfile = {
          id: '1',
          email: email,
          fullName: 'Utilisateur Dev',
          role: 'admin'
        };
        
        localStorage.setItem('auth_token', 'dev-mode-token');
        authStore.setState({ 
          user: mockUser,
          isAuthenticated: true,
          isLoading: false
        });
        return mockUser;
      }
      
      // Utiliser la vraie API
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        authStore.setState({ 
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false
        });
        return response.data.user;
      }
      
      throw new Error(response.data.message || 'Erreur de connexion');
    } catch (error: any) {
      authStore.setState({ isLoading: false });
      throw new Error(error.response?.data?.message || error.message || 'Erreur de connexion');
    }
  },
  
  loginWithGoogle: async () => {
    throw new Error('Google login not implemented yet');
  },
  
  register: async (email: string, password: string, fullName: string) => {
    authStore.setState({ isLoading: true });
    
    try {
      const response = await api.post('/auth/register', { email, password, fullName });
      
      if (response.data.success) {
        authStore.setState({ isLoading: false });
        return response.data;
      }
      
      throw new Error(response.data.message || 'Erreur lors de l\'inscription');
    } catch (error: any) {
      authStore.setState({ isLoading: false });
      throw new Error(error.response?.data?.message || error.message || 'Erreur lors de l\'inscription');
    }
  },
  
  logout: async () => {
    authStore.setState({ isLoading: true });
    
    try {
      localStorage.removeItem('auth_token');
      authStore.setState({ 
        user: null,
        isAuthenticated: false,
        isLoading: false,
        impersonatedUser: null
      });
    } catch (error: any) {
      authStore.setState({ isLoading: false });
      throw error;
    }
  },
  
  resetPassword: async (email: string) => {
    try {
      const response = await api.post('/auth/reset-password', { email });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Erreur lors de la réinitialisation');
    }
  },
  
  checkUser: async () => {
    const currentState = authStore.getState();
    
    if (currentState.isLoading || currentState.isAuthenticated) {
      return;
    }
    
    authStore.setState({ isLoading: true });
    
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        authStore.setState({ isLoading: false });
        return;
      }
      
      // En mode dev avec token fictif
      if (isDevelopment() && token === 'dev-mode-token') {
        const mockUser: UserWithProfile = {
          id: '1',
          email: 'admin@topcenter.app',
          fullName: 'Utilisateur Dev',
          role: 'admin'
        };
        
        authStore.setState({ 
          user: mockUser,
          isAuthenticated: true,
          isLoading: false
        });
        return mockUser;
      }
      
      // Utiliser la vraie API
      const response = await api.get('/users/profile');
      
      if (response.data.success && response.data.user) {
        authStore.setState({ 
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false
        });
        return response.data.user;
      } else {
        localStorage.removeItem('auth_token');
        authStore.setState({ isLoading: false });
      }
    } catch (error: any) {
      console.error('Error checking user:', error);
      localStorage.removeItem('auth_token');
      authStore.setState({ isLoading: false });
    }
  },

  updateProfile: async (updates: any) => {
    try {
      const response = await api.put('/users/profile', updates);
      
      if (response.data.success) {
        authStore.setState({ user: response.data.user });
        return response.data.user;
      }
      
      throw new Error(response.data.message || 'Erreur lors de la mise à jour');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Erreur lors de la mise à jour');
    }
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await api.put('/users/password', { currentPassword, newPassword });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || error.message || 'Erreur lors du changement de mot de passe');
    }
  }
};
