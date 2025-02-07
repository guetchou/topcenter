
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Download, BarChart2, Clock, ThumbsUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsReport {
  id: string;
  title: string;
  description: string | null;
  report_type: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  created_at: string;
  status: string;
}

interface AgentStatistics {
  conversations_handled: number;
  average_response_time: string;
  satisfaction_score: number;
}

const Analytics = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('week');

  const { data: reports } = useQuery({
    queryKey: ['analytics-reports', selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analytics_reports')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AnalyticsReport[];
    }
  });

  const { data: agentStats } = useQuery({
    queryKey: ['agent-statistics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agent_statistics')
        .select('*')
        .order('date', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data[0] as AgentStatistics;
    }
  });

  const downloadReport = async (reportId: string) => {
    const report = reports?.find(r => r.id === reportId);
    if (!report) return;

    try {
      const jsonString = JSON.stringify(report.data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${report.title}-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Téléchargement réussi",
        description: "Le rapport a été téléchargé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le rapport",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Analytiques</h1>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === 'day' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('day')}
          >
            Jour
          </Button>
          <Button 
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('week')}
          >
            Semaine
          </Button>
          <Button 
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('month')}
          >
            Mois
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Appels Totaux
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
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
              Temps Moyen de Réponse
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agentStats?.average_response_time || '0s'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Satisfaction Client
            </CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(agentStats?.satisfaction_score || 0) * 100}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {reports?.map((report) => (
          <Card key={report.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{report.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {report.description}
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={() => downloadReport(report.id)}>
                <Download className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={report.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Analytics;
