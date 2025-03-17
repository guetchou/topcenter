
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Activity, LineChart, Users, Phone } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export const RealTimeDashboard = () => {
  const [stats, setStats] = useState({
    calls: Math.floor(Math.random() * 100) + 50,
    satisfaction: Math.floor(Math.random() * 20) + 80,
    response: Math.floor(Math.random() * 30) + 10,
    agents: Math.floor(Math.random() * 15) + 5,
  });

  // Mise à jour simulée des statistiques en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        calls: Math.floor(Math.random() * 100) + 50,
        satisfaction: Math.floor(Math.random() * 20) + 80,
        response: Math.floor(Math.random() * 30) + 10,
        agents: Math.floor(Math.random() * 15) + 5,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg overflow-hidden border border-border shadow-md">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4">
        <h3 className="text-lg font-semibold">Tableau de bord en temps réel</h3>
        <p className="text-sm text-muted-foreground">Statistiques opérationnelles</p>
      </div>
      
      <Tabs defaultValue="stats" className="p-4">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="stats" className="text-xs flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span className="hidden sm:inline">Statistiques</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="text-xs flex items-center gap-1">
            <Phone className="w-3 h-3" />
            <span className="hidden sm:inline">Appels</span>
          </TabsTrigger>
          <TabsTrigger value="perf" className="text-xs flex items-center gap-1">
            <BarChart className="w-3 h-3" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          <TabsTrigger value="team" className="text-xs flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span className="hidden sm:inline">Équipe</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Appels aujourd'hui", value: stats.calls, color: "bg-blue-500" },
              { label: "Satisfaction", value: `${stats.satisfaction}%`, color: "bg-green-500" },
              { label: "Temps de réponse", value: `${stats.response}s`, color: "bg-amber-500" },
              { label: "Agents actifs", value: stats.agents, color: "bg-purple-500" },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="bg-card p-3 rounded-md shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <div className="text-xl font-bold">{item.value}</div>
                <Progress 
                  value={Math.random() * 100} 
                  className="h-1 mt-2" 
                  indicatorClassName={item.color}
                />
              </motion.div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="calls">
          <Card>
            <CardContent className="pt-4">
              <h4 className="text-sm font-medium mb-2">Volume d'appels (dernières 24h)</h4>
              <div className="h-[150px] flex items-end space-x-2">
                {Array.from({ length: 24 }).map((_, i) => {
                  const height = Math.floor(Math.random() * 80) + 20;
                  return (
                    <motion.div
                      key={i}
                      className="bg-primary/80 rounded-t w-full"
                      style={{ height: `${height}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.5, delay: i * 0.02 }}
                    />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="perf">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {[
                  { label: "Taux de conversion", value: `${Math.floor(Math.random() * 50) + 30}%` },
                  { label: "Temps moyen d'attente", value: `${Math.floor(Math.random() * 60) + 10}s` },
                  { label: "Appels abandonnés", value: `${Math.floor(Math.random() * 10)}%` },
                  { label: "Résolution au premier appel", value: `${Math.floor(Math.random() * 30) + 70}%` }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">{item.label}</span>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                    <Progress value={parseInt(item.value)} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="team">
          <div className="space-y-3">
            {[
              "Équipe commerciale", 
              "Support technique", 
              "Service client", 
              "Administration"
            ].map((team, i) => (
              <motion.div 
                key={i}
                className="flex items-center justify-between p-2 bg-background rounded-md border"
                whileHover={{ scale: 1.01 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span>{team}</span>
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {Math.floor(Math.random() * 10) + 1} agents
                </span>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
