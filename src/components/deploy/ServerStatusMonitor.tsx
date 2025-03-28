
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { getWorkflowRuns } from '@/services/deployment/githubActions';

export const ServerStatusMonitor: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [gitHubStatus, setGitHubStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [lastDeployment, setLastDeployment] = useState<string | null>(null);
  
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // Simuler une vérification du statut du serveur
        const response = await fetch('/api/status', { 
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        }).catch(() => ({ ok: false }));
        
        setServerStatus(response.ok ? 'online' : 'offline');
      } catch (error) {
        console.error("Erreur lors de la vérification du statut du serveur:", error);
        setServerStatus('offline');
      }
    };
    
    const checkGitHubStatus = async () => {
      try {
        const workflowRuns = await getWorkflowRuns('guetchou', 'topcenter', 'deploy.yml', 1);
        setGitHubStatus(workflowRuns.length > 0 ? 'online' : 'checking');
        
        if (workflowRuns.length > 0) {
          const lastRun = workflowRuns[0];
          setLastDeployment(new Date(lastRun.created_at).toLocaleString());
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut GitHub:", error);
        setGitHubStatus('offline');
      }
    };
    
    // Exécuter les vérifications au chargement du composant
    checkServerStatus();
    checkGitHubStatus();
    
    // Mettre en place une vérification périodique
    const interval = setInterval(() => {
      checkServerStatus();
      checkGitHubStatus();
    }, 60000); // Vérifier chaque minute
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusIcon = (status: 'online' | 'offline' | 'checking') => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'offline':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'checking':
      default:
        return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Statut du système</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(serverStatus)}
              <span>Serveur de production</span>
            </div>
            <span className={`text-sm font-medium ${
              serverStatus === 'online' ? 'text-green-500' : 
              serverStatus === 'offline' ? 'text-red-500' : 'text-yellow-500'
            }`}>
              {serverStatus === 'online' ? 'En ligne' : 
               serverStatus === 'offline' ? 'Hors ligne' : 'Vérification...'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(gitHubStatus)}
              <span>GitHub Actions</span>
            </div>
            <span className={`text-sm font-medium ${
              gitHubStatus === 'online' ? 'text-green-500' : 
              gitHubStatus === 'offline' ? 'text-red-500' : 'text-yellow-500'
            }`}>
              {gitHubStatus === 'online' ? 'Disponible' : 
               gitHubStatus === 'offline' ? 'Non disponible' : 'Vérification...'}
            </span>
          </div>
          
          {lastDeployment && (
            <div className="pt-2 text-sm text-gray-500">
              <p>Dernier déploiement: {lastDeployment}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
