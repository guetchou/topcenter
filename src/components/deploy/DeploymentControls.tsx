
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DeploymentControlsProps {
  deploymentStatus: "idle" | "running" | "success" | "failed";
  startDeployment: () => void;
  resetForm: () => void;
  setActiveTab: (tab: string) => void;
}

export const DeploymentControls: React.FC<DeploymentControlsProps> = ({
  deploymentStatus,
  startDeployment,
  resetForm,
  setActiveTab
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            {deploymentStatus === "idle" && (
              <Button 
                onClick={startDeployment} 
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                Lancer le déploiement
              </Button>
            )}
            
            {deploymentStatus === "running" && (
              <Button 
                disabled 
                className="w-full" 
                size="lg"
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Déploiement en cours...
              </Button>
            )}
            
            {deploymentStatus === "success" && (
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("history")} 
                className="w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                size="lg"
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Voir l'historique
              </Button>
            )}
            
            {deploymentStatus === "failed" && (
              <Button 
                variant="destructive" 
                onClick={startDeployment} 
                className="w-full"
                size="lg"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Réessayer
              </Button>
            )}
            
            <Button 
              variant="outline" 
              onClick={resetForm} 
              className="w-full"
              size="lg"
            >
              Réinitialiser
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
