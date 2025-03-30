
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Log } from './useDeploymentLogs';

export type DeploymentStepStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: DeploymentStepStatus;
  startTime: Date | null;
  endTime: Date | null;
  logs: Log[];
}

interface DeploymentOptions {
  environment: string;
  withBackup: boolean;
  notifyOnComplete: boolean;
}

export const useDeployment = () => {
  const [steps, setSteps] = useState<DeploymentStep[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);

  const addLogToStep = useCallback((stepId: string, message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    setSteps(prevSteps => {
      return prevSteps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            logs: [
              ...step.logs,
              {
                id: uuidv4(),
                message,
                type,
                timestamp: new Date()
              }
            ]
          };
        }
        return step;
      });
    });
  }, []);

  const initDeployment = useCallback((initialSteps: Omit<DeploymentStep, 'id' | 'startTime' | 'endTime' | 'logs'>[]) => {
    const stepsWithIds = initialSteps.map(step => ({
      ...step,
      id: uuidv4(),
      startTime: null,
      endTime: null,
      logs: []
    }));
    
    setSteps(stepsWithIds);
    setCurrentStepIndex(-1);
    setIsDeploying(false);
    
    return stepsWithIds;
  }, []);

  const startDeployment = useCallback(async (options: DeploymentOptions) => {
    if (steps.length === 0 || isDeploying) {
      return false;
    }
    
    setIsDeploying(true);
    setCurrentStepIndex(0);
    
    // Update the first step to in-progress
    setSteps(prevSteps => {
      if (prevSteps.length === 0) return prevSteps;
      
      const updatedSteps = [...prevSteps];
      updatedSteps[0] = {
        ...updatedSteps[0],
        status: 'in-progress',
        startTime: new Date(),
        logs: [
          ...updatedSteps[0].logs,
          {
            id: uuidv4(),
            message: `Démarrage du déploiement sur ${options.environment}`,
            type: 'info',
            timestamp: new Date()
          }
        ]
      };
      
      return updatedSteps;
    });
    
    return true;
  }, [steps, isDeploying]);

  const progressToNextStep = useCallback(() => {
    if (!isDeploying || currentStepIndex === -1) {
      return false;
    }
    
    setSteps(prevSteps => {
      if (currentStepIndex >= prevSteps.length) return prevSteps;
      
      const updatedSteps = [...prevSteps];
      
      // Complete the current step
      updatedSteps[currentStepIndex] = {
        ...updatedSteps[currentStepIndex],
        status: 'completed',
        endTime: new Date()
      };
      
      // Start the next step if available
      if (currentStepIndex + 1 < updatedSteps.length) {
        updatedSteps[currentStepIndex + 1] = {
          ...updatedSteps[currentStepIndex + 1],
          status: 'in-progress',
          startTime: new Date()
        };
        
        setCurrentStepIndex(currentStepIndex + 1);
        return updatedSteps;
      }
      
      return updatedSteps;
    });
    
    // Return true if there are more steps, false if we've completed all steps
    return currentStepIndex + 1 < steps.length;
  }, [isDeploying, currentStepIndex, steps.length]);

  const completeDeployment = useCallback((success: boolean = true) => {
    if (!isDeploying) {
      return false;
    }
    
    setIsDeploying(false);
    
    // Update the current step if it's still in progress
    if (currentStepIndex !== -1 && currentStepIndex < steps.length) {
      setSteps(prevSteps => {
        const updatedSteps = [...prevSteps];
        updatedSteps[currentStepIndex] = {
          ...updatedSteps[currentStepIndex],
          status: success ? 'completed' : 'failed',
          endTime: new Date()
        };
        return updatedSteps;
      });
    }
    
    setCurrentStepIndex(-1);
    return true;
  }, [isDeploying, currentStepIndex, steps.length]);

  const cancelDeployment = useCallback(() => {
    if (!isDeploying) {
      return false;
    }
    
    // Update the current step to failed
    if (currentStepIndex !== -1 && currentStepIndex < steps.length) {
      setSteps(prevSteps => {
        const updatedSteps = [...prevSteps];
        updatedSteps[currentStepIndex] = {
          ...updatedSteps[currentStepIndex],
          status: 'failed',
          endTime: new Date(),
          logs: [
            ...updatedSteps[currentStepIndex].logs,
            {
              id: uuidv4(),
              message: 'Déploiement annulé par l\'utilisateur',
              type: 'warning',
              timestamp: new Date()
            }
          ]
        };
        return updatedSteps;
      });
    }
    
    setIsDeploying(false);
    setCurrentStepIndex(-1);
    return true;
  }, [isDeploying, currentStepIndex, steps.length]);

  return {
    steps,
    isDeploying,
    currentStepIndex,
    initDeployment,
    startDeployment,
    progressToNextStep,
    completeDeployment,
    cancelDeployment,
    addLogToStep
  };
};
