
import { create } from 'zustand';
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
  login: () => Promise<void>;
  logout: () => Promise<void>;
  checkUser: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,

  checkUser: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    set({
      user: {
        id: session.user.id,
        email: session.user.email,
        role: (roleData?.role as UserRole) || null,
        profile
      },
      isAuthenticated: true
    });
  },

  login: async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  }
}));
