import { AgentMetrics } from "@/components/AgentDashboard/AgentMetrics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { wsService } from "../services/websocket";
import { useEffect, useState } from "react";
import { Phone, Pause, Play } from "lucide-react";

const AgentDashboard = () => {
  const [status, setStatus] = useState<"available" | "busy" | "break">("available");
  const agentId = "agent-001"; // Simulé, devrait venir de l'authentification

  useEffect(() => {
    // Connexion WebSocket pour les mises à jour en temps réel
    wsService.send({ type: "agent_status", status, agentId });

    return () => {
      wsService.send({ type: "agent_disconnect", agentId });
    };
  }, [status]);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord Agent</h1>
        <div className="flex gap-4">
          <Button
            variant={status === "available" ? "default" : "outline"}
            onClick={() => setStatus("available")}
          >
            <Play className="w-4 h-4 mr-2" />
            Disponible
          </Button>
          <Button
            variant={status === "break" ? "default" : "outline"}
            onClick={() => setStatus("break")}
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </Button>
        </div>
      </div>

      <AgentMetrics agentId={agentId} />

      <div className="mt-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Prochain appel</h2>
              <p className="text-muted-foreground">
                Temps d'attente estimé: 2 minutes
              </p>
            </div>
            <Button size="lg" disabled={status !== "available"}>
              <Phone className="w-4 h-4 mr-2" />
              Prendre l'appel
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AgentDashboard;