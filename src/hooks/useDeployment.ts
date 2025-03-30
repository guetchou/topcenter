
import { useState, useCallback } from 'react';
import { DeploymentLogType } from './useDeploymentLogs';

export type DeploymentStatus = 'idle' | 'running' | 'success' | 'error';

interface DeploymentStepConfig {
  id: string; 
  title: string;
  description: string;
}

export interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  logs: { message: string; type: string; }[];
}

const deploymentStepsConfig: DeploymentStepConfig[] = [
  {
    id: 'backup',
    title: 'Sauvegarde des données',
    description: 'Création d\'un backup complet avant déploiement'
  },
  {
    id: 'trigger-workflow',
    title: 'Déclenchement workflow GitHub',
    description: 'Envoi de l\'événement repository_dispatch'
  },
  {
    id: 'build',
    title: 'Construction du projet',
    description: 'Compilation et build du projet'
  },
  {
    id: 'tests',
    title: 'Exécution des tests',
    description: 'Vérification du bon fonctionnement'
  },
  {
    id: 'deployment',
    title: 'Déploiement FTP',
    description: 'Transfert des fichiers vers l\'hébergement'
  },
  {
    id: 'post-deploy',
    title: 'Post-déploiement',
    description: 'Configuration et vérifications finales'
  }
];

interface UseDeploymentProps {
  addLog: (message: string, type: DeploymentLogType) => void;
}

export const useDeployment = ({ addLog }: UseDeploymentProps) => {
  const [status, setStatus] = useState<DeploymentStatus>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | undefined>(undefined);
  
  // Initialize deployment steps from configuration
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>(
    deploymentStepsConfig.map(step => ({
      ...step,
      status: 'pending',
      logs: []
    }))
  );

  // Update a specific step
  const updateStep = useCallback((
    stepId: string, 
    updates: Partial<DeploymentStep>
  ) => {
    setDeploymentSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  }, []);

  // Add a log to a specific step
  const addStepLog = useCallback((
    stepId: string, 
    message: string, 
    type: string = 'info'
  ) => {
    setDeploymentSteps(prev => prev.map(step => 
      step.id === stepId ? { 
        ...step, 
        logs: [...step.logs, { message, type }] 
      } : step
    ));
  }, []);

  // Marks a step as started
  const startStep = useCallback((stepId: string) => {
    const now = new Date();
    updateStep(stepId, { status: 'in-progress', startTime: now });
    setCurrentStepId(stepId);
    addStepLog(stepId, `Démarrage de l'étape: ${stepId}`, 'info');
    addLog(`Démarrage de l'étape: ${stepId}`, 'info');
  }, [updateStep, addStepLog, addLog]);

  // Marks a step as completed
  const completeStep = useCallback((stepId: string) => {
    const now = new Date();
    updateStep(stepId, { status: 'completed', endTime: now });
    addStepLog(stepId, `Étape terminée avec succès: ${stepId}`, 'success');
    addLog(`Étape terminée avec succès: ${stepId}`, 'success');
  }, [updateStep, addStepLog, addLog]);

  // Marks a step as failed
  const failStep = useCallback((stepId: string, error: string) => {
    const now = new Date();
    updateStep(stepId, { status: 'failed', endTime: now });
    addStepLog(stepId, `Échec de l'étape: ${error}`, 'error');
    addLog(`Échec de l'étape: ${stepId} - ${error}`, 'error');
  }, [updateStep, addStepLog, addLog]);

  // Start the deployment process
  const startDeployment = useCallback(async () => {
    setIsLoading(true);
    setStatus('running');
    
    // Reset all steps to pending
    setDeploymentSteps(deploymentStepsConfig.map(step => ({
      ...step,
      status: 'pending',
      logs: [],
      startTime: undefined,
      endTime: undefined
    })));
    
    addLog('Démarrage du processus de déploiement', 'info');
    
    // Simulated deployment process for demo
    try {
      // Step 1: Backup
      startStep('backup');
      await new Promise(r => setTimeout(r, 2000)); // Simulate work
      addStepLog('backup', 'Connexion au serveur FTP', 'info');
      await new Promise(r => setTimeout(r, 1000));
      addStepLog('backup', 'Création de l\'archive de sauvegarde', 'info');
      await new Promise(r => setTimeout(r, 1500));
      completeStep('backup');
      
      // Step 2: Trigger GitHub workflow
      startStep('trigger-workflow');
      await new Promise(r => setTimeout(r, 2000));
      addStepLog('trigger-workflow', 'Envoi de la requête à l\'API GitHub', 'info');
      await new Promise(r => setTimeout(r, 1000));
      completeStep('trigger-workflow');
      
      // Step 3: Build
      startStep('build');
      await new Promise(r => setTimeout(r, 3000));
      addStepLog('build', 'Installation des dépendances', 'info');
      await new Promise(r => setTimeout(r, 1500));
      addStepLog('build', 'Compilation du code TypeScript', 'info');
      await new Promise(r => setTimeout(r, 2000));
      addStepLog('build', 'Optimisation des assets', 'info');
      await new Promise(r => setTimeout(r, 1000));
      completeStep('build');
      
      // Step 4: Tests
      startStep('tests');
      await new Promise(r => setTimeout(r, 2500));
      addStepLog('tests', 'Exécution des tests unitaires', 'info');
      await new Promise(r => setTimeout(r, 1000));
      addStepLog('tests', 'Exécution des tests d\'intégration', 'info');
      await new Promise(r => setTimeout(r, 1500));
      completeStep('tests');
      
      // Step 5: Deployment
      startStep('deployment');
      await new Promise(r => setTimeout(r, 3000));
      addStepLog('deployment', 'Connexion au serveur FTP', 'info');
      await new Promise(r => setTimeout(r, 1000));
      addStepLog('deployment', 'Transfert des fichiers (1/3)', 'info');
      await new Promise(r => setTimeout(r, 1000));
      addStepLog('deployment', 'Transfert des fichiers (2/3)', 'info');
      await new Promise(r => setTimeout(r, 1000));
      addStepLog('deployment', 'Transfert des fichiers (3/3)', 'info');
      await new Promise(r => setTimeout(r, 1000));
      completeStep('deployment');
      
      // Step 6: Post-deployment
      startStep('post-deploy');
      await new Promise(r => setTimeout(r, 2000));
      addStepLog('post-deploy', 'Vérification des permissions de fichiers', 'info');
      await new Promise(r => setTimeout(r, 1000));
      addStepLog('post-deploy', 'Purge des caches', 'info');
      await new Promise(r => setTimeout(r, 1000));
      completeStep('post-deploy');
      
      // Deployment successful
      setStatus('success');
      addLog('Déploiement terminé avec succès!', 'success');
      
    } catch (error) {
      // In case of error
      if (currentStepId) {
        failStep(currentStepId, error instanceof Error ? error.message : 'Erreur inconnue');
      }
      setStatus('error');
      addLog('Échec du déploiement', 'error');
    } finally {
      setIsLoading(false);
      setCurrentStepId(undefined);
    }
  }, [addLog, startStep, completeStep, failStep, currentStepId]);
  
  return {
    status,
    isLoading,
    deploymentSteps,
    currentStepId,
    startDeployment,
    updateStep,
    addStepLog
  };
};
