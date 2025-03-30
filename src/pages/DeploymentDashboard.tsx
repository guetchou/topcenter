
import React, { useState, useEffect } from 'react';
import { useDeployment } from "@/hooks/useDeployment";
import { useDeploymentLogs } from "@/hooks/useDeploymentLogs";
import { DeploymentStepsPanel } from "@/components/deploy/DeploymentStepsPanel";
import { ServerStatusMonitor } from "@/components/deploy/ServerStatusMonitor";
import { DomainsPanel } from "@/components/deploy/DomainsPanel";
import { BackupPanel } from "@/components/deploy/BackupPanel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Rocket, Database, Shield, RotateCcw, Server, Globe, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DeploymentDashboard: React.FC = () => {
  const { 
    steps, 
    isDeploying, 
    initDeployment, 
    startDeployment, 
    progressToNextStep, 
    completeDeployment,
    cancelDeployment
  } = useDeployment();
  
  const { logs, addLog, clearLogs } = useDeploymentLogs();
  
  // Initialiser les étapes de déploiement
  useEffect(() => {
    if (steps.length === 0) {
      const initialSteps = initDeployment([
        {
          title: "Préparation",
          description: "Vérification de l'environnement",
          status: "pending"
        },
        {
          title: "Sauvegarde",
          description: "Création d'une sauvegarde des fichiers",
          status: "pending"
        },
        {
          title: "Déploiement",
          description: "Transfert des nouveaux fichiers",
          status: "pending"
        },
        {
          title: "Configuration",
          description: "Application des configurations",
          status: "pending"
        },
        {
          title: "Validation",
          description: "Vérification du déploiement",
          status: "pending"
        }
      ]);
    }
  }, [initDeployment, steps.length]);
  
  // Pour simuler un déploiement automatique
  const handleDeploy = async () => {
    const started = await startDeployment({
      environment: 'production',
      withBackup: true,
      notifyOnComplete: true
    });
    
    if (started) {
      addLog("Déploiement démarré", "info");
      
      // Simuler la progression à travers les étapes
      const interval = setInterval(() => {
        if (!progressToNextStep()) {
          clearInterval(interval);
          completeDeployment(true);
        }
      }, 3000);
    }
  };
  
  const handleCancel = () => {
    cancelDeployment();
    toast.info("Déploiement annulé");
  };
  
  const handleRollback = () => {
    toast.info("Restauration à partir de la dernière sauvegarde...");
    addLog("Restauration initiée...", "warning");
    
    setTimeout(() => {
      addLog("Restauration terminée avec succès", "success");
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
          
          {isDeploying ? (
            <Button
              variant="destructive"
              onClick={handleCancel}
              className="flex items-center"
            >
              Annuler
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleRollback}
              className="flex items-center"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Restaurer
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
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
        </div>
        
        <div>
          <ServerStatusMonitor />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <DeploymentStepsPanel steps={steps} />
        </div>
        
        <div className="space-y-6">
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
                  <Server className="mr-2 h-4 w-4" />
                  Redémarrer les services
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Tabs defaultValue="backups" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="backups" className="flex items-center">
            <Archive className="h-4 w-4 mr-2" />
            Sauvegardes
          </TabsTrigger>
          <TabsTrigger value="domains" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            Domaines
          </TabsTrigger>
        </TabsList>
        <TabsContent value="backups">
          <BackupPanel />
        </TabsContent>
        <TabsContent value="domains">
          <DomainsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeploymentDashboard;
