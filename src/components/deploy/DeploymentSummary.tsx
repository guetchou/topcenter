
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, Clock, Globe, Box } from "lucide-react";

interface DeploymentSummaryProps {
  environment: string;
  buildTime: string;
  startTime: string;
  domain: string;
  deployId: string;
  gitBranch: string;
}

export const DeploymentSummary: React.FC<DeploymentSummaryProps> = ({
  environment,
  buildTime,
  startTime,
  domain,
  deployId,
  gitBranch
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-3">Informations de déploiement</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Box className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Environnement</p>
              <p className="font-medium">{environment}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Durée estimée</p>
              <p className="font-medium">{buildTime}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <GitBranch className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Branche</p>
              <p className="font-medium">{gitBranch}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Domaine cible</p>
              <p className="font-medium">{domain}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 text-blue-500 flex items-center justify-center">
              <span className="text-xs">#</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">ID de déploiement</p>
              <p className="font-medium">{deployId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Démarrage</p>
              <p className="font-medium">{startTime}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
