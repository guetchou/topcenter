
import { useEffect } from 'react';
import { authStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { AuthUser } from '@/types/auth';
import { AuthActions } from '@/types/authStore';

// Hook combinant le store et les actions d'authentification
export const useAuth = (): {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  impersonatedUser: AuthUser | null;
} & AuthActions => {
  // Récupération de l'état depuis le store
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    impersonatedUser 
  } = authStore();
  
  // Combinaison de l'état et des actions
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
