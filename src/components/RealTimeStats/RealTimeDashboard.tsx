
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone, User, Clock, ThumbsUp, BarChart2 } from "lucide-react";
import { CallVolumeChart } from "./CallVolumeChart";
import { StatCard } from "./StatCard";

// Données simulées
const getRandomData = () => {
  return {
    callsHandled: Math.floor(Math.random() * 150) + 50,
    activeAgents: Math.floor(Math.random() * 20) + 5,
    averageWaitTime: Math.floor(Math.random() * 120) + 10,
    satisfactionRate: Math.floor(Math.random() * 30) + 70,
    callsInQueue: Math.floor(Math.random() * 10)
  };
};

export const RealTimeDashboard = () => {
  const [stats, setStats] = useState(getRandomData());
  const [activeTab, setActiveTab] = useState("current");

  // Mise à jour périodique des données
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getRandomData());
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="current">Temps réel</TabsTrigger>
          <TabsTrigger value="historical">Historique</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              icon={<Phone className="h-5 w-5 text-primary" />}
              title="Appels traités"
              value={stats.callsHandled}
              change={"+12%"}
              isPositive={true}
            />
            
            <StatCard 
              icon={<User className="h-5 w-5 text-indigo-500" />}
              title="Agents actifs"
              value={stats.activeAgents}
              change={"+3"}
              isPositive={true}
            />
            
            <StatCard 
              icon={<Clock className="h-5 w-5 text-amber-500" />}
              title="Temps d'attente moyen"
              value={stats.averageWaitTime}
              unit="sec"
              change={"-5%"}
              isPositive={true}
            />
            
            <StatCard 
              icon={<ThumbsUp className="h-5 w-5 text-green-500" />}
              title="Taux de satisfaction"
              value={stats.satisfactionRate}
              unit="%"
              change={"+2%"}
              isPositive={true}
            />
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Appels en attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{stats.callsInQueue}</div>
                    <div className={`px-2 py-1 rounded-full text-xs ${stats.callsInQueue < 5 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {stats.callsInQueue < 5 ? 'Normal' : 'Élevé'}
                    </div>
                  </div>
                  <Progress 
                    value={stats.callsInQueue * 10} 
                    className="h-2 bg-secondary" 
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Temps de réponse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold">{stats.averageWaitTime} sec</div>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <CallVolumeChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="historical">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tendances sur 7 jours</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <CallVolumeChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
