
import { useState, useEffect } from "react";
import { CallVolumeChart } from "./CallVolumeChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CircleOff, Activity, BarChart, Clock, Zap } from "lucide-react";
import { StatCard } from "./StatCard";
import { AIPrediction } from "@/components/AIPrediction";
import { VoiceAnalytics } from "@/components/VoiceAnalytics";
import { RealTimeTranslation } from "@/components/RealTimeTranslation";

export const RealTimeStats = () => {
  const [currentStats, setCurrentStats] = useState({
    callsInQueue: Math.floor(Math.random() * 15),
    activeAgents: Math.floor(Math.random() * 25) + 5,
    avgHandlingTime: Math.floor(Math.random() * 120) + 60,
    satisfactionRate: Math.floor(Math.random() * 20) + 80,
  });

  // Simuler des mises à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStats({
        callsInQueue: Math.floor(Math.random() * 15),
        activeAgents: Math.floor(Math.random() * 25) + 5,
        avgHandlingTime: Math.floor(Math.random() * 120) + 60,
        satisfactionRate: Math.floor(Math.random() * 20) + 80,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const statsConfig = [
    { 
      title: "Appels en attente", 
      value: currentStats.callsInQueue, 
      icon: <CircleOff className="w-5 h-5 text-primary/70" />,
      change: "+3%",
      color: "text-amber-500"
    },
    { 
      title: "Agents actifs", 
      value: currentStats.activeAgents, 
      icon: <Activity className="w-5 h-5 text-primary/70" />,
      change: "+2%",
      color: "text-emerald-500"
    },
    { 
      title: "Temps moyen (sec)", 
      value: currentStats.avgHandlingTime, 
      icon: <Clock className="w-5 h-5 text-primary/70" />,
      change: "-5%",
      color: "text-blue-500"
    },
    { 
      title: "Satisfaction", 
      value: `${currentStats.satisfactionRate}%`, 
      icon: <Zap className="w-5 h-5 text-primary/70" />,
      change: "+1%",
      color: "text-purple-500"
    }
  ];

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden md:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            <span className="hidden md:inline">IA & Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <BarChart className="w-4 h-4" />
            <span className="hidden md:inline">Voix & Son</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="hidden md:inline">Tendances</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statsConfig.map((stat, i) => (
              <StatCard 
                key={i}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={stat.change}
                color={stat.color}
                progress={Math.random() * 100}
              />
            ))}
          </div>
          
          <div className="mt-6">
            <CallVolumeChart />
          </div>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AIPrediction />
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Analyse de sentiment</h3>
              <div className="space-y-4">
                {["Satisfaction client", "Clarté des informations", "Réactivité", "Résolution"].map((metric, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{metric}</span>
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 20) + 80}%</span>
                    </div>
                    <Progress value={Math.floor(Math.random() * 20) + 80} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <VoiceAnalytics />
            <RealTimeTranslation />
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <TrendsContent />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TrendsContent = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Tendances hebdomadaires</h3>
      <div className="space-y-6">
        {["Volume d'appels", "Temps de réponse", "Taux de conversion", "Satisfaction"].map((metric, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <span>{metric}</span>
              <span className={i % 2 === 0 ? "text-emerald-500" : "text-amber-500"}>
                {i % 2 === 0 ? "↑" : "↓"} {Math.floor(Math.random() * 10) + 1}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary"
                style={{width: `${Math.floor(Math.random() * 50) + 50}%`}}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RealTimeStats;
