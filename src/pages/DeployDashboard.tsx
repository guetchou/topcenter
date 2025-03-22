
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, CheckCircle, Database, Server, Cloud, Package, GitPullRequest, Rocket } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

type DeployStatus = 'idle' | 'running' | 'success' | 'error';
type LogEntry = {
  id: number;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'error' | 'warning';
};

export default function DeployDashboard() {
  const [status, setStatus] = useState<DeployStatus>("idle");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [backupStatus, setBackupStatus] = useState<DeployStatus>('idle');

  const formatTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString();
  };

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const newLog: LogEntry = {
      id: Date.now(),
      message,
      timestamp: formatTimestamp(),
      type
    };
    setLogs(prev => [...prev, newLog]);
  };

  const simulateBackup = async () => {
    setBackupStatus('running');
    addLog("Sauvegarde du site en cours...", 'info');
    await new Promise(r => setTimeout(r, 2000));
    addLog("Compression des fichiers...", 'info');
    await new Promise(r => setTimeout(r, 1000));
    addLog("Téléchargement de la base de données...", 'info');
    await new Promise(r => setTimeout(r, 1500));
    addLog("Sauvegarde terminée avec succès!", 'success');
    setBackupStatus('success');
  };

  const runBackupOnly = async () => {
    try {
      setBackupStatus('running');
      addLog("Lancement de la sauvegarde indépendante...", 'info');
      await simulateBackup();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      addLog(`Erreur pendant la sauvegarde: ${errorMessage}`, 'error');
      setBackupStatus('error');
    }
  };

  const handleDeploy = async () => {
    try {
      setStatus("running");
      setLogs([{
        id: Date.now(),
        message: "🚀 Déploiement lancé...",
        timestamp: formatTimestamp(),
        type: 'info'
      }]);
      
      // Exécuter la sauvegarde avant le déploiement
      await simulateBackup();
      
      addLog("Préparation du déploiement...", 'info');
      await new Promise(r => setTimeout(r, 1000));
      
      // Simuler l'appel API à GitHub Actions
      addLog("Connexion à GitHub Actions...", 'info');
      await new Promise(r => setTimeout(r, 1500));
      
      try {
        // Simulation d'un appel API (ceci serait votre vrai appel en production)
        addLog("Déclenchement du workflow GitHub Actions...", 'info');
        await new Promise(r => setTimeout(r, 1000));
        
        // Ici, nous simulons une réponse réussie
        const mockResponse = { status: 201 };
        
        if (mockResponse.status === 201) {
          addLog("Déploiement GitHub déclenché avec succès!", 'success');
          
          // Simuler les étapes du déploiement
          addLog("Construction du projet en cours...", 'info');
          await new Promise(r => setTimeout(r, 2000));
          
          addLog("Tests unitaires réussis", 'success');
          await new Promise(r => setTimeout(r, 1000));
          
          addLog("Optimisation des assets...", 'info');
          await new Promise(r => setTimeout(r, 1500));
          
          addLog("Transfert FTP vers Infomaniak...", 'info');
          await new Promise(r => setTimeout(r, 3000));
          
          addLog("Nettoyage des anciens fichiers...", 'info');
          await new Promise(r => setTimeout(r, 1000));
          
          addLog("Déploiement terminé avec succès! Site en ligne.", 'success');
          setStatus("success");
        } else {
          throw new Error("La requête a échoué avec le statut: " + mockResponse.status);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
        throw new Error(`Erreur lors du déclenchement du déploiement: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue";
      addLog(`${errorMessage}`, 'error');
      setStatus("error");
    }
  };

  // Fonction pour afficher une icône basée sur le type de log
  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500 mr-2" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500 mr-2" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />;
      default:
        return null;
    }
  };

  const getStatusIndicator = (currentStatus: DeployStatus) => {
    switch (currentStatus) {
      case 'running':
        return <Spinner size="sm" className="text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord de Déploiement</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Rocket className="h-5 w-5 text-blue-500" /> 
              Déploiement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Statut:</span>
              <span className="flex items-center">
                {getStatusIndicator(status)}
                <span className="ml-2 text-sm">
                  {status === 'idle' && 'En attente'}
                  {status === 'running' && 'En cours...'}
                  {status === 'success' && 'Déployé'}
                  {status === 'error' && 'Erreur'}
                </span>
              </span>
            </div>
            <Button 
              onClick={handleDeploy} 
              disabled={status === 'running'}
              className="w-full mt-2"
            >
              {status === 'running' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Déploiement en cours...
                </>
              ) : (
                <>Lancer le déploiement</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" /> 
              Sauvegarde
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Statut:</span>
              <span className="flex items-center">
                {getStatusIndicator(backupStatus)}
                <span className="ml-2 text-sm">
                  {backupStatus === 'idle' && 'En attente'}
                  {backupStatus === 'running' && 'En cours...'}
                  {backupStatus === 'success' && 'Sauvegardé'}
                  {backupStatus === 'error' && 'Erreur'}
                </span>
              </span>
            </div>
            <Button 
              onClick={runBackupOnly}
              disabled={backupStatus === 'running' || status === 'running'}
              variant="outline"
              className="w-full mt-2"
            >
              {backupStatus === 'running' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sauvegarde en cours...
                </>
              ) : (
                <>Sauvegarder uniquement</>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Server className="h-5 w-5 text-amber-500" /> 
              Statut du serveur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Infomaniak:</span>
                <span className="flex items-center text-green-500 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" /> Opérationnel
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Base de données:</span>
                <span className="flex items-center text-green-500 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" /> Opérationnel
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">GitHub Actions:</span>
                <span className="flex items-center text-green-500 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" /> Opérationnel
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {status === 'error' && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de déploiement</AlertTitle>
          <AlertDescription>
            Le déploiement a échoué. Consultez les logs ci-dessous pour plus de détails.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <GitPullRequest className="h-5 w-5" /> Logs du déploiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-white p-3 rounded-lg text-sm h-80 overflow-y-auto font-mono">
            {logs.length === 0 ? (
              <div className="text-gray-500 italic">Aucun log disponible. Lancez un déploiement pour voir les logs.</div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start mb-1">
                  <span className="text-gray-400 mr-2">[{log.timestamp}]</span>
                  <span className="flex items-center">
                    {getLogIcon(log.type)}
                    <span className={`
                      ${log.type === 'success' ? 'text-green-400' : ''}
                      ${log.type === 'error' ? 'text-red-400' : ''}
                      ${log.type === 'warning' ? 'text-yellow-400' : ''}
                    `}>
                      {log.message}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
