
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell
} from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface RequestTypeData {
  name: string;
  count: number;
  color?: string;
}

interface RequestTypeBarChartProps {
  data: RequestTypeData[];
  height?: number | string;
  showGrid?: boolean;
  defaultBarColor?: string;
  showLegend?: boolean;
  layout?: 'vertical' | 'horizontal';
}

export const RequestTypeBarChart = ({ 
  data,
  height = "100%",
  showGrid = true,
  defaultBarColor = "#8884d8",
  showLegend = true,
  layout = "vertical"
}: RequestTypeBarChartProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Theme-aware colors
  const [colors, setColors] = useState({
    bar: defaultBarColor,
    grid: "#e5e7eb",
    text: "#374151"
  });
  
  // Update colors based on theme
  useEffect(() => {
    setMounted(true);
    if (theme === 'dark') {
      setColors({
        bar: defaultBarColor,
        grid: "#374151",
        text: "#e5e7eb"
      });
    } else {
      setColors({
        bar: defaultBarColor,
        grid: "#e5e7eb",
        text: "#374151"
      });
    }
  }, [theme, defaultBarColor]);
  
  if (!mounted) return null;
  
  const isVertical = layout === 'vertical';
  
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={layout}
        margin={{
          top: 5,
          right: 30,
          left: isVertical ? 80 : 20,
          bottom: 5,
        }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />}
        
        {isVertical ? (
          <>
            <XAxis 
              type="number" 
              tick={{ fill: colors.text, fontSize: 12 }}
              axisLine={{ stroke: colors.grid }}
              tickLine={{ stroke: colors.grid }}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={150} 
              tick={{ fill: colors.text, fontSize: 12 }}
              axisLine={{ stroke: colors.grid }}
              tickLine={{ stroke: colors.grid }}
            />
          </>
        ) : (
          <>
            <XAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: colors.text, fontSize: 12 }}
              axisLine={{ stroke: colors.grid }}
              tickLine={{ stroke: colors.grid }}
            />
            <YAxis 
              type="number" 
              tick={{ fill: colors.text, fontSize: 12 }}
              axisLine={{ stroke: colors.grid }}
              tickLine={{ stroke: colors.grid }}
            />
          </>
        )}
        
        <Tooltip 
          formatter={(value) => [`${value}`, 'Nombre de demandes']}
          contentStyle={{ 
            backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
            borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
            borderRadius: '6px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        />
        
        {showLegend && <Legend />}
        
        <Bar 
          dataKey="count" 
          name="Nombre de demandes"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry.color || colors.bar} 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};
