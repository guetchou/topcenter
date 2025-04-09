
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";

interface DeploymentStepProps {
  number: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  icon?: React.ReactNode;
}

export const DeploymentStep: React.FC<DeploymentStepProps> = ({
  number,
  title,
  description,
  status,
  icon
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-amber-500 animate-pulse" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Terminé</Badge>;
      case "in-progress":
        return <Badge className="bg-amber-100 text-amber-800">En cours</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-800">Échec</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  return (
    <div className={`flex items-start gap-4 p-4 rounded-lg border ${
      status === "in-progress" 
        ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800" 
        : status === "completed"
          ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
          : "border-muted"
    }`}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
        {icon || <span className="text-foreground font-semibold">{number}</span>}
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium">{title}</p>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex items-center justify-center h-10 w-10">
        {getStatusIcon()}
      </div>
    </div>
  );
};
