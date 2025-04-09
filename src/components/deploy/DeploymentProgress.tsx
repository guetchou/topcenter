
import React from "react";

interface DeploymentProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const DeploymentProgress: React.FC<DeploymentProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  const progressPercentage = Math.min((currentStep / totalSteps) * 100, 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progression: {Math.round(progressPercentage)}%</span>
        <span>Étape {currentStep} sur {totalSteps}</span>
      </div>
      
      <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
        <div 
          className="bg-primary h-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};
