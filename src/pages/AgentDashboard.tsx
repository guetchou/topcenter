
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AgentMetrics } from "@/components/AgentDashboard/AgentMetrics";
import { Phone, Users, Clock, Headphones, BarChart3, Activity } from "lucide-react";
import { RealTimeStats } from "@/components/RealTimeStats";
import { VoiceAnalytics } from "@/components/VoiceAnalytics";
import { LiveChat } from "@/components/LiveChat";
import { AIAssistant } from "@/components/AIAssistant";

const AgentDashboard = () => {
  const { data: agentStats, isLoading } = useQuery({
    queryKey: ['agent-statistics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!agent) throw new Error("Agent non trouvé");

      const { data, error } = await supabase
        .from('agent_statistics')
        .select('*')
        .eq('agent_id', agent.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      return data;
    }
  });

  const { data: realTimeMetrics } = useQuery({
    queryKey: ['real-time-metrics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!agent) throw new Error("Agent non trouvé");

      // Cette requête devrait être remplacée par une vraie source de données temps réel
      return {
        activeChats: 3,
        averageResponseTime: "2m 30s",
        satisfactionScore: 4.8,
        callsInQueue: 5
      };
    },
    refetchInterval: 5000 // Rafraîchir toutes les 5 secondes
  });

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tableau de bord agent</h1>
        <Button className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          En ligne
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Appels traités aujourd'hui
            </CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agentStats?.conversations_handled || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Temps moyen de réponse
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realTimeMetrics?.averageResponseTime || "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Score de satisfaction
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agentStats?.satisfaction_score?.toFixed(1) || "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversations actives
            </CardTitle>
            <Headphones className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {realTimeMetrics?.activeChats || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Statistiques en temps réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RealTimeStats />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Analyse vocale</CardTitle>
          </CardHeader>
          <CardContent>
            <VoiceAnalytics />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Conversations actives</CardTitle>
            </CardHeader>
            <CardContent>
              <LiveChat />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Assistant IA</CardTitle>
            </CardHeader>
            <CardContent>
              <AIAssistant />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
