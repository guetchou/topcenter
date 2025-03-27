
import React from 'react';
import { DeploymentStep } from './DeploymentStep';
import { DeploymentProgress } from './DeploymentProgress';
import { DeploymentLog } from '@/hooks/useDeploymentLogs';

export type DeployStepStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface Step {
  id: string;
  title: string;
  description: string;
  status: DeployStepStatus;
  startTime?: Date;
  endTime?: Date;
  logs: DeploymentLog[];
}

interface DeploymentStepsProps {
  steps: Step[];
  currentStepId?: string;
}

export const DeploymentSteps: React.FC<DeploymentStepsProps> = ({ steps, currentStepId }) => {
  // Calculer le temps écoulé pour chaque étape
  const getStepDuration = (step: Step): string => {
    if (!step.startTime) return '0s';
    
    const endTime = step.endTime || new Date();
    const durationMs = endTime.getTime() - step.startTime.getTime();
    
    if (durationMs < 1000) return `${durationMs}ms`;
    if (durationMs < 60000) return `${Math.floor(durationMs / 1000)}s`;
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  // Filtrer les logs pour l'étape courante
  const getStepLogs = (step: Step): string => {
    if (step.logs.length === 0) return '';
    
    return step.logs
      .map(log => `[${log.timestamp.toLocaleTimeString()}] ${log.message}`)
      .join('\n');
  };

  return (
    <div className="space-y-4">
      <DeploymentProgress steps={steps} />
      
      <div className="space-y-2">
        {steps.map((step) => (
          <DeploymentStep
            key={step.id}
            title={step.title}
            description={step.description}
            status={step.status}
            time={getStepDuration(step)}
            details={getStepLogs(step)}
            isCurrentStep={currentStepId === step.id}
          />
        ))}
      </div>
    </div>
  );
};
