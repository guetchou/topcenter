import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Clock, ThumbsUp, Users } from "lucide-react";
import { AlgorithmController } from "../../controllers/AlgorithmController";
import { useState, useEffect } from "react";

export const AgentMetrics = ({ agentId }: { agentId: string }) => {
  const [metrics, setMetrics] = useState({
    callsHandled: 0,
    avgDuration: 0,
    satisfaction: 0,
    queueLength: 0
  });

  useEffect(() => {
    // Simuler la récupération des métriques
    const mockMetrics = [
      { calls: 25, duration: 180, rating: 4.5 },
      { calls: 30, duration: 160, rating: 4.8 },
    ];

    const performance = AlgorithmController.analyzeAgentPerformance(agentId, mockMetrics);
    setMetrics({
      callsHandled: performance.callsHandled,
      avgDuration: performance.avgDuration,
      satisfaction: performance.satisfaction,
      queueLength: 5
    });
  }, [agentId]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Appels traités</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.callsHandled}</div>
          <Badge className="mt-2">+20% vs hier</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Durée moyenne</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(metrics.avgDuration)}s</div>
          <Badge variant="secondary" className="mt-2">Dans la moyenne</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.satisfaction.toFixed(1)}/5</div>
          <Badge className="mt-2 bg-green-500">Excellent</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">File d'attente</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.queueLength}</div>
          <Badge variant="destructive" className="mt-2">Attention</Badge>
        </CardContent>
      </Card>
    </div>
  );
};