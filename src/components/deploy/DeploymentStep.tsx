
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export type DeploymentStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

interface DeploymentStepProps {
  title: string;
  description: string;
  status: DeploymentStatus;
  time?: string;
  details?: string;
}

export const DeploymentStep: React.FC<DeploymentStepProps> = ({
  title,
  description,
  status,
  time,
  details
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-muted-foreground" />;
      case 'in-progress':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const renderStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'completed':
        return <Badge variant="success">Terminé</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échoué</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="mb-4 border rounded-lg overflow-hidden">
      <div 
        className={`p-4 flex items-center justify-between cursor-pointer ${details ? 'hover:bg-gray-50' : ''}`}
        onClick={details ? toggleExpanded : undefined}
      >
        <div className="flex items-center gap-3">
          {renderStatusIcon()}
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {time && <span className="text-xs text-muted-foreground">{time}</span>}
          {renderStatusBadge()}
          {details && (
            isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
          )}
        </div>
      </div>

      {isExpanded && details && (
        <div className="p-4 border-t bg-gray-50">
          <pre className="text-xs bg-gray-100 p-3 rounded whitespace-pre-wrap overflow-x-auto">
            {details}
          </pre>
        </div>
      )}
    </div>
  );
};
