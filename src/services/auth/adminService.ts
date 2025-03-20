
import api from "../api";
import { authStoreService } from "./authStore";
import { userService } from "./userService";
import { toast } from "sonner";

// Service pour les opérations d'administration
export const adminService = {
  // Impersonner un utilisateur (pour les administrateurs)
  impersonateUser: async (userId: string) => {
    try {
      const response = await api.post('/admin/impersonate', { userId });
      const { token, user } = response.data;
      
      if (!user) {
        toast.error("Utilisateur non trouvé");
        return;
      }
      
      // Stocker les données d'origine
      const currentUser = authStoreService.getState().user;
      if (currentUser) {
        // Stocker l'utilisateur actuel comme utilisateur impersonné
        authStoreService.setImpersonatedUser(user);
        
        // Utiliser le nouveau token pour les requêtes API
        localStorage.setItem('impersonation_token', token);
        
        toast.success(`Impersonnification en tant que ${user.email}`);
      }
    } catch (error) {
      console.error("Erreur lors de l'impersonnification:", error);
      toast.error("Impossible d'impersonner cet utilisateur");
    }
  },
  
  // Arrêter l'impersonnification
  stopImpersonation: () => {
    // Supprimer le token d'impersonnification
    localStorage.removeItem('impersonation_token');
    
    // Réinitialiser l'utilisateur impersonné
    authStoreService.setImpersonatedUser(null);
    
    // Rafraîchir les données utilisateur
    userService.checkUser();
    
    toast.success("Impersonnification terminée");
  },
  
  // Promouvoir un utilisateur en super admin
  promoteToSuperAdmin: async (userId: string) => {
    try {
      await api.post('/admin/promote', { userId, role: 'super_admin' });
      toast.success("Utilisateur promu en super administrateur");
    } catch (error) {
      console.error("Erreur lors de la promotion:", error);
      toast.error("Impossible de promouvoir cet utilisateur");
    }
  }
};
