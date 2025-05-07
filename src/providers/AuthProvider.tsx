
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  user: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
  impersonatedUser: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  stopImpersonation: () => void;
}

const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  user: null,
  impersonatedUser: null,
  login: async () => false,
  logout: () => {},
  stopImpersonation: () => {}
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<AuthContextType['impersonatedUser']>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulation d'une connexion réussie
      console.log(`Tentative de connexion avec ${email}`);
      setIsLoggedIn(true);
      setUser({
        id: '1',
        name: 'Utilisateur Test',
        email,
        role: 'user'
      });
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setImpersonatedUser(null);
  };

  const stopImpersonation = () => {
    setImpersonatedUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      impersonatedUser,
      login, 
      logout,
      stopImpersonation 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
