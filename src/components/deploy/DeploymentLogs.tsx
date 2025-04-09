
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { TerminalSquare } from "lucide-react";

interface DeploymentLogsProps {
  logs: string[];
  deploymentStatus: "idle" | "running" | "success" | "failed";
}

export const DeploymentLogs: React.FC<DeploymentLogsProps> = ({
  logs,
  deploymentStatus
}) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TerminalSquare className="h-5 w-5 text-primary" />
          Logs de déploiement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-black text-green-400 p-4 rounded-md font-mono text-sm h-[400px] overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-500">Les logs de déploiement apparaîtront ici...</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
              </div>
            ))
          )}
          {deploymentStatus === "running" && (
            <div className="animate-pulse">_</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
