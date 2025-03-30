
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { DeploymentStepStatus } from '@/hooks/useDeployment';

interface DeploymentProgressProps {
  steps: Array<{ status: DeploymentStepStatus }>;
}

export const DeploymentProgress = ({ steps }: DeploymentProgressProps) => {
  // Calculate the progress percentage
  const calculateProgress = () => {
    if (steps.length === 0) return 0;
    
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const inProgressSteps = steps.filter(step => step.status === 'in-progress').length;
    
    // Count in-progress steps as half completed
    const completionValue = completedSteps + (inProgressSteps * 0.5);
    return Math.round((completionValue / steps.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Progression de déploiement</span>
        <span className="text-sm font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};
