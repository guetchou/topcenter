
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Loader2, CheckCircle, Globe2 } from "lucide-react";
import axios from "axios";

export default function DeployDashboard() {
  const [status, setStatus] = useState("idle"); // idle | running | success | error
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
      const response = await fetch("https://api.github.com/repos/<guetchou>/<topcenter>/dispatches", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ event_type: "manual_deploy" })
      });
      if (response.ok) {
        setLogs(prev => [...prev, "📤 Déploiement GitHub déclenché."]);
        setStatus("success");
      } else {
        throw new Error("Erreur lors du déclenchement du déploiement");
      }
    } catch (error) {
      setLogs(prev => [...prev, `❌ ${error instanceof Error ? error.message : "Une erreur est survenue"}`]);
      setStatus("error");
    }
  };

  const fetchDomainsFromInfomaniak = async () => {
    setLogs(prev => [...prev, "🌐 Connexion à l'API Infomaniak..."]);
    try {
      const response = await axios.get("https://api.infomaniak.com/1/domains", {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_INFOMANIAK_TOKEN}`
        }
      });
      setDomains(response.data.data);
      setLogs(prev => [...prev, `✅ ${response.data.data.length} domaine(s) chargés.`]);
    } catch (error) {
      setLogs(prev => [...prev, `❌ Erreur API Infomaniak : ${error instanceof Error ? error.message : "Une erreur est survenue"}`]);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Tableau de Bord : Déploiement Manuel</h1>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Button onClick={handleDeploy} disabled={status === 'running'}>
              {status === 'running' ? <Loader2 className="animate-spin mr-2" /> : '🚀 Lancer le déploiement'}
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
