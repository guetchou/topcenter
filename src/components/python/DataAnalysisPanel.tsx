
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { pythonDataService, DataAnalysisRequest, DataProcessingJob } from '@/services/python/dataService';
import { toast } from 'sonner';

export function DataAnalysisPanel() {
  const [analysisType, setAnalysisType] = useState<string>('');
  const [dataInput, setDataInput] = useState('');
  const [currentJob, setCurrentJob] = useState<DataProcessingJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!analysisType || !dataInput.trim()) {
      toast.error('Veuillez sélectionner un type d\'analyse et saisir des données');
      return;
    }

    setIsLoading(true);
    
    try {
      let data: any[] = [];
      
      try {
        data = JSON.parse(dataInput);
      } catch {
        // Si ce n'est pas du JSON, créer un objet simple
        data = [{ text: dataInput, timestamp: new Date().toISOString() }];
      }

      const request: DataAnalysisRequest = {
        type: analysisType as any,
        data,
        options: {
          timeRange: '30d',
          groupBy: 'day'
        }
      };

      const jobId = await pythonDataService.analyzeData(request);
      
      // Suivre le progrès du job
      const checkProgress = async () => {
        const job = await pythonDataService.getJobStatus(jobId);
        if (job) {
          setCurrentJob(job);
          
          if (job.status === 'completed') {
            toast.success('Analyse terminée avec succès');
            setIsLoading(false);
          } else if (job.status === 'failed') {
            toast.error('Erreur lors de l\'analyse: ' + (job.error || 'Erreur inconnue'));
            setIsLoading(false);
          } else {
            setTimeout(checkProgress, 1000);
          }
        }
      };

      checkProgress();
      
    } catch (error) {
      console.error('Error starting analysis:', error);
      toast.error('Erreur lors du démarrage de l\'analyse');
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analyse de Données Python</CardTitle>
          <CardDescription>
            Utilisez les services d'analyse Python pour traiter vos données
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Type d'analyse</label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Analyse des Ventes</SelectItem>
                  <SelectItem value="customer">Analyse Client</SelectItem>
                  <SelectItem value="performance">Analyse Performance</SelectItem>
                  <SelectItem value="predictive">Analyse Prédictive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Données (JSON ou texte)</label>
            <Textarea
              value={dataInput}
              onChange={(e) => setDataInput(e.target.value)}
              placeholder="Saisissez vos données au format JSON ou en texte libre..."
              rows={6}
            />
          </div>

          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading || !analysisType || !dataInput.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              'Démarrer l\'analyse'
            )}
          </Button>
        </CardContent>
      </Card>

      {currentJob && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Résultats de l'analyse</span>
              <Badge variant={currentJob.status === 'completed' ? 'default' : 'secondary'}>
                {currentJob.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progrès</span>
                <span>{currentJob.progress}%</span>
              </div>
              <Progress value={currentJob.progress} />
            </div>

            {currentJob.result && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Résumé</h4>
                  <p className="text-sm text-muted-foreground">{currentJob.result.analysis.summary}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Insights</h4>
                  <ul className="space-y-1">
                    {currentJob.result.analysis.insights.map((insight, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommandations</h4>
                  <ul className="space-y-1">
                    {currentJob.result.analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {currentJob.result.predictions && (
                  <div>
                    <h4 className="font-medium mb-2">Prédictions</h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        {getTrendIcon(currentJob.result.predictions.trend)}
                        <span>Tendance: {currentJob.result.predictions.trend}</span>
                      </div>
                      <div>
                        Confiance: {Math.round(currentJob.result.predictions.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
