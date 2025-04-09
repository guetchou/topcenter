
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitPullRequest } from "lucide-react";
import { DeploymentProgress } from "./DeploymentProgress";
import { DeploymentStep } from "./DeploymentStep";
import { DeploymentLogs } from "./DeploymentLogs";
import { DeploymentSuccess } from "./DeploymentSuccess";
import { Shield, Server, Users, Database, Bot, ServerCog, Network, CheckCheck } from "lucide-react";

interface DeploymentViewProps {
  currentStep: number;
  deploymentStatus: "idle" | "running" | "success" | "failed";
  logs: string[];
  startDeployment: () => void;
  setActiveTab: (tab: string) => void;
  packageConfig: {
    agentCount: number[];
    servicePeriod: string;
    callVolume: string;
    includeSupport: boolean;
    includeCRM: boolean;
    multilingual: boolean;
  };
  resetForm: () => void;
}

export const DeploymentView: React.FC<DeploymentViewProps> = ({
  currentStep,
  deploymentStatus,
  logs,
  startDeployment,
  setActiveTab,
  packageConfig,
  resetForm
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitPullRequest className="h-5 w-5 text-primary" />
            Déploiement des Services
          </CardTitle>
          <CardDescription>
            Lancer le déploiement automatisé de votre pack de services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DeploymentProgress currentStep={currentStep} totalSteps={8} />
          
          <div className="mt-8 space-y-6">
            <DeploymentStep 
              number={1} 
              title="Vérification des prérequis" 
              description="Vérification de la compatibilité et des ressources nécessaires"
              status={currentStep >= 1 ? "completed" : "pending"}
              icon={<Shield className="h-5 w-5" />}
            />
            
            <DeploymentStep 
              number={2} 
              title="Configuration des services" 
              description="Mise en place des services selon votre configuration"
              status={currentStep >= 2 ? "completed" : currentStep === 1 ? "in-progress" : "pending"}
              icon={<Server className="h-5 w-5" />}
            />
            
            <DeploymentStep 
              number={3} 
              title="Création des utilisateurs" 
              description="Création des comptes pour vos agents"
              status={currentStep >= 3 ? "completed" : currentStep === 2 ? "in-progress" : "pending"}
              icon={<Users className="h-5 w-5" />}
            />
            
            <DeploymentStep 
              number={4} 
              title="Configuration de la base de données" 
              description="Préparation de l'infrastructure de données"
              status={currentStep >= 4 ? "completed" : currentStep === 3 ? "in-progress" : "pending"}
              icon={<Database className="h-5 w-5" />}
            />
            
            <DeploymentStep 
              number={5} 
              title="Déploiement des agents virtuels" 
              description="Installation des agents virtuels pour le support automatisé"
              status={currentStep >= 5 ? "completed" : currentStep === 4 ? "in-progress" : "pending"}
              icon={<Bot className="h-5 w-5" />}
            />
            
            <DeploymentStep 
              number={6} 
              title="Configuration du serveur" 
              description="Optimisation des serveurs pour votre charge de travail"
              status={currentStep >= 6 ? "completed" : currentStep === 5 ? "in-progress" : "pending"}
              icon={<ServerCog className="h-5 w-5" />}
            />
            
            <DeploymentStep 
              number={7} 
              title="Test des connexions" 
              description="Vérification des connexions et des intégrations"
              status={currentStep >= 7 ? "completed" : currentStep === 6 ? "in-progress" : "pending"}
              icon={<Network className="h-5 w-5" />}
            />
            
            <DeploymentStep 
              number={8} 
              title="Finalisation du déploiement" 
              description="Dernières vérifications et activation des services"
              status={currentStep >= 8 ? "completed" : currentStep === 7 ? "in-progress" : "pending"}
              icon={<CheckCheck className="h-5 w-5" />}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab("quotation")}
            disabled={deploymentStatus === "running"}
          >
            Retour au devis
          </Button>
          <Button 
            onClick={startDeployment} 
            disabled={deploymentStatus === "running" || deploymentStatus === "success"}
          >
            {deploymentStatus === "idle" && "Lancer le déploiement"}
            {deploymentStatus === "running" && "Déploiement en cours..."}
            {deploymentStatus === "success" && "Déploiement terminé"}
            {deploymentStatus === "failed" && "Réessayer"}
          </Button>
        </CardFooter>
      </Card>
      
      <DeploymentLogs logs={logs} deploymentStatus={deploymentStatus} />
      
      {deploymentStatus === "success" && (
        <DeploymentSuccess packageConfig={packageConfig} resetForm={resetForm} />
      )}
    </div>
  );
};
