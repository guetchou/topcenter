
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
}

export type AuthRole = "user" | "client" | "manager" | "agent" | "admin" | "super_admin" | "guest";
