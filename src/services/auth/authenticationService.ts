
import api from "../api";
import { toast } from "sonner";
import { AuthUser } from "@/types/auth";
import { authStoreService } from "./authStore";

// Service pour les opérations d'authentification avec NestJS et JWT
export const authenticationService = {
  // Connexion avec email et mot de passe
  login: async (email: string, password: string) => {
    try {
      // Vérifier d'abord si nous sommes en ligne
      const isOnline = navigator.onLine;
      if (!isOnline) {
        throw new Error("Vous êtes hors ligne. Veuillez vous reconnecter à Internet pour vous connecter.");
      }
      
      // Essayer de faire une simple requête pour vérifier l'état du serveur
      try {
        await fetch('/lovable-uploads/logo-topcenter.png', { method: 'HEAD' });
      } catch (e) {
        throw new Error("Impossible de se connecter au serveur. Veuillez réessayer plus tard.");
      }
      
      // Procéder à la connexion
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Stocker le token dans le localStorage
      localStorage.setItem('auth_token', token);
      
      // Mettre à jour le store avec les informations utilisateur
      authStoreService.setUser(user);
      
      return user;
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      
      // Message d'erreur plus informatif
      if (error.response?.status === 503) {
        throw new Error("Le service est temporairement indisponible. Veuillez réessayer plus tard.");
      } else if (error.code === "ERR_NETWORK") {
        throw new Error("Problème de connexion réseau. Vérifiez votre connexion Internet.");
      } else if (error.response?.status === 401) {
        throw new Error("Email ou mot de passe incorrect.");
      } else {
        throw error;
      }
    }
  },

  // Connexion avec Google OAuth
  loginWithGoogle: async () => {
    try {
      if (!navigator.onLine) {
        throw new Error("Vous êtes hors ligne. Veuillez vous reconnecter à Internet.");
      }
      
      window.location.href = `${api.defaults.baseURL}/auth/google`;
    } catch (error) {
      console.error("Erreur de connexion avec Google:", error);
      throw error;
    }
  },

  // Inscription d'un nouvel utilisateur
  register: async (email: string, password: string, fullName: string) => {
    try {
      if (!navigator.onLine) {
        throw new Error("Vous êtes hors ligne. Veuillez vous reconnecter à Internet.");
      }
      
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
      if (!navigator.onLine) {
        throw new Error("Vous êtes hors ligne. Veuillez vous reconnecter à Internet.");
      }
      
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
      if (!navigator.onLine) {
        throw new Error("Vous êtes hors ligne. Veuillez vous reconnecter à Internet.");
      }
      
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
      if (navigator.onLine) {
        await api.post('/auth/logout');
      }
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
      
      if (!navigator.onLine) {
        // En mode hors ligne, on pourrait implémenter une logique pour
        // permettre à l'utilisateur de continuer à utiliser l'application
        // avec des fonctionnalités limitées
        return null;
      }
      
      const response = await api.get('/auth/me');
      return response.data.user;
    } catch (error) {
      localStorage.removeItem('auth_token');
      return null;
    }
  }
};
