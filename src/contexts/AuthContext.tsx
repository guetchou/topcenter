
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '@/services/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          // Valider la session côté serveur
          const sessionResponse = await apiClient.auth.checkSession();
          
          if (sessionResponse.authenticated) {
            setUser(JSON.parse(storedUser));
          } else {
            // Session expirée, nettoyer le stockage local
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // En cas d'erreur, supposer que l'utilisateur n'est pas authentifié
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.auth.login({ email, password });
      
      if (response.user && response.token) {
        // Stocker les informations d'authentification
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        
        toast.success(`Bienvenue, ${response.user.fullName}`);
        return true;
      } else {
        toast.error('Identifiants incorrects');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Échec de la connexion');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
    toast.info('Vous avez été déconnecté');
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiClient.auth.register(userData);
      
      if (response.success) {
        toast.success('Inscription réussie. Vous pouvez maintenant vous connecter.');
        navigate('/login');
        return true;
      } else {
        toast.error(response.message || 'Échec de l\'inscription');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Échec de l\'inscription');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
