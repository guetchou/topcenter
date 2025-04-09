
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { History, Clock } from "lucide-react";

export const DeploymentHistory: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Historique des déploiements
        </CardTitle>
        <CardDescription>
          Suivez l'historique de vos déploiements et devis générés
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Pack 5 agents</h3>
                <p className="text-sm text-muted-foreground">
                  Déployé le 09/04/2025
                </p>
              </div>
              <Badge>Actif</Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm">
                <span className="font-medium">Total :</span> 850,000 FCFA
              </p>
              <p className="text-sm">
                <span className="font-medium">ID :</span> DEP-58942
              </p>
            </div>
          </div>
          <Separator />
          <div className="p-4 flex justify-end gap-2">
            <Button variant="outline" size="sm">Voir détails</Button>
            <Button variant="outline" size="sm">Télécharger facture</Button>
          </div>
        </div>
        
        {/* Placeholder for empty state */}
        <div className="mt-4 p-8 text-center border rounded-md border-dashed">
          <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
          <h3 className="font-medium">Aucun autre déploiement</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Les déploiements futurs apparaîtront ici.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
