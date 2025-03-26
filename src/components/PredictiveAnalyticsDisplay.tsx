
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowUpCircle, ArrowDownCircle, AlertCircle, BarChart3, LineChart, PieChart } from 'lucide-react';

export const PredictiveAnalyticsDisplay = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-2">Analyse Prédictive</h1>
      <p className="text-muted-foreground mb-6">
        Modèles d'IA inspirés par l'approche de Tesla, appliqués au centre d'appels
      </p>
      
      <div className="mb-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-md mb-4">
            <TabsTrigger value="overview">Vue Générale</TabsTrigger>
            <TabsTrigger value="volume">Volume</TabsTrigger>
            <TabsTrigger value="efficiency">Performance</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <MetricCard
                title="Prédiction de Volume"
                value="+12%"
                trend="up"
                description="Pour les 7 prochains jours"
                icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
              />
              
              <MetricCard
                title="Temps de Résolution"
                value="-8%"
                trend="down"
                description="Amélioration prévue"
                icon={<LineChart className="h-5 w-5 text-green-500" />}
              />
              
              <MetricCard
                title="Satisfaction Client"
                value="+4%"
                trend="up"
                description="Tendance sur 30 jours"
                icon={<PieChart className="h-5 w-5 text-purple-500" />}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Analyse Globale des Tendances</CardTitle>
                <CardDescription>
                  Basée sur 12,542 interactions et 347 métriques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <PredictionMetric 
                    label="Précision du Modèle" 
                    value={87} 
                  />
                  
                  <PredictionMetric 
                    label="Confiance des Prédictions" 
                    value={73} 
                  />
                  
                  <PredictionMetric 
                    label="Couverture des Scénarios" 
                    value={91} 
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="volume" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Prédiction du Volume d'Appels</CardTitle>
                <CardDescription>
                  Estimation précise basée sur l'historique et les tendances saisonnières
                </CardDescription>
                
                <div className="flex gap-2 mt-2">
                  <PeriodSelector 
                    selected={selectedPeriod} 
                    onChange={setSelectedPeriod} 
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center border border-dashed rounded-md">
                  <p className="text-muted-foreground">Graphique de prédiction du volume</p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="grid grid-cols-3 w-full gap-4">
                  <PredictionStat 
                    label="Volume Prévu" 
                    value="1,285" 
                    change="+12%" 
                    trend="up" 
                  />
                  <PredictionStat 
                    label="Heures de Pointe" 
                    value="10h-14h" 
                    change="" 
                    trend="none" 
                  />
                  <PredictionStat 
                    label="Confiance" 
                    value="92%" 
                    change="+3%" 
                    trend="up" 
                  />
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="efficiency" className="space-y-4">
            <AgentEfficiencyPrediction />
          </TabsContent>
          
          <TabsContent value="satisfaction" className="space-y-4">
            <SatisfactionPrediction />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const PredictionMetric = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <Progress value={value} />
    </div>
  );
};

const MetricCard = ({ 
  title, 
  value, 
  trend, 
  description, 
  icon 
}: { 
  title: string; 
  value: string; 
  trend: 'up' | 'down' | 'neutral'; 
  description: string;
  icon: React.ReactNode;
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend === 'up' && <ArrowUpCircle className="text-green-500 h-5 w-5" />}
              {trend === 'down' && <ArrowDownCircle className="text-red-500 h-5 w-5" />}
              {trend === 'neutral' && <AlertCircle className="text-amber-500 h-5 w-5" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="p-2 bg-primary/5 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PredictionStat = ({ 
  label, 
  value, 
  change, 
  trend 
}: { 
  label: string; 
  value: string; 
  change: string;
  trend: 'up' | 'down' | 'none'; 
}) => {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
      {change && (
        <div className="flex items-center mt-1">
          {trend === 'up' && <ArrowUpCircle className="text-green-500 h-3 w-3 mr-1" />}
          {trend === 'down' && <ArrowDownCircle className="text-red-500 h-3 w-3 mr-1" />}
          <span className={`text-xs ${trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : ''}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
};

const PeriodSelector = ({ 
  selected, 
  onChange 
}: { 
  selected: string; 
  onChange: (value: string) => void;
}) => {
  return (
    <div className="bg-muted rounded-md p-1 flex space-x-1 text-xs">
      {['daily', 'weekly', 'monthly'].map((period) => (
        <button
          key={period}
          className={`px-2.5 py-1 rounded-sm ${
            selected === period 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
          onClick={() => onChange(period)}
        >
          {period.charAt(0).toUpperCase() + period.slice(1)}
        </button>
      ))}
    </div>
  );
};

const AgentEfficiencyPrediction = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prédiction de Performance des Agents</CardTitle>
        <CardDescription>
          Analyse avancée de l'efficacité et recommandations d'amélioration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Temps de Résolution Prédit</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">4m 32s</p>
                <ArrowDownCircle className="text-green-500 h-5 w-5" />
                <span className="text-xs text-green-500">-8%</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Taux de Résolution Premier Contact</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">78%</p>
                <ArrowUpCircle className="text-green-500 h-5 w-5" />
                <span className="text-xs text-green-500">+5%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Répartition des Problèmes</p>
            <div className="h-40 border rounded-md border-dashed flex items-center justify-center">
              <p className="text-muted-foreground">Graphique de répartition</p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-md">
            <h4 className="font-medium mb-2">Recommandations IA</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full px-1.5 py-0.5 text-xs mt-0.5">1</span>
                <span>Renforcer la formation sur les problèmes techniques fréquents (+15% efficacité)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full px-1.5 py-0.5 text-xs mt-0.5">2</span>
                <span>Optimiser les scripts de réponse pour les questions sur la facturation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full px-1.5 py-0.5 text-xs mt-0.5">3</span>
                <span>Implémenter une rotation des agents pendant les heures de pointe</span>
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SatisfactionPrediction = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prédiction de la Satisfaction Client</CardTitle>
        <CardDescription>
          Analyse prédictive des tendances de satisfaction et facteurs d'influence
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">CSAT Prédit</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">4.2/5</p>
                <ArrowUpCircle className="text-green-500 h-5 w-5" />
                <span className="text-xs text-green-500">+0.3</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">NPS Prédit</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">42</p>
                <ArrowUpCircle className="text-green-500 h-5 w-5" />
                <span className="text-xs text-green-500">+4</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Taux de Fidélisation</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold">87%</p>
                <ArrowUpCircle className="text-green-500 h-5 w-5" />
                <span className="text-xs text-green-500">+2%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium">Impact des initiatives récentes</p>
              <p className="text-sm text-muted-foreground">Confiance: 82%</p>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Nouveau script d'accueil</span>
                  <span>+12%</span>
                </div>
                <Progress value={68} />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Formation empathie</span>
                  <span>+9%</span>
                </div>
                <Progress value={54} />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Assistance proactive</span>
                  <span>+15%</span>
                </div>
                <Progress value={78} />
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-md">
            <h4 className="font-medium mb-2">Facteurs d'amélioration détectés</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Réponse personnalisée (+23%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Suivi post-appel (+18%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Temps d'attente réduit (+15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Formation technique (+12%)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
