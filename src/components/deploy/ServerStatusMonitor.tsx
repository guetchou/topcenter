
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cpu, Database, Server, Wifi } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ServerStatusItemProps {
  icon: React.ReactNode;
  name: string;
  status: 'online' | 'warning' | 'offline';
  value?: number;
  details?: string;
}

const ServerStatusItem: React.FC<ServerStatusItemProps> = ({ icon, name, status, value, details }) => {
  const statusColor = {
    online: 'success',
    warning: 'default',
    offline: 'destructive'
  }[status];
  
  const statusText = {
    online: 'En ligne',
    warning: 'Attention',
    offline: 'Hors ligne'
  }[status];
  
  return (
    <div className="flex items-center justify-between p-3 border-b last:border-0">
      <div className="flex items-center">
        <div className="mr-3 text-primary">
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{details}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {value !== undefined && (
          <Progress className="h-2 w-16" value={value} />
        )}
        <Badge variant={statusColor as "default" | "destructive" | "outline" | "secondary" | "success"}>
          {statusText}
        </Badge>
      </div>
    </div>
  );
};

export const ServerStatusMonitor: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">État des serveurs</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ServerStatusItem
          icon={<Server className="h-5 w-5" />}
          name="Serveur Web"
          status="online"
          value={92}
          details="Uptime: 42 jours"
        />
        <ServerStatusItem
          icon={<Database className="h-5 w-5" />}
          name="Base de données"
          status="online"
          value={78}
          details="Charge normale"
        />
        <ServerStatusItem
          icon={<Cpu className="h-5 w-5" />}
          name="API Gateway"
          status="warning"
          value={65}
          details="Charge élevée"
        />
        <ServerStatusItem
          icon={<Wifi className="h-5 w-5" />}
          name="CDN"
          status="online"
          value={98}
          details="Fonctionnement optimal"
        />
      </CardContent>
    </Card>
  );
};
