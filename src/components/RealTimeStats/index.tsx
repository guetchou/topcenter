
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CallVolumeChart } from './CallVolumeChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, RefreshCw } from 'lucide-react';
import { RealTimeDashboard } from './RealTimeDashboard';

// Mock data for charts
const mockCallVolumeData = [
  { time: '8:00', inbound: 12, outbound: 8, abandoned: 2 },
  { time: '9:00', inbound: 18, outbound: 12, abandoned: 3 },
  { time: '10:00', inbound: 25, outbound: 18, abandoned: 4 },
  { time: '11:00', inbound: 30, outbound: 20, abandoned: 5 },
  { time: '12:00', inbound: 22, outbound: 15, abandoned: 3 },
  { time: '13:00', inbound: 18, outbound: 13, abandoned: 2 },
  { time: '14:00', inbound: 28, outbound: 19, abandoned: 4 },
  { time: '15:00', inbound: 32, outbound: 24, abandoned: 6 },
  { time: '16:00', inbound: 20, outbound: 18, abandoned: 3 },
  { time: '17:00', inbound: 15, outbound: 10, abandoned: 2 },
];

// Service level mock data
const serviceLevelData = {
  current: 86,
  target: 90,
  lastUpdate: new Date().toLocaleTimeString()
};

interface RealTimeStatsProps {
  refreshInterval?: number;  // in seconds
  className?: string;
}

export const RealTimeStats: React.FC<RealTimeStatsProps> = ({ 
  refreshInterval = 30,
  className
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [countdown, setCountdown] = useState(refreshInterval);

  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      setLastUpdate(new Date());
      setCountdown(refreshInterval);
      setIsLoading(false);
    }, 800);
  };

  // Auto refresh effect
  useEffect(() => {
    if (!autoRefresh) return;
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          refreshData();
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [autoRefresh, refreshInterval]);

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row items-start justify-between mb-4 gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Statistiques en temps réel
          </h2>
          <p className="text-muted-foreground">
            Visualisez les performances actuelles de votre centre d'appels
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{new Date().toLocaleDateString()}</span>
          <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
          <span>{formatTime(lastUpdate)}</span>
          <button 
            onClick={refreshData}
            disabled={isLoading}
            className="ml-2 p-1 rounded-full hover:bg-muted flex items-center justify-center"
            aria-label="Rafraîchir les données"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-primary' : 'text-muted-foreground'}`} />
          </button>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
          <TabsTrigger value="calls">Volume d'appels</TabsTrigger>
          <TabsTrigger value="service-level">Niveau de service</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <RealTimeDashboard />
        </TabsContent>
        
        <TabsContent value="calls">
          <Card>
            <CardHeader>
              <CardTitle>Volume d'appels</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <CallVolumeChart />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="service-level">
          <Card>
            <CardHeader>
              <CardTitle>Niveau de service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Niveau actuel: {serviceLevelData.current}%</span>
                  <span className="text-sm">Objectif: {serviceLevelData.target}%</span>
                </div>
                <Progress value={serviceLevelData.current} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Additional service level stats would go here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {autoRefresh && (
        <div className="mt-4 flex items-center justify-end">
          <span className="text-xs text-muted-foreground">
            Actualisation dans {countdown}s
          </span>
        </div>
      )}
    </div>
  );
};
