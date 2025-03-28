
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeploymentLog } from "@/hooks/useDeploymentLogs";
import { Wifi, WifiOff } from "lucide-react";

interface DeploymentLogPanelProps {
  logs: DeploymentLog[];
  isWebSocketConnected: boolean;
  maxHeight?: string;
}

export const DeploymentLogPanel: React.FC<DeploymentLogPanelProps> = ({
  logs,
  isWebSocketConnected,
  maxHeight = "350px"
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [logs]);

  const getLogClassByType = (type: string): string => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Logs de déploiement</CardTitle>
        <div className="flex items-center gap-2">
          {isWebSocketConnected ? (
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
              <Wifi className="h-3 w-3" />
              Connecté
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
              <WifiOff className="h-3 w-3" />
              Déconnecté
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea ref={scrollAreaRef} className={`rounded-md border p-2 font-mono text-sm h-[${maxHeight}]`}>
          {logs.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              Aucun log disponible
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className={`py-1 ${getLogClassByType(log.type)}`}
                >
                  <span className="text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()} 
                  </span>
                  <span className="ml-2">
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
