
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { LucideIcon } from "lucide-react";

interface StatProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  color?: string;
  progress?: number;
}

export const StatCard: React.FC<StatProps> = ({
  title,
  value,
  icon,
  change,
  color = "text-emerald-500",
  progress
}) => {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 border-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon}
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold group-hover:text-primary transition-colors">
            {value}
          </div>
          {change && (
            <div className={`text-xs ${color} flex items-center gap-1`}>
              {change}
            </div>
          )}
        </div>
        {progress !== undefined && (
          <Progress
            value={progress}
            className="h-1 mt-2 bg-primary/10"
          />
        )}
      </CardContent>
    </Card>
  );
};
