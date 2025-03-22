
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineVolumeChart } from "./charts/LineVolumeChart";
import { WaitTimeBarChart } from "./charts/WaitTimeBarChart";
import { SatisfactionPieChart } from "./charts/SatisfactionPieChart";
import { RequestTypeBarChart } from "./charts/RequestTypeBarChart";

// Données simulées pour les appels
const generateCallData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 14; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      appelsEntrants: Math.floor(Math.random() * 100) + 20,
      appelsRepondus: Math.floor(Math.random() * 80) + 20,
      tempsAttente: Math.floor(Math.random() * 3) + 1
    });
  }
  return data;
};

// Données simulées pour la satisfaction
const satisfactionData = [
  { name: 'Très satisfait', value: 60, color: '#4ADE80' },
  { name: 'Satisfait', value: 25, color: '#818CF8' },
  { name: 'Neutre', value: 10, color: '#F9A8D4' },
  { name: 'Insatisfait', value: 5, color: '#F87171' }
];

// Données simulées pour les types de demandes
const typeDemandesData = [
  { name: 'Information', count: 45 },
  { name: 'Support technique', count: 32 },
  { name: 'Réclamation', count: 18 },
  { name: 'Commercial', count: 25 },
  { name: 'Autre', count: 10 }
];

export const RealTimeAnalytics = () => {
  const [callData, setCallData] = useState(generateCallData());
  const [activeTab, setActiveTab] = useState("calls");

  // Simuler des mises à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...callData];
      // Mettre à jour la dernière entrée
      const lastEntry = newData[newData.length - 1];
      lastEntry.appelsEntrants = Math.max(10, lastEntry.appelsEntrants + Math.floor(Math.random() * 11) - 5);
      lastEntry.appelsRepondus = Math.min(lastEntry.appelsEntrants, lastEntry.appelsRepondus + Math.floor(Math.random() * 7) - 3);
      setCallData(newData);
    }, 5000);

    return () => clearInterval(interval);
  }, [callData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Analyse en temps réel</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calls">Appels</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
            <TabsTrigger value="demandes">Types de demandes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calls" className="space-y-4">
            <div className="h-[300px] mt-4">
              <LineVolumeChart data={callData} />
            </div>
            
            <div className="h-[250px] mt-8">
              <h3 className="text-lg font-medium mb-2">Temps d'attente moyen (min)</h3>
              <WaitTimeBarChart data={callData} />
            </div>
          </TabsContent>
          
          <TabsContent value="satisfaction">
            <div className="h-[400px] mt-4 flex justify-center">
              <SatisfactionPieChart data={satisfactionData} />
            </div>
          </TabsContent>
          
          <TabsContent value="demandes">
            <div className="h-[400px] mt-4">
              <RequestTypeBarChart data={typeDemandesData} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
