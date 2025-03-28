
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, AlertCircle, Rocket } from "lucide-react";
import { toast } from "sonner";

interface DeploymentControlsProps {
  status: "idle" | "running" | "success" | "error";
  isLoading: boolean;
  onDeploy: () => Promise<void>;
}

export const DeploymentControls: React.FC<DeploymentControlsProps> = ({
  status,
  isLoading,
  onDeploy
}) => {
  const handleDeploy = async () => {
    try {
      await onDeploy();
      toast.success("Déploiement déclenché avec succès");
    } catch (error) {
      console.error("Erreur de déploiement:", error);
      toast.error("Échec du déploiement");
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Button onClick={handleDeploy} disabled={status === 'running' || isLoading}>
            {status === 'running' ? (
              <>
                <Loader2 className="animate-spin mr-2" />
                Déploiement en cours...
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4 mr-2" />
                Lancer le déploiement
              </>
            )}
          </Button>

          {status === 'success' && <CheckCircle className="text-green-500" />} 
          {status === 'error' && <AlertCircle className="text-red-500" />} 
        </div>
      </CardContent>
    </Card>
  );
};
