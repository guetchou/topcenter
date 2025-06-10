
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Clock, GitPullRequest, Server, Users } from "lucide-react";
import { DeploymentView } from "@/components/deploy/DeploymentView";
import { QuotationTab } from "@/pages/deploy/QuotationTab";
import { HistoryTab } from "@/pages/deploy/HistoryTab";
import { useDeploymentSimulator } from "@/hooks/useDeploymentSimulator";

const DeployDashboard = () => {
  const [activeTab, setActiveTab] = useState("quotation");
  const [packageConfig, setPackageConfig] = useState({
    agentCount: [5],
    servicePeriod: "12",
    callVolume: "1000-5000",
    includeSupport: false,
    includeCRM: false,
    multilingual: false
  });

  const {
    currentStep,
    deploymentStatus,
    logs,
    startDeployment,
    resetForm
  } = useDeploymentSimulator();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-500";
      case "failed": return "bg-red-500";
      case "running": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="h-4 w-4" />;
      case "failed": return <AlertCircle className="h-4 w-4" />;
      case "running": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard de Déploiement
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gérez vos déploiements et suivez l'état de vos services
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Déploiements actifs
                </p>
                <p className="text-2xl font-bold text-orange-600">3</p>
              </div>
              <Server className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Agents connectés
                </p>
                <p className="text-2xl font-bold text-green-600">127</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Temps de réponse
                </p>
                <p className="text-2xl font-bold text-blue-600">1.2s</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Disponibilité
                </p>
                <p className="text-2xl font-bold text-green-600">99.9%</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quotation">Devis & Configuration</TabsTrigger>
          <TabsTrigger value="deployment">Déploiement</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="quotation">
          <QuotationTab 
            packageConfig={packageConfig}
            setPackageConfig={setPackageConfig}
            onProceedToDeployment={() => setActiveTab("deployment")}
          />
        </TabsContent>

        <TabsContent value="deployment">
          <DeploymentView
            currentStep={currentStep}
            deploymentStatus={deploymentStatus}
            logs={logs}
            startDeployment={startDeployment}
            setActiveTab={setActiveTab}
            packageConfig={packageConfig}
            resetForm={resetForm}
          />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeployDashboard;
