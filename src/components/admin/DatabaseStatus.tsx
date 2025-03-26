
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, Database } from 'lucide-react';
import useDatabaseConnection from '@/hooks/useDatabaseConnection';

interface DatabaseStatusProps {
  showDetails?: boolean;
}

const DatabaseStatus: React.FC<DatabaseStatusProps> = ({ showDetails = true }) => {
  const { isConnected, isLoading, error } = useDatabaseConnection();

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="font-medium">Base de données Infomaniak</h3>
          </div>
          
          <div>
            {isLoading ? (
              <Badge variant="outline" className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Connexion...
              </Badge>
            ) : isConnected ? (
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Connecté
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 text-muted-foreground">
                <AlertCircle className="h-3 w-3" />
                Non connecté
              </Badge>
            )}
          </div>
        </div>
        
        {showDetails && (
          <div className="mt-4 text-sm">
            {isConnected ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-muted-foreground">Serveur</p>
                  <p className="font-medium">rj8dl.myd.infomaniak.com</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Base de données</p>
                  <p className="font-medium">rj8dl_topcenter_moderne</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <p className="text-muted-foreground">
                Connexion à la base de données Infomaniak non établie
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseStatus;
