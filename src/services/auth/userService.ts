
import api from "../api";
import { authStoreService } from "./authStore";
import { UserRole, AuthUser } from "@/types/auth";

// Service pour les opérations sur les données utilisateur avec NestJS
export const userService = {
  // Récupérer les données utilisateur
  fetchUserData: async (userId: string): Promise<AuthUser | null> => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.user;
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error);
      return null;
    }
  },
  
  // Vérifier et mettre à jour l'état de l'utilisateur actuel
  checkUser: async () => {
    try {
      authStoreService.setLoading(true);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        authStoreService.setUser(null);
        authStoreService.setLoading(false);
        return;
      }

      // Récupérer les informations utilisateur du serveur
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      
      if (userData) {
        authStoreService.setUser({
          id: userData.id,
          email: userData.email,
          role: userData.role as UserRole,
          profile: userData.profile
        });
      } else {
        authStoreService.setUser(null);
      }
      
      authStoreService.setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la vérification de l'utilisateur:", error);
      authStoreService.setUser(null);
      authStoreService.setLoading(false);
    }
  }
};
