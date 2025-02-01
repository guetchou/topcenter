import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

export const AIPredictionChart = () => {
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      const { data, error } = await supabase
        .from('ai_analytics')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(10);

      if (error) {
        console.error('Error fetching predictions:', error);
        return;
      }

      setPredictions(data);
    };

    fetchPredictions();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('ai_analytics_changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ai_analytics' },
        (payload) => {
          setPredictions(current => [...current.slice(-9), payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Prédictions en temps réel</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="created_at" 
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
            />
            <Line 
              type="monotone" 
              dataKey="metric_value" 
              stroke="#8884d8" 
              name="Valeur"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};