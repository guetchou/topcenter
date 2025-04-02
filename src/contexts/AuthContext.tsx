
import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/services/api';
import { toast } from 'sonner';
import { UserRole } from '@/types/auth';

interface User {
  id: string;
  email: string;
  role: UserRole;
  profile: any;
}

interface AuthContextType {
  user: User | null;
  profile: any | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  userRole: UserRole | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string, token: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize the session
    const initSession = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          try {
            const response = await api.get('/auth/me');
            const userData = response.data.user;
            
            if (userData && userData.id) {
              setUser(userData);
              setProfile(userData.profile || null);
              setUserRole(userData.role as UserRole || null);
            } else {
              // Invalid user data
              localStorage.removeItem('auth_token');
              setUser(null);
            }
          } catch (error) {
            console.error("Error initializing session:", error);
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error initializing session:", error);
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;
      
      if (!userData || !userData.id) {
        throw new Error("Invalid user data received");
      }
      
      localStorage.setItem('auth_token', token);
      setUser(userData);
      setProfile(userData.profile || null);
      setUserRole(userData.role || null);
      
      toast.success("Connexion réussie");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Impossible de se connecter");
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      window.location.href = `${api.defaults.baseURL}/auth/google`;
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error("Impossible de se connecter avec Google");
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        fullName
      });
      
      const { token, user: userData } = response.data;
      
      if (!userData || !userData.id) {
        throw new Error("Invalid user data received");
      }
      
      localStorage.setItem('auth_token', token);
      setUser(userData);
      setProfile(userData.profile || null);
      setUserRole(userData.role || null);
      
      toast.success("Compte créé avec succès");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.response?.data?.message || "Impossible de créer le compte");
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await api.post('/auth/reset-password', { email });
      toast.success("Email de réinitialisation envoyé");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error(error.response?.data?.message || "Impossible d'envoyer l'email de réinitialisation");
      throw error;
    }
  };

  const updatePassword = async (password: string, token: string) => {
    try {
      await api.post('/auth/update-password', {
        password,
        token
      });
      
      toast.success("Mot de passe mis à jour");
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.response?.data?.message || "Impossible de mettre à jour le mot de passe");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('auth_token');
      setUser(null);
      setProfile(null);
      setUserRole(null);
      toast.success("Déconnexion réussie");
    } catch (error: any) {
      console.error("Logout error:", error);
      localStorage.removeItem('auth_token');
      setUser(null);
      setProfile(null);
      setUserRole(null);
      toast.error("Impossible de se déconnecter");
      throw error;
    }
  };

  // Safe check for admin roles
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        profile,
        isAdmin,
        isSuperAdmin,
        userRole,
        signIn, 
        signUp, 
        signOut, 
        signInWithGoogle,
        resetPassword,
        updatePassword,
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
