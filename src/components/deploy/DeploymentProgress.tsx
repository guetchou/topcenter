
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { DeploymentStatus } from './DeploymentStep';

interface DeploymentProgressProps {
  steps: Array<{ status: DeploymentStatus }>;
}

export const DeploymentProgress = ({ steps }: DeploymentProgressProps) => {
  // Calculate the progress percentage
  const calculateProgress = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return Math.round((completedSteps / steps.length) * 100);
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
