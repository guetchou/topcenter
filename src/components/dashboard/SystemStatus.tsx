import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Server,
  Database,
  Globe,
  Cpu
} from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'warning';
  responseTime: number;
  lastCheck: Date;
  description: string;
}

export const SystemStatus: React.FC = () => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'API Backend',
      status: 'online',
      responseTime: 145,
      lastCheck: new Date(),
      description: 'Service principal de l\'API'
    },
    {
      name: 'Base de données',
      status: 'online',
      responseTime: 23,
      lastCheck: new Date(),
      description: 'Base de données PocketBase'
    },
    {
      name: 'Services Python',
      status: 'warning',
      responseTime: 0,
      lastCheck: new Date(),
      description: 'Services d\'IA et analyse de données'
    },
    {
      name: 'Stockage fichiers',
      status: 'online',
      responseTime: 87,
      lastCheck: new Date(),
      description: 'Système de stockage des médias'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    // Simuler la vérification des services
    setTimeout(() => {
      setServices(prev => prev.map(service => ({
        ...service,
        lastCheck: new Date(),
        responseTime: Math.floor(Math.random() * 200) + 10
      })));
      setIsRefreshing(false);
    }, 2000);
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'online':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">En ligne</Badge>;
      case 'offline':
        return <Badge variant="destructive">Hors ligne</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Attention</Badge>;
    }
  };

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.includes('API')) return <Server className="h-4 w-4" />;
    if (serviceName.includes('Base')) return <Database className="h-4 w-4" />;
    if (serviceName.includes('Python')) return <Cpu className="h-4 w-4" />;
    return <Globe className="h-4 w-4" />;
  };

  const overallStatus = services.every(s => s.status === 'online') ? 'online' :
                      services.some(s => s.status === 'offline') ? 'offline' : 'warning';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          {getStatusIcon(overallStatus)}
          État du système
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshStatus}
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Overall Status */}
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">État général</span>
                {getStatusBadge(overallStatus)}
              </div>
              <div className="text-sm text-muted-foreground">
                Dernière vérification: {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Individual Services */}
          <div className="space-y-3">
            {services.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getServiceIcon(service.name)}
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">{service.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {service.status === 'online' && (
                    <div className="text-sm text-muted-foreground">
                      {service.responseTime}ms
                    </div>
                  )}
                  {getStatusBadge(service.status)}
                </div>
              </div>
            ))}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Disponibilité</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(services.reduce((acc, s) => acc + s.responseTime, 0) / services.length)}ms
              </div>
              <div className="text-sm text-muted-foreground">Temps de réponse moy.</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;