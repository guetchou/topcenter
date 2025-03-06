
import { supabase } from "@/integrations/supabase/client";
import { authStore } from "@/stores/authStore";
import { UserRole, DbUserRole, AuthUser } from "@/types/auth";
import { AuthActions } from "@/types/authStore";

// Service d'authentification contenant toutes les actions liées à l'authentification
export const authService: AuthActions = {
  // Vérifier l'utilisateur actuel
  checkUser: async () => {
    try {
      authStore.getState().setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        authStore.getState().setUser(null);
        authStore.getState().setIsAuthenticated(false);
        authStore.getState().setIsLoading(false);
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

      authStore.getState().setUser({
        id: session.user.id,
        email: session.user.email,
        role: (roleData?.role as UserRole) || 'client',
        profile
      });
      
      authStore.getState().setIsAuthenticated(true);
      authStore.getState().setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
      authStore.getState().setUser(null);
      authStore.getState().setIsAuthenticated(false);
      authStore.getState().setIsLoading(false);
    }
  },

  // Connexion avec email et mot de passe
  login: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    await authService.checkUser();
  },

  // Connexion avec Google
  loginWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
  },

  // Inscription
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
    
    await authService.checkUser();
  },

  // Réinitialisation de mot de passe
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/new-password`,
    });
    
    if (error) throw error;
  },

  // Mise à jour du mot de passe
  updatePassword: async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    
    if (error) throw error;
  },

  // Déconnexion
  logout: async () => {
    await supabase.auth.signOut();
    authStore.getState().resetAuth();
  },
  
  // Impersonnification d'un utilisateur
  impersonateUser: async (userId: string) => {
    const { user } = authStore.getState();
    
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
      const { data: authUserData, error } = await supabase.auth.admin.getUserById(userId);
      
      if (error) throw error;
        
      // Sauvegarder l'utilisateur impersonifié
      authStore.getState().setImpersonatedUser({
        id: userId,
        email: authUserData.user.email,
        role: (roleData?.role as UserRole) || 'client',
        profile
      });
      
      console.log(`Super admin impersonnifie l'utilisateur: ${userId}`);
    } catch (error) {
      console.error("Erreur lors de l'impersonnification:", error);
      throw error;
    }
  },
  
  // Arrêter l'impersonnification
  stopImpersonation: () => {
    authStore.getState().setImpersonatedUser(null);
  },
  
  // Promouvoir un utilisateur en super admin
  promoteToSuperAdmin: async (userId: string) => {
    const { user } = authStore.getState();
    
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
};

// Écouter les changements d'authentification
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    authService.checkUser();
  } else {
    authStore.getState().resetAuth();
  }
});
