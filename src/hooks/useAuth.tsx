
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from "@/integrations/supabase/client";

type UserRole = 'admin' | 'commercial_agent' | 'support_agent' | 'client';

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
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
}

export const useAuth = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,

      checkUser: async () => {
        try {
          set({ isLoading: true });
          
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return;
          }

          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();

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
        set({ user: null, isAuthenticated: false });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Écouter les changements d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    useAuth.getState().checkUser();
  } else {
    useAuth.setState({ user: null, isAuthenticated: false });
  }
});
