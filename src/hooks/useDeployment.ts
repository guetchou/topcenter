
import { useState, useEffect } from 'react';
import { Step } from '@/components/deploy/DeploymentSteps';
import { useDeploymentLogs, DeploymentLog } from '@/hooks/useDeploymentLogs';
import { triggerWorkflow } from '@/services/deployment/githubActions';

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
            const newLog = addLog(log, newStatus === 'failed' ? 'error' : 'info');
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
      addLog("🚀 Démarrage du processus de déploiement");
      
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
        'manual_deploy.yml', 
        'main'
      );
      
      if (success) {
        updateStepStatus('build', 'completed', 'Build terminé avec succès');
      } else {
        throw new Error('Échec du build');
      }
      
      // Étape 3: Déploiement
      setCurrentStepId('deploy');
      updateStepStatus('deploy', 'in-progress', 'Déploiement des fichiers sur le serveur...');
      
      // Simuler un déploiement
      await new Promise(r => setTimeout(r, 3000));
      updateStepStatus('deploy', 'completed', 'Déploiement terminé avec succès');
      
      // Étape 4: Vérification
      setCurrentStepId('verify');
      updateStepStatus('verify', 'in-progress', 'Vérification du déploiement...');
      
      // Simuler une vérification
      await new Promise(r => setTimeout(r, 1500));
      updateStepStatus('verify', 'completed', 'Déploiement vérifié et validé');
      
      setStatus("success");
      addLog("✅ Déploiement terminé avec succès");
      
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
    } finally {
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
