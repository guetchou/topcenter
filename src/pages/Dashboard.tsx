
import React from "react";
import { RealTimeAnalytics } from "@/components/RealTimeAnalytics";
import { RealTimeStats } from "@/components/RealTimeStats";
import { AIPredictionChart } from "@/components/AIPredictionChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceAnalytics } from "@/components/VoiceAnalytics";
import { PredictiveAnalyticsDisplay } from "@/components/PredictiveAnalyticsDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
      
      <Tabs defaultValue="realtime" className="mb-6">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="realtime">Temps réel</TabsTrigger>
          <TabsTrigger value="predictive">Prédictif IA</TabsTrigger>
        </TabsList>
        <TabsContent value="realtime" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <RealTimeStats />
            <AIPredictionChart />
          </div>
          
          <div className="mb-6">
            <RealTimeAnalytics />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Tableau de bord pour gérer les agents et leur performance.</p>
              </CardContent>
            </Card>
            
            <VoiceAnalytics />
          </div>
        </TabsContent>
        
        <TabsContent value="predictive" className="mt-4">
          <PredictiveAnalyticsDisplay />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
