
import { supabase } from "@/integrations/supabase/client";
import { authStoreService } from "./authStore";
import { toast } from "sonner";

// Service for basic authentication operations
export const authenticationService = {
  // Login with email and password
  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
  },

  // Login with Google OAuth
  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
  },

  // Register new user
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
  },

  // Request password reset
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/new-password`,
    });
    
    if (error) throw error;
  },

  // Update user password
  updatePassword: async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) throw error;
  },

  // Logout user
  logout: async () => {
    try {
      await supabase.auth.signOut();
      authStoreService.resetAuth();
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Échec de la déconnexion");
    }
  }
};
