
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react";

interface ServerStatus {
  status: 'online' | 'offline' | 'degraded';
  lastChecked: Date;
  responseTime?: number;
  services: {
    name: string;
    status: 'online' | 'offline' | 'degraded';
  }[];
}

export const ServerStatusMonitor: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<ServerStatus>({
    status: 'online',
    lastChecked: new Date(),
    responseTime: 120,
    services: [
      { name: 'API', status: 'online' },
      { name: 'Base de données', status: 'online' },
      { name: 'Stockage', status: 'online' },
      { name: 'Workflow GitHub', status: 'online' }
    ]
  });
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkServerStatus = async () => {
    setIsRefreshing(true);
    
    // Simulation d'appel API pour vérifier le statut du serveur
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulation de données pour la démonstration
      setServerStatus({
        status: Math.random() > 0.9 ? 'degraded' : 'online',
        lastChecked: new Date(),
        responseTime: Math.floor(Math.random() * 150) + 80,
        services: [
          { name: 'API', status: Math.random() > 0.95 ? 'degraded' : 'online' },
          { name: 'Base de données', status: Math.random() > 0.97 ? 'degraded' : 'online' },
          { name: 'Stockage', status: 'online' },
          { name: 'Workflow GitHub', status: Math.random() > 0.9 ? 'degraded' : 'online' }
        ]
      });
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Vérification initiale
    checkServerStatus();
    
    // Vérification périodique tous les 30 secondes
    const interval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: 'online' | 'offline' | 'degraded') => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'degraded': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status: 'online' | 'offline' | 'degraded') => {
    switch (status) {
      case 'online': return 'En ligne';
      case 'offline': return 'Hors ligne';
      case 'degraded': return 'Dégradé';
      default: return 'Inconnu';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Statut du Serveur</CardTitle>
          <button 
            onClick={checkServerStatus} 
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="sr-only">Rafraîchir</span>
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {serverStatus.status === 'online' ? (
                <CheckCircle className="text-green-500 w-5 h-5" />
              ) : (
                <AlertCircle className={`${serverStatus.status === 'degraded' ? 'text-yellow-500' : 'text-red-500'} w-5 h-5`} />
              )}
              <span className="font-medium">Statut global:</span>
            </div>
            <Badge className={getStatusColor(serverStatus.status)}>
              {getStatusText(serverStatus.status)}
            </Badge>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Dernière vérification: {serverStatus.lastChecked.toLocaleTimeString()}
            {serverStatus.responseTime && (
              <span className="ml-2">
                (Temps de réponse: {serverStatus.responseTime}ms)
              </span>
            )}
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Services:</h4>
            <div className="grid grid-cols-2 gap-2">
              {serverStatus.services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-2 rounded bg-gray-100 dark:bg-gray-800">
                  <span className="text-sm">{service.name}</span>
                  <Badge className={getStatusColor(service.status)}>
                    {getStatusText(service.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
