
import React from 'react';
import { AuthProvider } from './AuthProvider';
import { HelmetProvider } from 'react-helmet-async';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <HelmetProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </HelmetProvider>
  );
};
