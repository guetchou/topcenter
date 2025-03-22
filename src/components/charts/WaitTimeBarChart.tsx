
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { cn } from "@/lib/utils";

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
  className?: string;
  animated?: boolean;
}

export const WaitTimeBarChart = ({ 
  data, 
  height = "100%",
  showLegend = true,
  showGrid = true,
  barColor = "hsl(var(--primary))",
  className,
  animated = true
}: WaitTimeBarChartProps) => {
  // Custom tooltip component for better styling
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover p-2 rounded-md shadow-md border border-border text-sm">
          <p className="font-medium">{`Date: ${label}`}</p>
          <p className="text-primary">
            {`Temps d'attente: ${payload[0].value} min`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart 
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
          barGap={2}
          barSize={24}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(var(--border))" 
              opacity={0.5}
              vertical={false}
            />
          )}
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            padding={{ left: 10, right: 10 }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            tickFormatter={(value) => `${value}min`}
            width={50}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'hsl(var(--muted)/0.1)' }}
          />
          {showLegend && (
            <Legend 
              formatter={() => (
                <span className="text-sm font-medium text-foreground">
                  Temps d'attente moyen (min)
                </span>
              )}
              verticalAlign="top"
              height={36}
            />
          )}
          <Bar 
            dataKey="tempsAttente" 
            fill={barColor}
            name="Temps d'attente moyen (min)"
            radius={[4, 4, 0, 0]}
            animationDuration={animated ? 1500 : 0}
            animationEasing="ease-out"
            label={{
              position: 'top',
              formatter: (value: number) => value > 5 ? `${value}` : '',
              fill: 'hsl(var(--muted-foreground))',
              fontSize: 10
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
