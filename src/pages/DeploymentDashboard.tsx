
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, Loader2, CheckCircle, Globe2, Save, Trash2, RefreshCw, ExternalLink, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import axios from "axios";

type DeploymentLog = {
  id: string;
  message: string;
  timestamp: Date;
  type: "info" | "success" | "error" | "warning";
};

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
  const [deploymentStatus, setDeploymentStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [backupStatus, setBackupStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [deploymentLogs, setDeploymentLogs] = useState<DeploymentLog[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [progress, setProgress] = useState(0);
  const [loadingDomains, setLoadingDomains] = useState(false);
  const [lastDeployment, setLastDeployment] = useState<Date | null>(null);

  // Simule la récupération du dernier déploiement
  useEffect(() => {
    setLastDeployment(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)); // 3 jours avant
    
    // Initialiser des sauvegardes de démonstration
    const demoBackups: BackupItem[] = [
      { id: "1", name: "backup_20250324_120000", date: new Date(2025, 2, 24, 12, 0), size: "156 MB" },
      { id: "2", name: "backup_20250320_093045", date: new Date(2025, 2, 20, 9, 30), size: "145 MB" },
      { id: "3", name: "backup_20250315_183022", date: new Date(2025, 2, 15, 18, 30), size: "142 MB" }
    ];
    setBackups(demoBackups);
  }, []);

  const addLog = (message: string, type: "info" | "success" | "error" | "warning" = "info") => {
    const newLog: DeploymentLog = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      type
    };
    setDeploymentLogs(prev => [newLog, ...prev]);
  };

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10);
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 500);
    return () => clearInterval(interval);
  };

  const handleBackup = async () => {
    try {
      setBackupStatus("running");
      addLog("🗄️ Démarrage de la sauvegarde...", "info");
      
      // Simulation du processus de sauvegarde
      let cleanupProgress = simulateProgress();
      
      addLog("📂 Préparation des fichiers à sauvegarder...", "info");
      await new Promise(r => setTimeout(r, 1500));
      
      addLog("💾 Sauvegarde de la base de données...", "info");
      await new Promise(r => setTimeout(r, 2000));
      
      addLog("🗃️ Compression des fichiers...", "info");
      await new Promise(r => setTimeout(r, 1500));
      
      addLog("📤 Stockage de la sauvegarde sur le serveur distant...", "info");
      await new Promise(r => setTimeout(r, 2000));
      
      cleanupProgress();
      setProgress(100);
      
      // Ajouter la nouvelle sauvegarde à la liste
      const newBackup: BackupItem = {
        id: Date.now().toString(),
        name: `backup_${new Date().toISOString().replace(/[:.]/g, "").slice(0, 15)}`,
        date: new Date(),
        size: `${Math.floor(140 + Math.random() * 20)} MB`
      };
      
      setBackups(prev => [newBackup, ...prev]);
      addLog("✅ Sauvegarde terminée avec succès!", "success");
      setBackupStatus("success");
      
      toast({
        title: "Sauvegarde terminée",
        description: "La sauvegarde a été créée avec succès.",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setBackupStatus("error");
      addLog(`❌ Erreur lors de la sauvegarde: ${error instanceof Error ? error.message : "Erreur inconnue"}`, "error");
      
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive",
      });
    }
  };

  const handleDeploy = async () => {
    try {
      setDeploymentStatus("running");
      addLog("🚀 Démarrage du déploiement...", "info");
      
      // Déclencher la simulation de progression
      let cleanupProgress = simulateProgress();
      
      // Sauvegarde avant déploiement
      addLog("📦 Création d'une sauvegarde avant déploiement...", "info");
      await new Promise(r => setTimeout(r, 3000));
      
      // Simuler le déclenchement de GitHub Actions
      addLog("🔄 Déclenchement du workflow GitHub Actions...", "info");
      
      try {
        // Dans un environnement réel, vous utiliseriez fetch pour appeler l'API GitHub
        // Ce code est simulé, car fetch échouerait sans le token réel
        // const response = await fetch("https://api.github.com/repos/guetchou/topcenter/dispatches", {
        //   method: "POST",
        //   headers: {
        //     Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
        //     Accept: "application/vnd.github+json",
        //     "Content-Type": "application/json"
        //   },
        //   body: JSON.stringify({ event_type: "manual_deploy" })
        // });
        
        // Simulation d'une réponse réussie
        const response = { ok: true };
        
        if (response.ok) {
          addLog("✅ Workflow GitHub Actions déclenché avec succès", "success");
        } else {
          throw new Error("Réponse API GitHub non valide");
        }
      } catch (error) {
        addLog(`⚠️ Avertissement: Échec du déclenchement GitHub. Poursuite du déploiement local...`, "warning");
      }
      
      addLog("🔨 Compilation du projet...", "info");
      await new Promise(r => setTimeout(r, 2500));
      
      addLog("🧪 Exécution des tests...", "info");
      await new Promise(r => setTimeout(r, 1800));
      
      addLog("📤 Déploiement des fichiers vers le serveur Infomaniak...", "info");
      await new Promise(r => setTimeout(r, 4000));
      
      addLog("🗄️ Mise à jour de la base de données...", "info");
      await new Promise(r => setTimeout(r, 1500));
      
      addLog("🧹 Nettoyage du cache...", "info");
      await new Promise(r => setTimeout(r, 1000));
      
      cleanupProgress();
      setProgress(100);
      
      // Ajouter une nouvelle sauvegarde automatique
      const newBackup: BackupItem = {
        id: Date.now().toString(),
        name: `auto_deploy_${new Date().toISOString().replace(/[:.]/g, "").slice(0, 15)}`,
        date: new Date(),
        size: `${Math.floor(140 + Math.random() * 20)} MB`
      };
      setBackups(prev => [newBackup, ...prev]);
      
      addLog("✅ Déploiement terminé avec succès!", "success");
      setDeploymentStatus("success");
      setLastDeployment(new Date());
      
      toast({
        title: "Déploiement réussi",
        description: "Votre site a été déployé avec succès.",
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur lors du déploiement:", error);
      setDeploymentStatus("error");
      addLog(`❌ Erreur lors du déploiement: ${error instanceof Error ? error.message : "Erreur inconnue"}`, "error");
      
      toast({
        title: "Erreur de déploiement",
        description: "Une erreur est survenue lors du déploiement.",
        variant: "destructive",
      });
    }
  };

  const fetchDomainsFromInfomaniak = async () => {
    setLoadingDomains(true);
    addLog("🌐 Connexion à l'API Infomaniak...", "info");
    
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
      addLog(`✅ ${mockDomains.length} domaine(s) chargés avec succès.`, "success");
      
      toast({
        title: "Domaines chargés",
        description: `${mockDomains.length} domaines ont été récupérés.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur API Infomaniak:", error);
      addLog(`❌ Erreur lors de la récupération des domaines: ${error instanceof Error ? error.message : "Erreur inconnue"}`, "error");
      
      toast({
        title: "Erreur API",
        description: "Impossible de récupérer les domaines Infomaniak.",
        variant: "destructive",
      });
    } finally {
      setLoadingDomains(false);
    }
  };

  const deleteBackup = (id: string) => {
    // Simuler la suppression d'une sauvegarde
    addLog(`🗑️ Suppression de la sauvegarde en cours...`, "info");
    
    setTimeout(() => {
      setBackups(prev => prev.filter(backup => backup.id !== id));
      addLog(`✅ Sauvegarde supprimée avec succès.`, "success");
      
      toast({
        title: "Sauvegarde supprimée",
        description: "La sauvegarde a été supprimée avec succès.",
      });
    }, 1000);
  };

  const restoreBackup = (id: string) => {
    // Simuler la restauration d'une sauvegarde
    const backup = backups.find(b => b.id === id);
    if (!backup) return;
    
    addLog(`⏳ Restauration de la sauvegarde ${backup.name} en cours...`, "info");
    setBackupStatus("running");
    
    let cleanupProgress = simulateProgress();
    
    setTimeout(() => {
      cleanupProgress();
      setProgress(100);
      setBackupStatus("success");
      addLog(`✅ Sauvegarde ${backup.name} restaurée avec succès.`, "success");
      
      toast({
        title: "Restauration terminée",
        description: `La sauvegarde ${backup.name} a été restaurée.`,
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Déploiement */}
          <Card>
            <CardHeader>
              <CardTitle>Déploiement</CardTitle>
              <CardDescription>Déployer votre site en production</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
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
              </div>
              
              {deploymentStatus === 'running' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              <div className="mt-2">
                <h3 className="font-medium text-sm mb-2">Logs du déploiement</h3>
                <div className="bg-slate-950 text-slate-50 p-3 rounded-lg text-sm h-44 overflow-y-auto font-mono">
                  {deploymentLogs.length === 0 ? (
                    <p className="text-slate-400 italic">Les logs de déploiement s'afficheront ici...</p>
                  ) : (
                    deploymentLogs.map(log => (
                      <div key={log.id} className="mb-1">
                        <span className="text-slate-400 text-xs">[{log.timestamp.toLocaleTimeString()}]</span>{' '}
                        <span className={`
                          ${log.type === 'success' ? 'text-green-400' : ''}
                          ${log.type === 'error' ? 'text-red-400' : ''}
                          ${log.type === 'warning' ? 'text-yellow-400' : ''}
                        `}>
                          {log.message}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Sauvegarde */}
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
              
              {backupStatus === 'running' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              <div className="mt-2">
                <h3 className="font-medium text-sm mb-2">Sauvegardes disponibles</h3>
                {backups.length === 0 ? (
                  <p className="text-slate-400 italic">Aucune sauvegarde disponible</p>
                ) : (
                  <div className="max-h-44 overflow-y-auto">
                    {backups.map(backup => (
                      <div key={backup.id} className="flex items-center justify-between py-2 border-b last:border-0">
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
                            <RefreshCw className="h-3.5 w-3.5" />
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
          
          {/* Domaines Infomaniak */}
          <Card className="md:col-span-2">
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
        </div>
      </div>
    </>
  );
}
