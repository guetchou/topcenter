
import { useEffect } from 'react';
import { authStore } from '@/stores/authStore';
import { authService } from '@/services/auth';
import { AuthUser } from '@/types/auth';
import { AuthActions } from '@/types/authStore';
import { useApiError } from './useApiError';

// Hook combining the auth store and the auth service actions
export const useAuth = (): {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  impersonatedUser: AuthUser | null;
  login: (email: string, password: string, devMode?: boolean) => Promise<void>;
} & Omit<AuthActions, 'login'> => {
  // Get the store state
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    impersonatedUser 
  } = authStore();
  
  const { handleError } = useApiError();
  
  // Check user auth on mount
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
  
  // Override login to support dev mode
  const login = async (email: string, password: string, devMode = false) => {
    try {
      await authService.login(email, password, devMode);
    } catch (error) {
      throw error;
    }
  };
  
  // Combine state and actions
  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    impersonatedUser,
    
    // Actions
    login,
    ...authService,
  };
};
