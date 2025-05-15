
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, CheckCircle2, CircleAlert, GitBranch, GitPullRequest, Github, Server, Terminal } from "lucide-react";
import { AnimationWrapper } from "@/components/AnimationWrapper";

const DeployDashboard = () => {
  const { toast } = useToast();
  const [deploying, setDeploying] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lastDeployment, setLastDeployment] = useState<{
    status: "success" | "failed" | "none";
    timestamp: string;
    version: string;
    logs: string[];
  }>({
    status: "success",
    timestamp: "2023-05-14T15:30:45Z",
    version: "v1.2.3",
    logs: [
      "[INFO] Initialisation du déploiement...",
      "[INFO] Sauvegarde du site en cours...",
      "[SUCCESS] Sauvegarde créée: backup-20230514-153045.zip",
      "[INFO] Téléchargement des fichiers depuis GitHub...",
      "[INFO] Configuration des paramètres Infomaniak...",
      "[SUCCESS] Déploiement terminé avec succès"
    ],
  });

  const handleDeploy = () => {
    if (!process.env.VITE_GITHUB_TOKEN || !process.env.VITE_INFOMANIAK_TOKEN) {
      toast({
        title: "Configuration manquante",
        description: "Les tokens GitHub et Infomaniak sont nécessaires pour le déploiement",
        variant: "destructive",
      });
      return;
    }

    setDeploying(true);
    toast({
      title: "Déploiement lancé",
      description: "Le déploiement a été initié et est en cours...",
    });

    // Simulation du déploiement
    setTimeout(() => {
      setDeploying(false);
      setLastDeployment({
        status: "success",
        timestamp: new Date().toISOString(),
        version: "v1.2.4",
        logs: [
          "[INFO] Initialisation du déploiement...",
          "[INFO] Sauvegarde du site en cours...",
          "[SUCCESS] Sauvegarde créée: backup-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + ".zip",
          "[INFO] Téléchargement des fichiers depuis GitHub...",
          "[INFO] Configuration des paramètres Infomaniak...",
          "[SUCCESS] Déploiement terminé avec succès"
        ],
      });
      toast({
        title: "Déploiement réussi",
        description: "Le site a été mis à jour avec succès",
        variant: "default",
      });
    }, 3000);
  };

  return (
    <div className="container py-8">
      <AnimationWrapper type="fade-in">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-orange-600">Tableau de bord de déploiement</h1>
            <Badge variant={lastDeployment.status === "success" ? "success" : "destructive"} className="text-sm py-1">
              {lastDeployment.status === "success" ? "En ligne" : "Problème détecté"}
            </Badge>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="logs">Journaux</TabsTrigger>
              <TabsTrigger value="settings">Paramètres</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Server className="w-5 h-5 mr-2 text-orange-500" />
                      État actuel
                    </CardTitle>
                    <CardDescription>Aperçu du statut du déploiement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Version actuelle:</span>
                      <span className="font-medium">{lastDeployment.version}</span>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-muted-foreground">Dernier déploiement:</span>
                      <span className="font-medium">
                        {new Date(lastDeployment.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <div className="flex items-center">
                        {lastDeployment.status === "success" ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-500" />
                            <span className="text-emerald-600 font-medium">Opérationnel</span>
                          </>
                        ) : (
                          <>
                            <CircleAlert className="w-4 h-4 mr-1.5 text-red-500" />
                            <span className="text-red-600 font-medium">Problème</span>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white" 
                      disabled={deploying}
                      onClick={handleDeploy}
                    >
                      {deploying ? "Déploiement en cours..." : "Déployer maintenant"}
                      {!deploying && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <Github className="w-5 h-5 mr-2 text-orange-500" />
                      Intégration GitHub
                    </CardTitle>
                    <CardDescription>Connexion avec le dépôt GitHub</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-muted p-2 rounded-full">
                        <GitBranch className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Branche principale</p>
                        <p className="text-xs text-muted-foreground">main</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="bg-muted p-2 rounded-full">
                        <GitPullRequest className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Pull Request active</p>
                        <p className="text-xs text-muted-foreground">PR #42: Mise à jour des fonctionnalités</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50 hover:text-orange-700">
                      Configurer GitHub
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium flex items-center">
                    <Terminal className="w-5 h-5 mr-2 text-orange-500" />
                    Derniers journaux de déploiement
                  </CardTitle>
                  <CardDescription>
                    Informations sur le dernier déploiement effectué
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-zinc-950 text-zinc-100 p-4 rounded-md font-mono text-sm h-[200px] overflow-y-auto">
                    {lastDeployment.logs.map((log, index) => {
                      // Colorize logs based on type
                      let logClass = "text-gray-300";
                      if (log.includes("[SUCCESS]")) logClass = "text-emerald-400";
                      if (log.includes("[ERROR]")) logClass = "text-red-400";
                      if (log.includes("[WARNING]")) logClass = "text-yellow-400";
                      
                      return (
                        <div key={index} className={`mb-1 ${logClass}`}>
                          {log}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle>Historique des journaux</CardTitle>
                  <CardDescription>
                    Consultez l'historique complet des déploiements et des opérations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground">
                    L'historique complet des journaux sera disponible prochainement.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de déploiement</CardTitle>
                  <CardDescription>
                    Configurez les paramètres pour le déploiement automatique
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-muted-foreground">
                    Configuration des tokens et des paramètres de déploiement à venir.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AnimationWrapper>
    </div>
  );
};

export default DeployDashboard;
