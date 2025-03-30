
import React, { useState } from 'react';
import { Check, AlertCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeploymentStepStatus } from '@/hooks/useDeployment';

interface DeploymentStepProps {
  title: string;
  description?: string;
  status: DeploymentStepStatus;
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
  isCurrentStep
}) => {
  const [isExpanded, setIsExpanded] = useState(isCurrentStep);

  const statusIcon = {
    pending: <Clock className="h-5 w-5 text-muted-foreground" />,
    'in-progress': (
      <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    ),
    completed: <Check className="h-5 w-5 text-green-500" />,
    failed: <AlertCircle className="h-5 w-5 text-destructive" />
  };

  const statusColor = {
    pending: 'border-muted-foreground',
    'in-progress': 'border-primary',
    completed: 'border-green-500',
    failed: 'border-destructive'
  };

  const hasDetails = details && details.length > 0;

  return (
    <div className={cn(
      "bg-card rounded-lg border p-4",
      isCurrentStep && "border-primary"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center",
          statusColor[status]
        )}>
          {statusIcon[status]}
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-medium">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {time && (
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  {time}
                </span>
              )}
              
              {hasDetails && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label={isExpanded ? "Réduire les détails" : "Voir les détails"}
                >
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
          </div>
          
          {hasDetails && isExpanded && (
            <div className="mt-3 bg-muted/50 p-3 rounded-md text-sm overflow-x-auto">
              <pre className="whitespace-pre-wrap">{details}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
