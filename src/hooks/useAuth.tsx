
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from "@/integrations/supabase/client";
import { UserRole, DbUserRole } from '@/types/auth';

interface AuthUser {
  id: string;
  role: UserRole | null;
  email: string | null;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface AuthStore {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  impersonatedUser: AuthUser | null;
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

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      impersonatedUser: null,

      checkUser: async () => {
        try {
          set({ isLoading: true });
          
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }

          // Récupérer le rôle de l'utilisateur
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();

          // Récupérer le profil de l'utilisateur
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          set({
            user: {
              id: session.user.id,
              email: session.user.email,
              role: (roleData?.role as UserRole) || 'client',
              profile
            },
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          console.error("Erreur lors de la vérification de l'utilisateur:", error);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        await get().checkUser();
      },

      loginWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });
        
        if (error) throw error;
      },

      register: async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        
        if (error) throw error;
        
        await get().checkUser();
      },

      resetPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/new-password`,
        });
        
        if (error) throw error;
      },

      updatePassword: async (password: string) => {
        const { error } = await supabase.auth.updateUser({
          password,
        });
        
        if (error) throw error;
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, impersonatedUser: null, isAuthenticated: false });
      },
      
      impersonateUser: async (userId: string) => {
        const { user } = get();
        
        if (!user || user.role !== 'super_admin') {
          throw new Error("Seuls les super administrateurs peuvent usurper l'identité des utilisateurs");
        }
        
        try {
          // Récupérer les informations de l'utilisateur à impersonifier
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .maybeSingle();
            
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
            
          // Récupérer l'email de l'utilisateur depuis l'API auth de Supabase
          const { data: userData } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', userId)
            .maybeSingle();
            
          // Sauvegarder l'utilisateur original et définir l'utilisateur impersonifié
          set({
            impersonatedUser: {
              id: userId,
              email: userData?.email || null,
              role: (roleData?.role as UserRole) || 'client',
              profile
            },
          });
          
          console.log(`Super admin impersonnifie l'utilisateur: ${userId}`);
        } catch (error) {
          console.error("Erreur lors de l'impersonnification:", error);
          throw error;
        }
      },
      
      stopImpersonation: () => {
        set({ impersonatedUser: null });
      },
      
      promoteToSuperAdmin: async (userId: string) => {
        const { user } = get();
        
        if (!user || user.role !== 'super_admin') {
          throw new Error("Seuls les super administrateurs peuvent promouvoir d'autres utilisateurs");
        }
        
        try {
          // Vérifier si l'utilisateur a déjà un rôle
          const { data: existingRole } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
            
          const roleValue: DbUserRole = 'super_admin';
            
          if (existingRole) {
            // Mettre à jour le rôle existant
            await supabase
              .from('user_roles')
              .update({ role: roleValue })
              .eq('user_id', userId);
          } else {
            // Créer un nouveau rôle
            await supabase
              .from('user_roles')
              .insert({ user_id: userId, role: roleValue });
          }
          
          console.log(`L'utilisateur ${userId} a été promu super admin`);
        } catch (error) {
          console.error("Erreur lors de la promotion:", error);
          throw error;
        }
      }
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

// Écouter les changements d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    useAuth.getState().checkUser();
  } else {
    useAuth.setState({ user: null, impersonatedUser: null, isAuthenticated: false });
  }
});
