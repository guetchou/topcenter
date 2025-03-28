
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeploymentControls } from "@/components/deploy/DeploymentControls";
import { DeploymentStepsPanel } from "@/components/deploy/DeploymentStepsPanel";
import { DeploymentLogPanel } from "@/components/deploy/DeploymentLogPanel";
import { BackupPanel } from "@/components/deploy/BackupPanel";
import { DomainsPanel } from "@/components/deploy/DomainsPanel";
import { ServerStatusMonitor } from "@/components/deploy/ServerStatusMonitor";
import { useDeployment } from "@/hooks/useDeployment";
import { useDeploymentLogs } from "@/hooks/useDeploymentLogs";

export default function DeploymentDashboard() {
  const [activeTab, setActiveTab] = useState<string>("deployments");
  const { logs, addLog, isConnected } = useDeploymentLogs();
  const { 
    status, 
    deploymentSteps, 
    currentStepId, 
    startDeployment,
    isLoading
  } = useDeployment({ addLog });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">TopCenter - Tableau de Bord</h1>
        <ServerStatusMonitor />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="deployments">Déploiements</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="domains">Domaines</TabsTrigger>
        </TabsList>

        <TabsContent value="deployments" className="space-y-4">
          <DeploymentControls 
            status={status} 
            isLoading={isLoading}
            onDeploy={startDeployment} 
          />
          <div className="grid md:grid-cols-2 gap-4">
            <DeploymentStepsPanel 
              steps={deploymentSteps}
              currentStepId={currentStepId}
              isWebSocketConnected={isConnected}
            />
            <DeploymentLogPanel 
              logs={logs}
              isWebSocketConnected={isConnected}
            />
          </div>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <BackupPanel />
        </TabsContent>

        <TabsContent value="domains" className="space-y-4">
          <DomainsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
