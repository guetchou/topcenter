
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

interface DataPoint {
  date: string;
  tempsAttente: number;
}

interface WaitTimeBarChartProps {
  data: DataPoint[];
  height?: number | string;
  showLegend?: boolean;
  showGrid?: boolean;
  barColor?: string;
}

export const WaitTimeBarChart = ({ 
  data, 
  height = "100%",
  showLegend = true,
  showGrid = true,
  barColor = "#f97316" 
}: WaitTimeBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart 
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
        <XAxis 
          dataKey="date" 
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#e5e7eb' }}
          tickLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#e5e7eb' }}
          tickLine={{ stroke: '#e5e7eb' }}
          tickFormatter={(value) => `${value}min`}
        />
        <Tooltip 
          formatter={(value) => [`${value} min`, "Temps d'attente moyen"]}
          labelFormatter={(label) => `Date: ${label}`}
          contentStyle={{ borderRadius: '6px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '8px 12px' }}
        />
        {showLegend && <Legend />}
        <Bar 
          dataKey="tempsAttente" 
          fill={barColor}
          name="Temps d'attente moyen (min)"
          radius={[4, 4, 0, 0]}
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
