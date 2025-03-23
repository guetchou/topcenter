
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { DeploymentStep, DeploymentStatus } from '@/components/deploy/DeploymentStep';
import { DeploymentProgress } from '@/components/deploy/DeploymentProgress';
import { DeploymentSummary } from '@/components/deploy/DeploymentSummary';
import { ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DeploymentStep {
  id: number;
  title: string;
  description: string;
  status: DeploymentStatus;
  time?: string;
  details?: string;
}

const DeployDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    {
      id: 1,
      title: "Initialisation du déploiement",
      description: "Préparation de l'environnement et vérification des dépendances",
      status: "completed",
      time: "45s"
    },
    {
      id: 2,
      title: "Compilation du projet",
      description: "Construction des assets et optimisation du bundle",
      status: "completed",
      time: "2m 12s",
      details: "Build réussi avec 0 erreurs et 2 avertissements."
    },
    {
      id: 3,
      title: "Tests automatisés",
      description: "Exécution des tests unitaires et d'intégration",
      status: "completed",
      time: "1m 35s",
      details: "96 tests réussis, 0 échecs"
    },
    {
      id: 4,
      title: "Déploiement sur serveur de production",
      description: "Transfert des fichiers vers l'environnement de production",
      status: "in-progress"
    },
    {
      id: 5,
      title: "Vérification post-déploiement",
      description: "Vérification de la santé de l'application et de l'infrastructure",
      status: "pending"
    }
  ]);

  useEffect(() => {
    // Simuler la progression du déploiement
    const interval = setInterval(() => {
      setDeploymentSteps(prev => {
        const updated = [...prev];
        const inProgressIndex = updated.findIndex(step => step.status === 'in-progress');
        
        if (inProgressIndex !== -1) {
          // Simuler la fin d'une étape et le début de la suivante
          if (Math.random() > 0.7) { // 30% de chance de terminer l'étape à chaque intervalle
            updated[inProgressIndex].status = 'completed';
            updated[inProgressIndex].time = `${Math.floor(Math.random() * 2) + 1}m ${Math.floor(Math.random() * 60)}s`;
            
            if (inProgressIndex < updated.length - 1) {
              updated[inProgressIndex + 1].status = 'in-progress';
            }
          }
        }
        
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    // Simuler une actualisation des données
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Tableau de bord de déploiement</h1>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Voir le site
          </Button>
        </div>
      </div>

      <DeploymentSummary 
        environment="Production"
        buildTime="3m 47s"
        startTime="23 Mars 2025, 13:42"
        domain="topcenter.com"
        deployId="deploy_h7x9p2k4"
        gitBranch="main"
      />

      <DeploymentProgress steps={deploymentSteps} />

      <div>
        {deploymentSteps.map(step => (
          <DeploymentStep
            key={step.id}
            title={step.title}
            description={step.description}
            status={step.status}
            time={step.time}
            details={step.details}
          />
        ))}
      </div>
    </div>
  );
};

export default DeployDashboard;
