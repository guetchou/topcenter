import React, { createContext, useContext, ReactNode, useState } from 'react';
import { UserWithProfile, AuthRole } from '@/types/auth';

interface AuthContextType {
  isLoggedIn: boolean;
  user: UserWithProfile | null;
  impersonatedUser: UserWithProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  stopImpersonation: () => void;
  isAdmin: (role?: AuthRole) => boolean;
  isSuperAdmin: (role?: AuthRole) => boolean;
}

const defaultAuthContext: AuthContextType = {
  isLoggedIn: false,
  user: null,
  impersonatedUser: null,
  login: async () => false,
  logout: () => { },
  stopImpersonation: () => { },
  isAdmin: () => false,
  isSuperAdmin: () => false,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [impersonatedUser, setImpersonatedUser] = useState<UserWithProfile | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulation d'une connexion réussie
      console.log(`Tentative de connexion avec ${email}`);
      setIsLoggedIn(true);
      setUser({
        id: '1',
        email: email,
        fullName: 'Utilisateur Test',
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

  const isAdmin = (role?: AuthRole): boolean => {
    return role === "admin" || role === "super_admin";
  };

  const isSuperAdmin = (role?: AuthRole): boolean => {
    return role === "super_admin";
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      impersonatedUser,
      login,
      logout,
      stopImpersonation,
      isAdmin,
      isSuperAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};
