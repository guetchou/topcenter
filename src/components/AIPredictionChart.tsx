
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from "@/services/api";

export const AIPredictionChart = () => {
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await api.get('/analytics/predictions');
        if (response.data && Array.isArray(response.data)) {
          setPredictions(response.data);
        }
      } catch (error) {
        console.error('Error fetching predictions:', error);
      }
    };

    fetchPredictions();

    // Simuler les mises à jour en temps réel toutes les 10 secondes
    const intervalId = setInterval(() => {
      const newPrediction = {
        id: Date.now(),
        created_at: new Date().toISOString(),
        metric_value: Math.random() * 100
      };
      
      setPredictions(current => [...current.slice(-9), newPrediction]);
    }, 10000);

    return () => {
      clearInterval(intervalId);
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
