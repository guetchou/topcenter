
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeploymentSteps } from '@/components/deploy/DeploymentSteps';
import { Step } from '@/components/deploy/DeploymentSteps';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DeploymentStepsPanelProps {
  steps: Step[];
  currentStepId?: string;
  isWebSocketConnected: boolean;
}

export const DeploymentStepsPanel: React.FC<DeploymentStepsPanelProps> = ({
  steps,
  currentStepId,
  isWebSocketConnected
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Suivi du déploiement</CardTitle>
        <div className="flex items-center gap-2">
          {isWebSocketConnected ? (
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
              <Wifi className="h-3 w-3" />
              Connecté
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
              <WifiOff className="h-3 w-3" />
              Déconnecté
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {steps.length === 0 ? (
          <div className="flex items-center justify-center p-6 text-muted-foreground">
            <AlertCircle className="h-5 w-5 mr-2" />
            Aucun déploiement en cours
          </div>
        ) : (
          <DeploymentSteps steps={steps} currentStepId={currentStepId} />
        )}
      </CardContent>
    </Card>
  );
};
