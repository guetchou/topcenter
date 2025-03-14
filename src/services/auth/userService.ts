
import { supabase } from "@/integrations/supabase/client";
import { authStoreService } from "./authStore";
import { UserRole, DbUserRole, AuthUser } from "@/types/auth";

// Service for user data operations
export const userService = {
  // Fetch user data including role and profile
  fetchUserData: async (userId: string): Promise<AuthUser | null> => {
    try {
      // Get user role
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      // Get auth user email
      const { data: userData, error } = await supabase.auth.admin.getUserById(userId);
      
      if (error) throw error;
      
      return {
        id: userId,
        email: userData.user.email,
        role: (roleData?.role as UserRole) || 'client',
        profile
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  },
  
  // Check and update current user state
  checkUser: async () => {
    try {
      authStoreService.setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        authStoreService.setUser(null);
        authStoreService.setLoading(false);
        return;
      }

      // Fetch user data including role and profile
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

      authStoreService.setUser({
        id: session.user.id,
        email: session.user.email,
        role: (roleData?.role as UserRole) || 'client',
        profile
      });
      
      authStoreService.setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
      authStoreService.setUser(null);
      authStoreService.setLoading(false);
    }
  }
};
