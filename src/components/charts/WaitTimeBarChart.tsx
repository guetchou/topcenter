
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";

interface DataPoint {
  date: string;
  tempsAttente: number;
}

interface WaitTimeBarChartProps {
  data: DataPoint[];
}

export const WaitTimeBarChart = ({ data }: WaitTimeBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar 
          dataKey="tempsAttente" 
          fill="#f97316" 
          name="Temps d'attente moyen (min)"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
