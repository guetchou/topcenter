import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlgorithmController } from "../../controllers/AlgorithmController";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const CallVolumeChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Simuler des données historiques
    const historicalData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      volume: Math.floor(Math.random() * 50) + 20
    }));

    const prediction = AlgorithmController.predictCallVolume(historicalData);
    
    const newData = [
      ...historicalData,
      {
        hour: 24,
        volume: prediction.predictedVolume,
        predicted: true
      }
    ];

    setData(newData);
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Volume d'appels</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="volume" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};