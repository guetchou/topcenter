
import { authStore } from "@/stores/authStore";
import { AuthUser } from "@/types/auth";

// Service for managing auth state in the store
export const authStoreService = {
  // Get current auth state
  getState: () => authStore.getState(),
  
  // Set user data
  setUser: (user: AuthUser | null) => {
    authStore.getState().setUser(user);
    authStore.getState().setIsAuthenticated(!!user);
  },
  
  // Set loading state
  setLoading: (isLoading: boolean) => {
    authStore.getState().setIsLoading(isLoading);
  },
  
  // Set impersonated user
  setImpersonatedUser: (user: AuthUser | null) => {
    authStore.getState().setImpersonatedUser(user);
  },
  
  // Reset authentication state
  resetAuth: () => {
    authStore.getState().resetAuth();
  }
};
