
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { usePocketBaseStatus } from '@/integrations/pocketbase/client';
import { Loader2, Database, WifiOff } from 'lucide-react';

export const PocketBaseStatus: React.FC = () => {
  const { isAvailable, isChecking } = usePocketBaseStatus();

  return (
    <div className="flex items-center gap-2">
      {isChecking ? (
        <Badge variant="outline" className="text-xs flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Vérification PocketBase...</span>
        </Badge>
      ) : isAvailable ? (
        <Badge variant="success" className="text-xs flex items-center gap-1">
          <Database className="w-3 h-3" />
          <span>PocketBase connecté</span>
        </Badge>
      ) : (
        <Badge variant="destructive" className="text-xs flex items-center gap-1">
          <WifiOff className="w-3 h-3" />
          <span>PocketBase déconnecté</span>
        </Badge>
      )}
    </div>
  );
};

export default PocketBaseStatus;
