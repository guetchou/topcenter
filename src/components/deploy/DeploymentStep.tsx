
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

export type DeploymentStatus = 'completed' | 'in-progress' | 'pending' | 'failed';

interface DeploymentStepProps {
  title: string;
  description: string;
  status: DeploymentStatus;
  time?: string;
  details?: string;
}

export const DeploymentStep = ({ 
  title, 
  description, 
  status, 
  time, 
  details 
}: DeploymentStepProps) => {
  const getStatusIcon = () => {
    switch(status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = () => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500">Terminé</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">En cours</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Échoué</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          {getStatusIcon()}
          {title}
        </CardTitle>
        {getStatusBadge()}
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
        {time && <p className="text-sm text-muted-foreground mt-2">Temps: {time}</p>}
        {details && <p className="text-sm mt-2 p-2 bg-muted rounded">{details}</p>}
      </CardContent>
    </Card>
  );
};
