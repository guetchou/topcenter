
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, TrendingUp, PieChart, BarChart, MessageSquare, Activity } from 'lucide-react';

interface Analytics {
  userSentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topIntents: {
    label: string;
    value: number;
    change: number;
  }[];
  responseEffectiveness: number;
  averageResolutionTime: number;
  predictionAccuracy: number;
  engagementRate: number;
}

export function PredictiveAnalyticsDisplay() {
  const [analytics, setAnalytics] = useState<Analytics>({
    userSentiment: {
      positive: 65,
      neutral: 25,
      negative: 10
    },
    topIntents: [
      { label: 'Information', value: 42, change: 5 },
      { label: 'Assistance', value: 28, change: -2 },
      { label: 'Purchase', value: 18, change: 8 },
      { label: 'Complaint', value: 12, change: -3 }
    ],
    responseEffectiveness: 87,
    averageResolutionTime: 2.4,
    predictionAccuracy: 91,
    engagementRate: 78
  });

  // Simuler des mises à jour d'analytics en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => {
        const randomChange = (max: number) => (Math.random() * max * 2) - max;
        
        return {
          ...prev,
          userSentiment: {
            positive: Math.min(100, Math.max(0, prev.userSentiment.positive + randomChange(2))),
            neutral: Math.min(100, Math.max(0, prev.userSentiment.neutral + randomChange(1.5))),
            negative: Math.min(100, Math.max(0, prev.userSentiment.negative + randomChange(1)))
          },
          topIntents: prev.topIntents.map(intent => ({
            ...intent,
            value: Math.min(100, Math.max(0, intent.value + randomChange(1.5))),
            change: intent.change + randomChange(0.5)
          })),
          responseEffectiveness: Math.min(100, Math.max(0, prev.responseEffectiveness + randomChange(1))),
          predictionAccuracy: Math.min(100, Math.max(70, prev.predictionAccuracy + randomChange(0.5))),
          engagementRate: Math.min(100, Math.max(0, prev.engagementRate + randomChange(1.5)))
        };
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Prédiction & Analytics IA</h2>
        </div>
        <Button variant="outline" size="sm">
          <TrendingUp className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Précision Prédictive" 
          value={`${analytics.predictionAccuracy.toFixed(1)}%`}
          icon={<Brain className="h-4 w-4" />}
          description="Taux de précision des prédictions IA"
          trend={analytics.predictionAccuracy > 90 ? "up" : "down"}
          trendValue={analytics.predictionAccuracy > 90 ? "+1.2%" : "-0.8%"}
        />
        
        <MetricCard 
          title="Temps de Résolution" 
          value={`${analytics.averageResolutionTime.toFixed(1)} min`}
          icon={<Activity className="h-4 w-4" />}
          description="Temps moyen de résolution des demandes"
          trend="down"
          trendValue="-0.3 min"
        />
        
        <MetricCard 
          title="Efficacité" 
          value={`${analytics.responseEffectiveness.toFixed(0)}%`}
          icon={<PieChart className="h-4 w-4" />}
          description="Taux de satisfaction des réponses"
          trend="up"
          trendValue="+2.5%"
        />
        
        <MetricCard 
          title="Engagement" 
          value={`${analytics.engagementRate.toFixed(0)}%`}
          icon={<MessageSquare className="h-4 w-4" />}
          description="Taux d'interaction avec les suggestions"
          trend={analytics.engagementRate > 75 ? "up" : "down"}
          trendValue={analytics.engagementRate > 75 ? "+3.2%" : "-1.5%"}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Analyse du Sentiment</CardTitle>
            <CardDescription>Répartition des sentiments détectés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                    <span>Positif</span>
                  </div>
                  <span className="font-medium">{analytics.userSentiment.positive.toFixed(1)}%</span>
                </div>
                <Progress value={analytics.userSentiment.positive} className="h-2 bg-muted" indicatorClassName="bg-green-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                    <span>Neutre</span>
                  </div>
                  <span className="font-medium">{analytics.userSentiment.neutral.toFixed(1)}%</span>
                </div>
                <Progress value={analytics.userSentiment.neutral} className="h-2 bg-muted" indicatorClassName="bg-blue-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <span>Négatif</span>
                  </div>
                  <span className="font-medium">{analytics.userSentiment.negative.toFixed(1)}%</span>
                </div>
                <Progress value={analytics.userSentiment.negative} className="h-2 bg-muted" indicatorClassName="bg-red-500" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Voir l'analyse détaillée →
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Intentions Utilisateurs</CardTitle>
            <CardDescription>Distribution des intentions détectées</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topIntents.map((intent, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2 font-normal">
                        {intent.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{intent.value.toFixed(1)}%</span>
                      <Badge variant={intent.change >= 0 ? "success" : "destructive"} className="text-xs">
                        {intent.change >= 0 ? `+${intent.change.toFixed(1)}%` : `${intent.change.toFixed(1)}%`}
                      </Badge>
                    </div>
                  </div>
                  <Progress 
                    value={intent.value} 
                    className="h-2 bg-muted" 
                    indicatorClassName={`${i === 0 ? 'bg-primary' : i === 1 ? 'bg-purple-500' : i === 2 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                  />
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              Explorer les tendances →
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

function MetricCard({ title, value, icon, description, trend, trendValue }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="rounded-full p-1 bg-muted">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
      <CardFooter className="py-1 px-6">
        <Badge 
          variant={trend === "up" ? "success" : trend === "down" ? "destructive" : "outline"}
          className="text-xs font-normal"
        >
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
        </Badge>
      </CardFooter>
    </Card>
  );
}
