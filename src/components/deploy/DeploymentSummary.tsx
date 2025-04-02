
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, Clock, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DeploymentSummaryProps {
  environment: string;
  buildTime: string;
  startTime: string;
  domain: string;
  deployId: string;
  gitBranch: string;
}

export const DeploymentSummary = ({
  environment,
  buildTime,
  startTime,
  domain,
  deployId,
  gitBranch
}: DeploymentSummaryProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          Résumé du déploiement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Environnement</p>
            <p className="font-medium">{environment}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Temps de construction</p>
            <p className="font-medium flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {buildTime}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Démarré à</p>
            <p className="font-medium">{startTime}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Domaine</p>
            <p className="font-medium">{domain}</p>
          </div>
        </div>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              {isExpanded ? "Masquer les détails" : "Afficher plus de détails"}
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ID de déploiement</p>
                <p className="font-medium">{deployId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Branche Git</p>
                <p className="font-medium">{gitBranch}</p>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};
