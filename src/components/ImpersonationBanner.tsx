
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, UserX } from 'lucide-react';

export const ImpersonationBanner: React.FC = () => {
  const { user } = useAuth();
  // Vérifie si l'utilisateur actuel est en mode impersonnification
  // Note: Cette fonction devra être mise à jour lorsque l'impersonnification sera implémentée
  const isImpersonating = false;
  const impersonatedUser = null;

  if (!isImpersonating || !impersonatedUser) {
    return null;
  }

  const stopImpersonation = () => {
    // Cette fonction sera implémentée lorsque nous mettrons en place l'impersonnification
    console.log("Arrêt de l'impersonnification");
  };

  return (
    <Alert variant="destructive" className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
      <div className="flex items-center">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertDescription>
          Vous êtes connecté en tant que {impersonatedUser} (impersonnification)
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
