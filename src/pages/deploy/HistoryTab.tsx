
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, RotateCcw } from "lucide-react";

const HistoryTab = () => {
  const deploymentHistory = [
    {
      id: "deploy-001",
      version: "v1.2.3",
      date: "2024-01-15 14:30",
      status: "success",
      duration: "2m 15s",
      environment: "production",
      deployedBy: "admin@topcenter.app"
    },
    {
      id: "deploy-002", 
      version: "v1.2.2",
      date: "2024-01-14 10:15",
      status: "failed",
      duration: "1m 45s",
      environment: "staging",
      deployedBy: "dev@topcenter.app"
    },
    {
      id: "deploy-003",
      version: "v1.2.1", 
      date: "2024-01-13 16:45",
      status: "success",
      duration: "3m 02s",
      environment: "production",
      deployedBy: "admin@topcenter.app"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      success: "default",
      failed: "destructive",
      running: "secondary"
    };
    
    return (
      <Badge variant={variants[status] || "outline"}>
        {status === "success" ? "Réussi" : status === "failed" ? "Échoué" : "En cours"}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Historique des Déploiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deploymentHistory.map((deployment) => (
              <div
                key={deployment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(deployment.status)}
                  <div>
                    <div className="font-medium">{deployment.version}</div>
                    <div className="text-sm text-gray-500">
                      {deployment.date} • {deployment.duration}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{deployment.environment}</div>
                    <div className="text-xs text-gray-500">{deployment.deployedBy}</div>
                  </div>
                  {getStatusBadge(deployment.status)}
                  
                  {deployment.status === "success" && (
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Rollback
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryTab;
