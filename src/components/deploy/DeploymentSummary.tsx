
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GitBranch, Globe, ChevronRight, Calendar, Clock } from 'lucide-react';

interface DeploymentSummaryProps {
  environment: string;
  buildTime: string;
  startTime: string;
  domain: string;
  deployId: string;
  gitBranch: string;
}

export const DeploymentSummary: React.FC<DeploymentSummaryProps> = ({
  environment,
  buildTime,
  startTime,
  domain,
  deployId,
  gitBranch
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              {environment}
              <ChevronRight className="h-4 w-4 text-muted-foreground mx-1" />
              <span className="text-muted-foreground font-normal">{deployId}</span>
            </h2>
            <div className="flex items-center gap-6 mt-2">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{startTime}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{buildTime}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{domain}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{gitBranch}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
