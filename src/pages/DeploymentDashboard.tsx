
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  AlertCircle, Loader2, CheckCircle, Globe2, Save, 
  Trash2, RefreshCw, ExternalLink, Clock, Github, 
  BarChart2, Server, GitBranch, Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeploymentSteps } from "@/components/deploy/DeploymentSteps";
import { DeploymentSummary } from "@/components/deploy/DeploymentSummary";
import { useDeployment } from "@/hooks/useDeployment";
import { getWorkflows, GithubWorkflow } from "@/services/deployment/githubActions";
import usePocketBaseStatus from '@/hooks/usePocketBaseStatus';

type Domain = {
  id: string;
  domain_name: string;
  expiration?: string;
  status?: string;
};

type BackupItem = {
  id: string;
  name: string;
  date: Date;
  size: string;
};

export default function DeploymentDashboard() {
  const { 
    status: deploymentStatus, 
    progress, 
    steps, 
    currentStepId, 
    logs,
    deploy,
    isConnected: logsConnected
  } = useDeployment();
  
  const [backupStatus, setBackupStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [domains, setDomains] = useState<Domain[]>([]);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loadingDomains, setLoadingDomains] = useState(false);
  const [lastDeployment, setLastDeployment] = useState<Date | null>(null);
  const [workflows, setWorkflows] = useState<GithubWorkflow[]>([]);
  const [loadingWorkflows, setLoadingWorkflows] = useState(false);
  const { isConnected: pocketbaseConnected } = usePocketBaseStatus();

  // Simuler la récupération du dernier déploiement et des sauvegardes au chargement
  useEffect(() => {
    setLastDeployment(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)); // 3 jours avant
    
    // Initialiser des sauvegardes de démonstration
    const demoBackups: BackupItem[] = [
      { id: "1", name: "backup_20250324_120000", date: new Date(2025, 2, 24, 12, 0), size: "156 MB" },
      { id: "2", name: "backup_20250320_093045", date: new Date(2025, 2, 20, 9, 30), size: "145 MB" },
      { id: "3", name: "backup_20250315_183022", date: new Date(2025, 2, 15, 18, 30), size: "142 MB" }
    ];
    setBackups(demoBackups);
    
    // Charger les workflows GitHub Actions
    fetchGithubWorkflows();
  }, []);

  const fetchGithubWorkflows = async () => {
    try {
      setLoadingWorkflows(true);
      const data = await getWorkflows('guetchou', 'topcenter');
      setWorkflows(data);
    } catch (error) {
      console.error("Erreur lors du chargement des workflows:", error);
      toast.error("Erreur", {
        description: "Impossible de charger les workflows GitHub."
      });
    } finally {
      setLoadingWorkflows(false);
    }
  };

  const handleBackup = async () => {
    try {
      setBackupStatus("running");
      
      // Simulation du processus de sauvegarde
      await new Promise(r => setTimeout(r, 1500));
      await new Promise(r => setTimeout(r, 2000));
      await new Promise(r => setTimeout(r, 1500));
      await new Promise(r => setTimeout(r, 2000));
      
      // Ajouter la nouvelle sauvegarde à la liste
      const newBackup: BackupItem = {
        id: Date.now().toString(),
        name: `backup_${new Date().toISOString().replace(/[:.]/g, "").slice(0, 15)}`,
        date: new Date(),
        size: `${Math.floor(140 + Math.random() * 20)} MB`
      };
      
      setBackups(prev => [newBackup, ...prev]);
      setBackupStatus("success");
      
      toast.success("Sauvegarde terminée", {
        description: "La sauvegarde a été créée avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setBackupStatus("error");
      
      toast.error("Erreur de sauvegarde", {
        description: "Une erreur est survenue lors de la sauvegarde."
      });
    }
  };

  const handleDeploy = async () => {
    await deploy({
      owner: 'guetchou',
      repo: 'topcenter',
      workflowId: 'deploy.yml',
      backupFirst: true
    });
    
    setLastDeployment(new Date());
  };

  const fetchDomainsFromInfomaniak = async () => {
    setLoadingDomains(true);
    
    try {
      // Dans un environnement réel avec le token correct:
      /*
      const response = await axios.get("https://api.infomaniak.com/1/domains", {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_INFOMANIAK_TOKEN}`
        }
      });
      setDomains(response.data.data);
      */
      
      // Pour la démonstration, nous simulons une réponse
      await new Promise(r => setTimeout(r, 2000));
      
      const mockDomains: Domain[] = [
        { id: "1", domain_name: "topcenter.cg", expiration: "2026-05-15", status: "active" },
        { id: "2", domain_name: "topcenter.com", expiration: "2026-03-22", status: "active" },
        { id: "3", domain_name: "topcenter-moderne.com", expiration: "2025-11-30", status: "active" }
      ];
      
      setDomains(mockDomains);
      
      toast.success("Domaines chargés", {
        description: `${mockDomains.length} domaines ont été récupérés.`
      });
    } catch (error) {
      console.error("Erreur API Infomaniak:", error);
      
      toast.error("Erreur API", {
        description: "Impossible de récupérer les domaines Infomaniak."
      });
    } finally {
      setLoadingDomains(false);
    }
  };

  const deleteBackup = (id: string) => {
    // Simuler la suppression d'une sauvegarde
    setTimeout(() => {
      setBackups(prev => prev.filter(backup => backup.id !== id));
      
      toast.success("Sauvegarde supprimée", {
        description: "La sauvegarde a été supprimée avec succès."
      });
    }, 1000);
  };

  const restoreBackup = (id: string) => {
    // Simuler la restauration d'une sauvegarde
    const backup = backups.find(b => b.id === id);
    if (!backup) return;
    
    setBackupStatus("running");
    
    setTimeout(() => {
      setBackupStatus("success");
      
      toast.success("Restauration terminée", {
        description: `La sauvegarde ${backup.name} a été restaurée.`
      });
    }, 5000);
  };

  return (
    <>
      <Helmet>
        <title>Tableau de Bord de Déploiement - TopCenter</title>
      </Helmet>
      
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold">Tableau de Bord de Déploiement</h1>
            <p className="text-muted-foreground">
              Gérez vos déploiements et sauvegardes en un clic
            </p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            {lastDeployment && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                Dernier déploiement: {lastDeployment.toLocaleDateString()} à {lastDeployment.toLocaleTimeString()}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => window.open('https://topcenter.cg', '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Voir le site
            </Button>
          </div>
        </div>
        
        {/* Statut des services */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Server className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <h3 className="font-medium text-sm">PocketBase</h3>
                  <p className="text-xs text-muted-foreground">Base de données</p>
                </div>
              </div>
              {pocketbaseConnected ? (
                <Badge variant="success">Connecté</Badge>
              ) : (
                <Badge variant="destructive">Déconnecté</Badge>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Github className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <h3 className="font-medium text-sm">GitHub</h3>
                  <p className="text-xs text-muted-foreground">Actions CI/CD</p>
                </div>
              </div>
              {workflows.length > 0 ? (
                <Badge variant="success">Disponible</Badge>
              ) : (
                loadingWorkflows ? (
                  <Badge variant="outline">Vérification...</Badge>
                ) : (
                  <Badge variant="destructive">Non configuré</Badge>
                )
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Globe2 className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <h3 className="font-medium text-sm">Infomaniak</h3>
                  <p className="text-xs text-muted-foreground">Hébergement</p>
                </div>
              </div>
              <Badge variant="outline">Non vérifié</Badge>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-3 text-primary" />
                <div>
                  <h3 className="font-medium text-sm">Logs</h3>
                  <p className="text-xs text-muted-foreground">Temps réel</p>
                </div>
              </div>
              {logsConnected ? (
                <Badge variant="success">Connecté</Badge>
              ) : (
                <Badge variant="outline">Déconnecté</Badge>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="deployment">
          <TabsList className="mb-4">
            <TabsTrigger value="deployment">Déploiement</TabsTrigger>
            <TabsTrigger value="backups">Sauvegardes</TabsTrigger>
            <TabsTrigger value="domains">Domaines</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deployment">
            <div className="grid grid-cols-1 gap-6">
              {/* Résumé du déploiement */}
              <DeploymentSummary
                environment="Production"
                buildTime={deploymentStatus === 'running' ? 'En cours...' : deploymentStatus === 'success' ? '2m 34s' : '--'}
                startTime={new Date().toLocaleDateString()}
                domain="topcenter.cg"
                deployId="deploy-123456"
                gitBranch="main"
              />
              
              {/* Panneau de déploiement */}
              <Card>
                <CardHeader>
                  <CardTitle>Déploiement</CardTitle>
                  <CardDescription>Déployer votre site en production</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 flex-wrap mb-6">
                    <Button onClick={handleDeploy} disabled={deploymentStatus === 'running'}>
                      {deploymentStatus === 'running' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Déploiement en cours...
                        </>
                      ) : (
                        '🚀 Déployer maintenant'
                      )}
                    </Button>
                    
                    {deploymentStatus === 'success' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Déploiement réussi</Badge>}
                    {deploymentStatus === 'error' && <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Déploiement échoué</Badge>}
                    
                    {workflows.length > 0 && (
                      <div className="ml-auto flex items-center">
                        <GitBranch className="h-4 w-4 mr-2 text-muted-foreground" />
                        <select className="text-sm border rounded px-2 py-1">
                          <option value="main">main</option>
                          <option value="develop">develop</option>
                        </select>
                      </div>
                    )}
                  </div>
                  
                  {/* Étapes de déploiement */}
                  <DeploymentSteps steps={steps} currentStepId={currentStepId} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="backups">
            <Card>
              <CardHeader>
                <CardTitle>Sauvegardes</CardTitle>
                <CardDescription>Gérer les sauvegardes de votre site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <Button onClick={handleBackup} disabled={backupStatus === 'running'} variant="outline">
                    {backupStatus === 'running' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sauvegarde en cours...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Créer une sauvegarde
                      </>
                    )}
                  </Button>
                  
                  {backupStatus === 'success' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Sauvegarde réussie</Badge>}
                  {backupStatus === 'error' && <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Sauvegarde échouée</Badge>}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-sm mb-4">Sauvegardes disponibles</h3>
                  {backups.length === 0 ? (
                    <p className="text-slate-400 italic">Aucune sauvegarde disponible</p>
                  ) : (
                    <div className="space-y-3">
                      {backups.map(backup => (
                        <div key={backup.id} className="flex items-center justify-between py-3 border-b last:border-0">
                          <div>
                            <p className="font-medium text-sm">{backup.name}</p>
                            <p className="text-xs text-slate-500">
                              {backup.date.toLocaleDateString()} - {backup.size}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 px-2"
                              onClick={() => restoreBackup(backup.id)}
                            >
                              <RefreshCw className="h-3.5 w-3.5 mr-1" />
                              Restaurer
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 px-2"
                              onClick={() => window.open('#', '_blank')}
                            >
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Télécharger
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 px-2 text-red-500 hover:text-red-700"
                              onClick={() => deleteBackup(backup.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="domains">
            <Card>
              <CardHeader>
                <CardTitle>Domaines Infomaniak</CardTitle>
                <CardDescription>Gérer vos domaines connectés à Infomaniak</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <Button 
                    onClick={fetchDomainsFromInfomaniak} 
                    disabled={loadingDomains} 
                    variant="outline"
                  >
                    {loadingDomains ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Chargement...
                      </>
                    ) : (
                      <>
                        <Globe2 className="mr-2 h-4 w-4" />
                        Récupérer mes domaines
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="mt-2">
                  {domains.length === 0 ? (
                    <p className="text-slate-400 italic">Aucun domaine chargé. Cliquez sur le bouton pour récupérer vos domaines.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {domains.map(domain => (
                        <div key={domain.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{domain.domain_name}</h3>
                              {domain.expiration && (
                                <p className="text-sm text-slate-500">
                                  Expiration: {new Date(domain.expiration).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {domain.status && (
                              <Badge variant={domain.status === 'active' ? 'default' : 'outline'}>
                                {domain.status === 'active' ? 'Actif' : domain.status}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-3 flex space-x-2">
                            <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => window.open(`https://${domain.domain_name}`, '_blank')}>
                              <Globe2 className="h-3 w-3 mr-1" /> Visiter
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7">
                              DNS
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7">
                              SSL
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="configuration">
            <Card>
              <CardHeader>
                <CardTitle>Configuration du Déploiement</CardTitle>
                <CardDescription>Paramètres pour le déploiement automatique</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">GitHub Actions</h3>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm">Repository:</span>
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">guetchou/topcenter</code>
                      </div>
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm">Workflow:</span>
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">deploy.yml</code>
                      </div>
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm">Event type:</span>
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">manual_deploy</code>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Infomaniak FTP</h3>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm">Hôte:</span>
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">ftp.cluster0xy.hosting.infomaniak.ch</code>
                      </div>
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm">Répertoire:</span>
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">/home/clients/182ddf0dfc453b3faeaee042d1660720/sites/</code>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Options de sauvegarde</h3>
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm">Répertoire de sauvegarde:</span>
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">/home/clients/182ddf0dfc453b3faeaee042d1660720/backups/</code>
                      </div>
                      <div className="flex items-center justify-between border-b pb-2">
                        <span className="text-sm">Rétention:</span>
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">5 dernières sauvegardes</code>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
