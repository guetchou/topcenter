
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, UserX } from 'lucide-react';

export const ImpersonationBanner: React.FC = () => {
  const { impersonatedUser, stopImpersonation, user } = useAuth();

  if (!impersonatedUser || !user || user.role !== 'super_admin') {
    return null;
  }

  return (
    <Alert variant="destructive" className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Vous êtes connecté en tant que {impersonatedUser.email} (impersonnification)
        </AlertDescription>
      </div>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={stopImpersonation}
      >
        <UserX className="h-4 w-4 mr-2" />
        Arrêter l'impersonnification
      </Button>
    </Alert>
  );
};
