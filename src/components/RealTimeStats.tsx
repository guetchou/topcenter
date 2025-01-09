import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export const RealTimeStats = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => [
        ...prev.slice(-20),
        {
          time: new Date().toLocaleTimeString(),
          calls: Math.floor(Math.random() * 100),
          satisfaction: 85 + Math.random() * 15
        }
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6">
      <h3 className="mb-4 text-xl font-semibold">Statistiques en Temps Réel</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="calls"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="satisfaction"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};