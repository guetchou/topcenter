
import { UserRole, DbUserRole, AuthUser } from "@/types/auth";

export interface AuthServiceInterface {
  // Auth state checking
  checkUser: () => Promise<void>;
  
  // Authentication methods
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Admin operations
  impersonateUser: (userId: string) => Promise<void>;
  stopImpersonation: () => void;
  promoteToSuperAdmin: (userId: string) => Promise<void>;
}
