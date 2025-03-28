
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeploymentLog } from "@/hooks/useDeploymentLogs";

interface DeploymentLogPanelProps {
  logs: DeploymentLog[];
  maxHeight?: string;
}

export const DeploymentLogPanel: React.FC<DeploymentLogPanelProps> = ({ 
  logs, 
  maxHeight = "400px" 
}) => {
  const getLogTypeClass = (type: 'info' | 'success' | 'error' | 'warning') => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info':
      default: return 'text-blue-500';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Logs de déploiement</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={`h-[${maxHeight}] w-full rounded border p-2 bg-black text-white font-mono text-sm`}>
          {logs.length === 0 ? (
            <div className="p-4 text-gray-400 text-center">
              Aucun log disponible. Lancez un déploiement pour voir les logs.
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="flex space-x-2"
                >
                  <span className="text-gray-400 whitespace-nowrap">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={getLogTypeClass(log.type)}>
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
