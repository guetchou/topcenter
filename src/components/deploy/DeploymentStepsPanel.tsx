
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeploymentStep } from './DeploymentStep';
import { DeploymentProgress } from './DeploymentProgress';
import { DeploymentStep as DeploymentStepType, DeploymentStepStatus } from '@/hooks/useDeployment';

interface DeploymentStepsPanelProps {
  steps: DeploymentStepType[];
}

export const DeploymentStepsPanel: React.FC<DeploymentStepsPanelProps> = ({ steps }) => {
  const currentStepIndex = steps.findIndex(step => step.status === 'in-progress');
  
  const formatTime = (startTime: Date | null, endTime: Date | null) => {
    if (!startTime) return '';
    
    if (endTime) {
      // Calculer la durée entre le début et la fin
      const durationMs = endTime.getTime() - startTime.getTime();
      const seconds = Math.floor(durationMs / 1000);
      
      if (seconds < 60) {
        return `${seconds}s`;
      } else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
      }
    } else {
      // Afficher l'heure de début
      return startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Étapes de déploiement</CardTitle>
      </CardHeader>
      <CardContent>
        <DeploymentProgress steps={steps} />
        
        <div className="space-y-3">
          {steps.map((step, index) => (
            <DeploymentStep
              key={step.id}
              title={step.title}
              description={step.description}
              status={step.status}
              time={formatTime(step.startTime, step.endTime)}
              details={step.logs.map(log => log.message).join('\n')}
              isCurrentStep={index === currentStepIndex}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
