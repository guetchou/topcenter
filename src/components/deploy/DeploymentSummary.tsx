
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Hash, Package, Clock } from "lucide-react";

interface DeploymentSummaryProps {
  packageType: string;
  deploymentDate: string;
  deploymentId: string;
}

export const DeploymentSummary: React.FC<DeploymentSummaryProps> = ({
  packageType,
  deploymentDate,
  deploymentId,
}) => {
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium">Résumé du déploiement</h3>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Type de package</p>
              <p className="font-medium">{packageType}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Date de déploiement</p>
              <p className="font-medium">{deploymentDate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Identifiant de déploiement</p>
              <p className="font-medium">{deploymentId}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Statut</p>
              <p className="font-medium text-green-600">Déploiement terminé avec succès</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
