
import api from "../api";
import { toast } from "sonner";
import { AuthUser } from "@/types/auth";
import { authStoreService } from "./authStore";

// Service pour les opérations d'authentification avec NestJS et JWT
export const authenticationService = {
  // Connexion avec email et mot de passe
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Stocker le token dans le localStorage
      localStorage.setItem('auth_token', token);
      
      // Mettre à jour le store avec les informations utilisateur
      authStoreService.setUser(user);
      
      return user;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  },

  // Connexion avec Google OAuth
  loginWithGoogle: async () => {
    try {
      window.location.href = `${api.defaults.baseURL}/auth/google`;
    } catch (error) {
      console.error("Erreur de connexion avec Google:", error);
      throw error;
    }
  },

  // Inscription d'un nouvel utilisateur
  register: async (email: string, password: string, fullName: string) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        fullName
      });
      
      const { token, user } = response.data;
      
      // Stocker le token dans le localStorage
      localStorage.setItem('auth_token', token);
      
      // Mettre à jour le store avec les informations utilisateur
      authStoreService.setUser(user);
      
      return user;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      throw error;
    }
  },

  // Demande de réinitialisation de mot de passe
  resetPassword: async (email: string) => {
    try {
      await api.post('/auth/reset-password', { email });
      toast.success("Instructions de réinitialisation envoyées à votre email");
    } catch (error) {
      console.error("Erreur de réinitialisation de mot de passe:", error);
      throw error;
    }
  },

  // Mise à jour du mot de passe
  updatePassword: async (password: string) => {
    try {
      await api.post('/auth/update-password', { password });
      toast.success("Mot de passe mis à jour avec succès");
    } catch (error) {
      console.error("Erreur de mise à jour du mot de passe:", error);
      throw error;
    }
  },

  // Déconnexion de l'utilisateur
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('auth_token');
      authStoreService.resetAuth();
      toast.success("Déconnexion réussie");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      localStorage.removeItem('auth_token');
      authStoreService.resetAuth();
    }
  },

  // Vérification du token
  checkAuthToken: async (): Promise<AuthUser | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('auth_token');
      return null;
    }
  }
};
