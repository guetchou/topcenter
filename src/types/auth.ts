
export interface UserWithProfile {
  id: string;
  email: string;
  fullName?: string;
  full_name?: string;
  role: string;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  profile?: {
    fullName?: string;
    phone?: string;
    address?: string;
    bio?: string;
  };
}

export type AuthRole = "user" | "client" | "manager" | "agent" | "admin" | "super_admin" | "guest";

// Alias pour la compatibilité
export type AuthUser = UserWithProfile;
export type UserRole = AuthRole;
export type DbUserRole = AuthRole;
