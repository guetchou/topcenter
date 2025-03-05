
// Types pour les rôles utilisateur
export type UserRole = 'super_admin' | 'admin' | 'commercial_agent' | 'support_agent' | 'client';

// Définition du type pour les rôles dans la base de données
// Note: Ceci correspond aux valeurs dans l'enum app_role de la base de données
export type DbUserRole = 'super_admin' | 'admin' | 'commercial_agent' | 'support_agent' | 'client';

// Type pour les informations utilisateur
export interface AuthUser {
  id: string;
  role: UserRole | null;
  email: string | null;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}
