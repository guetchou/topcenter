
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const DevModeAlert = () => {
  // Check if we are in development mode
  const isDevelopment = () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' || 
           window.location.hostname.includes('vercel.app');
  };
  
  if (!isDevelopment()) {
    return null;
  }
  
  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200" variant="default">
      <AlertDescription className="text-blue-800 flex items-center">
        <div className="bg-blue-100 p-1 rounded-full mr-2">
          <AlertCircle className="h-4 w-4 text-blue-500" />
        </div>
        Mode développement : Accès simplifié activé
      </AlertDescription>
    </Alert>
  );
};
