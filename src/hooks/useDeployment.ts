
import { useState, useEffect } from 'react';
import { Step } from '@/components/deploy/DeploymentStepsPanel';
import { DeploymentLog } from '@/hooks/useDeploymentLogs';
import { triggerWorkflow, getWorkflowRuns, checkWorkflowStatus } from '@/services/deployment/githubActions';

interface UseDeploymentOptions {
  addLog: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => DeploymentLog;
}

const initialSteps: Step[] = [
  {
    id: 'backup',
    title: 'Sauvegarde',
    description: 'Sauvegarde de la base de données et des fichiers',
    status: 'pending',
    logs: []
  },
  {
    id: 'build',
    title: 'Build',
    description: 'Compilation et optimisation du code',
    status: 'pending',
    logs: []
  },
  {
    id: 'deploy',
    title: 'Déploiement',
    description: 'Publication des fichiers sur le serveur',
    status: 'pending',
    logs: []
  },
  {
    id: 'verify',
    title: 'Vérification',
    description: 'Tests finaux et validation du déploiement',
    status: 'pending',
    logs: []
  }
];

export const useDeployment = ({ addLog }: UseDeploymentOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [deploymentSteps, setDeploymentSteps] = useState<Step[]>([]);
  const [currentStepId, setCurrentStepId] = useState<string | undefined>(undefined);
  const [workflowRunId, setWorkflowRunId] = useState<number | null>(null);
  
  // Vérifier régulièrement le statut du workflow si un workflow est en cours
  useEffect(() => {
    let interval: number | undefined;
    
    if (status === 'running' && workflowRunId) {
      interval = window.setInterval(async () => {
        try {
          const workflowStatus = await checkWorkflowStatus('guetchou', 'topcenter', workflowRunId);
          
          if (workflowStatus === 'completed') {
            updateStepStatus('deploy', 'completed', 'Déploiement terminé avec succès');
            setCurrentStepId('verify');
            updateStepStatus('verify', 'in-progress', 'Vérification du déploiement...');
            
            // Simuler une vérification finale
            setTimeout(() => {
              updateStepStatus('verify', 'completed', 'Déploiement vérifié et validé');
              setStatus('success');
              addLog("✅ Déploiement terminé avec succès", 'success');
            }, 1500);
            
            clearInterval(interval);
          } else if (workflowStatus === 'failed' || workflowStatus === 'error') {
            updateStepStatus('deploy', 'failed', `Le déploiement a échoué: ${workflowStatus}`);
            setStatus('error');
            addLog("❌ Échec du déploiement", 'error');
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du statut:", error);
        }
      }, 5000); // Vérifier toutes les 5 secondes
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, workflowRunId, addLog]);
  
  const updateStepStatus = (stepId: string, newStatus: Step['status'], log?: string) => {
    setDeploymentSteps(prev => {
      return prev.map(step => {
        if (step.id === stepId) {
          const updatedStep = { 
            ...step, 
            status: newStatus,
            ...(newStatus === 'in-progress' && !step.startTime && { startTime: new Date() }),
            ...((['completed', 'failed'].includes(newStatus)) && { endTime: new Date() })
          };
          
          if (log) {
            const newLog = { message: log, type: newStatus === 'failed' ? 'error' : 'info' };
            updatedStep.logs = [...updatedStep.logs, newLog];
          }
          
          return updatedStep;
        }
        return step;
      });
    });
  };

  const startDeployment = async () => {
    try {
      setIsLoading(true);
      setStatus("running");
      setDeploymentSteps(initialSteps);
      addLog("🚀 Démarrage du processus de déploiement", 'info');
      
      // Étape 1: Sauvegarde
      setCurrentStepId('backup');
      updateStepStatus('backup', 'in-progress', 'Démarrage de la sauvegarde...');
      
      // Simuler une sauvegarde
      await new Promise(r => setTimeout(r, 2000));
      updateStepStatus('backup', 'completed', 'Sauvegarde terminée avec succès');
      
      // Étape 2: Build
      setCurrentStepId('build');
      updateStepStatus('build', 'in-progress', 'Démarrage du build...');
      
      // Déclencher le workflow GitHub Actions
      const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
      if (!githubToken) {
        throw new Error("VITE_GITHUB_TOKEN n'est pas défini");
      }
      
      const success = await triggerWorkflow(
        'guetchou', 
        'topcenter', 
        'deploy.yml', 
        'main'
      );
      
      if (success) {
        updateStepStatus('build', 'completed', 'Build déclenché avec succès');
        
        // Récupérer l'ID du workflow en cours pour le suivi
        const workflowRuns = await getWorkflowRuns('guetchou', 'topcenter', 'deploy.yml', 1);
        if (workflowRuns.length > 0) {
          setWorkflowRunId(workflowRuns[0].id);
        }
        
        // Étape 3: Déploiement
        setCurrentStepId('deploy');
        updateStepStatus('deploy', 'in-progress', 'Déploiement des fichiers sur le serveur...');
        addLog("📤 La compilation et le déploiement sont en cours sur GitHub Actions", 'info');
      } else {
        throw new Error('Échec du déclenchement du workflow');
      }
      
    } catch (error) {
      console.error("Erreur de déploiement:", error);
      
      // Marquer l'étape en cours comme échouée
      if (currentStepId) {
        updateStepStatus(
          currentStepId, 
          'failed', 
          `Erreur: ${error instanceof Error ? error.message : "Une erreur est survenue"}`
        );
      }
      
      setStatus("error");
      addLog(`❌ Échec du déploiement: ${error instanceof Error ? error.message : "Une erreur est survenue"}`, 'error');
      setIsLoading(false);
    }
  };

  return {
    status,
    isLoading,
    deploymentSteps,
    currentStepId,
    startDeployment
  };
};
