
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { applyAnimations } from "@/utils/chatAnimations";

export interface StatProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  change?: string;
  unit?: string;
  isPositive?: boolean;
  className?: string;
  animated?: boolean;
  highlighted?: boolean;
}

export const StatCard: React.FC<StatProps> = ({ 
  icon, 
  title, 
  value, 
  change, 
  unit = "", 
  isPositive = true,
  className,
  animated = true,
  highlighted = false
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300",
      highlighted && "ring-2 ring-primary/30 shadow-lg",
      className
    )}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className={cn(
              "flex items-baseline",
              applyAnimations("", [
                { type: "popIn", active: animated },
              ])
            )}>
              <h4 className="text-2xl font-bold">
                {value.toLocaleString()}
                {unit && <span className="text-lg ml-1">{unit}</span>}
              </h4>
            </div>
          </div>
          <div className={cn(
            "p-2 rounded-full",
            highlighted ? "bg-primary text-primary-foreground" : "bg-primary/10",
            applyAnimations("", [
              { type: "pulse", active: animated && highlighted, intensity: "medium" },
            ])
          )}>
            {icon}
          </div>
        </div>
        
        {change && (
          <div className={cn(
            "mt-4 flex items-center",
            applyAnimations("", [
              { type: "slideIn", active: animated },
            ])
          )}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span className={cn(
              "text-sm font-medium",
              isPositive ? "text-green-500" : "text-red-500"
            )}>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
