
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useDeploymentSimulator } from "@/hooks/useDeploymentSimulator";
import QuotationTab from "@/pages/deploy/QuotationTab";
import DeploymentTab from "@/pages/deploy/DeploymentTab";
import HistoryTab from "@/pages/deploy/HistoryTab";

const DeployDashboard = () => {
  const [activeTab, setActiveTab] = useState("quotation");
  
  const {
    businessInfo,
    packageConfig,
    quoteResult,
    deploymentStatus,
    currentStep,
    logs,
    handleBusinessInfoChange,
    handleSliderChange,
    handleSelectChange,
    handleSwitchChange,
    generateQuote,
    startDeployment,
    resetForm,
    downloadQuote
  } = useDeploymentSimulator();
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de Bord de Déploiement</h1>
          <p className="text-muted-foreground">
            Créez un devis automatique et simulez différents packs de services en ligne.
          </p>
        </div>
        
        <Tabs defaultValue="quotation" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="quotation">Simulateur de Devis</TabsTrigger>
            <TabsTrigger value="deployment">Déploiement</TabsTrigger>
            <TabsTrigger value="history">Historique</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quotation">
            <QuotationTab 
              businessInfo={businessInfo}
              packageConfig={packageConfig}
              quoteResult={quoteResult}
              handleBusinessInfoChange={handleBusinessInfoChange}
              handleSliderChange={handleSliderChange}
              handleSelectChange={handleSelectChange}
              handleSwitchChange={handleSwitchChange}
              generateQuote={generateQuote}
              resetForm={resetForm}
              downloadQuote={downloadQuote}
              setActiveTab={setActiveTab}
            />
          </TabsContent>
          
          <TabsContent value="deployment">
            <DeploymentTab 
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
    </div>
  );
};

export default DeployDashboard;
