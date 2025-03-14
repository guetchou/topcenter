
import { supabase } from "@/integrations/supabase/client";
import { authStoreService } from "./authStore";
import { userService } from "./userService";
import { DbUserRole } from "@/types/auth";

// Service for admin operations
export const adminService = {
  // Impersonate another user
  impersonateUser: async (userId: string) => {
    const { user } = authStoreService.getState();
    
    if (!user || user.role !== 'super_admin') {
      throw new Error("Seuls les super administrateurs peuvent usurper l'identité des utilisateurs");
    }
    
    try {
      const impersonatedUser = await userService.fetchUserData(userId);
      
      if (!impersonatedUser) {
        throw new Error("Impossible de récupérer les données de l'utilisateur");
      }
      
      authStoreService.setImpersonatedUser(impersonatedUser);
      console.log(`Super admin impersonnifie l'utilisateur: ${userId}`);
    } catch (error) {
      console.error("Erreur lors de l'impersonnification:", error);
      throw error;
    }
  },
  
  // Stop impersonating user
  stopImpersonation: () => {
    authStoreService.setImpersonatedUser(null);
  },
  
  // Promote user to super admin
  promoteToSuperAdmin: async (userId: string) => {
    const { user } = authStoreService.getState();
    
    if (!user || user.role !== 'super_admin') {
      throw new Error("Seuls les super administrateurs peuvent promouvoir d'autres utilisateurs");
    }
    
    try {
      // Check if user already has a role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      const roleValue: DbUserRole = 'super_admin';
        
      if (existingRole) {
        // Update existing role
        await supabase
          .from('user_roles')
          .update({ role: roleValue })
          .eq('user_id', userId);
      } else {
        // Create new role
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
};
