
import React from "react";
import { DeploymentView } from "@/components/deploy/DeploymentView";

interface DeploymentTabProps {
  currentStep: number;
  deploymentStatus: "idle" | "running" | "success" | "failed";
  logs: string[];
  startDeployment: () => void;
  setActiveTab: (tab: string) => void;
  packageConfig: {
    agentCount: number[];
    servicePeriod: string;
    callVolume: string;
    includeSupport: boolean;
    includeCRM: boolean;
    multilingual: boolean;
  };
  resetForm: () => void;
}

const DeploymentTab: React.FC<DeploymentTabProps> = ({
  currentStep,
  deploymentStatus,
  logs,
  startDeployment,
  setActiveTab,
  packageConfig,
  resetForm
}) => {
  return (
    <div className="space-y-8">
      <DeploymentView 
        currentStep={currentStep}
        deploymentStatus={deploymentStatus}
        logs={logs}
        startDeployment={startDeployment}
        setActiveTab={setActiveTab}
        packageConfig={packageConfig}
        resetForm={resetForm}
      />
    </div>
  );
};

export default DeploymentTab;
