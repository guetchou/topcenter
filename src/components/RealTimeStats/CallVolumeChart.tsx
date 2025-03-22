
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CallVolumeData {
  hour: number;
  volume: number;
  predicted?: boolean;
}

interface CallVolumeChartProps {
  data?: any[];
  height?: number | string;
}

export const CallVolumeChart = ({ data, height = "100%" }: CallVolumeChartProps) => {
  const [chartData, setChartData] = useState<CallVolumeData[]>([]);

  useEffect(() => {
    if (data) {
      setChartData(data);
      return;
    }

    // Simuler des données historiques si aucune donnée n'est fournie
    const generateHistoricalData = () => {
      const historicalData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        volume: Math.floor(Math.random() * 50) + 20
      }));

      // Add prediction point
      const lastValue = historicalData[historicalData.length - 1].volume;
      const predictedVolume = Math.floor(lastValue * (0.8 + Math.random() * 0.4));
      
      return [
        ...historicalData,
        {
          hour: 24,
          volume: predictedVolume,
          predicted: true
        }
      ];
    };

    setChartData(generateHistoricalData());
  }, [data]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPredicted = payload[0].payload.predicted;
      
      return (
        <div className="bg-popover p-2 rounded-md shadow-md border border-border text-sm">
          <p className="font-medium">{`Heure: ${label}:00`}</p>
          <p className="text-primary">
            {isPredicted ? 'Volume prédit' : 'Volume'}: {payload[0].value}
          </p>
          {isPredicted && (
            <p className="text-xs text-muted-foreground mt-1">Valeur prédite par l'IA</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
        <XAxis 
          dataKey="hour" 
          tickFormatter={(hour) => `${hour}h`}
          stroke="hsl(var(--muted-foreground))"
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value) => <span className="text-sm font-medium">Volume d'appels</span>} />
        <Line 
          type="monotone" 
          dataKey="volume" 
          stroke="hsl(var(--primary))" 
          strokeWidth={2}
          dot={(props) => {
            const { cx, cy, payload } = props;
            const isPredicted = payload.predicted;
            
            if (isPredicted) {
              return (
                <svg x={cx - 6} y={cy - 6} width={12} height={12} fill="hsl(var(--primary))" viewBox="0 0 12 12">
                  <circle cx="6" cy="6" r="6" strokeWidth="0" />
                </svg>
              );
            }
            
            return (
              <svg x={cx - 3} y={cy - 3} width={6} height={6} fill="hsl(var(--primary))" viewBox="0 0 6 6">
                <circle cx="3" cy="3" r="3" strokeWidth="0" />
              </svg>
            );
          }}
          activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
