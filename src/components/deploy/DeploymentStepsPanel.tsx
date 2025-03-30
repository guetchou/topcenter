
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeploymentStep } from "./DeploymentStep";
import { DeploymentStep as DeploymentStepType } from "@/hooks/useDeployment";

interface DeploymentStepsPanelProps {
  steps: DeploymentStepType[];
}

export const DeploymentStepsPanel: React.FC<DeploymentStepsPanelProps> = ({ steps }) => {
  // Calculate elapsed time for each step
  const getStepDuration = (step: DeploymentStepType): string => {
    if (!step.startTime) return '0s';
    
    const endTime = step.endTime || new Date();
    const durationMs = endTime.getTime() - step.startTime.getTime();
    
    if (durationMs < 1000) return `${durationMs}ms`;
    if (durationMs < 60000) return `${Math.floor(durationMs / 1000)}s`;
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Get logs for a step
  const getStepLogs = (step: DeploymentStepType): string => {
    if (step.logs.length === 0) return '';
    
    return step.logs
      .map(log => `${log.message}`)
      .join('\n');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Étapes du déploiement</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {steps.map((step) => (
            <DeploymentStep
              key={step.id}
              title={step.title}
              description={step.description}
              status={step.status}
              time={getStepDuration(step)}
              details={getStepLogs(step)}
              isCurrentStep={step.status === 'in-progress'}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
