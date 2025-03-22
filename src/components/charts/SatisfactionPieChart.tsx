
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface SatisfactionData {
  name: string;
  value: number;
  color: string;
}

interface SatisfactionPieChartProps {
  data: SatisfactionData[];
  height?: number | string;
  innerRadius?: number;
  outerRadius?: number;
  animationDuration?: number;
  showLabel?: boolean;
}

export const SatisfactionPieChart = ({ 
  data,
  height = "100%",
  innerRadius = 60,
  outerRadius = 130,
  animationDuration = 1000,
  showLabel = true
}: SatisfactionPieChartProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Custom label renderer
  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent, 
    index,
    name 
  }: any) => {
    if (!showLabel) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill={theme === 'dark' ? '#e5e7eb' : '#4b5563'}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {name}: {(percent * 100).toFixed(0)}%
      </text>
    );
  };
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={showLabel}
          label={renderCustomizedLabel}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          fill="#8884d8"
          dataKey="value"
          animationDuration={animationDuration}
          animationBegin={200}
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color} 
              stroke={theme === 'dark' ? '#1f2937' : '#ffffff'} 
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value) => [`${value}`, 'Nombre']}
          contentStyle={{ 
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            borderRadius: '6px', 
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend 
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          iconSize={10}
          formatter={(value) => (
            <span style={{ color: theme === 'dark' ? '#e5e7eb' : '#4b5563', fontSize: '14px' }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
