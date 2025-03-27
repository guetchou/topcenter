
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2, CheckCircle, Globe2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function DeployDashboard() {
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [logs, setLogs] = useState<string[]>([]);
  const [domains, setDomains] = useState<any[]>([]);

  const simulateBackup = async () => {
    setLogs(prev => [...prev, "📦 Sauvegarde du site en cours..."]);
    await new Promise(r => setTimeout(r, 2000));
    setLogs(prev => [...prev, "✅ Sauvegarde terminée."]);
  };

  const handleDeploy = async () => {
    try {
      setStatus("running");
      setLogs(["🚀 Déploiement lancé..."]);
      await simulateBackup();
      
      // Vérifier la présence du token avant l'appel
      const githubToken = import.meta.env.VITE_GITHUB_TOKEN;
      if (!githubToken) {
        throw new Error("VITE_GITHUB_TOKEN n'est pas défini dans les variables d'environnement");
      }

      const response = await fetch("https://api.github.com/repos/guetchou/topcenter/dispatches", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ event_type: "manual_deploy" })
      });
      
      if (response.ok) {
        setLogs(prev => [...prev, "📤 Déploiement GitHub déclenché."]);
        setStatus("success");
        toast.success("Déploiement déclenché avec succès");
      } else {
        throw new Error(`Erreur lors du déclenchement du déploiement: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erreur de déploiement:", error);
      setLogs(prev => [...prev, `❌ ${error instanceof Error ? error.message : "Une erreur est survenue"}`]);
      setStatus("error");
      toast.error("Échec du déploiement");
    }
  };

  const fetchDomainsFromInfomaniak = async () => {
    setLogs(prev => [...prev, "🌐 Connexion à l'API Infomaniak..."]);
    try {
      // Vérifier la présence du token
      const infomaniakToken = import.meta.env.VITE_INFOMANIAK_TOKEN;
      if (!infomaniakToken) {
        throw new Error("VITE_INFOMANIAK_TOKEN n'est pas défini dans les variables d'environnement");
      }

      const response = await axios.get("https://api.infomaniak.com/1/domains", {
        headers: {
          Authorization: `Bearer ${infomaniakToken}`
        }
      });
      
      setDomains(response.data.data);
      setLogs(prev => [...prev, `✅ ${response.data.data.length} domaine(s) chargés.`]);
      toast.success(`${response.data.data.length} domaines chargés`);
    } catch (error) {
      console.error("Erreur API Infomaniak:", error);
      setLogs(prev => [...prev, `❌ Erreur API Infomaniak : ${error instanceof Error ? error.message : "Une erreur est survenue"}`]);
      toast.error("Échec de chargement des domaines");
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Tableau de Bord : Déploiement Manuel</h1>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Button onClick={handleDeploy} disabled={status === 'running'}>
              {status === 'running' ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Déploiement en cours...
                </>
              ) : (
                '🚀 Lancer le déploiement'
              )}
            </Button>

            <Button variant="secondary" onClick={fetchDomainsFromInfomaniak}>
              <Globe2 className="w-4 h-4 mr-2" /> Charger mes domaines
            </Button>

            {status === 'success' && <CheckCircle className="text-green-500" />} 
            {status === 'error' && <AlertCircle className="text-red-500" />} 
          </div>

          <div className="bg-gray-900 text-white p-3 rounded-lg text-sm h-52 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>

          {domains.length > 0 && (
            <div className="pt-4">
              <h2 className="text-lg font-semibold">🌐 Domaines chargés :</h2>
              <ul className="list-disc list-inside text-sm mt-2">
                {domains.map((d) => (
                  <li key={d.id}>{d.domain_name}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
