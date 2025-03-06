
import { AuthUser, UserRole, DbUserRole } from './auth';

// État de l'authentification
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  impersonatedUser: AuthUser | null;
}

// Store d'authentification
export interface AuthStore extends AuthState {
  // Setters
  setUser: (user: AuthUser | null) => void;
  setImpersonatedUser: (user: AuthUser | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  
  // Reset
  resetAuth: () => void;
}

// Interface pour les actions d'authentification
export interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  impersonateUser: (userId: string) => Promise<void>;
  stopImpersonation: () => void;
  promoteToSuperAdmin: (userId: string) => Promise<void>;
}
