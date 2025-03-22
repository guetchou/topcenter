
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface DataPoint {
  date: string;
  appelsEntrants: number;
  appelsRepondus: number;
  tempsAttente?: number;
}

interface LineVolumeChartProps {
  data: DataPoint[];
  height?: number | string;
  showGrid?: boolean;
  showReferenceLine?: boolean;
  referenceValue?: number;
}

export const LineVolumeChart = ({ 
  data, 
  height = "100%",
  showGrid = true,
  showReferenceLine = false,
  referenceValue = 0
}: LineVolumeChartProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Theme-aware colors
  const [colors, setColors] = useState({
    inbound: "#8884d8",
    answered: "#82ca9d",
    grid: "#e5e7eb"
  });
  
  // Update colors based on theme
  useEffect(() => {
    setMounted(true);
    if (theme === 'dark') {
      setColors({
        inbound: "#a78bfa",
        answered: "#6ee7b7",
        grid: "#374151"
      });
    } else {
      setColors({
        inbound: "#8884d8",
        answered: "#82ca9d",
        grid: "#e5e7eb"
      });
    }
  }, [theme]);
  
  if (!mounted) return null;
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart 
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />}
        <XAxis 
          dataKey="date" 
          tick={{ fill: theme === 'dark' ? '#e5e7eb' : '#374151', fontSize: 12 }}
          axisLine={{ stroke: colors.grid }}
          tickLine={{ stroke: colors.grid }}
        />
        <YAxis 
          tick={{ fill: theme === 'dark' ? '#e5e7eb' : '#374151', fontSize: 12 }}
          axisLine={{ stroke: colors.grid }}
          tickLine={{ stroke: colors.grid }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            color: theme === 'dark' ? '#e5e7eb' : '#374151'
          }}
        />
        <Legend />
        
        {showReferenceLine && referenceValue > 0 && (
          <ReferenceLine 
            y={referenceValue} 
            stroke="#ff7300" 
            strokeDasharray="3 3" 
            label="Objectif"
          />
        )}
        
        <Line 
          type="monotone" 
          dataKey="appelsEntrants" 
          stroke={colors.inbound}
          name="Appels entrants"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
          animationDuration={1500}
        />
        <Line 
          type="monotone" 
          dataKey="appelsRepondus" 
          stroke={colors.answered}
          name="Appels répondus"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6, strokeWidth: 2 }}
          animationDuration={1500}
          animationBegin={300}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
