
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser } from '@/types/auth';
import { AuthState, AuthStore } from '@/types/authStore';

// État initial de l'authentification
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  impersonatedUser: null,
};

// Création du store Zustand pour l'authentification
export const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Setters
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setImpersonatedUser: (impersonatedUser) => set({ impersonatedUser }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      // Reset
      resetAuth: () => set({ 
        user: null, 
        impersonatedUser: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        impersonatedUser: state.impersonatedUser,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
