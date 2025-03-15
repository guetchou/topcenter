
import { useEffect } from 'react';
import { authStore } from '@/stores/authStore';
import { authService } from '@/services/auth';
import { AuthUser } from '@/types/auth';
import { AuthActions } from '@/types/authStore';

// Hook combining auth store and auth service actions
export const useAuth = (): {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  impersonatedUser: AuthUser | null;
} & AuthActions => {
  // Get state from store
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    impersonatedUser 
  } = authStore();
  
  // Check user on mount
  useEffect(() => {
    authService.checkUser();
  }, []);
  
  // Combine state and actions
  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    impersonatedUser,
    
    // Actions
    ...authService
  };
};
