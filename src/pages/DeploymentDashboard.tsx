
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeploymentControls } from "@/components/deploy/DeploymentControls";
import { DeploymentStepsPanel } from "@/components/deploy/DeploymentStepsPanel";
import { BackupPanel } from "@/components/deploy/BackupPanel";
import { DomainsPanel } from "@/components/deploy/DomainsPanel";
import { DeploymentLogPanel } from "@/components/deploy/DeploymentLogPanel";
import { ServerStatusMonitor } from "@/components/deploy/ServerStatusMonitor";
import { useDeployment } from "@/hooks/useDeployment";
import { useDeploymentLogs } from "@/hooks/useDeploymentLogs";

const DeploymentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("deployment");
  const { logs, addLog, clearLogs } = useDeploymentLogs();
  const { status, isLoading, deploymentSteps, startDeployment } = useDeployment({ addLog });

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Dashboard de Déploiement</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <DeploymentControls 
            status={status} 
            isLoading={isLoading} 
            onDeploy={startDeployment} 
          />
        </div>
        <div className="md:col-span-1">
          <ServerStatusMonitor />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="deployment">Déploiement</TabsTrigger>
          <TabsTrigger value="backups">Sauvegardes</TabsTrigger>
          <TabsTrigger value="domains">Domaines</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deployment" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DeploymentStepsPanel steps={deploymentSteps} />
            <DeploymentLogPanel logs={logs} />
          </div>
        </TabsContent>
        
        <TabsContent value="backups" className="space-y-6">
          <BackupPanel />
        </TabsContent>
        
        <TabsContent value="domains" className="space-y-6">
          <DomainsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeploymentDashboard;
