
import React, { useState } from 'react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, CheckCircle, Clock, AlertTriangle, Info } from "lucide-react";

export type DeploymentStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

interface DeploymentStepProps {
  title: string;
  description: string;
  status: DeploymentStatus;
  time?: string;
  details?: string;
  isCurrentStep?: boolean;
}

export const DeploymentStep: React.FC<DeploymentStepProps> = ({
  title,
  description,
  status,
  time,
  details,
  isCurrentStep = false
}) => {
  const [isOpen, setIsOpen] = useState(isCurrentStep);

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'failed':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Complété</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 animate-pulse">En cours</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Échoué</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">En attente</Badge>;
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`border rounded-lg overflow-hidden transition-colors ${
        isCurrentStep ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' : 'border-border'
      }`}
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {time && <span className="text-xs text-muted-foreground">{time}</span>}
          {getStatusBadge()}
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        {details && (
          <div className="p-4 pt-0 border-t mt-1 bg-black/5 dark:bg-white/5">
            <pre className="text-xs font-mono whitespace-pre-wrap">
              {details}
            </pre>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};
