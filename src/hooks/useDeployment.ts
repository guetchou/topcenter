
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDeploymentLogs } from './useDeploymentLogs';
import { toast } from 'sonner';

export type DeploymentStepStatus = 'pending' | 'in-progress' | 'completed' | 'error';

export interface DeploymentLog {
  message: string;
  timestamp?: Date;
}

export interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: DeploymentStepStatus;
  logs: DeploymentLog[];
  startTime: Date | null;
  endTime: Date | null;
}

interface DeploymentOptions {
  environment?: 'production' | 'staging' | 'development';
  withBackup?: boolean;
  notifyOnComplete?: boolean;
}

export const useDeployment = () => {
  const [steps, setSteps] = useState<DeploymentStep[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const { addLog } = useDeploymentLogs();

  const initDeployment = useCallback((deploymentSteps: Omit<DeploymentStep, 'id' | 'logs' | 'startTime' | 'endTime'>[]) => {
    const initializedSteps = deploymentSteps.map(step => ({
      ...step,
      id: uuidv4(),
      logs: [],
      startTime: null,
      endTime: null,
      status: 'pending' as DeploymentStepStatus
    }));
    
    setSteps(initializedSteps);
    return initializedSteps;
  }, []);

  const startDeployment = useCallback(async (options: DeploymentOptions = {}) => {
    if (isDeploying || steps.length === 0) return;
    
    setIsDeploying(true);
    addLog("Démarrage du déploiement...", "info");
    
    try {
      // Start first step
      const firstStep = steps[0];
      setCurrentStepId(firstStep.id);
      
      // Update step status
      updateStepStatus(firstStep.id, 'in-progress');
      
      // Log deployment start with options
      const optionDetails = Object.entries(options)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
        
      addLog(`Configuration du déploiement: ${optionDetails || 'par défaut'}`, "info");
      
      // Simulate the API call for starting a deployment
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      addLog("Erreur lors du démarrage du déploiement", "error");
      setIsDeploying(false);
      return false;
    }
  }, [isDeploying, steps, addLog]);

  const updateStepStatus = useCallback((stepId: string, status: DeploymentStepStatus, log?: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => {
        if (step.id === stepId) {
          const now = new Date();
          const updatedStep = {
            ...step,
            status,
            logs: log ? [...step.logs, { message: log, timestamp: now }] : step.logs
          };
          
          if (status === 'in-progress' && !step.startTime) {
            updatedStep.startTime = now;
          } else if (['completed', 'error'].includes(status) && !step.endTime) {
            updatedStep.endTime = now;
          }
          
          return updatedStep;
        }
        return step;
      })
    );
    
    if (log) {
      addLog(log, status === 'error' ? 'error' : status === 'completed' ? 'success' : 'info');
    }
  }, [addLog]);

  const addStepLog = useCallback((stepId: string, message: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            logs: [...step.logs, { message, timestamp: new Date() }]
          };
        }
        return step;
      })
    );
  }, []);

  const progressToNextStep = useCallback(() => {
    if (!currentStepId) return false;
    
    const currentIndex = steps.findIndex(step => step.id === currentStepId);
    if (currentIndex === -1 || currentIndex >= steps.length - 1) {
      // Complete deployment if we're at the last step
      if (currentIndex === steps.length - 1) {
        updateStepStatus(currentStepId, 'completed', "Étape terminée avec succès");
        setIsDeploying(false);
        setCurrentStepId(null);
        toast.success("Déploiement terminé avec succès");
        addLog("Déploiement terminé avec succès", "success");
      }
      return false;
    }
    
    // Complete current step
    updateStepStatus(currentStepId, 'completed', "Étape terminée avec succès");
    
    // Move to next step
    const nextStep = steps[currentIndex + 1];
    setCurrentStepId(nextStep.id);
    updateStepStatus(nextStep.id, 'in-progress', "Démarrage de l'étape");
    
    return true;
  }, [currentStepId, steps, updateStepStatus, addLog]);

  const completeDeployment = useCallback((success: boolean = true) => {
    if (currentStepId) {
      updateStepStatus(
        currentStepId, 
        success ? 'completed' : 'error',
        success ? "Étape terminée avec succès" : "Échec de l'étape"
      );
    }
    
    setIsDeploying(false);
    setCurrentStepId(null);
    
    if (success) {
      toast.success("Déploiement terminé avec succès");
      addLog("Déploiement terminé avec succès", "success");
    } else {
      toast.error("Échec du déploiement");
      addLog("Échec du déploiement", "error");
    }
  }, [currentStepId, updateStepStatus, addLog]);

  const cancelDeployment = useCallback(() => {
    setIsDeploying(false);
    setCurrentStepId(null);
    
    addLog("Déploiement annulé par l'utilisateur", "warning");
    toast.info("Déploiement annulé");
    
    setSteps(prevSteps => 
      prevSteps.map(step => {
        if (step.status === 'in-progress') {
          return {
            ...step,
            status: 'error',
            endTime: new Date(),
            logs: [...step.logs, { message: "Étape annulée par l'utilisateur", timestamp: new Date() }]
          };
        }
        return step;
      })
    );
  }, [addLog]);

  const getOverallProgress = useCallback(() => {
    if (steps.length === 0) return 0;
    
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const inProgressStep = steps.find(step => step.status === 'in-progress');
    
    // Calculate basic progress from completed steps
    let progress = (completedSteps / steps.length) * 100;
    
    // Add partial progress for the in-progress step if any
    if (inProgressStep && inProgressStep.startTime) {
      const stepIndex = steps.findIndex(step => step.id === inProgressStep.id);
      const stepWeight = 1 / steps.length;
      
      // Estimate in-progress step to be 50% done on average
      progress += (stepWeight * 0.5) * 100;
    }
    
    return Math.min(Math.round(progress), 99); // Cap at 99% until fully complete
  }, [steps]);

  return {
    steps,
    isDeploying,
    currentStepId,
    initDeployment,
    startDeployment,
    updateStepStatus,
    addStepLog,
    progressToNextStep,
    completeDeployment,
    cancelDeployment,
    getOverallProgress
  };
};
