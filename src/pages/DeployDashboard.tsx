
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, CheckCircle, Server, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";

interface ServerStatus {
  status: 'online' | 'offline' | 'unknown';
  lastChecked: string;
  responseTime?: number;
}

export default function DeployDashboard() {
  const [deployStatus, setDeployStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [backupStatus, setBackupStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    status: 'unknown',
    lastChecked: new Date().toISOString()
  });

  // Check server status periodically
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        const startTime = performance.now();
        const response = await fetch('/', { method: 'HEAD' });
        const endTime = performance.now();
        
        setServerStatus({
          status: response.ok ? 'online' : 'offline',
          lastChecked: new Date().toISOString(),
          responseTime: Math.round(endTime - startTime)
        });
      } catch (error) {
        setServerStatus({
          status: 'offline',
          lastChecked: new Date().toISOString()
        });
      }
    };

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const simulateBackup = async () => {
    try {
      setBackupStatus('running');
      setLogs(prev => [...prev, "📦 Sauvegarde du site en cours..."]);
      await new Promise(r => setTimeout(r, 2000));
      setLogs(prev => [...prev, "✅ Sauvegarde terminée avec succès."]);
      setBackupStatus('success');
      toast.success("Sauvegarde terminée avec succès");
    } catch (error) {
      setLogs(prev => [...prev, `❌ Erreur de sauvegarde: ${error.message}`]);
      setBackupStatus('error');
      toast.error("Erreur lors de la sauvegarde");
    }
  };

  const handleDeploy = async () => {
    try {
      setDeployStatus('running');
      setLogs(["🚀 Déploiement lancé..."]);
      await simulateBackup();
      
      // Simuler le déploiement via API ou GitHub Actions Trigger
      setLogs(prev => [...prev, "⚙️ Configuration du déploiement..."]);
      await new Promise(r => setTimeout(r, 1500));
      
      setLogs(prev => [...prev, "🔄 Build de l'application en cours..."]);
      await new Promise(r => setTimeout(r, 3000));
      
      setLogs(prev => [...prev, "📤 Transfert des fichiers vers le serveur..."]);
      await new Promise(r => setTimeout(r, 2500));
      
      setLogs(prev => [...prev, "✅ Déploiement terminé avec succès!"]);
      setDeployStatus('success');
      toast.success("Déploiement terminé avec succès");
    } catch (error) {
      setLogs(prev => [...prev, `❌ Erreur de déploiement: ${error.message}`]);
      setDeployStatus('error');
      toast.error("Erreur lors du déploiement");
    }
  };

  const handleManualGitHubDeploy = async () => {
    try {
      setDeployStatus('running');
      setLogs(["🚀 Déploiement GitHub Actions lancé..."]);
      
      // Remplacer avec la vraie implémentation si nécessaire
      // Cette version simule l'appel à l'API GitHub mais n'envoie pas réellement de requête
      setLogs(prev => [...prev, "📤 Déclenchement de GitHub Actions..."]);
      await new Promise(r => setTimeout(r, 2000));
      
      setLogs(prev => [...prev, "⏳ Workflow en cours d'exécution..."]);
      await new Promise(r => setTimeout(r, 3000));
      
      setLogs(prev => [...prev, "✅ Workflow GitHub Actions terminé!"]);
      setDeployStatus('success');
      toast.success("Déploiement GitHub Actions terminé");
    } catch (error) {
      setLogs(prev => [...prev, `❌ Erreur lors du déclenchement du workflow: ${error.message}`]);
      setDeployStatus('error');
      toast.error("Erreur lors du déploiement via GitHub Actions");
    }
  };

  const getStatusIcon = (status: 'idle' | 'running' | 'success' | 'error') => {
    switch (status) {
      case 'running':
        return <Loader2 className="animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="text-green-500" />;
      case 'error':
        return <AlertCircle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getServerStatusColor = (status: 'online' | 'offline' | 'unknown') => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'offline':
        return 'text-red-500';
      case 'unknown':
      default:
        return 'text-yellow-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'short',
      timeStyle: 'medium'
    }).format(date);
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tableau de Bord de Déploiement</h1>
        <div className="flex items-center gap-2">
          <Server className={`h-5 w-5 ${getServerStatusColor(serverStatus.status)}`} />
          <span className={`text-sm ${getServerStatusColor(serverStatus.status)}`}>
            {serverStatus.status === 'online' ? 'Serveur en ligne' : 
             serverStatus.status === 'offline' ? 'Serveur hors ligne' : 'Statut inconnu'}
          </span>
          {serverStatus.responseTime && (
            <span className="text-xs text-muted-foreground ml-2">
              {serverStatus.responseTime}ms
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Déploiement Manuel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Button 
                onClick={handleDeploy} 
                disabled={deployStatus === 'running' || backupStatus === 'running'}
                className="gap-2"
              >
                {deployStatus === 'running' ? <Loader2 className="animate-spin h-4 w-4" /> : <ArrowUpCircle className="h-4 w-4" />}
                Déployer l'application
              </Button>
              
              <Button 
                variant="outline" 
                onClick={simulateBackup}
                disabled={backupStatus === 'running' || deployStatus === 'running'}
                className="gap-2"
              >
                {backupStatus === 'running' ? <Loader2 className="animate-spin h-4 w-4" /> : <ArrowDownCircle className="h-4 w-4" />}
                Sauvegarde uniquement
              </Button>
              
              <div className="flex items-center ml-auto">
                {getStatusIcon(deployStatus)}
              </div>
            </div>
            
            <div className="bg-muted/50 dark:bg-muted/20 border rounded-lg p-3 font-mono text-sm h-60 overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-muted-foreground italic">Les logs de déploiement s'afficheront ici...</div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="py-1">{log}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">GitHub Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Déclenchez un déploiement via GitHub Actions. Cette action démarrera le workflow
              configuré dans <code className="bg-muted/50 px-1 rounded">.github/workflows/deploy.yml</code>.
            </p>
            
            <div className="flex items-center gap-4 pt-2">
              <Button 
                variant="secondary"
                onClick={handleManualGitHubDeploy}
                disabled={deployStatus === 'running'}
                className="gap-2"
              >
                {deployStatus === 'running' ? <Loader2 className="animate-spin h-4 w-4" /> : null}
                Déclencher workflow GitHub
              </Button>
            </div>
            
            <div className="bg-muted/20 border border-dashed rounded-lg p-4 mt-4">
              <h3 className="font-medium mb-2">Dernière vérification serveur</h3>
              <p className="text-sm">
                <span className="font-medium">Date: </span> 
                {formatDate(serverStatus.lastChecked)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Statut: </span> 
                <span className={getServerStatusColor(serverStatus.status)}>
                  {serverStatus.status === 'online' ? 'En ligne' : 
                   serverStatus.status === 'offline' ? 'Hors ligne' : 'Inconnu'}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
