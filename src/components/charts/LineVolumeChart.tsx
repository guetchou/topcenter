
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from "recharts";

interface DataPoint {
  date: string;
  appelsEntrants: number;
  appelsRepondus: number;
  tempsAttente: number;
}

interface LineVolumeChartProps {
  data: DataPoint[];
}

export const LineVolumeChart = ({ data }: LineVolumeChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="appelsEntrants" 
          stroke="#8884d8" 
          name="Appels entrants"
        />
        <Line 
          type="monotone" 
          dataKey="appelsRepondus" 
          stroke="#82ca9d" 
          name="Appels répondus"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
