
import { useEffect } from 'react';
import { authStore } from '@/stores/authStore';
import { authService } from '@/services/auth';
import { AuthUser } from '@/types/auth';
import { AuthActions } from '@/types/authStore';
import { useApiError } from './useApiError';

// Hook combinant le store d'authentification et les actions du service d'authentification
export const useAuth = (): {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  impersonatedUser: AuthUser | null;
} & AuthActions => {
  // Récupérer l'état du store
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    impersonatedUser 
  } = authStore();
  
  const { handleError } = useApiError();
  
  // Vérifier l'utilisateur au montage
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        await authService.checkUser();
      } catch (error) {
        handleError(error as Error);
      }
    };
    
    checkUserAuth();
  }, []);
  
  // Combiner l'état et les actions
  return {
    // État
    user,
    isAuthenticated,
    isLoading,
    impersonatedUser,
    
    // Actions
    ...authService
  };
};
