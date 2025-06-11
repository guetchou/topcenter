
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataAnalysisPanel } from '@/components/python/DataAnalysisPanel';
import { AIProcessingPanel } from '@/components/python/AIProcessingPanel';
import { BarChart3, Brain, Server, Activity } from 'lucide-react';

export default function PythonServices() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Services Python</h1>
        <p className="text-muted-foreground">
          Accédez aux services d'analyse de données et d'intelligence artificielle Python
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service de Données</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Actif</div>
            <p className="text-xs text-muted-foreground">Analyse et traitement des données</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Service IA</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Actif</div>
            <p className="text-xs text-muted-foreground">Modèles d'intelligence artificielle</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infrastructure</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Simulation</div>
            <p className="text-xs text-muted-foreground">Mode développement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="data-analysis" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="data-analysis" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analyse de Données</span>
          </TabsTrigger>
          <TabsTrigger value="ai-processing" className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Traitement IA</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="data-analysis">
          <DataAnalysisPanel />
        </TabsContent>

        <TabsContent value="ai-processing">
          <AIProcessingPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
