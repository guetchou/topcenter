
import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  setAdmin: (isAdmin: boolean) => void;
}

export const useAuth = create<AuthStore>((set) => ({
  isAuthenticated: false,
  isAdmin: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, isAdmin: false }),
  setAdmin: (isAdmin: boolean) => set({ isAdmin }),
}));
