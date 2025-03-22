
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

interface RequestTypeData {
  name: string;
  count: number;
}

interface RequestTypeBarChartProps {
  data: RequestTypeData[];
}

export const RequestTypeBarChart = ({ data }: RequestTypeBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis type="category" dataKey="name" width={150} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="Nombre de demandes" />
      </BarChart>
    </ResponsiveContainer>
  );
};
