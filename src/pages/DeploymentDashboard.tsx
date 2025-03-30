
import React, { useState } from 'react';
import { useDeploymentLogs } from "@/hooks/useDeploymentLogs";
import { DeploymentStepsPanel } from "@/components/deploy/DeploymentStepsPanel";
import { ServerStatusMonitor } from "@/components/deploy/ServerStatusMonitor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Rocket, Database, Shield, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dummy deployment steps for demonstration
const deploymentSteps = [
  {
    id: "1",
    title: "Préparation",
    description: "Vérification de l'environnement et des dépendances",
    status: "completed" as const,
    logs: [{ message: "Environnement vérifié avec succès" }],
    startTime: new Date(Date.now() - 120000),
    endTime: new Date(Date.now() - 110000)
  },
  {
    id: "2",
    title: "Sauvegarde",
    description: "Création d'une sauvegarde des fichiers actuels",
    status: "completed" as const,
    logs: [{ message: "Sauvegarde créée avec succès" }],
    startTime: new Date(Date.now() - 100000),
    endTime: new Date(Date.now() - 80000)
  },
  {
    id: "3",
    title: "Déploiement",
    description: "Transfert des nouveaux fichiers vers le serveur",
    status: "in-progress" as const,
    logs: [{ message: "Transfert en cours..." }],
    startTime: new Date(Date.now() - 60000),
    endTime: null
  },
  {
    id: "4",
    title: "Finalisation",
    description: "Vérification et configuration finale",
    status: "pending" as const,
    logs: [],
    startTime: null,
    endTime: null
  }
];

const DeploymentDashboard: React.FC = () => {
  const { logs, addLog, clearLogs } = useDeploymentLogs();
  const [isDeploying, setIsDeploying] = useState(false);
  
  const handleDeploy = () => {
    setIsDeploying(true);
    addLog("Démarrage du déploiement...", "info");
    
    // Simuler un déploiement
    setTimeout(() => {
      addLog("Préparation de l'environnement...", "info");
      
      setTimeout(() => {
        addLog("Création de la sauvegarde...", "info");
        
        setTimeout(() => {
          addLog("Déploiement des fichiers...", "info");
          
          setTimeout(() => {
            addLog("Déploiement terminé avec succès!", "success");
            setIsDeploying(false);
            toast.success("Déploiement terminé avec succès");
          }, 3000);
        }, 2000);
      }, 2000);
    }, 1000);
  };
  
  const handleRollback = () => {
    toast.info("Restauration à partir de la dernière sauvegarde...");
    addLog("Restauration initiée...", "warning");
    
    setTimeout(() => {
      addLog("Restauration terminée", "success");
      toast.success("Restauration terminée avec succès");
    }, 3000);
  };
  
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord de déploiement</h1>
          <p className="text-muted-foreground">Gérez les déploiements de votre site TopCenter</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button
            onClick={handleDeploy}
            disabled={isDeploying}
            className="flex items-center"
          >
            <Rocket className="mr-2 h-4 w-4" />
            {isDeploying ? "Déploiement en cours..." : "Déployer maintenant"}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRollback}
            disabled={isDeploying}
            className="flex items-center"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restaurer
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">État du déploiement</CardTitle>
                <Badge variant={isDeploying ? "default" : "success"}>
                  {isDeploying ? "En cours" : "Prêt"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center p-3 bg-secondary/20 rounded-lg">
                    <Database className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <p className="text-sm font-medium">Base de données</p>
                      <p className="text-xs text-muted-foreground">Connectée</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-secondary/20 rounded-lg">
                    <Shield className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <p className="text-sm font-medium">Certificat SSL</p>
                      <p className="text-xs text-muted-foreground">Valide</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-secondary/20 rounded-lg">
                    <Rocket className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <p className="text-sm font-medium">Dernier déploiement</p>
                      <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Journaux récents</h3>
                  <div className="bg-muted/50 rounded-md p-3 h-40 overflow-y-auto text-sm">
                    {logs.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">Aucun journal disponible</p>
                    ) : (
                      logs.map((log) => (
                        <div key={log.id} className="mb-1">
                          <span className="text-xs text-muted-foreground mr-2">
                            {log.timestamp.toLocaleTimeString()}
                          </span>
                          <span className={`
                            ${log.type === 'error' ? 'text-destructive' : ''}
                            ${log.type === 'success' ? 'text-green-500' : ''}
                            ${log.type === 'warning' ? 'text-yellow-500' : ''}
                          `}>
                            {log.message}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="flex justify-end mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearLogs}
                      disabled={logs.length === 0}
                    >
                      Effacer les journaux
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <DeploymentStepsPanel steps={deploymentSteps} />
        </div>
        
        <div className="space-y-6">
          <ServerStatusMonitor />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button variant="outline" className="justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Vérifier la base de données
                </Button>
                <Button variant="outline" className="justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Tester la sécurité
                </Button>
                <Button variant="outline" className="justify-start">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Redémarrer les services
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DeploymentDashboard;
