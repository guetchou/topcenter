
import { authStore } from './authStore';
import { authModule } from '@/integrations/api/modules/authModule';

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
      const { data, error } = await authModule.signIn({ email, password }, devMode && isDevelopment());
      
      if (error) throw error;
      
      if (data && data.user) {
        authStore.setState({ 
          user: data.user,
          isAuthenticated: true,
          isLoading: false
        });
        return data.user;
      }
      
      throw new Error('Erreur de connexion: données utilisateur manquantes');
    } catch (error: any) {
      authStore.setState({ isLoading: false });
      throw error;
    }
  },
  
  loginWithGoogle: async () => {
    authStore.setState({ isLoading: true });
    
    try {
      // Rediriger vers l'auth Google via Supabase ou autre provider
      // Cette partie dépend de votre implémentation spécifique
      
      // Pour simulation, on va juste lancer une erreur
      throw new Error('Google login not implemented yet');
    } catch (error: any) {
      authStore.setState({ isLoading: false });
      throw error;
    }
  },
  
  register: async (email: string, password: string, fullName: string) => {
    authStore.setState({ isLoading: true });
    
    try {
      const { data, error } = await authModule.signUp({ email, password });
      
      if (error) throw error;
      
      authStore.setState({ isLoading: false });
      return data;
    } catch (error: any) {
      authStore.setState({ isLoading: false });
      throw error;
    }
  },
  
  logout: async () => {
    authStore.setState({ isLoading: true });
    
    try {
      const { error } = await authModule.signOut();
      
      if (error) throw error;
      
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
      const { data, error } = await authModule.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      throw error;
    }
  },
  
  checkUser: async () => {
    // Ne pas afficher le loader pour cette vérification silencieuse
    const currentState = authStore.getState();
    
    if (currentState.isLoading || currentState.isAuthenticated) {
      return;
    }
    
    authStore.setState({ isLoading: true });
    
    try {
      const { data, error } = await authModule.getUser();
      
      if (error) {
        console.error('Error checking user:', error);
        authStore.setState({ isLoading: false });
        return;
      }
      
      if (data && data.user) {
        authStore.setState({ 
          user: data.user,
          isAuthenticated: true,
          isLoading: false
        });
        return data.user;
      } else {
        authStore.setState({ isLoading: false });
      }
    } catch (error: any) {
      console.error('Error checking user:', error);
      authStore.setState({ isLoading: false });
    }
  }
};
