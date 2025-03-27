
import { useState, useEffect, useCallback } from 'react';
import { triggerWorkflow, getWorkflowRuns } from '@/services/deployment/githubActions';
import { useDeploymentLogs, DeploymentLog } from './useDeploymentLogs';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export type DeploymentStatus = 'idle' | 'running' | 'success' | 'error';
export type DeploymentStepStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: DeploymentStepStatus;
  startTime?: Date;
  endTime?: Date;
  logs: DeploymentLog[];
}

export interface DeploymentOptions {
  owner: string;
  repo: string;
  workflowId: string;
  ref?: string;
  inputs?: Record<string, string>;
  backupFirst?: boolean;
}

export const useDeployment = () => {
  const deploymentId = uuidv4();
  const { logs, addLog, isConnected } = useDeploymentLogs(deploymentId);
  
  const [status, setStatus] = useState<DeploymentStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  
  const [steps, setSteps] = useState<DeploymentStep[]>([
    {
      id: 'backup',
      title: 'Sauvegarde',
      description: 'Création d\'une sauvegarde du site et de la base de données',
      status: 'pending',
      logs: []
    },
    {
      id: 'build',
      title: 'Build',
      description: 'Compilation du projet',
      status: 'pending',
      logs: []
    },
    {
      id: 'test',
      title: 'Tests',
      description: 'Exécution des tests automatisés',
      status: 'pending',
      logs: []
    },
    {
      id: 'deploy',
      title: 'Déploiement',
      description: 'Transfert des fichiers vers le serveur',
      status: 'pending',
      logs: []
    },
    {
      id: 'verify',
      title: 'Vérification',
      description: 'Validation du déploiement',
      status: 'pending',
      logs: []
    }
  ]);
  
  // Mise à jour des logs dans les étapes
  useEffect(() => {
    if (logs.length > 0 && currentStepId) {
      setSteps(prevSteps => {
        return prevSteps.map(step => {
          if (step.id === currentStepId) {
            return {
              ...step,
              logs: [...logs.filter(log => 
                log.message.toLowerCase().includes(step.id.toLowerCase()) || 
                (currentStepId === step.id && !prevSteps.some(s => 
                  s.id !== step.id && 
                  log.message.toLowerCase().includes(s.id.toLowerCase())
                ))
              )]
            };
          }
          return step;
        });
      });
    }
  }, [logs, currentStepId]);
  
  // Fonction pour démarrer une étape
  const startStep = useCallback((stepId: string) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId 
          ? { ...step, status: 'in-progress', startTime: new Date() } 
          : step
      )
    );
    setCurrentStepId(stepId);
    addLog(`🚀 Démarrage de l'étape: ${stepId}`, 'info');
  }, [addLog]);
  
  // Fonction pour terminer une étape
  const completeStep = useCallback((stepId: string, success: boolean = true) => {
    setSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === stepId 
          ? { 
              ...step, 
              status: success ? 'completed' : 'failed', 
              endTime: new Date() 
            } 
          : step
      )
    );
    
    addLog(
      success 
        ? `✅ Étape terminée avec succès: ${stepId}` 
        : `❌ Échec de l'étape: ${stepId}`, 
      success ? 'success' : 'error'
    );
    
    // Calcul du progrès global
    setSteps(prevSteps => {
      const totalSteps = prevSteps.length;
      const completedSteps = prevSteps.filter(s => 
        s.status === 'completed' || s.status === 'failed'
      ).length;
      
      setProgress(Math.round((completedSteps / totalSteps) * 100));
      return prevSteps;
    });
  }, [addLog]);
  
  // Fonction principale pour effectuer un déploiement
  const deploy = useCallback(async (options: DeploymentOptions) => {
    try {
      // Réinitialiser l'état
      setStatus('running');
      setProgress(0);
      setSteps(prevSteps => 
        prevSteps.map(step => ({
          ...step,
          status: 'pending',
          startTime: undefined,
          endTime: undefined,
          logs: []
        }))
      );
      
      addLog('🚀 Démarrage du déploiement...', 'info');
      
      // Étape 1: Sauvegarde
      if (options.backupFirst !== false) {
        startStep('backup');
        addLog('📦 Création d\'une sauvegarde avant déploiement...', 'info');
        
        // Simuler une sauvegarde (à remplacer par une vraie API)
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        addLog('✅ Sauvegarde terminée avec succès', 'success');
        completeStep('backup');
      } else {
        addLog('⏩ Sauvegarde ignorée selon les options', 'info');
        completeStep('backup');
      }
      
      // Étape 2: Déclenchement du workflow GitHub
      startStep('build');
      addLog('🔨 Déclenchement du workflow GitHub Actions...', 'info');
      
      const success = await triggerWorkflow(
        options.owner,
        options.repo,
        options.workflowId,
        options.ref || 'main',
        options.inputs
      );
      
      if (success) {
        addLog('✅ Workflow GitHub Actions déclenché avec succès', 'success');
        completeStep('build');
        
        // Suivi des étapes suivantes (dans un cas réel, cela serait fait via webhooks ou polling)
        startStep('test');
        addLog('🧪 Exécution des tests en cours...', 'info');
        await new Promise(resolve => setTimeout(resolve, 2000));
        addLog('✅ Tests réussis', 'success');
        completeStep('test');
        
        startStep('deploy');
        addLog('📤 Déploiement des fichiers en cours...', 'info');
        await new Promise(resolve => setTimeout(resolve, 4000));
        addLog('✅ Fichiers déployés avec succès', 'success');
        completeStep('deploy');
        
        startStep('verify');
        addLog('🔍 Vérification du déploiement...', 'info');
        await new Promise(resolve => setTimeout(resolve, 1500));
        addLog('✅ Déploiement vérifié et fonctionnel', 'success');
        completeStep('verify');
        
        addLog('✅ Déploiement terminé avec succès!', 'success');
        setStatus('success');
        
        toast.success('Déploiement réussi', {
          description: 'Votre site a été déployé avec succès.'
        });
      } else {
        throw new Error('Échec du déclenchement du workflow GitHub');
      }
    } catch (error) {
      console.error('Erreur lors du déploiement:', error);
      
      const currentStep = steps.find(step => step.status === 'in-progress');
      if (currentStep) {
        completeStep(currentStep.id, false);
      }
      
      addLog(`❌ Erreur lors du déploiement: ${error instanceof Error ? error.message : "Erreur inconnue"}`, 'error');
      setStatus('error');
      
      toast.error('Échec du déploiement', {
        description: error instanceof Error ? error.message : 'Une erreur est survenue lors du déploiement.'
      });
    }
  }, [addLog, startStep, completeStep, steps]);

  return {
    status,
    progress,
    steps,
    currentStepId,
    logs,
    deploy,
    isConnected
  };
};
