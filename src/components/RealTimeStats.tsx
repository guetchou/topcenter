
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface RealTimeStatsProps {
  className?: string;
  refreshInterval?: number;
  showCard?: boolean;
}

export const RealTimeStats = ({ 
  className = "", 
  refreshInterval = 2000, 
  showCard = true 
}: RealTimeStatsProps) => {
  const [data, setData] = useState<any[]>([]);

  // Generate random data points at intervals
  useEffect(() => {
    // Initial data
    setData([
      {
        time: new Date().toLocaleTimeString(),
        calls: Math.floor(Math.random() * 100),
        satisfaction: 85 + Math.random() * 15
      }
    ]);

    // Update data periodically
    const interval = setInterval(() => {
      setData((prev) => [
        ...prev.slice(-20),
        {
          time: new Date().toLocaleTimeString(),
          calls: Math.floor(Math.random() * 100),
          satisfaction: 85 + Math.random() * 15
        }
      ]);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-2 rounded-md shadow-md border border-border text-sm">
          <p className="font-medium">{`Temps: ${label}`}</p>
          <p className="text-primary">{`Appels: ${payload[0].value}`}</p>
          <p className="text-secondary">{`Satisfaction: ${payload[1].value.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  const chart = (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="calls"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            animationDuration={300}
          />
          <Line
            type="monotone"
            dataKey="satisfaction"
            stroke="hsl(var(--secondary))"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return showCard ? (
    <Card className={`p-6 ${className}`}>
      <h3 className="mb-4 text-xl font-semibold">Statistiques en Temps Réel</h3>
      {chart}
    </Card>
  ) : (
    <div className={className}>
      {chart}
    </div>
  );
};
