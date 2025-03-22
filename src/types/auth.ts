
export interface UserProfile {
  id?: string;
  user_id?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  updated_at?: string;
}

export interface UserWithProfile {
  id: string;
  email?: string;
  role?: string;
  profile?: UserProfile;
}

export interface AuthStore {
  user: UserWithProfile | null;
  impersonatedUser: UserWithProfile | null;
  session: any | null;
  loading: boolean;
  initialized: boolean;
  setSession: (session: any | null) => void;
  setUser: (user: UserWithProfile | null) => void;
  setImpersonatedUser: (user: UserWithProfile | null) => void;
  reset: () => void;
}

// Types pour les rôles utilisateurs
export type UserRole = 'master_admin' | 'super_admin' | 'admin' | 'commercial_agent' | 'support_agent' | 'client';
export type DbUserRole = 'master_admin' | 'super_admin' | 'admin' | 'commercial_agent' | 'support_agent' | 'client';

// Interface pour l'utilisateur authentifié avec un profil
export interface AuthUser {
  id: string;
  email?: string;
  role?: UserRole;
  profile?: UserProfile;
}

// Interface pour la session d'authentification
export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  user: AuthUser;
}

// Statut de l'authentification
export enum AuthStatus {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

// État du formulaire d'authentification
export interface AuthFormState {
  email: string;
  password: string;
  fullName?: string;
  error?: string;
  loading: boolean;
}

// Interface pour les actions du formulaire d'authentification
export type AuthFormAction = 
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_FULL_NAME'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET' };

// Options disponibles pour l'authentification
export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  GITHUB = 'github',
}

// Types de méthodes d'authentification
export enum AuthMethod {
  SIGNIN = 'signin',
  SIGNUP = 'signup',
  RESET_PASSWORD = 'reset_password',
}
