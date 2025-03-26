
import React from 'react';
import usePocketBaseStatus from '@/hooks/usePocketBaseStatus';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const PocketBaseStatus = () => {
  const { isConnected, isChecking } = usePocketBaseStatus();

  return (
    <div className="flex items-center space-x-2 mb-4 p-2 bg-muted/50 rounded">
      <span className="text-xs text-muted-foreground">Base de données:</span>
      {isChecking ? (
        <Badge variant="outline" className="text-xs">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Vérification...
        </Badge>
      ) : isConnected ? (
        <Badge variant="success" className="bg-green-500 text-white text-xs">Connectée</Badge>
      ) : (
        <Badge variant="destructive" className="text-xs">Déconnectée</Badge>
      )}
    </div>
  );
};

export default PocketBaseStatus;
