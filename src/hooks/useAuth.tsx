
import { useEffect } from 'react';
import { authStore } from '@/stores/authStore';
import { authService } from '@/services/auth';
import { UserWithProfile } from '@/types/auth';
import { useApiError } from './useApiError';

// Hook combining the auth store and the auth service actions
export const useAuth = () => {
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
    
    if (!isAuthenticated && !isLoading) {
      checkUserAuth();
    }
  }, [isAuthenticated, isLoading, handleError]);
  
  // Override login to support dev mode
  const login = async (email: string, password: string, devMode = false) => {
    try {
      await authService.login(email, password, devMode);
    } catch (error) {
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await authService.loginWithGoogle();
    } catch (error) {
      throw error;
    }
  };

  const promoteToSuperAdmin = async (userId: string) => {
    try {
      await authService.promoteToSuperAdmin(userId);
    } catch (error) {
      throw error;
    }
  };
  
  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    impersonatedUser,
    
    // Actions
    login,
    loginWithGoogle,
    logout: authService.logout,
    register: authService.register,
    checkUser: authService.checkUser,
    resetPassword: authService.resetPassword,
    impersonateUser: authService.impersonateUser,
    stopImpersonation: authService.stopImpersonation,
    promoteToSuperAdmin,
  };
};
