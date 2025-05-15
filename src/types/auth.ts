
// Type definitions for auth-related functionality

export interface UserWithProfile {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  profile?: {
    avatar?: string;
    phone?: string;
    address?: string;
    bio?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserWithProfile | null;
  impersonatedUser: UserWithProfile | null;
  loading: boolean;
  error: string | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  name: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: UserWithProfile;
  token: string;
  refreshToken?: string;
}

export type AuthRole = 'admin' | 'manager' | 'agent' | 'client' | 'user' | 'guest';

export interface PermissionCheck {
  minRole: AuthRole;
  currentRole: AuthRole | undefined;
}

// Legacy auth types for backward compatibility
export type UserRole = AuthRole;
export type DbUserRole = AuthRole;
export type AuthUser = UserWithProfile;
